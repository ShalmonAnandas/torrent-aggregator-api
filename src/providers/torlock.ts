import axios from "axios";
import { load } from "cheerio";
import Torrent from "../types";
import { USER_AGENT } from "../config/constants";

export const torLock = async (query = "", page = "1"): Promise<Torrent[]> => {
    const torrents: Torrent[] = [];
    const allUrls: string[] = [];
    const url = encodeURI(
        "https://www.torlock.com/all/torrents/" + query + "/" + page + ".html"
    );
    let html;
    try {
        html = await axios.get(url, {
            headers: {
                "User-Agent": USER_AGENT,
            },
            // @ts-ignore
            family: 4 as 4,
        });
    } catch (error) {
        return [];
    }

    const $ = load(html.data);

    $(".table tbody tr").each((i, element) => {
        if (i > 3) {
            const url =
                "https://www.torlock.com" +
                $(element).find("td").eq(0).find("div a").attr("href");
            allUrls.push(url);
            const torrent: Torrent = {
                name: $(element).find("td").eq(0).find("div a b").text().trim(),
                size: $(element).find("td").eq(2).text().trim(),
                dateUploaded: $(element).find("td").eq(1).text().trim(),
                seeders: Number($(element).find("td").eq(3).text().trim()),
                leechers: Number($(element).find("td").eq(4).text().trim()),
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
                    torrents[i].torrentLink =
                        $(
                            "body > article > div:nth-child(6) > div > div:nth-child(2) > a"
                        ).attr("href") || "";
                    torrents[i].magnet = $(
                        "body > article > table:nth-child(5) > thead > tr > th > div:nth-child(2) > h4 > a:nth-child(1)"
                    ).attr("href");
                }
            }
        })
    );

    return torrents;
};
