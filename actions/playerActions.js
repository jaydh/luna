import { playerState } from "../app";
import m from "mithril";

export const nextSong = () => {
  const { queue, position } = playerState();
  const nextPosition = position + 1 > queue.length ? 0 : position + 1;
  const nextSong = queue[nextPosition];
  playerState({ position: nextPosition, currentSong: nextSong });
};
export const prevSong = player => {
  const { queue, position } = playerState();
  const nextPosition = position - 1 < 0 ? queue.length - 1 : position - 1;
  playerState({ position: nextPosition, currentSong: queue[nextPosition] });
};
