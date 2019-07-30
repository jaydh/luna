const Koa = require("koa");
const serve = require("koa-static");
const Router = require("koa-router");
const BodyParser = require("koa-bodyparser");
const logger = require("koa-logger");
const mount = require("koa-mount");
const app = new Koa();
const router = new Router();

require("./mongo")(app);
app.use(BodyParser());
app.use(logger());
app.use(router.routes()).use(router.allowedMethods());

const frontEnd = new Koa();
frontEnd.use(serve("../dist/."));

app.use(mount("/", frontEnd));

router.get("/users", async ctx => {
  ctx.body = await ctx.app.users.find().toArray();
});

router.get("/songs", async ctx => {
  ctx.body = await ctx.app.songs.find().toArray();
});

router.get("/song/:id", async ctx => {
  const { id } = ctx.params;
  ctx.body = id;
});

router.post("/song/", async ctx => {
  const { id } = ctx.request.body;
  console.log(id);
  ctx.body = id;
  ctx.app.songs.insert({ id });
});

app.listen(5000);
