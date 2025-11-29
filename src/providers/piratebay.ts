import axios from "axios";
import { load } from "cheerio";
import Torrent from "../types";

export const pirateBayTorrents = async (query: string, page: string = "1"): Promise<Torrent[]> => {
    const url = `https://tpb.party/search/${query}/${page}/99/0`;
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
        console.error("[piratebay] Error:", err);
        return [];
    }
    const $ = load(html.data);
    const torrents: Torrent[] = [];

    const items = $("table#searchResult tr");

    items.each((_, element) => {
        // Skip header row
        if ($(element).find("th").length > 0) return;

        const name = $(element).find("td").eq(1).find("a").text().trim();
        if (name) {
            const dateUploaded = $(element).find("td").eq(2).text().trim();
            const magnet = $(element).find("td").eq(3).find("a[href^='magnet:']").attr("href");
            const size = $(element).find("td").eq(4).text().trim();
            const seeders = Number($(element).find("td").eq(5).text().trim()) || 0;
            const leechers = Number($(element).find("td").eq(6).text().trim()) || 0;
            const uploadedBy = $(element).find("td").eq(7).find("a").text().trim() || $(element).find("td").eq(7).text().trim();
            const url = "https://tpb.party" + $(element).find("td").eq(1).find("a").attr("href");
            const category = $(element).find("td").eq(0).text().trim();

            torrents.push({
                name,
                size,
                dateUploaded,
                category,
                seeders,
                leechers,
                uploadedBy,
                url,
                magnet,
            });
        }
    });

    return torrents;
};
