import axios from "axios";
import { load } from "cheerio";
import Torrent from "../types";

import { USER_AGENT } from "../config/constants";

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
    const url =
        "https://torrentgalaxy.to/torrents.php?search=" +
        query +
        "&sort=id&order=desc&page=" +
        currentPage;
    let html;
    try {
        html = await axios.get(url, {
            headers: {
                "User-Agent": USER_AGENT,
            },
            // @ts-ignore
            family: 4 as 4,
        });
    } catch {
        return [];
    }

    const $ = load(html.data);

    $("div.tgxtablerow.txlight").each((_, element) => {
        const torrent: Torrent = {};
        torrent.name = $(element).find(":nth-child(4) div a b").text();
        torrent.category = $(element).find(":nth-child(1) a small").text();
        torrent.url =
            "https://torrentgalaxy.to" + $(element).find("a.txlight").attr("href");
        torrent.uploadedBy = $(element).find(":nth-child(7) span a span").text();
        torrent.size = $(element).find(":nth-child(8)").text();
        torrent.seeders = Number(
            $(element).find(":nth-child(11) span font:nth-child(1)").text()
        );
        torrent.leechers = Number(
            $(element).find(":nth-child(11) span font:nth-child(2)").text()
        );
        torrent.dateUploaded = $(element).find(":nth-child(12)").text();
        torrent.torrentLink = $(element)
            .find(".tgxtablecell.collapsehide.rounded.txlight a")
            .attr("href");
        torrent.magnet = $(element)
            .find(".tgxtablecell.collapsehide.rounded.txlight a")
            .next()
            .attr("href");
        allTorrents.push(torrent);
    });
    return allTorrents;
};
