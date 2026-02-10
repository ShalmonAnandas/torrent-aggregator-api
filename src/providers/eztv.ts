import axios from "axios";
import { load } from "cheerio";
import Torrent from "../types";
import { USER_AGENT } from "../config/constants";

const BASE_URL = "https://eztvx.to";

export const eztvTorrent = async (query: string): Promise<Torrent[]> => {
    const searchQuery = query.split(" ").join("-");
    const url = `${BASE_URL}/search/${searchQuery}`;
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

    const items = $("tr.forum_header_border");

    items.each((_, element) => {
        const titleLink = $(element).find("a.epinfo");
        const name = titleLink.text().trim();
        if (name) {
            const magnet = $(element).find("a.magnet").attr("href");
            const tds = $(element).find("td.forum_thread_post");
            const size = tds.eq(3).text().trim();
            const dateUploaded = tds.eq(4).text().trim();
            const seeders = Number($(element).find("td.forum_thread_post_end font").text().trim()) || 0;
            const href = titleLink.attr("href");
            const torrentUrl = href ? BASE_URL + href : "";

            torrents.push({
                name,
                size,
                dateUploaded,
                seeders,
                leechers: 0,
                downloads: "0",
                url: torrentUrl,
                torrentLink: magnet,
                magnet,
                category: "TV",
            });
        }
    });

    return torrents;
};
