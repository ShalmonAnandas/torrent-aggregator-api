import axios from "axios";
import { load } from "cheerio";
import Torrent from "../types";
import { USER_AGENT } from "../config/constants";

export const limeTorrents = async (query: string, page: string = "1"): Promise<Torrent[]> => {
    const url = `https://www.limetorrents.lol/search/all/${query}/seeds/${page}/`;
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
        return [];
    }

    const $ = load(html.data);

    const torrents: Torrent[] = [];

    $(".table2 tbody tr").each((i, element) => {
        if (i > 0) {
            const category_and_age = $(element)
                .find("td")
                .eq(1)
                .text()
                .trim()
                .split("-");

            const age = category_and_age[0].trim();
            const category = category_and_age[1].replace("in", "").trim();
            const torrent: Torrent = {
                name: $(element).find("div.tt-name").text().trim(),
                size: $(element).find("td").eq(2).text().trim(),
                category: category,
                age: age,
                seeders: Number($(element).find("td").eq(3).text().trim()),
                leechers: Number($(element).find("td").eq(4).text().trim()),
                torrentLink: $(element).find("div.tt-name a").attr("href"),
                url: `https://www.limetorrents.lol${$(element)
                    .find("div.tt-name a")
                    .next()
                    .attr("href")}`,
            };
            torrents.push(torrent);
        }
    });
    return torrents;
};
