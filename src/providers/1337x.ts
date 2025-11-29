import axios from "axios";
import { load } from "cheerio";
import Torrent from "../types";

export const torrent1337x = async (query: string, page = "1"): Promise<Torrent[]> => {
    const url = `https://1337x.so/search/${query}/${page}/`;
    let html;
    try {
        html = await axios.get(url);
    } catch {
        return [];
    }

    const $ = load(html.data);
    const torrents: Torrent[] = [];

    $("tbody tr").each((_, element) => {
        const name = $(element).find("td.name a").eq(1).text().trim();
        const url = "https://1337x.so" + $(element).find("td.name a").eq(1).attr("href");
        const seeders = Number($(element).find("td.seeds").text().trim());
        const leechers = Number($(element).find("td.leeches").text().trim());
        const dateUploaded = $(element).find("td.coll-date").text().trim();
        const size = $(element).find("td.size").clone().children().remove().end().text().trim();
        const uploader = $(element).find("td.vip, td.user").text().trim();

        if (name) {
            torrents.push({
                name,
                url,
                seeders,
                leechers,
                dateUploaded,
                size,
                uploadedBy: uploader,
                // Magnet link is not available on the listing page, omitting for performance
                magnet: "",
            });
        }
    });

    return torrents;
};
