const Commando = require('discord.js-commando');
const Index = require('../../index');

var yt_api_key = Index.yt_api_key;

class SearchCommand extends Commando.Command {
    constructor(client){
        super(client, {
            name: 'search',
            group: 'music',
            memberName: 'search',
            description: 'Add the searched video to the playlist queue'
        });
    }

    async run(message, args){
        if(yt_api_key === null) {
            message.reply("You need a YouTube API key in order to use the !search command. Please see https://github.com/agubelu/discord-music-bot#obtaining-a-youtube-api-key");
        } else {
            var q = "";
            for(var i = 1; i < args.length; i++) {
                q += args[i] + " ";
            }
            Index.search_video(message, q);
        }
    }
}

module.exports = SearchCommand;