const Koa = require("koa");
const { youtubeAPIKey } = require("../secrets");
const serve = require("koa-static");
const Router = require("koa-router");
const BodyParser = require("koa-bodyparser");
const logger = require("koa-logger");
const axios = require("axios");
const app = new Koa();
const router = new Router();

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
  const document = await ctx.app.users.findOne({ name: "jay" });
  if (!document.youtubeLibrary.includes(id)) {
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

router.get("/api/songs", async ctx => {
  const songs = await ctx.app.youtubeSongs.find({}).toArray();
  ctx.body = songs;
});

router.get("/api/users", async ctx => {
  const songs = await ctx.app.users.find({}).toArray();
  ctx.body = songs;
});

app.listen(5000);
