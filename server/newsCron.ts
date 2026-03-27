import cron from "node-cron";
import { fetchNukibNews } from "./newsFetcher";
import { fetchCsirtNews } from "./newsFetcherCSIRT";
import { fetchEnisaNews } from "./newsFetcherENISA";


export function startNewsCron() {
  cron.schedule("0 6 * * *", async () => {
    console.log("Fetching cyber news...");

    await fetchNukibNews();
    await fetchCsirtNews();
    await fetchEnisaNews();

    console.log("Cyber news updated.");
  });
}
