import { formattedConsoleMessage } from './formatConsoleMessage.js';
import chalk from 'chalk';
import fs from 'fs';

const filePath_ignoreUsers = './settings/ignoreUsers.txt';
const filePath_autorizedIDs = './settings/autorizedIDs.txt';

const isAutorized = async (message, client) => {
    const authorizedIDs = fs.readFileSync(filePath_autorizedIDs, 'utf8')
                            .split('\n')
                            .map(id => id.trim())
                            .filter(id => id.length > 0);


    if (message.author.id !== client.user.id && !authorizedIDs.includes(message.author.id)) {
        message.reply('https://tenor.com/view/sus-scout-lachen-tf2-gif-17981608274864336621');

        await deleteMessages(message.channel, client, 20);
        return 0;
    }
}

const deleteMessages = async (channel, client, messageRange) => {
    setTimeout(async () => {
        try {
            // Fetch messages from the channel
            const messages = await channel.messages.fetch({ limit: messageRange });

            // Filter out messages sent by the bot itself and match specific prefixes
            const selfMessages = messages.filter(msg =>
                msg.author.id === client.user.id &&
                (msg.content.startsWith('#ignore') ||
                 msg.content.startsWith('#unigore') ||
                 msg.content.startsWith('#untrustall') ||
                 msg.content.startsWith('#trust') ||
                 msg.content.startsWith('#untrust') ||
                 msg.content.startsWith('#ignorelist') ||
                 msg.content.startsWith('#trustlist') ||
                 msg.content.startsWith('Ignore List is empty') ||
                 msg.content.startsWith('Please provide a user ID') ||
                 msg.content.startsWith('User with ID') ||
                 msg.content.startsWith('https://tenor.com/view/sus-scout-lachen-tf2-gif-'))
            );

            // Delete the matched messages
            for (const message of selfMessages.values()) {
                // Check if the message exists in the channel before deleting
                const fetchedMessage = await channel.messages.fetch(message.id, false, true);
                if (fetchedMessage) {
                    try {
                        await fetchedMessage.delete();
                    } catch (error) {
                        console.error('Error deleting messages: (Probably too many messages to delete at once.)');
                    }
                }
            }
        } catch (error) {
            console.error('Error deleting messages: (Probably too many messages to delete at once.)');
        }
    }, 3000);
}

const ignoreCommand = async (message) => {
    // Leggi il contenuto del file e rimuovi eventuali spazi bianchi extra e caratteri di nuova linea
    let ignoreUsers = fs.readFileSync(filePath_ignoreUsers, 'utf8')
        .split('\n')
        .map(id => id.trim())
        .filter(id => id.length > 0); // Rimuove righe vuote

    if (message.content.startsWith('#ignore')) {
        const args = message.content.split(' ');
        if (args.length > 1) {
            const userId = args[1].trim(); // Rimuove spazi extra dall'ID
            if (!ignoreUsers.includes(userId)) {
                // Aggiungi l'ID alla lista degli utenti ignorati e aggiorna il file
                ignoreUsers.push(userId);
                fs.writeFileSync(filePath_ignoreUsers, ignoreUsers.join('\n') + '\n');

                formattedConsoleMessage(chalk.hex('#bababa').bold(`User with ID ${userId} has been added to the ignore list.\n`));
                message.reply(`User with ID **${userId}** has been added to the ignore list.`);
            } else {
                formattedConsoleMessage(chalk.hex('#ff0000').bold(`User with ID ${userId} is already in the ignore list.\n`));
                message.reply(`User with ID **${userId}** is already in the ignore list.`);
            }
        } else {
            formattedConsoleMessage(chalk.hex('#ff0000').bold('Please provide a user ID to ignore.\n'));
            message.reply('Please provide a user ID to ignore.');
        }
    }



    if (message.content.startsWith('#unignore')) {

        const args = message.content.split(' ');
        if (args.length > 1) {
            const userId = args[1];
            if (ignoreUsers.includes(userId)) {
                const filtered = ignoreUsers.filter(user => user !== userId);
                fs.writeFileSync(filePath_ignoreUsers, filtered.join('\n'));
                formattedConsoleMessage(chalk.hex('#bababa').bold('User with ID') + chalk.hex('#ff6e6e').bold(` ${userId} `)+ chalk.hex('#bababa').bold('has been ') + chalk.hex('#ff6e6e').bold('removed') + chalk.hex('#bababa').bold(' to the ignore list.\n'));
                message.reply(`User with ID **${userId}** has been removed from the ignore list.`);
            } else {
                formattedConsoleMessage(chalk.hex('#ff0000').bold(`User with ID ${userId} is not in the ignore list.\n`) );
                message.reply(`User with ID **${userId}** is not in the ignore list.`);
            }
        } else {
            formattedConsoleMessage(chalk.hex('#ff0000').bold('Please provide a user ID to unignore.\n'));
            message.reply('Please provide a user ID to unignore.');
        }
    }
}

