# URekha Caching Architecture: Frontend Integration Guide

This guide explains how the backend generates cache keys. Understanding this ensures that frontend changes (like toggling colors or themes) correctly interact with the high-performance caching layer.

## 1. Identity-First Caching (The 6-Field Standard)
The backend uses a **Minimalist Identity** for all cache lookups. Only the following 6 fields in the payload affect the cache key:
- `date`, `time`, `latitude`, `longitude`, `tz`, `lang`

### What this means for UI Developers:
- **Visual Independence**: Changing `color`, `style`, or `colored_planets` in your request **will not** trigger a new API call if the birth details are already cached.
- **Speed**: The system will return the first version of the chart generated for those birth details instantly.

---

## 2. Suffixed Slug Formatting
Cache keys are prefixed with the **Original Shortcut** name.

| UI Requested Slug | Example Cache Key |
| :--- | :--- |
| `divisional_chart_D1` | `jyotisham:divisional_chart_D1:{identity}` |
| `chart_image_D9` | `jyotisham:chart_image_D9:{identity}` |
| `binnashtakvarga_Sun` | `jyotisham:binnashtakvarga_Sun:{identity}` |
| `/predict/health-1200` | `predict:health-1200:{identity}` |

---

## 3. Dynamic Format Parity (Wise Reconstruction)
The system is built to be flexible. Both of the following requests will hit the **same cache entry**:
1. `GET /jyotisham/chart_image_D1`
2. `POST /jyotisham/chart_image` with `{ division: "D1" }` in the body.

The backend "reconstructs" the slug `chart_image_D1` for the key regardless of which format you use.

---

## 4. Uncacheable Routes (Always Fresh)
The following data types are **never cached** and will always trigger a fresh fetch from the astrology provider:
- **Transit Charts**: `transit_chart`
- **Specific Dashas**: `dasha_specific_sub`, `mahadasha_specific_sub`
- **Calculated Sade-Sati**: `extended_current_sadesati`

---

## 5. AI Worker & Background Parity
If you see a "Black and White" (Plain Black `#000000`) chart, it was likely pre-cached by an AI worker. 
- AI workers use **default visual settings** to fetch missing data.
- Because the cache key ignores visual settings, your themed UI component will share the same high-speed data retrieved by the AI.
