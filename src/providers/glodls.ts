import axios from "axios";
import { load } from "cheerio";
import Torrent from "../types";
import { USER_AGENT } from "../config/constants";

const BASE_URL = "https://glodls.to";

export const glodLSTorrents = async (query: string, page: string = "1"): Promise<Torrent[]> => {
    const url = `${BASE_URL}/search_results.php?search=${encodeURIComponent(query)}&sort=seeders&order=desc&page=${page}`;
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
    $(".ttable_headinner tr").each((_, element) => {
        const name = $(element).find("td").eq(1).find("a").text().trim();
        if (!name) return;

        const torrent: Torrent = {
            name,
            size: $(element).find("td").eq(4).text().trim(),
            author: $(element).find("td").eq(7).find("a b font").text().trim(),
            seeders: Number($(element).find("td").eq(5).find("font b").text()) || 0,
            leechers: Number($(element).find("td").eq(6).find("font b").text()) || 0,
            url: `${BASE_URL}${$(element).find("td").eq(1).find("a").next().attr("href") || ""}`,
            torrentLink: `${BASE_URL}${$(element).find("td").eq(2).find("a").attr("href") || ""}`,
            magnet: $(element).find("td").eq(3).find("a").attr("href"),
        };
        torrents.push(torrent);
    });
    return torrents;
};
