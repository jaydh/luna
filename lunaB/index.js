const Koa = require("koa");
const {
  youtubeAPIKey,
  spotifyClientId,
  spotifyClientSecret
} = require("../secrets");
const serve = require("koa-static");
const Router = require("koa-router");
const BodyParser = require("koa-bodyparser");
const logger = require("koa-logger");
const axios = require("axios");
const app = new Koa();
const router = new Router();

const server = require("http").createServer(app.callback());
const io = require("socket.io")(server);
const SS = io.of("/spotify");

const getUrlParameter = (name, url) => {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
  var results = regex.exec(url);
  return results === null
    ? ""
    : decodeURIComponent(results[1].replace(/\+/g, " "));
};

const getSpotifyTokens = code =>
  axios({
    url: "https://accounts.spotify.com/api/token",
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    params: {
      client_id: spotifyClientId,
      client_secret: spotifyClientSecret,
      grant_type: "authorization_code",
      code,
      redirect_uri: "http://localhost:5000/spotifyAuth"
    }
  }).then(res => res.data);

app.use(async (ctx, next) => {
  SS.on("connection", socket => {
    socket.on("auth", async code => {
      console.log("auth");
    });
  });
  await next();
});

require("./mongo")(app);
app.use(BodyParser());
app.use(logger());
app.use(router.routes()).use(router.allowedMethods());

app.use(serve("./dist"));

router.get("/api/user/youtubeLibrary", async ctx => {
  const ids = (await ctx.app.users.findOne({ name: "jay" })).youtubeLibrary;
  const videos = await ctx.app.youtubeSongs.find({ id: { $in: ids } });
  ctx.body = await videos.toArray();
});

router.post("/api/user/addYT", async ctx => {
  const { id } = ctx.request.body;
  const doc = await ctx.app.users.findOne({ name: "jay" });
  if (!doc.youtubeLibrary.includes(id)) {
    ctx.app.users.updateOne({ name: "jay" }, { $push: { youtubeLibrary: id } });
    if (!(await ctx.app.youtubeSongs.findOne({ id }))) {
      const res = await axios(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${id}&key=${youtubeAPIKey}`
      );
      const videoItem = res.data.items[0];
      ctx.app.youtubeSongs.insert(videoItem);
    }
  }
  ctx.body = id;
});

router.patch("/api/user/youtubeLibrary", async ctx => {
  const { id } = ctx.request.body;
  const doc = await ctx.app.users.findOne({ name: "jay" });
  if (!doc.youtubeLibrary.includes(id)) {
    ctx.body = "Song not in user library";
  } else {
    await ctx.app.users.updateOne(
      { name: "jay" },
      { $pull: { youtubeLibrary: id } }
    );
  }
});

router.get("/api/songs", async ctx => {
  const songs = await ctx.app.youtubeSongs.find({}).toArray();
  ctx.body = songs;
});

router.get("/api/users", async ctx => {
  const songs = await ctx.app.users.find({}).toArray();
  ctx.body = songs;
});

router.get("/spotifyAuth", async ctx => {
  const currentCode = (await ctx.app.users.findOne({ name: "jay" })).authCode;
  const code = getUrlParameter("code", ctx.url);
  if (currentCode !== code) {
    try {
      console.log("try");
      const spotifyCreds = await getSpotifyTokens(code);
      await ctx.app.users.updateOne(
        { name: "jay" },
        { $set: { spotifyCreds }, $set: { authCode: code } }
      );
      await ctx.redirect("/");
    } catch (err) {
      console.log(err);
    }
  }
});

router.get("/spotify", async ctx => {
  const scopes = "user-read-private user-read-email";
  ctx.redirect(
    "https://accounts.spotify.com/authorize" +
      "?response_type=code" +
      "&client_id=" +
      spotifyClientId +
      (scopes ? "&scope=" + encodeURIComponent(scopes) : "") +
      "&redirect_uri=" +
      encodeURIComponent("http://localhost:5000/spotifyAuth")
  );
});

server.listen(5000);
