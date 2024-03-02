import s from "sin";
import { values, prop, groupBy, compose, filter, map } from "ramda";

const groupedBy = (pr) => (xs) => values(groupBy(prop(pr), xs));
const toViewModel = ({ results }) =>
  compose(
    map(groupedBy("collectionName")),
    groupedBy("collectionCensoredName"),
    filter((x) => x.trackExplicitness == "notExplicit"),
  )(results);

const getCollections = (query) =>
  s.http("https://itunes.apple.com/search?" + query).then(toViewModel);

export default async function (app) {
  app.get("/music", async (r) => {
    const results = await getCollections(r.query);
    r.end(JSON.stringify(results));
  });
}
