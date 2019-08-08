import m from "mithril";
import { nextSong } from "../actions/playerActions";
import { playerState } from "../app";

const YoutubePlayer = initialVnode => {
  let player;

  const oncreate = vnode => {
    window.onYouTubeIframeAPIReady = () => {
      player = new YT.Player("ytPlayer", {
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
  };

  const onbeforeupdate = (vnode, old) => {
    if (player && vnode.attrs.id !== old.attrs.id) {
      console.log("call load", vnode.attrs.id);
      player.loadVideoById(vnode.attrs.id);
    }
  };

  const onPlayerStateChange = event => {
    if (event.data == YT.PlayerState.ENDED) {
      console.log("callNext song");
      nextSong();
      player.loadVideoById(playerState().currentSong.id);
    }
  };

  const playVideo = () => {
    player.playVideo();
  };
  const stopVideo = () => {
    player.stopVideo();
  };

  return {
    oncreate,
    onbeforeupdate,
    view: vnode => [
      m("div", { style: { display: "" }, id: "ytPlayer" }),
      m("script", { src: `https://www.youtube.com/iframe_api` })
    ]
  };
};

export default YoutubePlayer;
