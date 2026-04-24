# URekha Backend: Frontend Integration Guide

This document outlines the strict real-time WebSocket orchestration rules, routing payload structures, and storage caching mechanisms required to connect the Frontend to the High-Performance URekha Backend.

---

## 1. The Core Architecture (Non-Blocking)
The URekha backend is purely asynchronous to handle massive AI generation & Jyotisham calculations seamlessly.
**You must never wait for an HTTP response to hold data.**

### The 4-Step Client Execution Flow:
1. **Initialize:** Generate a unique `room_id` (e.g., `crypto.randomUUID()`).
2. **Listen:** Emit a `join_` event to the Socket and attach a listener for the incoming data (`..._result/...`).
3. **Trigger:** Send the HTTP `POST` request with the `room_id` in the body. The server will immediately return `202 Accepted`.
4. **Cleanup:** Once the Socket receives the data, emit an `ack_` event and destroy the listener (`socket.off()`).

---

## 2. API Routes & Payload Structures

All routes strictly use the HTTP `POST` method.

### A. Single Jyotisham Request
Used for fetching quick, single astrology data points (e.g. `planet_details`, `divisional_chart_D1`).
* **Route:** `POST /jyotisham/:slug`
* **Body parameters:**
  ```json
  {
    "room": "YOUR_UNIQUE_ROOM_ID",
    "payload": {
      "date": "01/12/1995",
      "time": "15:30",
      "latitude": 25.12,
      "longitude": 82.34,
      "tz": 5.5,
      "lang": "en"
    }
  }
  ```

### B. Batch Jyotisham Request (Group)
Used for fetching multiple charts/data structures concurrently without blocking.
* **Route:** `POST /jyotisham/group/:slug`
* **Body parameters:**
  ```json
  {
    "room": "YOUR_UNIQUE_ROOM_ID",
    "tasks": ["planet_details", "divisional_chart_D9"],
    "payload": { ...kundli_data... }
  }
  ```

### C. Single AI Prediction Request
Used for generating a specific AI astrology report (e.g. `career-1200`).
* **Route:** `POST /predict/:slug`
* **Body parameters:**
  ```json
  {
    "room": "YOUR_UNIQUE_ROOM_ID",
    "payload": { ...kundli_data... }
  }
  ```

### D. Batch AI Prediction Request (Group)
Used for generating a massive multi-part prediction pipeline concurrently (e.g. `finance-1200`, `health-1200`).
* **Route:** `POST /predict/group/:slug`
* **Body parameters:**
  ```json
  {
    "room": "YOUR_UNIQUE_ROOM_ID",
    "tasks": ["finance-1200", "health-1200"],
    "payload": { ...kundli_data... }
  }
  ```

---

## 3. The Socket Event Matrix

Based on the route you are calling above, you **MUST** strictly use these exact socket event names.

| API Route Triggered | 1. Join Room (Emit to Server) | 2. Wait for Data (Listen on Client) | 3. Cleanup ACK (Emit to Server) |
| :--- | :--- | :--- | :--- |
| `/jyotisham/[slug]` | `join_jyotisham` | `jyotisham_result/${room}/${slug}` | `ack_jyotisham` |
| `/jyotisham/group/[slug]` | `join_jyotisham_group` | `jyotisham_group_result/${room}/${slug}` | `ack_jyotisham_group` |
| `/predict/[slug]` | `join_predict` | `predict_result/${room}/${slug}` | `ack_predict` |
| `/predict/group/[slug]`| `join_predict_group` | `predict_group_result/${room}/${slug}` | `ack_predict_group` |

