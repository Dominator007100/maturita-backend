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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchEnisaNews = fetchEnisaNews;
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
const storage_1 = require("./storage");
function parseEnisaDate(dateText) {
    const parts = dateText.trim().split(" ");
    if (parts.length < 3)
        return new Date();
    const day = parseInt(parts[0], 10);
    const monthName = parts[1];
    const year = parseInt(parts[2], 10);
    const month = new Date(Date.parse(monthName + " 1, 2000")).getMonth();
    return new Date(year, month, day);
}
async function fetchEnisaNews() {
    console.log("Fetching ENISA news...");
    const url = "https://www.enisa.europa.eu/news#contentList";
    const html = (await axios_1.default.get(url, {
        headers: { "User-Agent": "Mozilla/5.0" }
    })).data;
    const $ = cheerio.load(html);
    const articles = [];
    $(".listing-item").each((_, el) => {
        const title = $(el).find("h2, h3").text().trim();
        const summary = $(el).find("p").first().text().trim();
        let sourceUrl = $(el).find("a").attr("href");
        if (sourceUrl && !sourceUrl.startsWith("http")) {
            sourceUrl = "https://www.enisa.europa.eu" + sourceUrl;
        }
        const dateText = $(el).find(".listing-date").text().trim();
        const publishedAt = dateText ? parseEnisaDate(dateText) : new Date();
        if (!title || !sourceUrl || !summary)
            return;
        articles.push({
            title,
            summary,
            sourceUrl,
            category: "ENISA",
            publishedAt
        });
    });
    console.log("Found ENISA articles:", articles.length);
    for (const a of articles) {
        const exists = await storage_1.storage.getNewsArticleByUrl(a.sourceUrl);
        if (exists)
            continue;
        await storage_1.storage.createNewsArticle({
            title: a.title,
            summary: a.summary,
            content: a.summary,
            category: a.category,
            source: "ENISA",
            sourceUrl: a.sourceUrl,
            imageUrl: null,
            featured: false,
            publishedAt: a.publishedAt
        });
    }
    console.log("ENISA fetch done.");
}
