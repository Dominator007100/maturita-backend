"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startNewsCron = startNewsCron;
const node_cron_1 = __importDefault(require("node-cron"));
const newsFetcher_1 = require("./newsFetcher");
const newsFetcherCSIRT_1 = require("./newsFetcherCSIRT");
const newsFetcherENISA_1 = require("./newsFetcherENISA");
function startNewsCron() {
    node_cron_1.default.schedule("0 6 * * *", async () => {
        console.log("Fetching cyber news...");
        await (0, newsFetcher_1.fetchNukibNews)();
        await (0, newsFetcherCSIRT_1.fetchCsirtNews)();
        await (0, newsFetcherENISA_1.fetchEnisaNews)();
        console.log("Cyber news updated.");
    });
}
