const Commando = require('discord.js-commando');

var stopped = false;
var inform_np = true;

var now_playing_data = {};
var queue = [];
var aliases = {};

var voice_connection = null;
var voice_handler = null;
var text_channel = null;

var yt_api_key = "AIzaSyC93HRvd7aGPB3pD19KaLvj4gf1l_BDMPc";