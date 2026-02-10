import axios from "axios";
import { load } from "cheerio";
import Torrent from "../types";
import { USER_AGENT } from "../config/constants";

const BASE_URL = "https://1337x.to";

export const torrent1337x = async (query: string, page = "1"): Promise<Torrent[]> => {
    const url = `${BASE_URL}/search/${encodeURIComponent(query)}/${page}/`;
    let html;
    try {
        html = await axios.get(url, {
            headers: { "User-Agent": USER_AGENT },
            timeout: 10000,
        });
    } catch {
        return [];
    }

    const $ = load(html.data);
    const torrents: Torrent[] = [];

    $(".table-list tbody tr").each((_, element) => {
        const nameLink = $(element).find("td.coll-1.name a").eq(1);
        const name = nameLink.text().trim();
        const href = nameLink.attr("href");
        const url = href ? BASE_URL + href : "";
        const seeders = Number($(element).find("td.seeds").text().trim());
        const leechers = Number($(element).find("td.leeches").text().trim());
        const dateUploaded = $(element).find("td.coll-date").text().trim();
        const size = $(element).find("td.coll-4").clone().children().remove().end().text().trim();
        const uploader = $(element).find("td.coll-5").text().trim();

        if (name) {
            torrents.push({
                name,
                url,
                seeders,
                leechers,
                dateUploaded,
                size,
                uploadedBy: uploader,
                magnet: "",
            });
        }
    });

    return torrents;
};
