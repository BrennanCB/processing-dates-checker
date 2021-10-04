const express = require("express");
const https = require("https");

const app = express();
const port = 3000;

const findFunction = (data1, searchString, endString) => {
  const startIndex =
    data1.search(new RegExp(searchString, "g")) + searchString.length;

  let newString = data1.slice(startIndex);

  return newString.substring(0, newString.indexOf(endString)).trim();
};

app.get("/current-date", (req, res) => {
  https
    .get(
      "https://enterprise.gov.ie/en/What-We-Do/Workplace-and-Skills/Employment-Permits/Current-Application-Processing-Dates/",
      (resp) => {
        let data = "";

        // A chunk of data has been received.
        resp.on("data", (chunk) => {
          console.log("chunk");
          data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on("end", () => {
          console.log(data.length);

          const searchString = '<tr><td>Trusted Partner</td><td class="left">';

          const lastupdatedDate = findFunction(data, "As of ", ",");
          const processingDate = findFunction(data, searchString, "<");
          console.log(data.length);
          console.log("test", lastupdatedDate, processingDate);

          res.send({
            lastUpdated: lastupdatedDate,
            processingDate,
          });
        });
      }
    )
    .on("error", (err) => {
      console.log("Error: " + err.message);
      res.status(500).send("Error: " + err.message);
    });
});

app.listen(port, () => {
  console.log("stuff");
});
