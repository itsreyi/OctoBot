import fs from 'fs/promises'; // Usa le API promise di fs
import path from 'path';
import { checkFiles } from './checkFiles.js';
import { formattedConsoleMessage } from './formatConsoleMessage.js';
import chalk from 'chalk';

// Risolvi il percorso del file di configurazione
const configFilePath = path.resolve('./settings/config.json');

let Config;

// Funzione per caricare la configurazione
const loadConfig = async () => {
    try {
        const data = await fs.readFile(configFilePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        if (err.code === 'ENOENT') {
            await checkFiles();
            return JSON.parse(await fs.readFile(configFilePath, 'utf8'));
        } else {
            console.error('Errore nella lettura del file di configurazione:', err);
            throw err;
        }
    }
};

// Funzione per aggiornare la configurazione
export const updateConfig = async (variableName, value) => {
    try {
        const data = await fs.readFile(configFilePath, 'utf8');
        let config = JSON.parse(data);

        config[variableName] = value;

        const updatedConfig = JSON.stringify(config, null, 2);
        await fs.writeFile(configFilePath, updatedConfig, 'utf8');
    } catch (err) {
        console.error('Errore nella lettura o scrittura del file di configurazione:', err);
    }
};

// Funzione per controllare la configurazione
export const checkConfig = async () => {
    let Valid = 0;
    
    // Carica la configurazione se non è già caricata
    if (!Config) {
        Config = await loadConfig();
    }

    const {
        richPresenceMode,
        dmTimerMode,
        dmTimer,
        dmMin,
        dmMax,
        responseMode,
        responseMsgMode1,
        responseMsgMode2,
        spamTimerMode,
        spamTimer,
        spamMin,
        spamMax,
        spamMsgMode,
        spamIdMode
    } = Config;

    // Verifica la configurazione
    if (!['1', '2', '3', '4', '5', '6', '7'].includes(richPresenceMode)) {
        formattedConsoleMessage(chalk.hex('#bababa').bold('Rich Presence Mode not valid...'));
        Valid = 1;
    }

    if (!['RANDOM', 'NORMAL'].includes(dmTimerMode)) {
        formattedConsoleMessage(chalk.hex('#bababa').bold('Dm Timer Mode not valid...'));
        Valid = 1;
    } else if (dmTimerMode === 'NORMAL') {
        if (isNaN(dmTimer) || dmTimer < 0) {
            formattedConsoleMessage(chalk.hex('#bababa').bold('Dm Timer not valid...'));
            Valid = 1;
        }
    } else if (dmTimerMode === 'RANDOM') {
        if (isNaN(dmMin) || isNaN(dmMax) || dmMin < 0 || dmMax < 0 || dmMin > dmMax || dmMin === dmMax) {
            formattedConsoleMessage(chalk.hex('#bababa').bold('Dm Min/Max Timer not valid...'));
            Valid = 1;
        }
    }

    if (!['FIRST & SECOND', 'FIRST'].includes(responseMode)) {
        formattedConsoleMessage(chalk.hex('#bababa').bold('Response Mode not valid...'));
        Valid = 1;
    } else if (responseMode === 'FIRST & SECOND') {
        if (!['NORMAL', 'RANDOM'].includes(responseMsgMode1) || !['NORMAL', 'RANDOM'].includes(responseMsgMode2)) {
            formattedConsoleMessage(chalk.hex('#bababa').bold('Response Message Mode not valid...'));
            Valid = 1;
        }
    } else if (responseMode === 'FIRST') {
        if (!['NORMAL', 'RANDOM'].includes(responseMsgMode1)) {
            formattedConsoleMessage(chalk.hex('#bababa').bold('Response Message Mode not valid...'));
            Valid = 1;
        }
    }

    if (!['RANDOM', 'NORMAL'].includes(spamTimerMode)) {
        formattedConsoleMessage(chalk.hex('#bababa').bold('Spam Timer Mode not valid...'));
        Valid = 1;
    } else if (spamTimerMode === 'NORMAL') {
        if (isNaN(spamTimer) || spamTimer < 0) {
            formattedConsoleMessage(chalk.hex('#bababa').bold('Spam Timer not valid...'));
            Valid = 1;
        }
    } else if (spamTimerMode === 'RANDOM') {
        if (isNaN(spamMin) || isNaN(spamMax) || spamMin < 0 || spamMax < 0 || spamMin > spamMax || spamMin === spamMax) {
            formattedConsoleMessage(chalk.hex('#bababa').bold('Spam Min/Max Timer not valid...'));
            Valid = 1;
        }
    }

    if (!['NORMAL', 'RANDOM'].includes(spamMsgMode)) {
        formattedConsoleMessage(chalk.hex('#bababa').bold('Spam Message Mode not valid...'));
        Valid = 1;
    }

    if (!['NORMAL', 'RANDOM'].includes(spamIdMode)) {
        formattedConsoleMessage(chalk.hex('#bababa').bold('Spam Id Mode not valid...'));
        Valid = 1;
    }

    return Valid;
};

// Carica la configurazione all'inizio del modulo
(async () => {
    try {
        Config = await loadConfig();
    } catch (error) {
        console.error('Errore nel caricamento della configurazione:', error);
    }
})();


