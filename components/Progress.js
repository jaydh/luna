import m from "mithril";
import { playerState } from "../app";

const Progress = initialVnode => {
  return {
    view: vnode => {
      const { currentTime, duration } = playerState();
      console.log(currentTime, duration);
      return m("div", {
        className: "test",
        style: {
          backgroundColor: "blue",
          width:
            currentTime && duration
              ? `${(currentTime / duration) * 100}%`
              : "0px",
          height: "20px"
        }
      });
    }
  };
};

export default Progress;
