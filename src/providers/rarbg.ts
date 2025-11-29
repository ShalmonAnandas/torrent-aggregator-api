import axios from "axios";
import { load } from "cheerio";
import Torrent from "../types";
import { USER_AGENT } from "../config/constants";

export const rarbgTorrents = async (query: string, page: string = "1"): Promise<Torrent[]> => {
    const allUrls: string[] = [];
    const torrents: Torrent[] = [];
    const url = `https://rargb.to/search/${page}/?search=${query}`;
    const options = {
        method: "GET",
        url,
        headers: {
            "User-Agent": USER_AGENT,
        },
        // @ts-ignore
        family: 4 as 4,
    };
    let html;
    try {
        html = await axios.request(options);
    } catch (err) {
        console.error("[rarbg] Error fetching list:", err);
        return [];
    }

    const $ = load(html.data);

    const items = $("table.lista2t tbody tr.lista2");

    items.each((_, el) => {
        const torrent: Torrent = {};
        const td = $(el).children("td");
        torrent.name = $(td).eq(1).find("a").attr("title");
        torrent.category = $(td).eq(2).find("a").text();
        torrent.dateUploaded = $(td).eq(3).text();
        torrent.size = $(td).eq(4).text();
        torrent.seeders = Number($(td).eq(5).find("font").text());
        torrent.leechers = Number($(td).eq(6).text());
        torrent.uploadedBy = $(td).eq(7).text();
        torrent.url = "https://rargb.to" + $(td).eq(1).find("a").attr("href");
        allUrls.push(torrent.url || "");
        torrents.push(torrent);
    });

    await Promise.all(
        allUrls.map(async (url) => {
            for (let i = 0; i < torrents.length; i++) {
                if (torrents[i]["url"] === url) {
                    const options = {
                        method: "GET",
                        url,
                        headers: {
                            "User-Agent": USER_AGENT,
                        },
                    };
                    let html;
                    try {
                        html = await axios.request(options);
                    } catch (err) {
                        return [];
                    }

                    const $ = load(html.data);

                    const poster =
                        "https://rargb.to" +
                        $("tr:nth-child(4) > td:nth-child(2) > img:nth-child(1)").attr(
                            "src"
                        ) || "";

                    torrents[i].poster = !poster.endsWith("undefined") ? poster : "";
                    torrents[i].magnet = $(
                        "tr:nth-child(1) > td:nth-child(2) > a:nth-child(3)"
                    ).attr("href");
                }
            }
        })
    );
    return torrents;
};
