import m from "mithril";
import { playerState } from "../app";

const Library = initialVnode => {
  let songList = [];
  const currentSong = playerState().currentSong;

  const onSongClick = songItem => {
    playerState({
      queue: songList,
      position: 0,
      currentSong: songList[0]
    });
  };
  const onRemoveClick = songItem => {
    m.request({
      method: "PATCH",
      url: "/api/user/youtubeLibrary",
      body: { id: songItem.id }
    });
  };

  return {
    oncreate: vnode => {
      m.request({
        method: "GET",
        url: "/api/user/youtubeLibrary"
      }).then(res => {
        songList = res;
        console.log("new library", songList);
      });
    },
    view: vnode => [
      m("div", [
        m("h3", "library"),
        m(
          "div",
          songList.map(item =>
            m("div", { className: "song-item" }, [
              m(
                currentSong && currentSong.id === item.id ? "h3" : "h6",
                {
                  onclick: () => onSongClick(item)
                },
                item.snippet.title
              ),
              m(
                "button",
                { className: "button-remove", onclick: () => onRemoveClick(item) },
                "❌"
              )
            ])
          )
        )
      ])
    ]
  };
};

export default Library;
