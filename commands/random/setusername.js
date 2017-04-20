const Commando = require('discord.js-commando');
const Index = require('../../index');

var aliases = Index.aliases;

class SetUsernameCommand extends Commando.Command {
    constructor(client){
        super(client, {
            name: 'setusername',
            group: 'random',
            memberName: 'setusername',
            description: 'Set username of bot'
        });
    }

    async run(message, args){
			var userName = args[1];
			if (aliases.hasOwnProperty(userName.toLowerCase())) {
				userName = aliases[userName.toLowerCase()];
			}

			bot.user.setUsername(userName).then(user => {
				message.reply('✔ Username set!');
			})
			.catch((err) => {
				message.reply('Error: Unable to set username');
				console.log('Error on setusername command:', err);
			});
    }
}

module.exports = SetUsernameCommand;