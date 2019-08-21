const axios = require("axios");
const { spotifyClientSecret, spotifyClientId } = require("../secrets");

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

module.exports = {
  getSpotifyTokens,
  getUrlParameter
};
