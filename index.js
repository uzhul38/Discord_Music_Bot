const Commando = require('discord.js-commando');
const fs = require("fs");
const ytdl = require("ytdl-core");
const request = require("request");
const bot = new Commando.Client({
    owner: '147317882114539520',
    commandPrefix: '!'
});
const path = require('path');
const sqlite = require('sqlite');
const settings = require('./settings');

const dm_text = "Hey there! Use !commands on a public chat room to see the command list.";
const mention_text = "Use !commands to see the command list.";
var aliases_file_path = "aliases.json";

var stopped = false;
var inform_np = true;

var now_playing_data = {};
var queue = [];
var aliases = {};

var voice_connection = null;
var voice_handler = null;

var yt_api_key = "AIzaSyC93HRvd7aGPB3pD19KaLvj4gf1l_BDMPc";

var commands = ["clearqueue", "np", "queue", "remove", "request", "resume", "search", "setnp", "skip", "stop" ];

bot
    .on('error', console.error)
    .on('warn', console.warn)
    .on('debug', console.log)
    .on('ready', () => {
		var server = bot.guilds.find("name", "Dev");
		if(server === null) throw "Couldn't find server 'Dev'";
		var voice_channel = server.channels.find(chn => chn.name === "General" && chn.type === "voice"); //The voice channel the bot will connect to
		if(voice_channel === null) throw "Couldn't find voice channel '" + "General"+ "' in server '" + "Dev" + "'";
		
		text_channel = server.channels.find(chn => chn.name === "general" && chn.type === "text"); //The text channel the bot will use to announce stuff
		if(text_channel === null) throw "Couldn't find text channel '#" + "general" + "' in server '" + "Dev" + "'";

		voice_channel.join().then(connection => {voice_connection = connection;}).catch(console.error);
        console.log('Pere Blaise est pret!');
    })
    .on('disconnect', () => { console.warn('Disconnected!'); })
    .on('reconnecting', () => {console.warn('Reconnecting...'); })
    .on('commandError', (cmd, err) => {
        if(err instanceof Commando.FriendlyError) return;
        console.error('Error in command ${cmd.groupID}:${cmd.memberName}', err);
    })
    .on('commandBlocked', (msg, reason) => {
		console.log(oneLine`
			Command ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ''}
			blocked; ${reason}
		`);
	})
	.on('commandPrefixChange', (guild, prefix) => {
		console.log(oneLine`
			Prefix ${prefix === '' ? 'removed' : `changed to ${prefix || 'the default'}`}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
	})
	.on('commandStatusChange', (guild, command, enabled) => {
		console.log(oneLine`
			Command ${command.groupID}:${command.memberName}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
	})
	.on('groupStatusChange', (guild, group, enabled) => {
		console.log(oneLine`
			Group ${group.id}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`)
    })
	.on("message", message => {
		if(message.channel.type === "dm" && message.author.id !== bot.user.id) { //Message received by DM
		//Check that the DM was not send by the bot to prevent infinite looping
		message.channel.sendMessage(dm_text);
		} else if(message.channel.type === "text" && message.channel.name === text_channel.name) { //Message received on desired text channel
			if(message.isMentioned(bot.user)) {
				message.reply(mention_text);
			} else {
				var message_text = message.content;
				if(message_text[0] == '!') { //Command issued
					this.handle_command(message, message_text.substring(1));
				}
			}
		}
	});

bot.setProvider(
    sqlite.open(path.join(__dirname, 'database.sqlit3')).then(db => new Commando.SQLiteProvider(db))
).catch(console.error);

bot.registry
.registerGroups([
    ['random', 'Random'], 
    ['music', 'Music']
])
.registerDefaults()
.registerCommandsIn(path.join(__dirname + '/commands'));

bot.login('MzAzOTg1ODI3NzE1NzQzNzQ0.C9gEcQ.IJ8hlJ-v9XngPPs4uTGh6fTbLkA');

//////////////////////////// Function

function get_video_id(string) {
	var regex = /(?:\?v=|&v=|youtu\.be\/)(.*?)(?:\?|&|$)/;
	var matches = string.match(regex);

	if(matches) {
		return matches[1];
	} else {
		return string;
	}
}

////////////////////////// Exports

exports.add_to_queue = function (video, message, mute = false) {

	var video_id = get_video_id(video);

	ytdl.getInfo("https://www.youtube.com/watch?v=" + video_id, (error, info) => {
		if(error) {
			message.reply("The requested video (" + video_id + ") does not exist or cannot be played.");
			console.log("Error (" + video_id + "): " + error);
		} else {
			queue.push({title: info["title"], id: video_id, user: message.author.username});
			if (!mute) {
				message.reply('"' + info["title"] + '" has been added to the queue.');
			}
			if(!stopped && !this.is_bot_playing() && queue.length === 1) {
				this.play_next_song();
			}
		}
	});
};

exports.play_next_song = function (message) {
	if(this.is_queue_empty()) {
		text_channel.sendMessage("The queue is empty!");
	}

	var video_id = queue[0]["id"];
	var title = queue[0]["title"];
	var user = queue[0]["user"];

	now_playing_data["title"] = title;
	now_playing_data["user"] = user;

	if(inform_np) {
		text_channel.sendMessage('Now playing: "' + title + '" (requested by ' + user + ')');
		bot.user.setGame(title);
	}

	var audio_stream = ytdl("https://www.youtube.com/watch?v=" + video_id);
	voice_handler = voice_connection.playStream(audio_stream);

	voice_handler.once("end", reason => {
		voice_handler = null;
		bot.user.setGame();
		if(!stopped && !this.is_queue_empty()) {
			this.play_next_song();
		}
	});

	queue.splice(0,1);
};

exports.search_command = function (command_name) {
	for(var i = 0; i < commands.length; i++) {
		if(commands[i].command == command_name.toLowerCase()) {
			return commands[i];
		}
	}

	return false;
};

exports.handle_command = function (message, text) {
	var params = text.split(" ");
	var command = this.search_command(params[0]);

	if(command) {
		if(params.length - 1 < command.parameters.length) {
			message.reply("Insufficient parameters!");
		} else {
			command.execute(message, params);
		}
	}
};

exports.is_queue_empty = function () {
	return queue.length === 0;
};

exports.is_bot_playing = function () {
	return voice_handler !== null;
};

exports.search_video = function (message, query) {
	request("https://www.googleapis.com/youtube/v3/search?part=id&type=video&q=" + encodeURIComponent(query) + "&key=" + yt_api_key, (error, response, body) => {
		var json = JSON.parse(body);
		if("error" in json) {
			message.reply("An error has occurred: " + json.error.errors[0].message + " - " + json.error.errors[0].reason);
		} else if(json.items.length === 0) {
			message.reply("No videos found matching the search criteria.");
		} else {
			this.add_to_queue(json.items[0].id.videoId, message);
		}
	})
};

exports.queue_playlist = function (playlistId, message, pageToken = '') {
	request("https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=" + playlistId + "&key=" + yt_api_key + "&pageToken=" + pageToken, (error, response, body) => {
		var json = JSON.parse(body);
		if ("error" in json) {
			message.reply("An error has occurred: " + json.error.errors[0].message + " - " + json.error.errors[0].reason);
		} else if (json.items.length === 0) {
			message.reply("No videos found within playlist.");
		} else {
			for (var i = 0; i < json.items.length; i++) {
				this.add_to_queue(json.items[i].snippet.resourceId.videoId, message, true)
			}
			if (json.nextPageToken == null){
				return;
			}
			this.queue_playlist(playlistId, message, json.nextPageToken)
		}
	});
};

exports.stopped = stopped;
exports.inform_np = inform_np;

exports.now_playing_data = now_playing_data;
exports.queue = queue;
exports.aliases = aliases;

exports.voice_connection = voice_connection;
exports.voice_handler = voice_handler;

exports.yt_api_key = yt_api_key;