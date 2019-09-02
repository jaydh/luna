import m from "mithril";
import SearchYoutube from "./components/SearchYoutube";
import SearchSpotify from "./components/SearchSpotify";
import MainView from "./components/MainView";
import stream from "mithril/stream";
import "./cssBaseline.css";
import "./app.css";
import io from "socket.io-client";
const isDev = !process.env.NODE_ENV;

export const SS = io(
  isDev
    ? "http://localhost:5000/spotify"
    : "https://luna.jaydanhoward.com/spotify"
);
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
