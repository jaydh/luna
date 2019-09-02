import m from "mithril";
import SearchYoutube from "./components/SearchYoutube";
import SearchSpotify from "./components/SearchSpotify";
import MainView from "./components/MainView";
import stream from "mithril/stream";
import "./cssBaseline.css";
import "./app.css";
import io from "socket.io-client";
export const SS = io("https://luna.jaydanhoward.com/spotify");
export const playerState = stream({
  paused: false,
  library: [],
  queue: [],
  position: 0,
  currentSong: {}
});

m.route(document.body, "/main", {
  "/main": MainView,
  "/search/youtube": SearchYoutube,
  "/search/spotify": SearchSpotify
});
