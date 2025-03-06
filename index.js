"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const discord_js_1 = require("discord.js");
const express_1 = __importDefault(require("express"));
const node_cron_1 = __importDefault(require("node-cron"));
dotenv.config();
const { DISCORD_TOKEN } = process.env;
const app = (0, express_1.default)();
const port = 3000;
app.get('/', (req, res) => {
    console.log(`[${new Date().toISOString()}] Ping!`);
    res.send(`[${new Date().toISOString()}] Hello World!`);
});
app.listen(port, () => {
    console.log(`[${new Date().toISOString()}] Example app listening at http://localhost:${port}`);
});
const bot = new discord_js_1.Client({ intents: [discord_js_1.GatewayIntentBits.Guilds, discord_js_1.GatewayIntentBits.GuildVoiceStates] });
bot.once('ready', () => {
    console.log(`[${new Date().toISOString()}] Ready!`);
});
bot.on('voiceStateUpdate', (oldState, newState) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (oldState.channelId === null) {
        let notifChannel = oldState.guild.channels.cache.find(channel => channel.name === "vc-notif");
        if (notifChannel === undefined) {
            let voiceCategory = oldState.guild.channels.cache.find(channel => channel.type == discord_js_1.ChannelType.GuildCategory && channel.name.toUpperCase() == "Voice Channels".toUpperCase());
            notifChannel = yield oldState.guild.channels.create(Object.assign({ name: 'vc-notif', type: discord_js_1.ChannelType.GuildText }, (voiceCategory !== undefined && { parent: voiceCategory.id })));
        }
        let channelId = notifChannel.id;
        bot.channels.cache.get(channelId).send(`@everyone ${(_a = newState.member) === null || _a === void 0 ? void 0 : _a.displayName} has joined`);
    }
}));
bot.login(DISCORD_TOKEN);
// Function to ping the URL and log the response time
function pingURL() {
    return __awaiter(this, void 0, void 0, function* () {
        const url = "https://massive-nerissa-sammn97.koyeb.app/";
        const start = Date.now();
        try {
            const response = yield fetch(url);
            const end = Date.now();
            const responseTime = end - start;
            console.log(`[${new Date().toISOString()}] Ping to ${url} - Response time: ${responseTime}ms`);
        }
        catch (error) {
            console.error(`[${new Date().toISOString()}] Error pinging ${url}:`, error);
        }
    });
}
// Schedule the ping task to run every 5 minutes
node_cron_1.default.schedule("*/1 * * * *", pingURL);
