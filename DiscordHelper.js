class DiscordHelper {
    constructor() {
        this.server = new Error('Server is not found!');
    }

    setServer(server) {
        this.server = server;
    }

    getCategory(categoryName) {
        categoryName = categoryName.toUpperCase();
        const category = this.server.channels.find(c => c.name === categoryName && c.type === 'category');
        return category;
    }

    async createCategory(categoryName) {
        categoryName = categoryName.toUpperCase();
        const category = await this.server.createChannel(categoryName, { type: 'category' });
        return category;
    }

    getChannel(channelName, category) {
        channelName = channelName.toLowerCase();
        const channel = this.server.channels.find(c => c.name === channelName && c.type === 'text' && c.parentID === category.id);
        return channel;
    }

    async createChannel(channelName, category) {
        channelName = channelName.toLowerCase();
        const channel = await this.server.createChannel(channelName, { type: 'text', parent: category.id });
        return channel;
    }

    async sendMessage(categoryName, channelName, message, type, object) {
        let category = this.getCategory(categoryName);
        if(!category) category = await this.createCategory(categoryName);
    
        let channel = this.getChannel(channelName, category);
        if(!channel) channel = await this.createChannel(channelName, category);
    
        const data = messageTemplate({ message, type, object });
        channel.send(data);

        const data2 = messageTemplate2({ message, type, object });
        channel.send(data2);
    }
}

const messageTypes = {
    "info": {
        text: 'Info',
        color: 47083,
        icon_url: 'https://img.icons8.com/color/100/000000/info--v1.png',
        icon_text: ':information_source:'
    },
    "error": {
        text: 'Error',
        color: 16713728,
        icon_url: 'https://img.icons8.com/color/100/000000/flash-bang.png',
        icon_text: ':boom:'
    },
    "warning": {
        text: 'Warning',
        color: 16772864,
        icon_url: 'https://img.icons8.com/color/100/000000/error.png',
        icon_text: ':warning:'
    }
}

const messageTemplate = ({ message, type = "error", object = false }) => {
    const { text, color, icon_url } = messageTypes[type];
    const title = message;
    const timestamp = new Date();

    const data = { embed: { title, color, timestamp, footer: { text, icon_url } } };
    if (object) {
      data.embed.description = `\`\`\`JSON\n${JSON.stringify(object, null, 2)}\`\`\``;
    }
   
    return data;
}

const messageTemplate2 = ({ message, type = "error", object = false }) => {
    const { icon_text } = messageTypes[type];

    let text = `${icon_text} ${message}`;
    if (object) {
      text += `\n\`\`\`JSON\n${JSON.stringify(object, null, 2)}\`\`\``;
    }
    
    return text;
}

module.exports = DiscordHelper;