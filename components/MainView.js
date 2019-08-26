import m from "mithril";
import Player from "./Player";
import Library from "./Library";
import Queue from "./Queue";
import Progress from "./Progress";
import { playerState } from "../app";

const MainView = initialVnode => {
  const goToYoutubeSearch = () => m.route.set("/search/youtube");
  const goToSpotifySearch = () => m.route.set("/search/spotify");

  return {
    view: vnode => {
      const { currentSong, library } = playerState();
      return m("div", { className: "main-view" }, [
        m(Library, {
          library,
          currentSongId: currentSong.track
            ? currentSong.track.id
            : currentSong.id
        }),
        m(Queue, {
          currentSongId: currentSong.track
            ? currentSong.track.id
            : currentSong.id
        }),
        m(Progress),
        m(Player),
        m("button", { onclick: goToYoutubeSearch }, "Search Youtube"),
        m("button", { onclick: goToSpotifySearch }, "Search Spotify")
      ]);
    }
  };
};

export default MainView;
