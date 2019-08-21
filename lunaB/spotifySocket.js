const { spotifyClientSecret } = require("../secrets");

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
  console.log(cacheLibrary);
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

module.exports = (server, ctx) => {
  console.log("dafsdasdf", ctx);
  const io = require("socket.io")(server);
  const SS = io.of("/spotify");

  SS.on("connection", (socket, ctx) => {
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
        console.log(2, ctx);

        const token = await getSpotifyToken(ctx);
        const library = await getUserLibrary(token, ctx);
        ack(library);
      } catch (err) {
        console.log(err);
      }
    });
    socket.on("token", async (args, ack) => {
      try {
        const token = (await ctx.app.users.findOne({ name: "jay" }))
          .spotifyCreds.access_token;
        ack(token);
      } catch (err) {
        console.log(err);
      }
    });
  });
};
