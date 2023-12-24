'use strict';

const { Client, Intents } = require("discord.js");
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const express = require("express");
const app = express();
const fs = require('fs');

const data = fs.readFileSync("config.json");
const obj = JSON.parse(data);

const channelId = "CHANNEL_ID"; // Change CHANNEL_ID with ID Channel you want
 
client.login(obj["bot-settings"]["token"]);
 
app.get("/", (req, res) => {
 res.sendFile(__dirname+"/index.html")
});

app.post("/", async (req, res) => {
 if (req.headers["get-link"] == "true") {
  client.guilds.cache.map(async guild => {
   client.user.setActivity("Generate A Link", { type: "PLAYING" });
 
   const channel = guild.channels.cache.get(channelId);
 
   if (channel) {
    await channel.createInvite({
     maxAge: obj["bot-settings"]["max-age"],
     maxUses: obj["bot-settings"]["max-uses"]
    }).then(async (invite) => {
     client.user.setActivity();
     res.send(`${invite.url}`);
    });
   }
  });
 }
 else {
  res.send("Header Argument Not Found!");
 }

});

app.listen(obj["site-settings"]["port"], () => {
 console.log("Server running in http://0.0.0.0:"+obj["site-settings"]["port"]);
});