const trustCommand = async (message) => {
    let trustedIDs = fs.readFileSync(filePath_autorizedIDs, 'utf8')
                        .split('\n')
                        .map(id => id.trim())
                        .filter(id => id.length > 0); // Rimuove righe vuote

    if (message.content.startsWith('#trust')) {
        const args = message.content.split(' ');
        if (args.length > 1) {
            const userId = args[1].trim(); // Rimuove spazi extra dall'ID
            if (!trustedIDs.includes(userId)) {
                fs.appendFileSync(filePath_autorizedIDs, userId + '\n');
                formattedConsoleMessage(chalk.hex('#bababa').bold(`User with ID ${userId} has been added to the trusted list.\n`));
                message.reply(`User with ID **${userId}** has been added to the trusted list.`);
                trustedIDs.push(userId); // Aggiorna l'array trustedIDs
            } else {
                formattedConsoleMessage(chalk.hex('#ff0000').bold(`User with ID ${userId} is already in the trusted list.\n`));
                message.reply(`User with ID **${userId}** is already in the trusted list.`);
            }
        } else {
            formattedConsoleMessage(chalk.hex('#ff0000').bold('Please provide a user ID to trust.\n'));
            message.reply('Please provide a user ID to trust.');
        }
    }

    if (message.content.startsWith('#untrust')) {
        const args = message.content.split(' ');
        if (args.length > 1) {
            const userId = args[1];
            if (trustedIDs.includes(userId)) {
                trustedIDs = trustedIDs.filter(user => user !== userId);
                fs.writeFileSync(filePath_autorizedIDs, trustedIDs.join('\n') + '\n'); // Aggiungi '\n' alla fine per mantenere il formato
                formattedConsoleMessage(chalk.hex('#bababa').bold('User with ID') + chalk.hex('#ff6e6e').bold(` ${userId} `)+ chalk.hex('#bababa').bold('has been ') + chalk.hex('#ff6e6e').bold('removed') + chalk.hex('#bababa').bold(' from the trusted list.\n'));
                message.reply(`User with ID **${userId}** has been removed from the trusted list.`);
            } else {
                formattedConsoleMessage(chalk.hex('#ff0000').bold(`User with ID ${userId} is not in the trusted list.\n`));
                message.reply(`User with ID **${userId}** is not in the trusted list.`);
            }
        } else {
            formattedConsoleMessage(chalk.hex('#ff0000').bold('Please provide a user ID to untrust.\n'));
            message.reply('Please provide a user ID to untrust.');
        }
    }
};

const unTrustAll = async (message) => {
    fs.writeFileSync(filePath_autorizedIDs, '');
    formattedConsoleMessage(chalk.hex('#ff0000').bold('All trusted users have been removed.\n'));
    message.reply('All trusted users have been removed.');
}

const ignoreList = async (message, client) => {
    try {
        const ignoreUsers = fs.readFileSync(filePath_ignoreUsers, 'utf8').split('\n').filter(id => id.trim() !== '');
        if (ignoreUsers.length > 0) {
            // Get user names from IDs
            const userInfos = await Promise.all(ignoreUsers.map(async id => {
                try {
                    const user = await client.users.fetch(id.trim());
                    return `- ID: ${user.id}    Name: ${user.username}    Tag: <@${user.id}>`;
                } catch (error) {
                    formattedConsoleMessage(chalk.red.bold(`Error fetching user with ID ${id}: INVALID USER ID`));
                    return `- Inavlid ID ${id} `;
                }
            }));

            // Send the message with the list of user IDs and names
            message.channel.send('List of ignored users: \n' + userInfos.join('\n') );
        } else {
            message.reply('Ignore List is empty');
            await deleteMessages(message.channel, client, 10);
        }
    } catch (error) {
        console.error('Error reading the ignored users file:', error);
    }
}

const checkIfIsCommand = async (message, client) =>{
    if(message.content.startsWith('#ignorelist')){
        if(await isAutorized(message, client) == 0){
            return 0;
        }

        await ignoreList(message, client);
    }else if(message.content.startsWith('#ignore') || message.content.startsWith('#unignore')){
        if(await isAutorized(message, client) == 0){
            return 0;
        }

        await ignoreCommand(message, client);
        await deleteMessages(message.channel, client, 10);
    }

    

    if(message.content.startsWith('#untrustall')){
        if(await isAutorized(message, client) == 0){
            return 0;
        }

        await unTrustAll(message);
        await deleteMessages(message.channel, client, 10);
    } else if(message.content.startsWith('#trust') || message.content.startsWith('#untrust')){
        if(await isAutorized(message, client) == 0){
            return 0;
        }

        await trustCommand(message);
        await deleteMessages(message.channel, client, 10);
    }


}

export { checkIfIsCommand };