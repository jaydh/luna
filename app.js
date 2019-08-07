import m from "mithril";
import { youtubeAPIKey } from "./secrets";
import YoutubePlayer from "./components/YoutubePlayer";

const Data = {
  onSaveSong: e =>
    m.request({
      method: "POST",
      url: "/api/song/",
      body: { id: e.target.value }
    }),
  songs: {
    list: [],
    fetch: () =>
      m
        .request({
          method: "GET",
          url: "/api/songs"
        })
        .then(items => {
          Data.songs.list = items;
        })
  }
};

const SaveSong = {
  view: vnode =>
    m("form", [
      m("label.label", "Song Id"),
      m("input.input[type=text][placeholder=Song Id]"),
      m("button.button[type=button]", { onclick: Data.onSaveSong }, "Save")
    ])
};

const Songs = {
  oninit: Data.songs.fetch,
  view: vnode =>
    m(
      "div",
      Data.songs.error
        ? [m(".error", Data.songs.error)]
        : Data.songs.list
        ? [
            Data.songs.list.map(function(item) {
              return m("div", item._id);
            })
          ]
        : m(".loading-icon")
    )
};

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
        selectedVideoId
          ? m(YoutubePlayer, { selectedVideoId })
          : m(
              "ol",
              searchResults.map(item =>
                m(
                  "li",
                  {
                    onclick: () => {
                      selectedVideoId = item.id.videoId;
                    }
                  },
                  item.snippet.description
                )
              )
            )
      ])
  };
};

m.route(document.body, "/", {
  "/": SaveSong,
  "/songs": Songs,
  "/search": SearchYoutube
});
