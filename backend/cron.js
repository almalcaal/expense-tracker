import cron from "cron";
import https from "https";

const URL = "https://expense-tracker-jawr.onrender.com/";

const job = new cron.CronJob("*/14 * * * *", function () {
  https
    .get(URL, (res) => {
      if (res.statusCode === 200) {
        console.log("GET request CRON sent successfully");
      } else {
        console.log("GET request CRON failed", res.statusCode);
      }
    })
    .on("error", (err) => {
      console.error("Error while sending CRON request", err);
    });
});

export default job;
