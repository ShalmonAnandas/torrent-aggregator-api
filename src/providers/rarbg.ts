import Torrent from "../types";

// RARBG permanently shut down in May 2023.
// This provider is kept for backward compatibility but will always return empty results.
export const rarbgTorrents = async (_query: string, _page: string = "1"): Promise<Torrent[]> => {
    return [];
};
