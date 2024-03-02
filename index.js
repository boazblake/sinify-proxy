import { createServer } from "http";
import url from "url";
import { getCollections } from "./model.js";
// it is a good practice to always allow to
// run on a different port

createServer(async (req, res) => {
  const {
    query: { term },
  } = url.parse(req.url, true);
  const results = await getCollections(term.split(" ").join("+"));
  return res.end(JSON.stringify(results));
}).listen(30);

// export default async function (app) {
//   app.get("/music", async (r) => {
//     const results = await getCollections(r.query);
//     r.json(results);
//   });
// }
