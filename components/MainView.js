import m from "mithril";
import Player from "./Player";
import Library from "./Library";
import Queue from "./Queue";
import Progress from "./Progress";

const MainView = initialVnode => {
  const goToYoutubeSearch = () => m.route.set("/search/youtube");
  const goToSpotifySearch = () => m.route.set("/search/spotify");

  return {
    view: vnode =>
      m("div", { className: "main-view" }, [
        m(Library),
        m(Queue),
        m(Progress),
        m(Player),
        m("button", { onclick: goToYoutubeSearch }, "Search Youtube"),
        m("button", { onclick: goToSpotifySearch }, "Search Spotify")
      ])
  };
};

export default MainView;
