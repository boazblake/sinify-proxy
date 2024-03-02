import { createServer } from "http";
import url from "url";
import { values, prop, groupBy, compose, filter, map } from "ramda";

const groupedBy = (pr) => (xs) => values(groupBy(prop(pr), xs));
const toViewModel = ({ results }) =>
  compose(
    map(groupedBy("collectionName")),
    groupedBy("collectionCensoredName"),
    filter((x) => x.trackExplicitness == "notExplicit"),
  )(results);

const getCollections = (query) =>
  fetch("https://itunes.apple.com/search?term=" + query)
    .then((x) => x.json())
    .then(toViewModel);

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
