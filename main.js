/*const { Client, Channel } = require('discord.js-selfbot-v13');
const { getMessage, askDmTimerMode, getMessageAll, responseMode } = require('./modules/dmMessages');
const { askSpamMessageMode, askChannelIdMode, askSpamTimerMode, getChannelSpamAll} = require('./modules/channelSpam');
const { startRichPresence } = require('./modules/richPresence');
const { printLogo } = require('./modules/logo');
const { print } = require('./modules/formatConsoleMessage')*/


import { Client, Channel } from 'discord.js-selfbot-v13';
import fs from 'fs';
import chalk from 'chalk';

import { getMessage, askDmTimerMode, responseMode, getMessageAll } from './modules/dmMessages.js';
import { askSpamMessageMode, askChannelIdMode, askSpamTimerMode, getChannelSpamAll} from './modules/channelSpam.js';
import { startRichPresence, askRichPresenceMode } from './modules/richPresence.js';
import { printLogo } from './modules/logo.js';
import { checkFiles } from './modules/checkFiles.js';
import { formattedConsoleMessage } from './modules/formatConsoleMessage.js';
import { checkIfIsCommand } from './modules/commands.js';

const client = new Client()
const now = new Date();
const timeString = now.toLocaleTimeString('it-IT', { hour12: false });

let richPresenceInfo;

let dmTimer;
let message1;
let message2;
let responseMsgMode;

let spamTimer;
let spamMessage;
let channelId;
let channelSpamAll;
let Config;
let filePath_DmMessage1;
let filePath_DmMessage2;
let filePath_ignoreUsers;
let filePath_autorizedIDs;


const firstMessages = new Set();

const initMessages = async () => {
    dmTimer = await askDmTimerMode();
    responseMsgMode = await responseMode();

    if(responseMsgMode === 'FIRST & SECOND'){
        message1 = await getMessage(filePath_DmMessage1);
        message2 = await getMessage(filePath_DmMessage2);
    } else if(responseMsgMode === 'FIRST'){
        message1 = await getMessage(filePath_DmMessage1);
    }
};

const initSpam = async () => {
    spamTimer = await askSpamTimerMode();
    spamMessage = await askSpamMessageMode();
    channelId = await askChannelIdMode();
}

const getEssentials = async () => {
    Config = JSON.parse(fs.readFileSync('./settings/config.json', 'utf8'));
    filePath_DmMessage1 = './settings/dmMessage1.txt';
    filePath_DmMessage2 = './settings/dmMessage2.txt';
    filePath_ignoreUsers = './settings/ignoreUsers.txt';
    filePath_autorizedIDs = './settings/autorizedIDs.txt';
}

let userMessageCount = {};
const threshold = 5;
client.on('messageCreate', async (message) => {
    const ignoreUsers = fs.readFileSync(filePath_ignoreUsers, 'utf8')
        .split('\n')
        .map(id => id.trim())
        .filter(id => id.length > 0); // Rimuove righe vuote

    const autorizedIDs = fs.readFileSync(filePath_autorizedIDs, 'utf8')
        .split('\n')
        .map(id => id.trim())
        .filter(id => id.length > 0); // Rimuove righe vuote


    if(ignoreUsers.includes(message.author.id)) return;

    if (message.author.id !== client.user.id) {
        const userId = message.author.id;
        if (!userMessageCount[userId]) {
            userMessageCount[userId] = 0;
        }

        userMessageCount[userId]++;

        if (message.author.id === client.user.id || autorizedIDs.includes(message.author.id)) {
            userMessageCount[userId] = 0; // Azzerare il conteggio per gli utenti fidati
            //formattedConsoleMessage(chalk.hex('#ff0000').bold(`Trusted User ${message.author.username} is sending a lot of messages, the bot will not automatically ignore it since it is a trusted user\n`));
        } else {
            if (userMessageCount[userId] > threshold) {
                formattedConsoleMessage(chalk.hex('#ff0000').bold(`User ${message.author.username} is sending a lot of messages, the bot will ignore it\n`));
                ignoreUsers.push(message.author.id);
                fs.writeFileSync(filePath_ignoreUsers, ignoreUsers.filter(id => id.trim() !== '').join('\n') + '\n');
                delete userMessageCount[userId];
            }
        }
    }
    

    if(message.content.startsWith('#')) {
        const autorized = await checkIfIsCommand(message, client);
        if(autorized == 0){
            return;
        }
        return;
    }
    

    if (message.author.bot || message.author.id === client.user.id) return;

    if (message.channel.type === 'DM') {
        //console.log('Received DM:', message.content); //debug line
        
        try {
            let responseMessage;
            if (!firstMessages.has(message.author.id)) {
                //console.log(`${timeString} | First message from this user: ${message.author.username}`);
                responseMessage = await getMessageAll(message1, dmTimer);
                //console.log('Response:', responseMessage);

                firstMessages.add(message.author.id);

                setTimeout(async () => {
                    await message.reply(responseMessage.message);
                }, responseMessage.time * 1000);

            } else {
                if(responseMsgMode === 'FIRST & SECOND'){
                    //console.log('Subsequent message from this user.');
                    responseMessage = await getMessageAll(message2, dmTimer);
                    //console.log('Response:', responseMessage);

                    setTimeout(async () => {
                        await message.reply(responseMessage.message);
                    }, responseMessage.time * 1000);
                }
            }

        } catch (error) {
            console.error('Error handling DM:', error);
        }
    }
});

const sendSpamMessages = async (channelSpamAll) => {  //function to send spam messages to channels
    const channelIds = channelSpamAll.channelId;

    if(channelSpamAll.idMode === 'NORMAL'){
        for(const id of channelIds){
            const channel = await client.channels.fetch(id);
            if(channel){
                await channel.send(channelSpamAll.spamMessage);
            }
        }
    } else if(channelSpamAll.idMode === 'RANDOM'){
        const channel = await client.channels.fetch(channelSpamAll.channelId);
        if(channel){
            await channel.send(channelSpamAll.spamMessage);
        }
    }
}



client.on('ready', async () => {

    await startRichPresence(client, richPresenceInfo);

    const spamLoop = async (spamMessage, channelId, spamTimer) => {  //timed loop for spamming in channels

        let channelSpamAll = await getChannelSpamAll(spamMessage, channelId, spamTimer);
        sendSpamMessages(channelSpamAll);
        //console.log('Send message with timer:', channelSpamAll.timer); //debug line

        setTimeout(() => spamLoop(spamMessage, channelId, spamTimer), channelSpamAll.timer * 1000);
    }

    spamLoop(spamMessage, channelId, spamTimer);

    console.log(`Logged in as:  ${client.user.tag}`);
});


(async () => {  //startup function
    await printLogo();

    await checkFiles();
    
    await getEssentials();

    richPresenceInfo = await askRichPresenceMode();
    
    await initMessages();
    formattedConsoleMessage(chalk.hex('#525252').bold('Info\t\t ') + chalk.hex('#00ff00').bold('Starting DM Responder\n'));


    await initSpam();
    formattedConsoleMessage(chalk.hex('#525252').bold('Info\t\t ') + chalk.hex('#00ff00').bold('Starting Channel IDs spammer\n'));

    try {
        await client.login(Config.token);
    } catch (error) { 
        formattedConsoleMessage(chalk.hex('#525252').bold('Error\t\t ') + chalk.hex('#ff0000').bold('Please check your token in the config file.\n'));
    }
})();

