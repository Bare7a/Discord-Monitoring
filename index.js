const Discord = require('discord.js');
const DiscordHelper = require('./DiscordHelper');
const { TOKEN, PREFIX, SERVER_ID } = require('./config.json');

const client = new Discord.Client();
const helper = new DiscordHelper();

client.once('ready', () => {
    const server = client.guilds.find(g => g.id === SERVER_ID);
    helper.setServer(server);
    console.log(`${client.user.username} started in server: ${server.name}`);
})


client.on('message', async function (message) {
    if (message.guild.id !== SERVER_ID || !message.content.startsWith(PREFIX)) return;
    const text = message.content.replace(PREFIX, '');

    const items = text.split(' ');
    const categoryName = items.shift();
    const channelName = items.shift();
    const content = items.join(' ');
    const object = { channelName, categoryName };

    helper.sendMessage(categoryName, channelName, content, 'error', object);
})

client.login(TOKEN);

