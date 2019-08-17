import m from "mithril";
import YoutubePlayer from "./YoutubePlayer";
import SpotifyPlayer from "./SpotifyPlayer";
import { playerState } from "../app";

const Player = initialVnode => {
  let playing = false;

  return {
    view: vnode =>
      m("div", [
        m(SpotifyPlayer, {
          id:
            playerState().currentSong.track &&
            playerState().currentSong.track.id
        }),
        m(YoutubePlayer, { playerId: "main", id: playerState().currentSong.id })
      ])
  };
};

export default Player;
