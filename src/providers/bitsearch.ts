import axios from "axios";
import { load } from "cheerio";
import Torrent from "../types";
import { USER_AGENT } from "../config/constants";

const BASE_URL = "https://bitsearch.to";

export const bitSearch = async (query: string, page = "1"): Promise<Torrent[]> => {
    const url = `${BASE_URL}/search?q=${encodeURIComponent(query)}&page=${page}&sort=seeders`;

    let html;
    try {
        html = await axios.get(url, {
            headers: {
                "User-Agent": USER_AGENT,
            },
            timeout: 10000,
        });
    } catch (err) {
        return [];
    }

    const $ = load(html.data);
    const torrents: Torrent[] = [];

    // Try multiple possible container selectors for robustness
    const items = $("li.search-result, .search-result, .card.search-result");

    if (items.length === 0) {
        // Fallback: try the older layout
        $(".data-list li, .search-result-list li").each((_, element) => {
            const name = $(element).find("h5 a, h3 a, .title a").first().text().trim();
            if (name) {
                const seeders = Number($(element).find(".stats .seeders, .seed").text().replace(/[^0-9]/g, "")) || 0;
                const leechers = Number($(element).find(".stats .leechers, .leech").text().replace(/[^0-9]/g, "")) || 0;
                const size = $(element).find(".stats .size, .filesize").text().trim();
                const magnet = $(element).find("a[href^='magnet:']").attr("href");
                const href = $(element).find("h5 a, h3 a, .title a").first().attr("href");
                const torrentUrl = href ? (href.startsWith("http") ? href : BASE_URL + href) : "";

                torrents.push({
                    name,
                    size,
                    seeders,
                    leechers,
                    url: torrentUrl,
                    magnet,
                });
            }
        });
    }

    items.each((_, element) => {
        const name = $(element).find("h5 a, h3 a, .title a").first().text().trim();
        if (name) {
            const statsText = $(element).text();
            const seedMatch = statsText.match(/(\d+)\s*seed/i);
            const leechMatch = statsText.match(/(\d+)\s*leech/i);
            const seeders = seedMatch ? Number(seedMatch[1]) : 0;
            const leechers = leechMatch ? Number(leechMatch[1]) : 0;

            const info = $(element).find(".info, .stats, .details");
            const size = info.find(".size, span:contains('B')").first().text().trim() ||
                $(element).find("span:contains('GB'), span:contains('MB'), span:contains('KB')").first().text().trim();

            const href = $(element).find("h5 a, h3 a, .title a").first().attr("href");
            const torrentUrl = href ? (href.startsWith("http") ? href : BASE_URL + href) : "";
            const magnet = $(element).find("a[href^='magnet:']").attr("href");

            torrents.push({
                name,
                size,
                seeders,
                leechers,
                url: torrentUrl,
                magnet,
            });
        }
    });

    return torrents;
};
