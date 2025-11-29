import axios from "axios";
import { load } from "cheerio";
import Torrent from "../types";
import { MOBILE_USER_AGENT } from "../config/constants";

export const magnetDLTorrents = async (query: string, page: string = "1"): Promise<Torrent[]> => {
    const url =
        page === "" || page === "1"
            ? `https://magnetdl.abcproxy.org/search/?q=${query}&m=1`
            : `https://magnetdl.proxyninja.org/search/?q=${query}&m=1`;

    let html;
    const options = {
        method: "GET",
        url,
        headers: {
            "User-Agent": MOBILE_USER_AGENT,
        },
    };
    try {
        html = await axios.request(options);
    } catch (err) {
        return [];
    }

    const $ = load(html.data);

    const torrents: Torrent[] = [];
    $(".download tbody tr").each((_, element) => {
        const torrent: Torrent = {
            name: $(element).find("td").eq(1).find("a").text().trim(),
            size: $(element).find("td").eq(5).text(),
            dateUploaded: $(element).find("td").eq(2).text(),
            category: $(element).find("td").eq(3).text(),
            seeders: Number($(element).find("td").eq(6).text()),
            leechers: Number($(element).find("td").eq(7).text()),
            url: `https://www.magnetdl.com${$(element)
                .find("td")
                .eq(1)
                .find("a")
                .attr("href")}`,
            magnet: $(element).find("td").eq(0).find("a").attr("href"),
        };
        if (torrent.name !== "") {
            torrents.push(torrent);
        }
    });
    return torrents;
};
