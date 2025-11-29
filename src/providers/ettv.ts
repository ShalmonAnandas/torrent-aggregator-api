import axios from "axios";
import { load } from "cheerio";
import Torrent from "../types";

export const ettvTorrents = async (query: string, page: string = "1"): Promise<Torrent[]> => {
    const allUrls: string[] = [];
    const torrents: Torrent[] = [];
    const url = `http://www.ettvcentral.com/torrents-search.php?search=${query}&page=${page}`;
    let html;
    try {
        html = await axios.get(url);
    } catch (err) {
        return [];
    }

    const $ = load(html.data);
    $("table tbody").each((_, element) => {
        $("tr").each((_, el) => {
            const td = $(el).children("td");
            const torrent: Torrent = {
                name: $(td).eq(1).find("a b").text(),
                category: $(td).eq(0).find("a img").attr("title"),
                dateUploaded: $(td).eq(2).text(),
                size: $(td).eq(3).text(),
                seeders: Number($(td).eq(5).text()),
                leechers: Number($(td).eq(6).text()),
                url: `https://www.ettvcentral.com${$(td).eq(1).find("a").attr("href")}`,
                author: $(td).eq(7).text(),
            };
            if (torrent.name !== "") {
                allUrls.push(torrent?.url || "");
                torrents.push(torrent);
            }
        });
    });

    // Optimization: Fetch details in parallel but limit concurrency or just return what we have?
    // For now, keeping original logic but wrapping in try-catch blocks inside map
    await Promise.all(
        allUrls.map(async (url) => {
            for (let i = 0; i < torrents.length; i++) {
                if (torrents[i]["url"] === url) {
                    let html;
                    try {
                        html = await axios.get(url);
                    } catch (err) {
                        return null;
                    }
                    const $ = load(html.data);
                    try {
                        torrents[i].poster = $("div .torrent_data")
                            .find("center img")
                            .attr("src");

                        torrents[i].magnet = $(
                            "#downloadbox > table > tbody > tr > td:nth-child(1) > a"
                        ).attr("href");
                    } catch (err) {
                        return [];
                    }
                }
            }
        })
    );

    return torrents;
};
