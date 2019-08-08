import m from "mithril";

const SongList = () => {
  return {
    view: vnode => {
      const { songItems, onSongClick, currentSong } = vnode.attrs;
      return [
        m(
          "div",
          songItems.map(item =>
            m(
              currentSong && currentSong.id === item.id ? "h3" : "h6",
              {
                onclick: item => onSongClick()
              },
              item.snippet.title
            )
          )
        )
      ];
    }
  };
};

export default SongList;
