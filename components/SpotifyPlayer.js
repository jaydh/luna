import m from "mithril";
import { nextSong } from "../actions/playerActions";
import { playerState } from "../app";
import { SS } from "../app";

const SpotifyPlayer = initialVnode => {
  let player;
  let token;
  let deviceId;

  const spotifyPlay = () =>
    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
      method: "PUT",
      body: JSON.stringify({ uris: [playerState().currentSong.track.uri] }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });

  const oninit = vnode => {
    SS.on("token", incomingToken => {
      if (!player) {
        const tag = document.createElement("script");
        tag.src = "https://sdk.scdn.co/spotify-player.js";
        const firstScriptTag = document.getElementsByTagName("script")[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        window.onSpotifyWebPlaybackSDKReady = () => {
          player = new Spotify.Player({
            name: "Luna",
            getOAuthToken: cb => cb(incomingToken)
          });

          player.addListener("player_state_changed", state => {
            if (state.paused && !playerState().paused) {
              // TODO fix multiple calls
              nextSong();
              spotifyPlay();
            }
          });

          player.addListener("ready", ({ device_id }) => {
            deviceId = device_id;
            console.log("Ready with Device ID", device_id);
          });
          player.connect();
        };
      }
      token = incomingToken;
    });

    setInterval(() => {
      const { currentSong } = playerState();
      if (player && currentSong.track) {
        player.getCurrentState().then(state => {
          if (state) {
            playerState({
              ...playerState(),
              currentTime: state.position,
              duration: currentSong.track.duration_ms
            });
          }
          m.redraw();
        });
      }
    }, 50);
  };

  const onbeforeupdate = (vnode, old) => {
    const { currentSong } = playerState();
    if (player && vnode.attrs.id !== old.attrs.id) {
      if (currentSong.track) {
        spotifyPlay();
      } else {
        player.pause();
      }
    }
  };

  return {
    oninit,
    onbeforeupdate,
    view: vnode => [m("div", "dd")]
  };
};

export default SpotifyPlayer;
