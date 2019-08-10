import m from "mithril";
import Player from "./Player";
import Library from "./Library";
import Queue from "./Queue";
import Progress from "./Progress";

const MainView = initialVnode => {
  const goToSearch = () => m.route.set("/search");

  return {
    view: vnode =>
      m(
        "div",
        { style: { display: "grid", gridTemplateColumns: "auto auto" } },
        [
          m(Library),
          m(Queue),
          m(Progress),
          m(Player),
          m("button", { onclick: goToSearch }, "Search")
        ]
      )
  };
};

export default MainView;