### Example Implementation (React/Next.js)
```javascript
const handleGenerateCareer = () => {
    const roomId = crypto.randomUUID();
    const slug = "career-1200";

    // 1. Join the isolated socket room
    socket.emit("join_predict", { room_id: roomId });

    // 2. Attach Listener
    socket.on(`predict_result/${roomId}/${slug}`, (response) => {
        if (response.success) {
            console.log("AI Data Received:", response.data);
        }

        // 3. Cleanup to prevent memory leaks (CRITICAL)
        socket.emit("ack_predict", { room_id: roomId, slug });
        socket.off(`predict_result/${roomId}/${slug}`);
    });

    // 4. Trigger Heavy Processing
    fetch(`http://api/predict/${slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ room: roomId, payload: myKundliData })
    });
};
```

---

## 4. Storage & Cache Key Structures (Kvrocks/Redis)
If you ever need to analyze or manually retrieve data directly from the Redis/Kvrocks cache layer, the backend stores the data using a strict deterministic stringification structure.

**Important Rule:** The data stringification automatically sorts JSON keys alphabetically internally in the backend, but the general pattern is always:

1. **Jyotisham (Math) Data Keys:**
   * **Format:** `jyotisham:${slug}:${JSON.stringify(payload)}`
   * **Example:** `jyotisham:planet_details:{"date":"01/12/1995","lang":"en","latitude":25.12,"longitude":82.34,"time":"15:30","tz":5.5}`

2. **Predict (AI) Data Keys:**
   * **Format:** `${slug}:${JSON.stringify(payload)}`
   * **Example:** `career-1200:{"date":"01/12/1995","lang":"en","latitude":25.12,"longitude":82.34,"time":"15:30","tz":5.5}`

*When the workers run, they first check these EXACT stringified keys in Kvrocks DB. If the data exists, it completely bypasses the GenAI / 3rd Party APIs and returns instantly.*

---

## 5. Jyotisham Supported Shortcuts & Required Payload Args

When querying the Single or Batch Jyotisham routes, the `:slug` parameter must exactly match one of the registered shortcuts below. The `payload` object you send in the request body **must contain all listed args** or the Zod validation will reject it with HTTP `400`.

> **Base Args (used by almost every shortcut):**
> `date` (DD/MM/YYYY), `time` (HH:MM 24h), `latitude` (number), `longitude` (number), `tz` (number, e.g. 5.5 for IST), `lang` (enum: `"en"` | `"hi"` | `"ma"` | `"ta"` | `"te"` | `"bn"` | `"kn"`, default `"en"`)

---

### 🌟 Standard Horoscope & Charts

| Shortcut | Required Args |
| :--- | :--- |
| `planet_details` | `date`, `time`, `latitude`, `longitude`, `tz`, `lang` |
| `ascendant_report` | `date`, `time`, `latitude`, `longitude`, `tz`, `lang` |
| `ashtakvarga` | `date`, `time`, `latitude`, `longitude`, `tz`, `lang` |
| `binnashtakvarga` | `date`, `time`, `latitude`, `longitude`, `tz`, `lang`, `planet` *(enum: `"Jupiter"` \| `"Saturn"` \| `"Mercury"` \| `"Venus"` \| `"Sun"` \| `"Moon"` \| `"Mars"`)* |
| `divisional_chart_DX` | `date`, `time`, `latitude`, `longitude`, `tz`, `lang` *(replace `DX` with `D1`, `D2`, `D9`, `D10`, etc.)* |

---

### ⏳ Dasha (Time Periods)

| Shortcut | Required Args |
| :--- | :--- |
| `dasha_current_maha` | `date`, `time`, `latitude`, `longitude`, `tz`, `lang` |
| `dasha_current_maha_full` | `date`, `time`, `latitude`, `longitude`, `tz`, `lang` |
| `dasha_maha` | `date`, `time`, `latitude`, `longitude`, `tz`, `lang` |
| `dasha_specific_sub` | `date`, `time`, `latitude`, `longitude`, `tz`, `lang`, `mahadasha`, `subdasha` |
| `dasha_yogini_main` | `date`, `time`, `latitude`, `longitude`, `tz`, `lang` |
| `dasha_yogini_sub` | `date`, `time`, `latitude`, `longitude`, `tz`, `lang` |

---

### ⚠️ Dosha (Afflictions)

| Shortcut | Required Args |
| :--- | :--- |
| `dosha_mangal` | `date`, `time`, `latitude`, `longitude`, `tz`, `lang` |
| `dosha_kaalsarp` | `date`, `time`, `latitude`, `longitude`, `tz`, `lang` |
| `dosha_manglik` | `date`, `time`, `latitude`, `longitude`, `tz`, `lang` |
| `dosha_pitra` | `date`, `time`, `latitude`, `longitude`, `tz`, `lang` |

---

### 🔭 Extended Horoscope

| Shortcut | Required Args |
| :--- | :--- |
| `extended_kundli` | `date`, `time`, `latitude`, `longitude`, `tz`, `lang` |
| `extended_current_sadesati` | `date`, `time`, `latitude`, `longitude`, `tz`, `lang` |
| `extended_friendship_table` | `date`, `time`, `latitude`, `longitude`, `tz`, `lang` |
| `extended_planets_kp` | `date`, `time`, `latitude`, `longitude`, `tz`, `lang` |

---

### 🔮 KP Astrology

| Shortcut | Required Args |
| :--- | :--- |
| `kp_planet_details` | `date`, `time`, `latitude`, `longitude`, `tz`, `lang` |
| `kp_cusp_details` | `date`, `time`, `latitude`, `longitude`, `tz`, `lang` |
| `kp_significators` | `date`, `time`, `latitude`, `longitude`, `tz`, `lang` |
| `kp_house_significators` | `date`, `time`, `latitude`, `longitude`, `tz`, `lang` |

---

### 📅 Panchang (Almanac)

| Shortcut | Required Args |
| :--- | :--- |
| `panchang_details` | `date`, `time`, `latitude`, `longitude`, `tz`, `lang` |
| `panchang_choghadiya` | `date`, `time`, `latitude`, `longitude`, `tz`, `lang` |
| `panchang_hora` | `date`, `time`, `latitude`, `longitude`, `tz`, `lang` |

---

### 🖼️ Visual Chart Generation (SVG)

| Shortcut | Required Args |
| :--- | :--- |
| `chart_image_DX` | `date`, `time`, `latitude`, `longitude`, `tz`, `lang`, `style`, `colored_planets`, `color` *(replace `DX` with `D1`, `D9`, etc.)* |
| `transit_chart` | `date`, `time`, `latitude`, `longitude`, `tz`, `lang`, `style`, `colored_planets`, `color`, `transit_date`, `transit_time` *(fixed slug — no division suffix needed)* |

---

## 6. Socket Response Payloads
When the Socket listener receives the event from the worker, the data injected directly depends on whether you called a **Single** route or a **Group (Batch)** route.

### 🔴 Group (Batch) Results Array
When calling `/predict/group/:slug` or `/jyotisham/group/:slug`, the parent worker collects all parallel task executions and returns a direct **Array of Objects**, regardless of individual successes or failures.

*Example Payload:*
```json
[
  {
    "task": "finance-1200",
    "status": "success",
    "data": {
      "blocks": [ ... ]
    }
  },
  {
    "task": "health-1200",
    "status": "error",
    "error": "GenAI Gateway Timeout"
  }
]
```

### 🟢 Single Request Results Structure
When calling `/predict/:slug` or `/jyotisham/:slug`, the worker emits a strict wrapper object cleanly validating `success` as a boolean.

*Success Payload Example:*
```json
{
  "success": true,
  "data": {
    "blocks": [ ... ]
  }
}
```

*Failure Payload Example:*
```json
{
  "success": false,
  "error": "Timeout generating astrologer logic."
}
```