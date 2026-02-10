import axios from "axios";
import { load } from "cheerio";
import Torrent from "../types";
import { USER_AGENT } from "../config/constants";

const BASE_URL = "https://torrentgalaxy.to";

export const torrentGalaxy = async (query = "", page = "0"): Promise<Torrent[]> => {
    let currentPage: number = 0;
    if (page !== "0") {
        try {
            currentPage = Number(page) - 1;
        } catch {
            return [];
        }
    }

    const allTorrents: Torrent[] = [];
    const url = `${BASE_URL}/torrents.php?search=${encodeURIComponent(query)}&sort=id&order=desc&page=${currentPage}`;
    let html;
    try {
        html = await axios.get(url, {
            headers: { "User-Agent": USER_AGENT },
            timeout: 10000,
        });
    } catch {
        return [];
    }

    const $ = load(html.data);

    $("div.tgxtablerow.txlight").each((_, element) => {
        const torrent: Torrent = {};
        const cells = $(element).find("div.tgxtablecell");

        torrent.name = $(element).find("a.txlight b, div:nth-child(4) a b").text().trim();
        torrent.category = cells.eq(0).find("a small").text().trim();
        const href = $(element).find("a.txlight").attr("href");
        torrent.url = href ? BASE_URL + href : "";
        torrent.uploadedBy = cells.eq(6).find("span a span").text().trim();
        torrent.size = cells.eq(7).text().trim();
        torrent.seeders = Number(cells.eq(10).find("span font:nth-child(1)").text().trim()) || 0;
        torrent.leechers = Number(cells.eq(10).find("span font:nth-child(2)").text().trim()) || 0;
        torrent.dateUploaded = cells.eq(11).text().trim();

        // Get torrent download link and magnet
        const downloadCell = $(element).find("div.tgxtablecell a[href$='.torrent']");
        torrent.torrentLink = downloadCell.attr("href");
        torrent.magnet = $(element).find("a[href^='magnet:']").attr("href");

        if (torrent.name) {
            allTorrents.push(torrent);
        }
    });
    return allTorrents;
};
