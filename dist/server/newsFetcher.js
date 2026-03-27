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
exports.fetchNukibNews = fetchNukibNews;
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
async function fetchNukibNews() {
    console.log("Fetching NÚKIB news...");
    const url = "https://nukib.gov.cz/cs/infoservis/aktuality/";
    const html = (await axios_1.default.get(url, {
        headers: { "User-Agent": "Mozilla/5.0" }
    })).data;
    const $ = cheerio.load(html);
    const articles = [];
    $(".article-list-item").each((_, el) => {
        const title = $(el).find("h2, h3, a").text().trim();
        const summary = $(el).find("p").first().text().trim();
        let sourceUrl = $(el).find("a").attr("href");
        if (sourceUrl && !sourceUrl.startsWith("http")) {
            sourceUrl = "https://nukib.gov.cz" + sourceUrl;
        }
        if (!title || !sourceUrl)
            return;
        articles.push({ title, summary, sourceUrl });
    });
    console.log("Found NÚKIB articles:", articles.length);
    for (const a of articles) {
        const exists = await storage_1.storage.getNewsArticleByUrl(a.sourceUrl);
        if (exists)
            continue;
        const detailHtml = (await axios_1.default.get(a.sourceUrl, {
            headers: { "User-Agent": "Mozilla/5.0" }
        })).data;
        const $$ = cheerio.load(detailHtml);
        const dateText = $$(".article-date").text().trim() ||
            $$(".date").text().trim() ||
            $$(".field--name-field-date").text().trim() ||
            $$(".meta").text().trim() ||
            $$(".published").text().trim();
        const publishedAt = parseCzechDate(dateText) ?? new Date();
        await storage_1.storage.createNewsArticle({
            title: a.title,
            summary: a.summary || a.title,
            content: a.summary || a.title,
            category: "NÚKIB",
            source: "NUKIB",
            sourceUrl: a.sourceUrl,
            imageUrl: null,
            featured: false,
            publishedAt,
        });
    }
    console.log("NÚKIB fetch done.");
}
