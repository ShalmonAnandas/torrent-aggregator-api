import axios from "axios";
import { load } from "cheerio";
import Torrent from "../types";
import { USER_AGENT } from "../config/constants";

const BASE_URL = "https://www.torlock.com";

export const torLock = async (query = "", page = "1"): Promise<Torrent[]> => {
    const torrents: Torrent[] = [];
    const url = encodeURI(`${BASE_URL}/all/torrents/${query}/${page}.html`);
    let html;
    try {
        html = await axios.get(url, {
            headers: { "User-Agent": USER_AGENT },
            timeout: 10000,
        });
    } catch (error) {
        return [];
    }

    const $ = load(html.data);

    $("table tbody tr, .table tbody tr").each((_, element) => {
        const nameLink = $(element).find("td").eq(0).find("a, div a");
        const name = nameLink.find("b").text().trim() || nameLink.text().trim();
        if (!name) return;

        const href = nameLink.attr("href");
        const torrentUrl = href ? BASE_URL + href : "";
        const tds = $(element).find("td");

        const torrent: Torrent = {
            name,
            size: tds.eq(2).text().trim(),
            dateUploaded: tds.eq(1).text().trim(),
            seeders: Number(tds.eq(3).text().trim()) || 0,
            leechers: Number(tds.eq(4).text().trim()) || 0,
            url: torrentUrl,
        };
        torrents.push(torrent);
    });

    return torrents;
};
