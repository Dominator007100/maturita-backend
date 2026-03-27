import axios from "axios";
import * as cheerio from "cheerio";
import { storage } from "./storage";

function parseEnisaDate(dateText: string): Date {
  const parts = dateText.trim().split(" ");
  if (parts.length < 3) return new Date();

  const day = parseInt(parts[0], 10);
  const monthName = parts[1];
  const year = parseInt(parts[2], 10);

  const month = new Date(Date.parse(monthName + " 1, 2000")).getMonth();

  return new Date(year, month, day);
}

export async function fetchEnisaNews() {
  console.log("Fetching ENISA news...");

  const url = "https://www.enisa.europa.eu/news#contentList";
  const html = (await axios.get(url, {
    headers: { "User-Agent": "Mozilla/5.0" }
  })).data;

  const $ = cheerio.load(html);
  const articles: any[] = [];

  $(".listing-item").each((_, el) => {
    const title = $(el).find("h2, h3").text().trim();
    const summary = $(el).find("p").first().text().trim();
    let sourceUrl = $(el).find("a").attr("href");

    if (sourceUrl && !sourceUrl.startsWith("http")) {
      sourceUrl = "https://www.enisa.europa.eu" + sourceUrl;
    }

    const dateText = $(el).find(".listing-date").text().trim();
    const publishedAt = dateText ? parseEnisaDate(dateText) : new Date();

    if (!title || !sourceUrl || !summary) return;

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
    const exists = await storage.getNewsArticleByUrl(a.sourceUrl);
    if (exists) continue;

    await storage.createNewsArticle({
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
