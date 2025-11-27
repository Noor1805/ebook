const cron = require("node-cron");
const axios = require("axios");

const URL = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;

const job = new cron.schedule("*/14 * * * *", function () {
  axios
    .get(URL)
    .then((response) => {
      console.log(`Keep-alive ping successful: ${response.status}`);
    })
    .catch((error) => {
      console.error("Keep-alive ping failed:", error.message);
    });
});

module.exports = job;
