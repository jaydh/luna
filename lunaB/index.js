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
      "content-type": "application/x-www-form-urlencoded"
    },
    params: {
      client_id: spotifyClientId,
      client_secret: spotifyClientSecret,
      grant_type: "authorization_code",
      code,
      redirect_uri: "http://localhost:5000/spotifyAuth"
    }
  }).then(res => res.data);

const getRefreshedSpotifyTokens = refresh_token =>
  axios({
    url: "https://accounts.spotify.com/api/token",
    method: "post",
    headers: {
      "content-type": "application/x-www-form-urlencoded"
    },
    params: {
      client_id: spotifyClientId,
      client_secret: spotifyClientSecret,
      grant_type: "refresh_token",
      refresh_token
    }
  }).then(res => res.data);

const getSpotifyToken = async (ctx, uid) =>
  (await ctx.app.users.findOne({ name: "jay" })).spotifyCreds.access_token;

const searchSpotify = async (token, query) =>
  await axios({
    url: `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      query
    )}&type=track&limit=25`,
    method: "get",
    headers: {
      Authorization: `Bearer ${token}`
    },
    params: { q: query }
  })
    .then(res => res.data)
    .then(data =>
      data.tracks.items.map(item => ({
        album: item.album,
        artists: item.artists,
        duration_ms: item.duration_ms,
        id: item.id,
        name: item.name
      }))
    );

const getUserLibrary = async (token, ctx) => {
  // should compare library to local copy by total copy before refteching all
  // of it

  let offset = 0;
  const data = (await axios({
    url: `https://api.spotify.com/v1/me/tracks?limit=50&offset=${offset}`,
    method: "get",
    headers: {
      Authorization: `Bearer ${token}`
    }
  })).data;
  const total = data.total;
  const cacheLibrary = (await ctx.app.users.findOne({ name: "jay" }))
    .spotifyLibrary;

  if (!cacheLibrary || total > cacheLibrary.length) {
    let library = data.items;

    while (library.length < total) {
      offset++;
      const data = (await axios({
        url: `https://api.spotify.com/v1/me/tracks?limit=50&offset=${offset}`,
        method: "get",
        headers: {
          Authorization: `Bearer ${token}`
        }
      })).data;
      if (library.length + 50 > total) {
        library = [
          ...library,
          ...data.items.slice(50 - (library.length + 50 - total))
        ];
      } else {
        library = [...library, ...data.items];
      }
    }
    await ctx.app.users.updateOne(
      { name: "jay" },
      { $set: { spotifyLibrary: library } }
    );
    return library;
  }
  return cacheLibrary;
};

require("./mongo")(app);

router.get("/api/user/youtubeLibrary", async ctx => {
  const items = (await ctx.app.users.findOne({ name: "jay" })).youtubeLibrary;
  const videos = await (await ctx.app.youtubeSongs.find({
    id: { $in: items.map(item => item.id) }
  })).toArray();
  const res = items.map(item => ({
    ...item,
    ...videos.find(vid => vid.id === item.id)
  }));
  ctx.body = res;
});

router.post("/api/user/addYT", async ctx => {
  const { id } = ctx.request.body;
  const doc = await ctx.app.users.findOne({ name: "jay" });
  if (!doc.youtubeLibrary.includes(id)) {
    ctx.app.users.updateOne(
      { name: "jay" },
      { $push: { youtubeLibrary: { id, added_at: Date.now() } } }
    );
    if (!(await ctx.app.youtubeSongs.findOne({ id }))) {
      const res = await axios(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${id}&key=${youtubeAPIKey}`
      );
      const video = res.data.items[0];
      ctx.app.youtubeSongs.insert(video);
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
      { $pull: { youtubeLibrary: { id } } }
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
      const spotifyCreds = await getSpotifyTokens(code);
      spotifyCreds.expires_at = Date.now() + spotifyCreds.expires_in * 1000;
      await ctx.app.users.updateOne(
        { name: "jay" },
        { $set: { authCode: code } }
      );
      await ctx.app.users.updateOne(
        { name: "jay" },
        { $set: { spotifyCreds } }
      );

      await ctx.redirect("/");
    } catch (err) {
      console.log(err);
    }
  }
});

router.get("/spotify", async ctx => {
  const scopes =
    "user-read-private user-read-email user-library-read streaming";
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

app.use(BodyParser());
app.use(logger());
app.use(router.routes()).use(router.allowedMethods());

app.use(async (ctx, next) => {
  const io = require("socket.io")(server);
  const SS = io.of("/spotify");

  SS.on("connection", socket => {
    const emitNewToken = async () => {
      try {
        const spotifyCreds = (await ctx.app.users.findOne({ name: "jay" }))
          .spotifyCreds;
        const res = await getRefreshedSpotifyTokens(spotifyCreds.refresh_token);
        res.expires_at = Date.now() + res.expires_in * 1000;
        await ctx.app.users.updateOne(
          { name: "jay" },
          { $set: { spotifyCreds: { ...spotifyCreds, ...res } } }
        );
        socket.emit("token", res.access_token);
      } catch (err) {
        console.log(err);
      }
    };

    emitNewToken();
    const tokenRefresher = setInterval(emitNewToken, 18000000);

    socket.on("search", async (query, ack) => {
      try {
        const token = await getSpotifyToken(ctx);
        const tracks = await searchSpotify(token, query);
        ack(tracks);
      } catch (err) {
        console.log(err);
      }
    });

    socket.on("library", async (args, ack) => {
      try {
        const token = await getSpotifyToken(ctx);
        const library = await getUserLibrary(token, ctx);
        ack(library);
      } catch (err) {
        console.log(err);
      }
    });

    socket.on("disconnect", async () => {
      clearInterval(tokenRefresher);
    });
  });
  await next();
});

app.use(serve("./dist"));

server.listen(5000);
