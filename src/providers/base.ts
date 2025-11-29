import Torrent from "../types";

export interface Provider {
    name: string;
    search(query: string, page?: string): Promise<Torrent[]>;
}
