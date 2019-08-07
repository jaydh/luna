import m from "mithril";

const YoutubePlayer = initialVnode => {
  let player;
  let done = false;

  const oncreate = vnode => {
    window.onYouTubeIframeAPIReady = () => {
      console.log("ytPlayer");
      player = new YT.Player("ytPlayer", {
        height: "500",
        width: "400",
        videoId: vnode.attrs.selectedVideoId,
        suggestedQuality: "small",
        playerVars: {
          controls: 0,
          disablekd: 1,
          modestbranding: 1,
          fs: 1
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange
        }
      });
    };
  };

  const onPlayerReady = event => {
    event.target.playVideo();
  };

  const onPlayerStateChange = event => {
    if (event.data == YT.PlayerState.PLAYING && !done) {
      done = true;
    }
  };
  const stopVideo = () => {
    player.stopVideo();
  };

  const onSaveSongToLibrary = () =>
    m.request({
      method: "POST",
      url: "/api/user/addYT",
      body: { id: initialVnode.attrs.selectedVideoId }
    });

  return {
    oncreate,
    view: vnode => [
      m("div", { id: "ytPlayer" }),
      m("script", { src: `https://www.youtube.com/iframe_api` }),
      m("button", { onclick: onSaveSongToLibrary }, "Add to library")
    ]
  };
};

export default YoutubePlayer;
