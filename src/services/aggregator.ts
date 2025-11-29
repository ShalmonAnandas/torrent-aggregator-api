import { providersMap, getProvider } from "../providers";
import Torrent from "../types";
import { TIMEOUT } from "../config/constants";

const executeProviders = async (
    providerFunctions: ((query: string, page?: string) => Promise<Torrent[]>)[],
    query: string,
    page: string
) => {
    const promises = providerFunctions.map((provider) => {
        return Promise.race([
            new Promise<Torrent[]>((_, reject) =>
                setTimeout(() => {
                    reject({ code: 408, message: "Timeout exceeded" });
                }, TIMEOUT)
            ),
            provider(query, page),
        ]);
    });

    const results = await Promise.allSettled(promises);

    return results
        .filter(
            (result): result is PromiseFulfilledResult<Torrent[]> =>
                result.status === "fulfilled"
        )
        .map((result) => result.value)
        .flat();
};

export const combineAllTorrents = async (query: string, page: string = "1") => {
    const providerFunctions = Object.values(providersMap);
    return executeProviders(providerFunctions, query, page);
};

export const searchSelectedProviders = async (
    providersList: string[],
    query: string,
    page: string = "1"
) => {
    const selectedFunctions = providersList
        .map((name) => getProvider(name))
        .filter((fn): fn is (query: string, page?: string) => Promise<Torrent[]> =>
            Boolean(fn)
        );

    if (selectedFunctions.length === 0) {
        return [];
    }

    return executeProviders(selectedFunctions, query, page);
};

export const checkProvidersHealth = async () => {
    const results = await Promise.allSettled(
        Object.entries(providersMap).map(async ([name, provider]) => {
            try {
                const start = Date.now();
                const result = await Promise.race([
                    provider("ubuntu", "1"),
                    new Promise<Torrent[]>((_, reject) =>
                        setTimeout(() => reject(new Error("Timeout")), TIMEOUT)
                    ),
                ]);
                const duration = Date.now() - start;
                return {
                    name,
                    status: result.length > 0 ? "working" : "zero_results",
                    results: result.length,
                    latency: duration,
                };
            } catch (error) {
                return {
                    name,
                    status: "failed",
                    error: error instanceof Error ? error.message : "Unknown error",
                };
            }
        })
    );

    return results.map((result, index) => {
        if (result.status === "fulfilled") {
            return result.value;
        }
        const providerName = Object.keys(providersMap)[index];
        return {
            name: providerName,
            status: "failed",
            error: result.reason,
        };
    });
};
