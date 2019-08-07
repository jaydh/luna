import m from "mithril";
import { youtubeAPIKey } from "./secrets";
import YoutubePlayer from "./components/YoutubePlayer";
import SearchYoutube from "./components/SearchYoutube";

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

const SongList = () => {
  let songList = [];
  const goToSearch = () => m.route.set("/search");
  return {
    oncreate: vnode => {
      m.request({
        method: "GET",
        url: "/api/user/youtubeLibrary"
      }).then(res => (songList = res));
    },
    view: vnode => [
      m("div", songList.map(item => m("div", item.snippet.title))),
      m("button", { onclick: goToSearch }, "Search")
    ]
  };
};

m.route(document.body, "/", {
  "/": SongList,
  "/search": SearchYoutube
});
