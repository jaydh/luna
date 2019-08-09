import m from "mithril";
import { playerState } from "../app";

const shuffle = array => {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
};

const Queue = initialVnode => {
  const shuffleQueue = () => {
    const state = playerState();
    const nextQueue = shuffle(state.queue.slice(0));
    playerState({ ...state, queue: nextQueue });
  };

  const onSongClick = position => {
    const prevState = playerState();
    playerState({
      queue: prevState.queue,
      position,
      currentSong: prevState.queue[position]
    });
  };

  return {
    view: () => {
      const { queue, currentSong } = playerState();
      return [
        m("div", [
          m("h3", "queue"),
          m(
            "div",
            {
              className: "queue"
            },
            queue.map((item, index) => [
              m(
                "div",
                {
                  className:
                    currentSong && currentSong.id === item.id && "current-song",
                  onclick: () => onSongClick(index)
                },
                item.snippet.title
              )
            ])
          ),
          m("button", { onclick: shuffleQueue }, "shuffle")
        ])
      ];
    }
  };
};

export default Queue;
