const Koa = require("koa");
const serve = require("koa-static");
const Router = require("koa-router");
const BodyParser = require("koa-bodyparser");
const logger = require("koa-logger");
const mount = require("koa-mount");
const send = require("koa-send");
const app = new Koa();
const router = new Router();

require("./mongo")(app);
app.use(BodyParser());
app.use(logger());
app.use(router.routes()).use(router.allowedMethods());

app.use(serve("./dist"));

router.post("/api/song/", async ctx => {
  const { id } = ctx.request.body;
  ctx.body = id;
  ctx.app.songs.insert({ id });
});

router.get("/api/songs", async ctx => {
  const songs = await ctx.app.songs.find({}).toArray();
  ctx.body = songs;
});

app.listen(5000);
