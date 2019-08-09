import m from "mithril";
import { youtubeAPIKey } from "../secrets";

const SearchYoutube = initialVnode => {
  let searchQuery = "";
  let searchResults = [];
  let selectedVideoId;

  const search = e => {
    e.preventDefault();
    m.request({
      method: "GET",
      url: `https://www.googleapis.com/youtube/v3/search?key=${youtubeAPIKey}&q=${encodeURIComponent(
        searchQuery
      )}&part=snippet&maxResults=25&type=video`
    }).then(res => {
      searchResults = res.items;
    });
  };

  const onSaveSongToLibrary = () =>
    m.request({
      method: "POST",
      url: "/api/user/addYT",
      body: { id: selectedVideoId }
    });

  return {
    view: vnode =>
      m("div", [
        m("form", { onsubmit: search }, [
          m("label.label", "Search"),
          m("input[type=text][placeholder=Search Youtube...]", {
            value: searchQuery,
            oninput: e => {
              e.preventDefault();
              searchQuery = e.target.value;
            }
          }),
          m("button.button[type=button]", { onclick: search }, "Search")
        ]),
        selectedVideoId &&
          m(
            "ol",
            searchResults.map(item =>
              m(
                "li",
                {
                  onclick: () => {
                    selectedVideoId = item.id.videoId;
                  }
                },
                item.snippet.title
              )
            )
          ),
        selectedVideoId &&
          m("button", { onclick: onSaveSongToLibrary }, "Add to library"),
        m("button", { onclick: () => m.route.set("/") }, "Home")
      ])
  };
};

export default SearchYoutube;
