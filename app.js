import m from "mithril";

const Data = {
  onSaveSong: e =>
    m.request({
      method: "POST",
      url: "/api/song/",
      body: { id: e.target.value }
    }),
  songs: {
    list: [],
    fetch: function() {
      m.request({
        method: "GET",
        url: "/api/songs"
      }).then(function(items) {
        Data.songs.list = items;
      });
    }
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

m.route(document.body, "/", {
  "/": SaveSong,
  "/songs": Songs
});
