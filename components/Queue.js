import m from "mithril";
import SongList from "./SongList";
import { playerState } from "../app";

const Queue = initialVnode => {
  return {
    view: () => [
      m("div", [
        m("h3", "queue"),
        m(SongList, {
          songItems: playerState().queue,
          currentSong: playerState().currentSong
        })
      ])
    ]
  };
};

export default Queue;
