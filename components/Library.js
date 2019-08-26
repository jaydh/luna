import m from "mithril";
import { playerState } from "../app";
import { SS } from "../app";

const Library = initialVnode => {
  const onSongClick = position => {
    const prevState = playerState();
    playerState({
      ...prevState,
      queue: prevState.library,
      position,
      currentSong: prevState.library[position]
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
      playerState({ ...playerState(), library: res });
      SS.emit("library", null, data => {
        const prevState = playerState();
        playerState({ ...prevState, library: [...prevState.library, ...data] });
        m.redraw();
      });
    });
  };

  return {
    oninit,
    view: vnode => {
      const { currentSongId, library } = vnode.attrs;
      return m("div", [
        m("h3", "library"),
        m(
          "div",
          { className: "library" },
          library
            .sort(
              (a, b) =>
                new Date(b.added_at).getTime() - new Date(a.added_at).getTime()
            )
            .map((item, index) =>
              m(
                "div",
                {
                  className: "song-item",
                  key: item.track ? item.track.id : item._id
                },
                [
                  m(
                    "div",
                    {
                      className: (item.track
                      ? currentSongId === item.track.id
                      : currentSongId === item.id)
                        ? "current-song"
                        : "song-item",
                      onclick: () => onSongClick(index)
                    },
                    item.track ? item.track.name : item.snippet.title
                  ),
                  m(
                    "button",
                    {
                      className: "button-remove",
                      onclick: () => onRemoveClick(item)
                    },
                    "❌"
                  )
                ]
              )
            )
        )
      ]);
    }
  };
};

export default Library;
