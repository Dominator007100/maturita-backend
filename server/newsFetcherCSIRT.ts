import axios from "axios";
import * as cheerio from "cheerio";
import { storage } from "./storage";

function parseCzechDate(text: string): Date | null {
  const match = text.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
  if (!match) return null;

  const [_, day, month, year] = match;
  return new Date(Number(year), Number(month) - 1, Number(day));
}

export async function fetchCsirtNews() {
  console.log("Fetching CSIRT news...");

  const url = "https://csirt.cz/";
  const html = (await axios.get(url, {
    headers: { "User-Agent": "Mozilla/5.0" }
  })).data;

  const $ = cheerio.load(html);
  const articles: any[] = [];

  $(".news-item, article, .views-row, .node").each((_, el) => {
    const title = $(el).find("h2, h3").text().trim();
    const summary = $(el).find("p").first().text().trim();
    let sourceUrl = $(el).find("a").attr("href");

    if (sourceUrl && !sourceUrl.startsWith("http")) {
      sourceUrl = "https://csirt.cz" + sourceUrl;
    }

    const dateText =
      $(el).find(".date, .field--name-field-date, time").text().trim() ||
      $(el).find("span").first().text().trim();

    const publishedAt = parseCzechDate(dateText) ?? new Date();

    if (!title || !sourceUrl || !summary) return;

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
    const exists = await storage.getNewsArticleByUrl(a.sourceUrl);
    if (exists) continue;

    await storage.createNewsArticle({
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
