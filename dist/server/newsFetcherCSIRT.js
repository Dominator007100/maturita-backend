"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchCsirtNews = fetchCsirtNews;
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
const storage_1 = require("./storage");
function parseCzechDate(text) {
    const match = text.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
    if (!match)
        return null;
    const [_, day, month, year] = match;
    return new Date(Number(year), Number(month) - 1, Number(day));
}
async function fetchCsirtNews() {
    console.log("Fetching CSIRT news...");
    const url = "https://csirt.cz/";
    const html = (await axios_1.default.get(url, {
        headers: { "User-Agent": "Mozilla/5.0" }
    })).data;
    const $ = cheerio.load(html);
    const articles = [];
    $(".news-item, article, .views-row, .node").each((_, el) => {
        const title = $(el).find("h2, h3").text().trim();
        const summary = $(el).find("p").first().text().trim();
        let sourceUrl = $(el).find("a").attr("href");
        if (sourceUrl && !sourceUrl.startsWith("http")) {
            sourceUrl = "https://csirt.cz" + sourceUrl;
        }
        const dateText = $(el).find(".date, .field--name-field-date, time").text().trim() ||
            $(el).find("span").first().text().trim();
        const publishedAt = parseCzechDate(dateText) ?? new Date();
        if (!title || !sourceUrl || !summary)
            return;
        articles.push({
            title,
            summary,
            sourceUrl,
            category: "CSIRT.CZ",
            publishedAt
        });
    });
    console.log("Found CSIRT articles:", articles.length);
    for (const a of articles) {
        const exists = await storage_1.storage.getNewsArticleByUrl(a.sourceUrl);
        if (exists)
            continue;
        await storage_1.storage.createNewsArticle({
            title: a.title,
            summary: a.summary,
            content: a.summary,
            category: a.category,
            source: "CSIRT.CZ",
            sourceUrl: a.sourceUrl,
            imageUrl: null,
            featured: false,
            publishedAt: a.publishedAt
        });
    }
    console.log("CSIRT fetch done.");
}
