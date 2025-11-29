import axios from "axios";
import { load } from "cheerio";
import Torrent from "../types";
import { USER_AGENT } from "../config/constants";

export const glodLSTorrents = async (query: string, page: string = "1"): Promise<Torrent[]> => {
    const url = `https://glodls.to/search_results.php?search=${query}&sort=seeders&order=desc&page=${page}`;
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

    const torrents: Torrent[] = [];
    $(".ttable_headinner tr").each((_, element) => {
        const torrent: Torrent = {
            name: $(element).find("td").eq(1).find("a").text().trim(),
            size: $(element).find("td").eq(4).text(),
            author: $(element).find("td").eq(7).find("a b font").text(),
            seeders: Number($(element).find("td").eq(5).find("font b").text()),
            leechers: Number($(element).find("td").eq(6).find("font b").text()),
            url: `https://glodls.to"${$(element)
                .find("td")
                .eq(1)
                .find("a")
                .next()
                .attr("href")}`,
            torrentLink: `https://glodls.to${$(element)
                .find("td")
                .eq(2)
                .find("a")
                .attr("href")}`,
            magnet: $(element).find("td").eq(3).find("a").attr("href"),
        };
        if (torrent.name !== "") {
            torrents.push(torrent);
        }
    });
    return torrents;
};
