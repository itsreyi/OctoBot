import { promises as fs } from 'fs';
import chalk from 'chalk';
import path from 'path';
import { fileURLToPath } from 'url';
import { formattedConsoleMessage } from './formatConsoleMessage.js';
import { responseMode } from './dmMessages.js';
import { RichPresence } from 'discord.js-selfbot-rpc';
import { exit } from 'process';
import { time } from 'console';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const settingsDir = path.join(__dirname, '../settings');
const filePath_Config = path.join(settingsDir, 'config.json');
const filePath_DmMessage1 = path.join(settingsDir, 'dmMessage1.txt');
const filePath_DmMessage2 = path.join(settingsDir, 'dmMessage2.txt');
const filePath_channelId = path.join(settingsDir, 'channelId.txt');
const filePath_spamMessage = path.join(settingsDir, 'spamMessage.txt');
const filePath_ignoreUsers = path.join(settingsDir, 'ignoreUsers.txt');
const filePath_autorizedIDs = path.join(settingsDir, 'autorizedIDs.txt');

const checkFiles = async () => {

    
    try {

        // Controlla se la cartella delle impostazioni esiste
        try {
            await fs.access(settingsDir);
            formattedConsoleMessage(chalk.hex('#525252').bold('Settings\t\t ') + chalk.hex('#ff9900').bold('LOADING'));
        } catch (err) {
            await fs.mkdir(settingsDir);
            formattedConsoleMessage(chalk.hex('#525252').bold('Settings\t\t ') + chalk.hex('#ff9900').bold('CREATED'));
        }

        // Controlla se il file degli utenti ignorati esiste
        try {
            await fs.access(filePath_ignoreUsers);
            formattedConsoleMessage(chalk.hex('#525252').bold('Ignore Users\t ') + chalk.hex('#00ff04').bold('LOADED'));
        } catch (err) {
            const defaultIgnoreUsers = `User ID 1\nUser ID 2\nUser ID 3\n...`;
            await fs.writeFile(filePath_ignoreUsers, defaultIgnoreUsers);
            formattedConsoleMessage(chalk.hex('#525252').bold('Ignore Users\t ') + chalk.hex('#ff9900').bold('CREATED'));
        }

        // Controlla se il file di configurazione esiste
        try {
            await fs.access(filePath_Config);
            formattedConsoleMessage(chalk.hex('#525252').bold('Config\t\t ') + chalk.hex('#00ff04').bold('LOADED'));
        } catch (err) {
            // Se il file di configurazione non esiste, crea un nuovo file con un template
            const defaultConfig = {
                token: 'AddYourTokenHere',
                richPresenceMode: '',
                dmTimerMode: '',
                dmTimer: null,
                dmMin: null,
                dmMax: null,
                responseMode: '',
                responseMsgMode1: '',
                responseMsgMode2: '',
                spamTimerMode: '',
                spamTimer: null,
                spamMin: null,
                spamMax: null,
                spamMsgMode: '',
                spamIdMode: '',
            };
            await fs.writeFile(filePath_Config, JSON.stringify(defaultConfig, null, 4));
            formattedConsoleMessage(chalk.hex('#525252').bold('Config\t\t ') + chalk.hex('#ff9900').bold('CREATED'));
        }

        // Controlla se il file del messaggio DM 1 esiste
        try {
            await fs.access(filePath_DmMessage1);
            formattedConsoleMessage(chalk.hex('#525252').bold('Message1\t\t ') + chalk.hex('#00ff04').bold('LOADED'));
        } catch (err) {
            // Se il file del messaggio DM 1 non esiste, crea un nuovo file con un template
            const defaultDmMessage1 = `This is your first DM message template.You can customize this message as per your preference.`;
            await fs.writeFile(filePath_DmMessage1, defaultDmMessage1);
            formattedConsoleMessage(chalk.hex('#525252').bold('Message1\t\t ') + chalk.hex('#ff9900').bold('CREATED'));
        }

        // Controlla se il file del messaggio DM 2 esiste
        try {
            await fs.access(filePath_DmMessage2);
            formattedConsoleMessage(chalk.hex('#525252').bold('Message2\t\t ') + chalk.hex('#00ff04').bold('LOADED'));
        } catch (err) {
            // Se il file del messaggio DM 2 non esiste, crea un nuovo file con un template
            const defaultDmMessage2 = `This is your second DM message template.Feel free to edit this message according to your needs.`;
            await fs.writeFile(filePath_DmMessage2, defaultDmMessage2);
            formattedConsoleMessage(chalk.hex('#525252').bold('Message2\t\t ') + chalk.hex('#ff9900').bold('CREATED'));
        }

        try {
            await fs.access(filePath_channelId);
            formattedConsoleMessage(chalk.hex('#525252').bold('Channel ID\t\t ') + chalk.hex('#00ff04').bold('LOADED'));
        } catch (err) {
            const defaultChannelId = `Channel ID 1\nChannel ID 2\nChannel ID 3\n...`;
            await fs.writeFile(filePath_channelId, defaultChannelId);
            formattedConsoleMessage(chalk.hex('#525252').bold('Channel ID\t\t ') + chalk.hex('#ff9900').bold('CREATED'));
        }

        try {
            await fs.access(filePath_spamMessage);
            formattedConsoleMessage(chalk.hex('#525252').bold('Spam Message\t ') + chalk.hex('#00ff04').bold('LOADED'));
        } catch (err) {
            const defaultSpamMessage = `This is your spam message template. You can customize this message as per your preference.`;
            await fs.writeFile(filePath_spamMessage, defaultSpamMessage);
            formattedConsoleMessage(chalk.hex('#525252').bold('Spam Message\t ') + chalk.hex('#ff9900').bold('CREATED'));
        }

        try {
            await fs.access(filePath_autorizedIDs);
            formattedConsoleMessage(chalk.hex('#525252').bold('Autorized IDs\t ') + chalk.hex('#00ff04').bold('LOADED'));
        } catch (err) {
            const defaultAutorizedIDs = `User ID 1\nUser ID 2\nUser ID 3\n...`;
            await fs.writeFile(filePath_autorizedIDs, defaultAutorizedIDs);
            formattedConsoleMessage(chalk.hex('#525252').bold('Autorized IDs\t ') + chalk.hex('#ff9900').bold('CREATED'));
        }

        console.log('\n');
    } catch (err) {
        setTimeout(async () => {
            console.log('\n');
            formattedConsoleMessage(chalk.hex('#525252').bold('Error\t\t ') + chalk.hex('#ff0000').bold('An error occurred while checking files. Plese restart the program\n'));
            exit();
        }, 100);
    }
    
};

export { checkFiles };