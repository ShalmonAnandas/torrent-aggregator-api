export interface Torrent {
    name?: string;
    magnet?: string;
    poster?: string;
    category?: string;
    type?: string;
    language?: string;
    size?: string;
    uploadedBy?: string;
    downloads?: string;
    lastChecked?: string;
    dateUploaded?: string;
    seeders?: number;
    leechers?: number;
    url?: string;
    torrentLink?: string;
    author?: string;
    age?: number | string;
    [key: string]: string | number | undefined;
}

export default Torrent;
