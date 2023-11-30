const express = require("express");
const app = express();

const DELAY = 1000;
const LIMIT = 20;

let connections = [];

app.get("/date", (req, res, next) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Transfer-Encoding", "chunked"); // https://en.wikipedia.org/wiki/Chunked_transfer_encoding
  connections.push(res);
});

let tick = 0;
setTimeout(function run() {
  console.log(tick);
  if (++tick > LIMIT) {
    connections.map(res => {
      res.write("END\n");
      res.end();
    });
    connections = [];
    tick = 0;
  }
  connections.map((res, i) => {
    res.write(`Hello ${i}! Tick: ${tick}.\n`);
  });
  setTimeout(run, DELAY);
}, DELAY);

module.exports = app;