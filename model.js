import { values, prop, groupBy, compose, filter, map } from "ramda";
const groupedBy = (pr) => (xs) => values(groupBy(prop(pr), xs));
const toViewModel = ({ results }) =>
  compose(
    map(groupedBy("collectionName")),
    groupedBy("collectionCensoredName"),
    filter((x) => x.trackExplicitness == "notExplicit"),
  )(results);

export const getCollections = (query) =>
  fetch("https://itunes.apple.com/search?term=" + query)
    .then((x) => x.json())
    .then(toViewModel);
