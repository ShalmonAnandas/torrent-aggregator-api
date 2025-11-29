import axios from "axios";
import { load } from "cheerio";
import Torrent from "../types";
import { USER_AGENT } from "../config/constants";

export const zooqle = async (query = "", page = "1"): Promise<Torrent[]> => {
    const torrents: Torrent[] = [];
    const url = "https://zooqle.com/search?pg=" + page + "&q=" + query;
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

    $("tbody tr").each((_, element) => {
        const seeders_leechers =
            $(element).find("td").eq(5).find("div").attr("title") ||
            "0|0".trim().split("|");
        const seeders = seeders_leechers[0].replace("Seeders:", "").trim();
        const leechers = seeders_leechers[1].replace("Leechers:", "").trim();

        const torrent: Torrent = {
            name: $(element).find("td").eq(1).find("a").text().trim(),
            size: $(element).find("td").eq(3).find("div div").text().trim(),
            dateUploaded: $(element).find("td").eq(4).text().trim(),
            seeders: Number(seeders),
            leechers: Number(leechers),
            url:
                "https://zooqle.com" +
                $(element).find("td").eq(1).find("a").attr("href"),
            magnet: $(element)
                .find("td")
                .eq(2)
                .find("ul")
                .find("li")
                .eq(1)
                .find("a")
                .attr("href"),
        };
        torrents.push(torrent);
    });
    return torrents;
};
