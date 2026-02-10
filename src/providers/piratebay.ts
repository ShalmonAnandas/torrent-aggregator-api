import axios from "axios";
import Torrent from "../types";
import { USER_AGENT } from "../config/constants";

const API_URL = "https://apibay.org";

export const pirateBayTorrents = async (query: string, page: string = "1"): Promise<Torrent[]> => {
    const url = `${API_URL}/q.php?q=${encodeURIComponent(query)}&cat=0`;
    let response;
    try {
        response = await axios.get(url, {
            headers: {
                "User-Agent": USER_AGENT,
            },
            timeout: 10000,
        });
    } catch (err) {
        return [];
    }

    const torrents: Torrent[] = [];

    if (!Array.isArray(response.data)) {
        return [];
    }

    for (const item of response.data) {
        // apibay returns {id: "0", name: "No results..."} when no results found
        if (item.id === "0" || !item.name) continue;

        const name = item.name;
        const infoHash = item.info_hash;
        const seeders = Number(item.seeders) || 0;
        const leechers = Number(item.leechers) || 0;
        const size = formatSize(Number(item.size) || 0);
        const dateUploaded = item.added ? new Date(Number(item.added) * 1000).toISOString().split("T")[0] : "";
        const uploadedBy = item.username || "";
        const category = item.category || "";
        const magnet = `magnet:?xt=urn:btih:${infoHash}&dn=${encodeURIComponent(name)}`;

        torrents.push({
            name,
            size,
            dateUploaded,
            category,
            seeders,
            leechers,
            uploadedBy,
            url: `https://thepiratebay.org/description.php?id=${item.id}`,
            magnet,
        });
    }

    return torrents;
};

function formatSize(bytes: number): string {
    if (bytes === 0) return "0 B";
    const units = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, i)).toFixed(2) + " " + units[i];
}
