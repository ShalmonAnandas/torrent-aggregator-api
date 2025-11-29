import { Request, Response } from "express";
import {
    combineAllTorrents,
    searchSelectedProviders,
    checkProvidersHealth,
} from "../services/aggregator";
import { getProvidersList, getProvider } from "../providers";
import Torrent from "../types";

const sortResults = (results: Torrent[]) => {
    results.sort((a, b) => (b.seeders || 0) - (a.seeders || 0));
    return results.filter((res) => res !== null);
};

export const searchTorrents = async (req: Request, res: Response) => {
    const query: string = req.query.query as string;
    const page: string = (req.query.page as string) || "1";

    if (!query) {
        res.status(400).send({ error: "Query parameter is required" });
        return;
    }

    try {
        const results = await combineAllTorrents(query, page);
        res.send({ data: sortResults(results) });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Internal server error" });
    }
};

export const searchProvider = async (req: Request, res: Response) => {
    const { provider } = req.params;
    const query: string = req.query.query as string;
    const page: string = (req.query.page as string) || "1";

    if (!query) {
        res.status(400).send({ error: "Query parameter is required" });
        return;
    }

    const providerFn = getProvider(provider);
    if (!providerFn) {
        res.status(404).send({ error: `Provider '${provider}' not found` });
        return;
    }

    try {
        const results = await providerFn(query, page);
        res.send({ data: sortResults(results) });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Internal server error" });
    }
};

export const searchCustom = async (req: Request, res: Response) => {
    const { providers, query, page = "1" } = req.body;

    if (!query) {
        res.status(400).send({ error: "Query is required" });
        return;
    }

    if (!providers || !Array.isArray(providers) || providers.length === 0) {
        res
            .status(400)
            .send({ error: "Providers list is required and must be an array" });
        return;
    }

    try {
        const results = await searchSelectedProviders(providers, query, page);
        res.send({ data: sortResults(results) });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Internal server error" });
    }
};

export const listProviders = (req: Request, res: Response) => {
    res.send({ data: getProvidersList() });
};

export const getProviderStatus = async (req: Request, res: Response) => {
    try {
        const health = await checkProvidersHealth();
        res.send({ data: health });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Internal server error" });
    }
};
