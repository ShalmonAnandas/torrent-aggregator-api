import axios from "axios";
import { load } from "cheerio";
import Torrent from "../types";
import { USER_AGENT } from "../config/constants";

export const bitSearch = async (query: string, page = "1"): Promise<Torrent[]> => {
    const url = `https://bitsearch.to/search?q=${query}&page=${page}&sort=seeders`;

    const options = {
        method: "GET",
        url,
        headers: {
            "User-Agent": USER_AGENT,
        },
    };
    let html;
    try {
        html = await axios.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            },
            // @ts-ignore
            family: 4,
        });
    } catch (err) {
        console.error("[bitsearch] Error:", err);
        return [];
    }

    const $ = load(html.data);
    const torrents: Torrent[] = [];

    const items = $("div.bg-white.rounded-lg.shadow-sm.border.border-gray-200.p-6");

    items.each((_, element) => {
        const name = $(element).find("h3 a").text().trim();
        if (name) {
            const stats = $(element).find("div.flex.flex-wrap.items-center.gap-4.text-sm");
            const seeders = Number(stats.find("span.text-green-600 span.font-medium").text().trim());
            const leechers = Number(stats.find("span.text-red-600 span.font-medium").text().trim());
            const downloads = stats.find("span.text-blue-600 span.font-medium").text().trim();

            const info = $(element).find("div.flex.flex-wrap.items-center.gap-4.text-sm.text-gray-600");
            const category = info.find("span.inline-flex").eq(0).find("span").eq(1).text().trim();
            const size = info.find("span.inline-flex").eq(1).find("span").eq(1).text().trim();
            const dateUploaded = info.find("span.inline-flex").eq(2).find("span").eq(1).text().trim();

            const url = "https://bitsearch.to" + $(element).find("h3 a").attr("href");
            const torrentLink = "https://bitsearch.to" + $(element).find("a[href^='/download/torrent']").attr("href");
            const magnet = $(element).find("a[href^='magnet:']").attr("href");

            torrents.push({
                name,
                size,
                dateUploaded,
                seeders,
                leechers,
                downloads,
                url,
                torrentLink,
                magnet,
                category,
            });
        }
    });

    return torrents;
};
