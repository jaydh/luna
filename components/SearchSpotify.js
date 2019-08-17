import m from "mithril";
import { SS } from "../app";

const SearchSpotify = initialVnode => {
  let searchQuery = "";
  let searchResults = [];

  const search = e => {
    e.preventDefault();
    SS.emit("search", searchQuery, data => {
      searchResults = data;
      m.redraw();
    });
  };

  return {
    view: vnode =>
      m("div", [
        m("form", { onsubmit: search }, [
          m("label.label", "Search"),
          m("input[type=text][placeholder=Search Spotify...]", {
            value: searchQuery,
            oninput: e => {
              e.preventDefault();
              searchQuery = e.target.value;
            }
          }),
          m("button.button[type=button]", { onclick: search }, "Search")
        ]),
        m(
          "ol",
          searchResults.map(item =>
            m(
              "li",
              {
                onclick: () => {
                  console.log(item.id);
                }
              },
              item.name
            )
          )
        ),
        m("button", { onclick: () => m.route.set("/") }, "Home")
      ])
  };
};

export default SearchSpotify;
