import m from "mithril";

const Data = {
  onclick: {
    fetch: function(e) {
      m.request({
        method: "POST",
        url: "/song/",
        body: { id: e.target.value }
      });
    }
  }
};

const Todos = {
  view: function(vnode) {
    return m("form", [
      m("label.label", "Song Id"),
      m("input.input[type=text][placeholder=Song Id]"),
      m("button.button[type=button]", { onclick: Data.onclick.fetch }, "Save")
    ]);
  }
};

m.route(document.body, "/", {
  "/": Todos
});
