const { createServer } = require("http");
const { compose, filter, groupBy, map, prop, values } = require("ramda");
const url = require("url");
const headers = {
  "Access-Control-Allow-Origin": "*" /* @dev First, read about security */,
  "Access-Control-Allow-Methods": "OPTIONS, GET",
  "Access-Control-Max-Age": 2592000, // 30 days
  /** add other headers as per requirement */
};
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
  res.writeHead(200, headers);
  return res.end(JSON.stringify(results));
}).listen(2001);
