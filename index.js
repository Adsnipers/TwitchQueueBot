require('dotenv').config()
const tmi = require('tmi.js');
const config = require('./config.json');
const queue = require('./datastore/queue.json');
const fs = require('fs');

queue.length = 0;
fs.writeFile('./datastore/queue.json', JSON.stringify(queue, null, 4), 'utf-8', function (err) {if (err) throw err})

const client = new tmi.Client({
	options: { debug: true, messagesLogLevel: "info" },
	connection: {
		reconnect: true,
		secure: true
	},
	identity: {
		username: process.env.USERNAME,
		password: process.env.OAUTH
	},
	channels: config.channelName
});
client.connect().catch(console.error);
client.on('message', (channel, tags, message, self) => {
    join(channel, tags, message, self);
    queueList(channel, tags, message, self);
    creator(channel, tags, message, self);
    remove(channel, tags, message, self);
});

async function join(channel, tags, message, self) {
    if(message.startsWith('!join')) {
        let ign = message.split(' ')[1]
        if (ign == undefined) {
            ign = tags.username
        }
        let isAlreadyInQueue = false;
        isAlreadyInQueue = queue.some(queue => ign.includes(queue))
        if (isAlreadyInQueue == false) {
            queue.push(ign);
            fs.writeFile('./datastore/queue.json', JSON.stringify(queue, null, 4), 'utf-8', function (err) {if (err) throw err})
            client.say(channel, `@${tags.username}, You've been added to the queue as ${ign} :D`);
        } else {
            client.say(channel, `Unable to add ${ign} to queue, already in queue ;-;`);
        }
	}
}

async function queueList(channel, tags, message, self) {
    if (message.toLowerCase() == '!queue') {
        if (typeof queue[0] !== "undefined") {
            client.say(channel, `@${tags.username} -> current queue: 1. ${queue[0]} 2. ${queue[1]} 3. ${queue[2]} 4. ${queue[3]} 5. ${queue[4]}`);
        } else {
            client.say(channel, `@${tags.username} -> The queue is empty`);
        }
    }
}

async function creator(channel, tags, message, self) {
    if (message.toLowerCase() == '!queuebot') {
        client.say(channel, `I was created by Adsnipers :D Huge luv to him bc hes awesome! <3`)
    }
}

async function remove(channel, tags, message, self) {
    if (message.toLowerCase() == '!queueremove') {
        if ('#' + tags.username == config.channelName[0] || tags.mod == true) {
            client.say(channel, `Removing ${queue[0]} from the queue! :D`)
            queue.shift();
            fs.writeFile('./datastore/queue.json', JSON.stringify(queue, null, 4), 'utf-8', function (err) {if (err) throw err})
        } else {
            client.say(channel, `@${tags.username} Only the streamer and mods can do that ;-;`)
        }
    }
}112