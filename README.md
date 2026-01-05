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

<!-- STATUS_TABLE_START -->
| Provider | Status | Results | Latency |
|----------|--------|---------|---------|
| 1337x | ❌ | 0 | 218ms |
| Bitsearch | ❌ | 0 | 152ms |
| Ettv | ❌ | 0 | 97ms |
| Eztv | ❌ | 0 | 143ms |
| Glodls | ❌ | 0 | 985ms |
| Kickass | ❌ | 0 | 148ms |
| Limetorrents | ❌ | 0 | 157ms |
| Magnetdl | ❌ | 0 | 67ms |
| Nyaasi | ✅ | 1 | 418ms |
| Piratebay | ✅ | 30 | 578ms |
| Rarbg | ❌ | 0 | 168ms |
| Torlock | ❌ | - | - |
| Torrentfunk | ❌ | 0 | 186ms |
| Torrentgalaxy | ❌ | 0 | 146ms |
| Torrentproject | ❌ | 0 | 184ms |
| Zooqle | ❌ | 0 | 193ms |
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
