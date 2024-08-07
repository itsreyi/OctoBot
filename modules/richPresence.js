import { Client, RichPresence ,Channel } from 'discord.js-selfbot-v13';
import { Util } from 'discord.js-selfbot-rpc';
import { askQuestion } from './input.js';
import { formattedConsoleMessage } from './formatConsoleMessage.js';
import chalk from 'chalk';
import { updateConfig } from './saveConfig.js';

const client = new Client();

const askRichPresenceMode = async () => {
    let mode;

    do {
        formattedConsoleMessage(chalk.hex('#bababa').bold('Select The Rich Presence Mode'));
        
        mode = await askQuestion(chalk.hex('580087').bold('\t  ├ 1. ') + chalk.hex('#bababa').bold('Octo Bot\n') + chalk.hex('580087').bold('\t  ├ 2. ') + chalk.hex('#bababa').bold('Minecraft\n') + chalk.hex('580087').bold('\t  ├ 3. ') + chalk.hex('#bababa').bold('Fortnite\n') + chalk.hex('580087').bold('\t  ├ 4. ') + chalk.hex('#bababa').bold('Rainbow Six\n') + chalk.hex('580087').bold('\t  ├ 5. ') + chalk.hex('#bababa').bold('GTA V\n') + chalk.hex('580087').bold('\t  ├ 6. ') + chalk.hex('#bababa').bold('Roblox\n') + chalk.hex('580087').bold('\t  └ 7. ') + chalk.hex('bababa').bold('Discord\n') + chalk.hex('580087').bold('Mode: '));
        if(mode === '1' || mode === '2' || mode === '3' || mode === '4' || mode === '5' || mode === '6' || mode === '7'){
            console.log('\n');
            await updateConfig('richPresenceMode', mode);
            formattedConsoleMessage(chalk.hex('#525252').bold('Rich Presence:\t ') + chalk.hex('#00ff04').bold('ENABLED'));
            break;
        } else {
            console.log('\n');
            formattedConsoleMessage(chalk.hex('#525252').bold('Rich Presence:\t ') + chalk.hex('#ff0000').bold('INVALID OPTION\n'));
        }
    } while (true);
    
    switch(mode) {
        case '1':
            return{
                image: 'octobot',
                state: 'SelfBot Spammer',
                details: 'Im using Octo Bot',
                name: 'Octo Bot',
                button: 'Get OctoBot',
                buttonlink: 'https://dsc.gg/octo-bot'
            };

        case '2':
            return{
                image: 'minecraft',
                state: 'Playing Minecraft',
                details: 'Unknow Minecraft Server',
                name: 'Minecraft',
                button: 'Join Me',
                buttonlink: 'https://dsc.gg/octo-bot'
            };

        case '3':
            return{
                image: 'fortnite',
                state: 'Playing Fortnite',
                details: 'In Game Lobby',
                name: 'Fortnite',
                button: 'Join Me',
                buttonlink: 'https://dsc.gg/octo-bot'
            };
        
        case '4':
            return{
                image: 'rainbowsix',
                state: 'Playing Rainbow Six',
                details: 'In Game Lobby',
                name: 'Rainbow Six',
                button: 'Join Me',
                buttonlink: 'https://dsc.gg/octo-bot'
            };

        case '5':
            return{
                image: 'gta5',
                state: 'Playing GTA V',
                details: 'Playing Online',
                name: 'GTA V',
                button: 'Join Me',
                buttonlink: 'https://dsc.gg/octo-bot'
            };

        case '6':
            return{
                image: 'roblox',
                state: 'Playing Roblox',
                details: 'Playing unknown game',
                name: 'Roblox',
                button: 'Join Me',
                buttonlink: 'https://dsc.gg/octo-bot'
            };

        case '7':
            return{
                image: 'discord',
                state: 'Using Discord',
                details: 'Chatting with friends',
                name: 'Discord',
                button: 'Join Me',
                buttonlink: 'https://dsc.gg/octo-bot'
            };
        }

}


const startRichPresence = async (client, richPresence) => {
    formattedConsoleMessage(chalk.hex('#525252').bold('Rich Presence is starting...\n'));
    const applicationId = '1117134214480007278';
    const octoBotImage = await Util.getAssets(applicationId, richPresence.image);

    const presence = new RichPresence(client)
        .setApplicationId(applicationId)

        .setType('PLAYING')
        .setState(richPresence.state)
        .setName(richPresence.name)
        .setDetails(richPresence.details)
        .setStartTimestamp(Date.now())
        .setAssetsLargeImage(octoBotImage.id)
        .setAssetsLargeText('🐙')
        .addButton(richPresence.button, richPresence.buttonlink);

    if (client.user) {
        client.user.setPresence({ activities: [presence] });
        console.log('\n');
    } else {
        console.error('Client user is not initialized');
    }
};

export { startRichPresence, askRichPresenceMode };