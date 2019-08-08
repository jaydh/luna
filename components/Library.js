import m from "mithril";
import SongList from "./SongList";
import { playerState } from "../app";

const Library = initialVnode => {
  let songList = [];

  const onSongClick = songItem => {
    playerState({
      queue: songList,
      position: 0,
      currentSong: songList[0]
    });
  };

  return {
    oncreate: vnode => {
      m.request({
        method: "GET",
        url: "/api/user/youtubeLibrary"
      }).then(res => {
        songList = res;
      });
    },
    view: () => [
      m("div", [
        m("h3", "library"),
        m(SongList, { songItems: songList, onSongClick })
      ])
    ]
  };
};

export default Library;
