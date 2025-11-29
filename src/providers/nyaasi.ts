import axios from "axios";
import { load } from "cheerio";
import Torrent from "../types";

export const nyaaSITorrents = async (query: string, page: string = "1"): Promise<Torrent[]> => {
    const url = `https://nyaa.si/?f=0&c=0_0&q=${query}&p=${page}`;
    let html = null;
    try {
        html = await axios.get(url);
    } catch {
        return [];
    }
    const regex = /.comments/gi;

    const $ = load(html.data);
    const torrents: Torrent[] = [];
    $("tbody tr").each((_, element) => {
        const td = $(element).children("td");
        const category = $(element).find("td:nth-child(1) a").attr("title");
        const name = $(element).find("td:nth-child(2) a:not(.comments)").text().trim();
        const url = "https://nyaa.si" + $(element).find("td:nth-child(2) a:not(.comments)").attr("href");
        const magnet = $(element).find("td:nth-child(3) a[href^='magnet:']").attr("href");
        const torrentLink = "https://nyaa.si" + $(element).find("td:nth-child(3) a[href$='.torrent']").attr("href");
        const size = $(td).eq(3).text().trim();
        const dateUploaded = $(td).eq(4).text().trim();
        const seeders = Number($(td).eq(5).text().trim());
        const leechers = Number($(td).eq(6).text().trim());
        const downloads = $(td).eq(7).text().trim();

        if (name) {
            torrents.push({
                name,
                category,
                url,
                magnet,
                torrentLink,
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
