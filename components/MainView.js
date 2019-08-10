import m from "mithril";
import Player from "./Player";
import Library from "./Library";
import Queue from "./Queue";
import Progress from "./Progress";

const MainView = initialVnode => {
  const goToSearch = () => m.route.set("/search");

  const oncreate = vnode => {
    const spotifyCode = m.route.param("code");
    if (spotifyCode) {
      m.request({
        method: "GET",
        url: `/spotify/${spotifyCode}`
      }).then(res => console.log(res));
    }
  };

  return {
    oncreate,
    view: vnode =>
      m("div", { className: "main-view" }, [
        m(Library),
        m(Queue),
        m(Progress),
        m(Player),
        m("button", { onclick: goToSearch }, "Search")
      ])
  };
};

export default MainView;
