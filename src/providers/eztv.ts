import axios from "axios";
import { load } from "cheerio";
import Torrent from "../types";

export const eztvTorrent = async (query: string): Promise<Torrent[]> => {
    const url = `https://eztvx.to/search/${query}`;
    let html;
    const options = {
        method: "POST",
        url,
        data: "layout=def_wlinks",
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Content-Type": "application/x-www-form-urlencoded",
        },
    };

    try {
        html = await axios.request({
            ...options,
            // @ts-ignore
            family: 4,
        });
    } catch (err) {
        console.error("[eztv] Error:", err);
        return [];
    }

    const $ = load(html.data);
    const torrents: Torrent[] = [];

    const items = $("tr.forum_header_border");

    items.each((_, element) => {
        const titleLink = $(element).find("td.forum_thread_post a.epinfo");
        const name = titleLink.text().trim();
        if (name) {
            const magnet = $(element).find("a.magnet").attr("href");
            const size = $(element).find("td").eq(3).text().trim();
            const dateUploaded = $(element).find("td").eq(4).text().trim();
            const seeders = Number($(element).find("td.forum_thread_post_end font").text().trim()) || 0;
            const url = "https://eztvx.to" + titleLink.attr("href");

            torrents.push({
                name,
                size,
                dateUploaded,
                seeders,
                leechers: 0,
                downloads: "0",
                url,
                torrentLink: magnet,
                magnet,
                category: "TV",
            });
        }
    });

    return torrents;
};
