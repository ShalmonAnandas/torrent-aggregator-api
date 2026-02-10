import axios from "axios";
import { load } from "cheerio";
import Torrent from "../types";
import { USER_AGENT } from "../config/constants";

const BASE_URL = "https://kickasstorrents.to";

export const kickassTorrents = async (query: string, page: string = "1"): Promise<Torrent[]> => {
    const torrents: Torrent[] = [];
    const url = `${BASE_URL}/usearch/${encodeURIComponent(query)}/${page}/`;

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

    $("table.data tbody tr, tbody tr").each((_, element) => {
        const nameLink = $(element).find("a.cellMainLink");
        if (!nameLink.length) return;

        const name = nameLink.text().trim();
        if (!name) return;

        const href = nameLink.attr("href");
        if (!href) return;

        const torrentUrl = `${BASE_URL}${href}`;
        const tds = $(element).find("td");

        const torrent: Torrent = {
            name,
            size: tds.eq(1).text().trim(),
            uploadedBy: tds.eq(2).text().trim(),
            seeders: Number(tds.eq(4).text().trim()) || 0,
            leechers: Number(tds.eq(5).text().trim()) || 0,
            url: torrentUrl,
            magnet: $(element).find("a[href^='magnet:']").attr("href"),
        };
        torrents.push(torrent);
    });

    return torrents;
};
