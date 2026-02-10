import axios from "axios";
import { load } from "cheerio";
import Torrent from "../types";
import { USER_AGENT } from "../config/constants";

const BASE_URL = "https://www.limetorrents.lol";

export const limeTorrents = async (query: string, page: string = "1"): Promise<Torrent[]> => {
    const searchQuery = query.split(" ").join("-");
    const url = `${BASE_URL}/search/all/${searchQuery}/seeds/${page}/`;
    let html;
    try {
        html = await axios.get(url, {
            headers: { "User-Agent": USER_AGENT },
            timeout: 10000,
        });
    } catch (err) {
        return [];
    }

    const $ = load(html.data);
    const torrents: Torrent[] = [];

    $(".table2 tbody tr").each((i, element) => {
        if (i === 0) return; // skip header row

        const nameEl = $(element).find("div.tt-name a").eq(1);
        const name = nameEl.text().trim() || $(element).find("div.tt-name").text().trim();
        if (!name) return;

        const tdNormal = $(element).find("td.tdnormal");
        const category_and_age = tdNormal.eq(0).text().trim();
        const parts = category_and_age.split("-");
        const age = parts[0] ? parts[0].trim() : "";
        const category = parts[1] ? parts[1].replace("in", "").trim() : "";

        const torrent: Torrent = {
            name,
            size: $(element).find("td.tdnormal").eq(1).text().trim() || $(element).find("td").eq(2).text().trim(),
            category,
            age,
            seeders: Number($(element).find("td.tdseed").text().replace(/,/g, "").trim()) || Number($(element).find("td").eq(3).text().trim()) || 0,
            leechers: Number($(element).find("td.tdleech").text().replace(/,/g, "").trim()) || Number($(element).find("td").eq(4).text().trim()) || 0,
            torrentLink: $(element).find("div.tt-name a").eq(0).attr("href"),
            url: `${BASE_URL}${$(element).find("div.tt-name a").eq(1).attr("href") || ""}`,
        };
        torrents.push(torrent);
    });
    return torrents;
};
