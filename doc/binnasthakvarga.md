Here are the exact request bodies used for both cases, as verified by the successful test suite.

1. Batch Request (Multi-Planet)
Sent to the Group endpoint. Notice that the planets are passed inside the tasks array as individual objects.

Endpoint: POST /jyotisham/group/batch_slug_abc
Request Body:
json
{
  "room": "your_unique_room_id",
  "payload": {
    "date": "10/10/1990",
    "time": "12:00",
    "latitude": 28.6139,
    "longitude": 77.2090,
    "tz": 5.5,
    "lang": "en"
  },
  "tasks": [
    { "task": "binnashtakvarga", "payload": { "planet": "Sun" } },
    { "task": "binnashtakvarga", "payload": { "planet": "Moon" } },
    { "task": "binnashtakvarga", "payload": { "planet": "Mars" } }
  ]
}
2. Single Request (Retries / Specific Planet)
Sent to the Single endpoint. The planet is identified by the prefixed slug in the URL, so it doesn't need to be in the body (the backend extracts it from the slug automatically).

Endpoint: POST /jyotisham/binnashtakvarga
Request Body:
json
{
  "room": "your_unique_room_id",
  "payload": {
    "date": "10/10/1990",
    "time": "12:00",
    "latitude": 28.6139,
    "longitude": 77.2090,
    "tz": 5.5,
    "lang": "en",
    "planet": "Mars"
  }
}
Key takeaway for implementation:
Batch: Use the tasks array with { task, payload } objects.
Single/Retry: Simply append _PlanetName to the slug in the URL and send the standard birth details payload.


1. Batch Request Socket Data (Array)
Returns a positional array. Even if you requested "Sun", the data contains the points for all planets for that birth chart. The orchestrator.ts uses the index to map it correctly.

Socket Event: jyotisham_group_result/${room}/${slug}
Payload:
json
[
  {
    "task": "binnashtakvarga",
    "status": "success",
    "data": {
      "status": 200,
      "response": {
        "sun": [0,0,1,1,0,0,0,1,0,1,1,0],
        "moon": [1,0,0,0,1,0,0,1,0,0,0,0],
        "mars": [0,1,1,0,1,0,0,1,1,0,1,1],
        "mercury": [0,0,0,1,0,0,0,1,0,1,1,0],
        "jupiter": [1,1,1,0,0,0,0,0,1,0,0,0],
        "venus": [1,0,0,1,1,0,0,0,0,0,1,0],
        "saturn": [0,0,1,1,1,1,1,0,1,0,0,1],
        "ascendant": [0,1,0,0,0,1,1,0,1,0,1,0],
        "Total": [3,3,4,4,4,2,2,4,4,2,5,2]
      },
      "callsRemaining": 51883
    },
    "index": 0
  },
  {
    "task": "binnashtakvarga",
    "status": "success",
    "data": { ...data_for_next_planet_task... },
    "index": 1
  }
]
2. Single Request Socket Data (Object)
Returns a standard success/data wrapper.

Socket Event: jyotisham_result/${room}/binnashtakvarga_Mars
Payload:
json
{
  "success": true,
  "data": {
    "status": 200,
    "response": {
      "sun": [0,0,1,1,0,0,0,1,0,1,1,0],
      "moon": [1,0,0,0,1,0,0,1,0,0,0,0],
      "mars": [0,1,1,0,1,0,0,1,1,0,1,1],
      "mercury": [0,0,0,1,0,0,0,1,0,1,1,0],
      "jupiter": [1,1,1,0,0,0,0,0,1,0,0,0],
      "venus": [1,0,0,1,1,0,0,0,0,0,1,0],
      "saturn": [0,0,1,1,1,1,1,0,1,0,0,1],
      "ascendant": [0,1,0,0,0,1,1,0,1,0,1,0],
      "Total": [3,3,4,4,4,2,2,4,4,2,5,2]
    },
    "callsRemaining": 51883
  }
}