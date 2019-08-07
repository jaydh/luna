const MongoClient = require("mongodb").MongoClient;
const MONGO_URL = "mongodb://127.0.0.1";
const assert = require("assert");
const client = new MongoClient(MONGO_URL);

module.exports = app => {
  client.connect(function(err) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    const db = client.db("lunaB");

    app.users = db.collection("users");
    app.youtubeSongs = db.collection("youtubeSongs");
  });
};
