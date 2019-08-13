import m from "mithril";
import Player from "./Player";
import Library from "./Library";
import Queue from "./Queue";
import Progress from "./Progress";
import { SS } from "../app";

const MainView = initialVnode => {
  const goToSearch = () => m.route.set("/search");

  const oncreate = vnode => {
    const spotifyCode = m.route.param("code");
    console.log("sdfaasdf", spotifyCode);
    if (spotifyCode) {
      SS.emit("auth", spotifyCode).then(() => m.route.set("/"));
    }
  };

  return {
    view: vnode =>
      m("div", { className: "main-view" }, [
        m(Library),
        m(Queue),
        m(Progress),
        m(Player),
        m("button", { onclick: goToSearch }, "Search"),
        m("button", { onclick: oncreate }, "spot")
      ])
  };
};

export default MainView;
