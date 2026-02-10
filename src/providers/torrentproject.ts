import axios from "axios";
import { load } from "cheerio";
import Torrent from "../types";
import { USER_AGENT } from "../config/constants";

const BASE_URL = "https://torrentproject.se";

export const torrentProject = async (query: string, page = "0"): Promise<Torrent[]> => {
    const torrents: Torrent[] = [];
    const url = `${BASE_URL}/?t=${encodeURIComponent(query)}&p=${page}&orderby=seeders`;
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

    $(".tt div, #similarfiles div, table tr").each((i, element) => {
        if (i < 2) return;

        const nameEl = $(element).find("span").eq(0).find("a");
        const name = nameEl.text().trim() || $(element).find("td").eq(0).find("a").text().trim();
        if (!name) return;

        const href = nameEl.attr("href") || $(element).find("td").eq(0).find("a").attr("href");
        const torrentUrl = href ? BASE_URL + href : "";

        const torrent: Torrent = {
            name,
            size: $(element).find("span:nth-child(5), td:nth-child(5)").text().trim(),
            dateUploaded: $(element).find("span:nth-child(4), td:nth-child(4)").text().trim(),
            seeders: Number($(element).find("span:nth-child(2), td:nth-child(2)").text().trim()) || 0,
            leechers: Number($(element).find("span:nth-child(3), td:nth-child(3)").text().trim()) || 0,
            url: torrentUrl,
        };
        torrents.push(torrent);
    });

    return torrents;
};
