import m from "mithril";
import SearchYoutube from "./components/SearchYoutube";
import MainView from "./components/MainView";
import stream from "mithril/stream";
import "./app.css";

export const playerState = stream({ queue: [], position: 0, currentSong: {} });

m.route(document.body, "/", {
  "/": MainView,
  "/search": SearchYoutube
});
