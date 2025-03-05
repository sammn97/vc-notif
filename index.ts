import * as dotenv from "dotenv";
import {
  ChannelType,
  Client,
  GatewayIntentBits,
  TextChannel,
} from "discord.js";
import express from "express";
import fetch from "node-fetch";
import cron from "node-cron";

dotenv.config();
const { DISCORD_TOKEN } = process.env;

const app = express();
const port = 8080;

app.get("/", (req, res) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Ping!`);

  res.send("Hello World!");
});

app.listen(port, () => {
  const timestamp = new Date().toISOString();
  console.log(
    `[${timestamp}] Example app listening at http://localhost:${port}`
  );
});

const bot = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

bot.once("ready", () => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Ready!`);
});

bot.on("voiceStateUpdate", async (oldState, newState) => {
  if (oldState.channelId === null) {
    let notifChannel = oldState.guild.channels.cache.find(
      (channel) => channel.name === "vc-notif"
    );
    if (notifChannel === undefined) {
      let voiceCategory = oldState.guild.channels.cache.find(
        (channel) =>
          channel.type == ChannelType.GuildCategory &&
          channel.name.toUpperCase() == "Voice Channels".toUpperCase()
      );
      notifChannel = await oldState.guild.channels.create({
        name: "vc-notif",
        type: ChannelType.GuildText,
        ...(voiceCategory !== undefined && { parent: voiceCategory.id }),
      });
    }
    let channelId = notifChannel.id;
    (bot.channels.cache.get(channelId) as TextChannel).send(
      `@everyone ${newState.member?.displayName} has joined`
    );

    console.log(`${newState.member?.displayName} has joined`);
  }
});

bot.login(DISCORD_TOKEN);

// Function to ping the URL and log the response time
async function pingURL() {
  const url = "https://massive-nerissa-sammn97.koyeb.app/";
  const start = Date.now();
  try {
    const response = await fetch(url);
    const end = Date.now();
    const responseTime = end - start;
    console.log(
      `[${new Date().toISOString()}] Ping to ${url} - Response time: ${responseTime}ms`
    );
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error pinging ${url}:`, error);
  }
}

// Schedule the ping task to run every 5 minutes
cron.schedule("*/5 * * * *", pingURL);
