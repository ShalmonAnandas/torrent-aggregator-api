import axios from "axios";
import { load } from "cheerio";
import Torrent from "../types";
import { USER_AGENT } from "../config/constants";

const BASE_URL = "https://www.magnetdl.com";

export const magnetDLTorrents = async (query: string, page: string = "1"): Promise<Torrent[]> => {
    // MagnetDL URL format requires first letter of query
    const searchQuery = query.replace(/\s+/g, "-").toLowerCase();
    const firstLetter = searchQuery.charAt(0);
    const url = `${BASE_URL}/${firstLetter}/${searchQuery}/`;

    let html;
    try {
        html = await axios.get(url, {
            headers: { "User-Agent": USER_AGENT },
            timeout: 10000,
        });
    } catch (err) {
        return [];
    }

    const $ = load(html.data);

    const torrents: Torrent[] = [];
    $("table.download tbody tr").each((_, element) => {
        const tds = $(element).find("td");
        if (tds.length < 8) return;

        const name = tds.eq(1).find("a").text().trim();
        if (!name) return;

        const torrent: Torrent = {
            name,
            size: tds.eq(5).text().trim(),
            dateUploaded: tds.eq(2).text().trim(),
            category: tds.eq(3).text().trim(),
            seeders: Number(tds.eq(6).text().trim()) || 0,
            leechers: Number(tds.eq(7).text().trim()) || 0,
            url: `${BASE_URL}${tds.eq(1).find("a").attr("href") || ""}`,
            magnet: tds.eq(0).find("a[href^='magnet:']").attr("href"),
        };
        torrents.push(torrent);
    });
    return torrents;
};
