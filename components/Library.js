import m from "mithril";
import { playerState } from "../app";
import { SS } from "../app";

const Library = initialVnode => {
  let songList = [];

  const onSongClick = position => {
    playerState({
      queue: songList,
      position,
      currentSong: songList[position]
    });
  };
  const onRemoveClick = songItem => {
    m.request({
      method: "PATCH",
      url: "/api/user/youtubeLibrary",
      body: { id: songItem.id }
    });
  };

  const oninit = () => {
    m.request({
      method: "GET",
      url: "/api/user/youtubeLibrary"
    }).then(res => {
      songList = res;
      SS.emit("library", null, data => {
        songList = [...songList, ...data];
        m.redraw();
      });
    });
  };

  return {
    oninit,
    view: vnode => {
      const currentSong = playerState().currentSong;
      return [
        m("div", [
          m("h3", "library"),
          m(
            "div",
            { className: "library" },
            songList.map((item, index) =>
              m("div", { className: "song-item" }, [
                m(
                  "div",
                  {
                    className: currentSong.id === item.id && "current-song",
                    onclick: () => onSongClick(index)
                  },
                  (item.track && item.track.name) || item.snippet.title
                ),
                m(
                  "button",
                  {
                    className: "button-remove",
                    onclick: () => onRemoveClick(item)
                  },
                  "❌"
                )
              ])
            )
          )
        ])
      ];
    }
  };
};

export default Library;
