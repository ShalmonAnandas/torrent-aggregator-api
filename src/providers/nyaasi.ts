import axios from "axios";
import { load } from "cheerio";
import Torrent from "../types";
import { USER_AGENT } from "../config/constants";

const BASE_URL = "https://nyaa.si";

export const nyaaSITorrents = async (query: string, page: string = "1"): Promise<Torrent[]> => {
    const url = `${BASE_URL}/?f=0&c=0_0&q=${encodeURIComponent(query)}&p=${page}`;
    let html = null;
    try {
        html = await axios.get(url, {
            headers: { "User-Agent": USER_AGENT },
            timeout: 10000,
        });
    } catch {
        return [];
    }

    const $ = load(html.data);
    const torrents: Torrent[] = [];
    $("table.torrent-list tbody tr").each((_, element) => {
        const td = $(element).children("td");
        const category = $(td).eq(0).find("a").attr("title") || "";
        const nameLink = $(td).eq(1).find("a:not(.comments)").last();
        const name = nameLink.text().trim();
        const href = nameLink.attr("href");
        const torrentUrl = href ? BASE_URL + href : "";
        const magnet = $(td).eq(2).find("a[href^='magnet:']").attr("href");
        const torrentLink = $(td).eq(2).find("a[href$='.torrent']").attr("href");
        const size = $(td).eq(3).text().trim();
        const dateUploaded = $(td).eq(4).text().trim();
        const seeders = Number($(td).eq(5).text().trim());
        const leechers = Number($(td).eq(6).text().trim());
        const downloads = $(td).eq(7).text().trim();

        if (name) {
            torrents.push({
                name,
                category,
                url: torrentUrl,
                magnet,
                torrentLink: torrentLink ? BASE_URL + torrentLink : undefined,
                size,
                dateUploaded,
                seeders,
                leechers,
                downloads,
            });
        }
    });

    return torrents;
};
