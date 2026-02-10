import axios from "axios";
import { load } from "cheerio";
import Torrent from "../types";
import { USER_AGENT } from "../config/constants";

const BASE_URL = "https://www.torrentfunk.com";

export const torrentFunk = async (query: string, page = "1"): Promise<Torrent[]> => {
    const torrents: Torrent[] = [];
    let url = "";
    if (page === "" || page === "1") {
        url = `${BASE_URL}/all/torrents/${encodeURIComponent(query)}.html`;
    } else {
        url = `${BASE_URL}/all/torrents/${encodeURIComponent(query)}/${page}.html`;
    }

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

    $(".tmain tbody tr").each((_, element) => {
        const nameLink = $(element).find("td").eq(0).find("a");
        const name = nameLink.text().trim();
        if (!name) return;

        const href = nameLink.attr("href");
        const torrentUrl = href ? BASE_URL + href : "";

        const torrent: Torrent = {
            name,
            size: $(element).find("td").eq(2).text().trim(),
            dateUploaded: $(element).find("td").eq(1).text().trim(),
            author: $(element).find("td").eq(5).text().trim(),
            seeders: Number($(element).find("td").eq(3).text().trim()) || 0,
            leechers: Number($(element).find("td").eq(4).text().trim()) || 0,
            url: torrentUrl,
        };
        torrents.push(torrent);
    });

    return torrents;
};
