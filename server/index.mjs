// Load environment variables
import "./loadEnvironment.mjs";

import express from "express"; // npm install express
import path from "path";
import favicon from "serve-favicon"; // npm install serve-favicon
import { fileURLToPath } from "url";
import { dirname } from "path";

let events_db = [
  {
    date: "02/11/2023",
    title: "Class",
  },
];

function showEvents() {
  return events_db;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const port = process.env.PORT || 8080;

app.use(favicon(__dirname + "/public/images/favicon.ico"));

// Static Files
app.use(express.static("public"));
app.use("/css", express.static(__dirname + "public/css"));
app.use("/js", express.static(__dirname + "public/js"));

app.get("/", function (req, res) {
  res.sendFile(
    path.join(__dirname, "public", req.url === "/" ? "index.html" : req.url)
  );
});

app.get("/connected", function (req, res) {
  res.send("Connected to Back-End. ");
});

app.listen(port, () => console.info(`Listening on port ${port}`));

// npm install dot-env
// npm install i -g nodemon

// const app = express();

// function showEvents() {
//   return dates_db;
// }

// function addEvent(date, title) {
//   dates_db.push({ date: date, title: title });
//   return;
// }

// app.get("/events", function (req, res) {
//   res.send(showEvents());
// });

// let port = process.env.PORT;
// if (port == null || port == "") {
//   port = 5000;
// }

// app.listen(port, function () {
//   console.log("Server started successfully");
// });
