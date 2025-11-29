import { torrent1337x } from "./1337x";
import { bitSearch } from "./bitsearch";
import { eztvTorrent } from "./eztv";
import { magnetDLTorrents } from "./magnetdl";
import { ettvTorrents } from "./ettv";
import { kickassTorrents } from "./kickass";
import { glodLSTorrents } from "./glodls";
import { limeTorrents } from "./limetorrents";
import { nyaaSITorrents } from "./nyaasi";
import { pirateBayTorrents } from "./piratebay";
import { rarbgTorrents } from "./rarbg";
import { torLock } from "./torlock";
import { torrentFunk } from "./torrentfunk";
import { torrentGalaxy } from "./torrentgalaxy";
import { torrentProject } from "./torrentproject";
import { zooqle } from "./zooqle";
import { Provider } from "./base";
import Torrent from "../types";

// Re-export individual functions if needed elsewhere
export * from "./1337x";
export * from "./bitsearch";
export * from "./eztv";
export * from "./magnetdl";
export * from "./ettv";
export * from "./kickass";
export * from "./glodls";
export * from "./limetorrents";
export * from "./nyaasi";
export * from "./piratebay";
export * from "./rarbg";
export * from "./torlock";
export * from "./torrentfunk";
export * from "./torrentgalaxy";
export * from "./torrentproject";
export * from "./zooqle";

// Define the type for the provider function
type ProviderFunction = (query: string, page?: string) => Promise<Torrent[]>;

// Map of provider names to their functions
export const providersMap: Record<string, ProviderFunction> = {
    "1337x": torrent1337x,
    bitsearch: bitSearch,
    eztv: eztvTorrent,
    magnetdl: magnetDLTorrents,
    ettv: ettvTorrents,
    kickass: kickassTorrents,
    glodls: glodLSTorrents,
    limetorrents: limeTorrents,
    nyaasi: nyaaSITorrents,
    piratebay: pirateBayTorrents,
    rarbg: rarbgTorrents,
    torlock: torLock,
    torrentfunk: torrentFunk,
    torrentgalaxy: torrentGalaxy,
    torrentproject: torrentProject,
    zooqle: zooqle,
};

export const getProvider = (name: string): ProviderFunction | undefined => {
    return providersMap[name.toLowerCase()];
};

export const getProvidersList = (): string[] => {
    return Object.keys(providersMap);
};
