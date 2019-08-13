import m from "mithril";
import SearchYoutube from "./components/SearchYoutube";
import MainView from "./components/MainView";
import stream from "mithril/stream";
import "./cssBaseline.css";
import "./app.css";
import io from "socket.io-client";
export const SS = io("/spotify");
export const playerState = stream({ queue: [], position: 0, currentSong: {} });

m.route(document.body, "/main", {
  "/main": MainView,
  "/search": SearchYoutube
});
