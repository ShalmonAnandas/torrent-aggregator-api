import axios from "axios";
import { load } from "cheerio";
import Torrent from "../types";
import { USER_AGENT } from "../config/constants";

export const torrentFunk = async (query: string, page = "1"): Promise<Torrent[]> => {
    const torrents: Torrent[] = [];
    const allUrls: string[] = [];
    let url = "";
    if (page === "" || page === "1") {
        url = "https://www.torrentfunk.com/all/torrents/" + query + ".html";
    } else {
        url =
            "https://www.torrentfunk.com/all/torrents/" +
            query +
            "/" +
            page +
            ".html";
    }

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

    $(".tmain tbody tr").each((i, element) => {
        if (i > 4) {
            const url =
                "https://www.torrentfunk.com" +
                $(element).find("td").eq(0).find("a").attr("href");
            allUrls.push(url);
            const torrent: Torrent = {
                name: $(element).find("td").eq(0).find("a").text().trim(),
                size: $(element).find("td").eq(2).text(),
                dateUploaded: $(element).find("td").eq(1).text(),
                author: $(element).find("td").eq(5).text(),
                seeders: Number($(element).find("td").eq(3).text()),
                leechers: Number($(element).find("td").eq(4).text()),
                url,
            };
            if (torrent.name !== "") {
                torrents.push(torrent);
            }
        }
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
                    torrents[i].torrentLink = $(
                        "#right > main > div.content > table:nth-child(3) > tbody > tr > td:nth-child(2) > a"
                    ).attr("href");
                }
            }
        })
    );

    return torrents;
};
