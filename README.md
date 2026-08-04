# Torrent Aggregator API

A powerful API to aggregate torrent search results from multiple providers.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FShalmonAnandas%2Ftorrent-aggregator-api)

## Features

- Search for torrents across multiple providers.
- Unified JSON response format.
- Caching for faster responses.
- Easy to extend with new providers.

## Provider Status

Check the live status of all providers at: [https://aggregatorapi.shalmon.site/status](https://aggregatorapi.shalmon.site/status)

Status legend: ✅ working, ⚠️ no results for the probe query, ❌ failed/timeout, ⚪ retired provider.

<!-- STATUS_TABLE_START -->
| Provider | Status | Results | Latency |
|----------|--------|---------|---------|
| 1337x | ⚠️ | 0 | 135ms |
| Bitsearch | ⚠️ | 0 | 126ms |
| Ettv | ⚠️ | 0 | 142ms |
| Eztv | ⚠️ | 0 | 127ms |
| Glodls | ⚠️ | 0 | 10019ms |
| Kickass | ⚠️ | 0 | 124ms |
| Limetorrents | ⚠️ | 0 | 153ms |
| Magnetdl | ⚠️ | 0 | 124ms |
| Nyaasi | ✅ | 75 | 535ms |
| Piratebay | ⚠️ | 0 | 143ms |
| Rarbg | ⚪ | 0 | 0ms |
| Torlock | ✅ | 104 | 1283ms |
| Torrentfunk | ⚠️ | 0 | 141ms |
| Torrentgalaxy | ⚠️ | 0 | 80ms |
| Torrentproject | ⚠️ | 0 | 567ms |
| Zooqle | ⚠️ | 0 | 139ms |
<!-- STATUS_TABLE_END -->

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ShalmonAnandas/torrent-aggregator-api.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally

```bash
npm start
```

The server will start at `http://localhost:3000`.

## API Documentation

You can import the Postman collection to explore the API:

[Download Postman Collection](./torrent_aggregator_postman_collection.json)

## Acknowledgements

Special thanks to [Nachiket Bhuta](https://github.com/nachiketbhuta) for providing the base for this project in [torrent-aggregator-api](https://github.com/nachiketbhuta/torrent-aggregator-api.git).
