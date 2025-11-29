import axios from "axios";
import { load } from "cheerio";
import Torrent from "../types";
import { USER_AGENT } from "../config/constants";

export const kickassTorrents = async (query: string, page: string = "1"): Promise<Torrent[]> => {
    const torrents: Torrent[] = [];
    const allUrls: string[] = [];
    const url = `https://kickasstorrents.to/usearch/${query}/${page}/`;

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

    $("tbody tr").each((i, element) => {
        if (i > 2) {
            const url = `https://kickasstorrents.to${$(element)
                .find("a.cellMainLink")
                .attr("href")}`;
            if (!url.endsWith("undefined")) {
                allUrls.push(url);
                const torrent: Torrent = {
                    name: $(element).find("a.cellMainLink").text().trim(),
                    size: $(element).find("td").eq(1).text().trim(),
                    uploadedBy: $(element).find("td").eq(2).text().trim(),
                    age: Number($(element).find("td").eq(3).text().trim()),
                    seeders: Number($(element).find("td").eq(4).text().trim()),
                    leechers: Number($(element).find("td").eq(5).text().trim()),
                    url,
                };
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
                    torrents[i].magnet = $("a.kaGiantButton").attr("href");
                }
            }
        })
    );
    return torrents;
};
