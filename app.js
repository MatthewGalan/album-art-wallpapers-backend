const { response } = require("express");
const express = require("express");
const request = require("request");

const unencodedCredentials = `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`;
const encodedCredentials = Buffer.from(unencodedCredentials).toString("base64");

var authOptions = {
  url: "https://accounts.spotify.com/api/token",
  headers: {
    Authorization: `Basic ${encodedCredentials}`,
  },
  form: {
    grant_type: "client_credentials",
  },
  json: true,
};

request.post(authOptions, function (error, response, body) {
  if (error) {
    console.error(error);
    return;
  }

  if (!error && response.statusCode === 200) {
    var token = body.access_token;
    var options = {
      url: "https://api.spotify.com/v1/search?q=fetch&type=track%2Calbum",
      headers: {
        Authorization: "Bearer " + token,
      },
      json: true,
    };
    request.get(options, function (error, response, body) {
      console.log(body.tracks.items[0]);
    });
  }
});

const app = express();

app.get("/", function (req, res) {
  res.send("Hello World");
});

app.listen(process.env.PORT ?? 3000);
