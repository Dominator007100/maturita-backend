import cron from "node-cron";
import { fetchNukibNews } from "./newsFetcher.ts";
import { fetchCsirtNews } from "./newsFetcherCSIRT.ts";
import { fetchEnisaNews } from "./newsFetcherENISA.ts";


export function startNewsCron() {
  cron.schedule("0 6 * * *", async () => {
    console.log("Fetching cyber news...");

    await fetchNukibNews();
    await fetchCsirtNews();
    await fetchEnisaNews();

    console.log("Cyber news updated.");
  });
}
