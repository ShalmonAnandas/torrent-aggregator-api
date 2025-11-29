import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import apicache from "apicache";
import {
    searchTorrents,
    searchProvider,
    searchCustom,
    listProviders,
    getProviderStatus,
} from "./controllers/searchController";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const cache = apicache.middleware;
const cacheDuration = "30 minutes";

app.get("/", cache(cacheDuration), searchTorrents);
app.get("/providers", listProviders);
app.get("/providers/:provider", cache(cacheDuration), searchProvider);
app.get("/status", getProviderStatus);
app.post("/search", cache(cacheDuration), searchCustom);

if (require.main === module) {
    app.listen(port, () => {
        console.log(`[server]: Server is running at http://localhost:${port}`);
    });
}

export default app;
