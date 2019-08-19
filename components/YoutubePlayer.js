import m from "mithril";
import { nextSong } from "../actions/playerActions";
import { playerState } from "../app";

const YoutubePlayer = initialVnode => {
  let player;

  const oncreate = vnode => {
    window.onYouTubeIframeAPIReady = () => {
      player = new YT.Player(vnode.attrs.playerId, {
        height: "500",
        width: "400",
        videoId: vnode.attrs.id,
        suggestedQuality: "small",
        playerVars: {
          controls: 0,
          disablekd: 1,
          modestbranding: 1,
          fs: 1
        },
        events: {
          onStateChange: onPlayerStateChange
        }
      });
    };

    setInterval(() => {
      if (player && playerState().currentSong.snippet) {
        playerState({
          ...playerState(),
          currentTime: player.getCurrentTime(),
          duration: player.getDuration()
        });
        m.redraw();
      }
    }, 50);
  };

  const onbeforeupdate = (vnode, old) => {
    const { currentSong } = playerState();
    if (player && vnode.attrs.id !== old.attrs.id && currentSong.snippet) {
      player.loadVideoById(currentSong.id);
    }
    if (player && player.stopVideo && !currentSong.snippet) {
      player.stopVideo();
    }
  };

  const onPlayerStateChange = event => {
    if (event.data == YT.PlayerState.ENDED) {
      nextSong();
      player.loadVideoById(playerState().currentSong.id);
    }
  };

  return {
    oncreate,
    onbeforeupdate,
    view: vnode => [
      m(
        "div",
        { className: "player-container" },
        m("div", { id: vnode.attrs.playerId })
      )
    ]
  };
};

export default YoutubePlayer;
