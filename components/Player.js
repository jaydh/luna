import m from "mithril";
import YoutubePlayer from "./YoutubePlayer";
import SpotifyPlayer from "./SpotifyPlayer";
import { playerState } from "../app";

const Player = initialVnode => {
  return {
    view: vnode => {
      const { currentSong } = playerState();
      return m("div", [
        m(SpotifyPlayer, {
          id: currentSong.track ? currentSong.track.id : currentSong.id
        }),
        m(YoutubePlayer, { playerId: "main", id: currentSong._id })
      ]);
    }
  };
};

export default Player;
