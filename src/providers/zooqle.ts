import axios from "axios";
import { load } from "cheerio";
import Torrent from "../types";
import { USER_AGENT } from "../config/constants";

const BASE_URL = "https://zooqle.com";

export const zooqle = async (query = "", page = "1"): Promise<Torrent[]> => {
    const torrents: Torrent[] = [];
    const url = `${BASE_URL}/search?pg=${page}&q=${encodeURIComponent(query)}`;
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

    $("tbody tr").each((_, element) => {
        const tds = $(element).find("td");
        const name = tds.eq(1).find("a").text().trim();
        if (!name) return;

        const divTitle = tds.eq(5).find("div").attr("title") || "";
        let seeders = 0;
        let leechers = 0;
        if (divTitle) {
            const parts = divTitle.split("|");
            seeders = Number((parts[0] || "").replace(/[^0-9]/g, "")) || 0;
            leechers = Number((parts[1] || "").replace(/[^0-9]/g, "")) || 0;
        }

        const torrent: Torrent = {
            name,
            size: tds.eq(3).find("div div").text().trim(),
            dateUploaded: tds.eq(4).text().trim(),
            seeders,
            leechers,
            url: BASE_URL + (tds.eq(1).find("a").attr("href") || ""),
            magnet: tds.eq(2).find("ul li").eq(1).find("a").attr("href"),
        };
        torrents.push(torrent);
    });
    return torrents;
};
