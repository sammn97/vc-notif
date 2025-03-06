import * as dotenv from 'dotenv';
import { ChannelType, Client, GatewayIntentBits, TextChannel } from 'discord.js';
import express from 'express';
dotenv.config();
const { DISCORD_TOKEN } = process.env;

const app = express();
const port = 8080;

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));

const bot = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });
bot.once('ready', () => {
    console.log('Ready!');
})

bot.on('voiceStateUpdate', async (oldState, newState) => {
    if (oldState.channelId === null) {
        let notifChannel = oldState.guild.channels.cache.find(channel => channel.name === "vc-notif");
        if (notifChannel === undefined) {
            let voiceCategory = oldState.guild.channels.cache.find(channel => channel.type == ChannelType.GuildCategory && channel.name.toUpperCase() == "Voice Channels".toUpperCase());
            notifChannel = await oldState.guild.channels.create({ name: 'vc-notif', type: ChannelType.GuildText, ...(voiceCategory !== undefined && { parent: voiceCategory.id }) });
        }
        let channelId = notifChannel.id;
        (bot.channels.cache.get(channelId) as TextChannel).send(`@everyone ${newState.member?.displayName} has joined`);
    }
})

bot.login(DISCORD_TOKEN);

