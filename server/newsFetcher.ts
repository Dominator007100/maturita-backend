import axios from "axios";
import * as cheerio from "cheerio";
import { storage } from "./storage";

function parseCzechDate(text: string): Date | null {
  const match = text.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
  if (!match) return null;

  const [_, day, month, year] = match;
  return new Date(Number(year), Number(month) - 1, Number(day));
}

export async function fetchNukibNews() {
  console.log("Fetching NÚKIB news...");

  const url = "https://nukib.gov.cz/cs/infoservis/aktuality/";
  const html = (await axios.get(url, {
    headers: { "User-Agent": "Mozilla/5.0" }
  })).data;

  const $ = cheerio.load(html);
  const articles: { title: string; summary: string; sourceUrl: string }[] = [];

  $(".article-list-item").each((_, el) => {
    const title = $(el).find("h2, h3, a").text().trim();
    const summary = $(el).find("p").first().text().trim();
    let sourceUrl = $(el).find("a").attr("href");

    if (sourceUrl && !sourceUrl.startsWith("http")) {
      sourceUrl = "https://nukib.gov.cz" + sourceUrl;
    }

    if (!title || !sourceUrl) return;

    articles.push({ title, summary, sourceUrl });
  });

  console.log("Found NÚKIB articles:", articles.length);

  for (const a of articles) {
    const exists = await storage.getNewsArticleByUrl(a.sourceUrl);
    if (exists) continue;

    const detailHtml = (await axios.get(a.sourceUrl, {
      headers: { "User-Agent": "Mozilla/5.0" }
    })).data;

    const $$ = cheerio.load(detailHtml);

    const dateText =
      $$(".article-date").text().trim() ||
      $$(".date").text().trim() ||
      $$(".field--name-field-date").text().trim() ||
      $$(".meta").text().trim() ||
      $$(".published").text().trim();

    const publishedAt = parseCzechDate(dateText) ?? new Date();

    await storage.createNewsArticle({
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
