import axios from "axios";
import { load } from "cheerio";
import Torrent from "../types";
import { USER_AGENT } from "../config/constants";

const BASE_URL = "https://www.ettvcentral.com";

export const ettvTorrents = async (query: string, page: string = "1"): Promise<Torrent[]> => {
    const torrents: Torrent[] = [];
    const url = `${BASE_URL}/torrents-search.php?search=${encodeURIComponent(query)}&page=${page}`;
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
    $("table tbody tr").each((_, el) => {
        const td = $(el).children("td");
        if (td.length < 7) return;
        const name = $(td).eq(1).find("a b").text().trim();
        if (!name) return;

        const torrent: Torrent = {
            name,
            category: $(td).eq(0).find("a img").attr("title"),
            dateUploaded: $(td).eq(2).text().trim(),
            size: $(td).eq(3).text().trim(),
            seeders: Number($(td).eq(5).text().trim()) || 0,
            leechers: Number($(td).eq(6).text().trim()) || 0,
            url: `${BASE_URL}${$(td).eq(1).find("a").attr("href") || ""}`,
            author: $(td).eq(7).text().trim(),
        };
        torrents.push(torrent);
    });

    return torrents;
};
