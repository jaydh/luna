import m from "mithril";
import YoutubePlayer from "./YoutubePlayer";
import { playerState } from "../app";

const Player = initialVnode => {
  let playing = false;

  return {
    view: vnode =>
      m("div", [m(YoutubePlayer, { id: playerState().currentSong.id })])
  };
};

export default Player;
