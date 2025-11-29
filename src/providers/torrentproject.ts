import axios from "axios";
import { load } from "cheerio";
import Torrent from "../types";
import { USER_AGENT } from "../config/constants";

export const torrentProject = async (query: string, page = "0"): Promise<Torrent[]> => {
    const torrents: Torrent[] = [];
    const allUrls: string[] = [];
    const url = `https://torrentproject2.com/?t=${query}&p=${page}&orderby=seeders`;
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

    $(".tt div").each((i, element) => {
        if (i > 1) {
            const url =
                "https://torrentproject2.com" +
                $(element).find("span").eq(0).find("a").attr("href");
            allUrls.push(url);
            const torrent: Torrent = {
                name: $(element).find("span:nth-child(1)").text().trim(),
                size: $(element).find("span:nth-child(5)").text(),
                dateUploaded: $(element).find("span:nth-child(4)").text().trim(),
                seeders: Number($(element).find("span:nth-child(2)").text().trim()),
                leechers: Number($(element).find("span:nth-child(3)").text().trim()),
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
                    let magnet = $(".usite a").attr("href") || "";
                    const startMagnetIdx = magnet.indexOf("magnet");
                    magnet = magnet.slice(startMagnetIdx);
                    torrents[i].magnet = decodeURIComponent(magnet);
                }
            }
        })
    );

    return torrents;
};
