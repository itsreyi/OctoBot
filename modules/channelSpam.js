import { promises as fs } from 'fs';
import { get } from 'http';
import { askQuestion } from './input.js';
import { updateConfig } from './saveConfig.js';
import chalk from 'chalk';
import { formattedConsoleMessage } from './formatConsoleMessage.js';

const filePath_channelID = './settings/channelId.txt';
const filePath_spamMessage = './settings/spamMessage.txt';

const getMinMax = async () => {
    let min, max;

    do{
        min = parseInt(await askQuestion(chalk.hex('#636363').bold('[') + chalk.hex('#a600ff').bold('Octo') + chalk.hex('#d400ff').bold('Bot') + chalk.hex('#636363').bold(']') + chalk.hex('#636363').bold(' : ') + chalk.hex('#bababa').bold('Enter the minimum time in seconds: ') ))
        max = parseInt(await askQuestion(chalk.hex('#636363').bold('[') + chalk.hex('#a600ff').bold('Octo') + chalk.hex('#d400ff').bold('Bot') + chalk.hex('#636363').bold(']') + chalk.hex('#636363').bold(' : ') + chalk.hex('#bababa').bold('Enter the maximum time in seconds: ') ))
        
        if(isNaN(min) || isNaN(max)){
            formattedConsoleMessage(chalk.hex('#ff0000').bold('ERROR: INVALID TIME\n'));
        }else{
            if(min > max){
                formattedConsoleMessage(chalk.hex('#ff0000').bold('ERROR: MINIMUM TIME CANNOT BE GREATER THAN MAXIMUM TIME\n'));
            }else{
                if(min === max){
                    formattedConsoleMessage(chalk.hex('#ff0000').bold('ERROR: MINIMUM TIME CANNOT BE EQUAL TO MAXIMUM TIME\n'));
                }else{
                    if(min < 0 || max < 0){
                        formattedConsoleMessage(chalk.hex('#ff0000').bold('ERROR: TIME CANNOT BE NEGATIVE\n'));
                    }else{
                        setTimeout(async () => {
                            await updateConfig('dmMax', max)
                        }, 1000);
    
                        setTimeout(async () => {
                            await updateConfig('dmMin', min)
                        }, 1500);
                        break;
                    }
                }
            }
        }

    }while(true)



    setTimeout(async () => {
        await updateConfig('spamMax', max)
    }, 500);

    setTimeout(async () => {
        await updateConfig('spamMin', min);
    }, 1000);

    setTimeout(async () => {
        await updateConfig('spamTimer', null)
    }, 1500);
    //console.log('Min:', min, 'Max:', max); // Debugging line
    return {
        min: min,
        max: max
    };
};

const getChannelId = async () => {
    try {
        const data = await fs.readFile(filePath_channelID, 'utf8');
        const channelIds = data.split('\n').map(id => id.trim()).filter(id => id.length > 0);
        if (channelIds.length > 0) {
            return channelIds;
        } else {
            formattedConsoleMessage(chalk.hex('#ff0000').bold('No channel IDs found in the file.\n'));
            return [];
        }
    } catch (err) {
        formattedConsoleMessage(chalk.hex('#ff0000').bold('Error reading channel ID file. \n'));
        return [];
    }
};

const askChannelIdMode = async () => {
    const idArray = await getChannelId();
    if (idArray.length > 1) {

        let mode

        do{
            console.log('\n');
            formattedConsoleMessage(chalk.hex('#525252').bold('Choose The Spam IDs Mode:\t '))
            mode = await askQuestion(chalk.hex('580087').bold('\t  ├ 1. ') + chalk.hex('#bababa').bold('Random IDs Mode\n') + chalk.hex('580087').bold('\t  └ 2. ') + chalk.hex('#bababa').bold('Normal Mode\n') + chalk.hex('580087').bold('Mode: '));
            if (mode === '1' || mode === '2'){
                break;
            } else {
                console.log('\n');
                formattedConsoleMessage(chalk.hex('#ff0000').bold('ERROR: INVALID OPTION\n'));
            }

        }while(true)
        if (mode === '1') {
            await updateConfig('spamIdMode', 'RANDOM')

            return {
                idArray: idArray,
                idMode: 'RANDOM'
            };
        } else if (mode === '2') {
            await updateConfig('spamIdMode', 'NORMAL')

            return {
                idArray: idArray,
                idMode: 'NORMAL'
            };
        }
    } else if (idArray.length == 1) {
        await updateConfig('spamIdMode', 'NORMAL')

        return {
            idArray: idArray,
            idMode: 'NORMAL'
        };
    }
};

const getSpamMessages = async () => {
    try {
        const data = await fs.readFile(filePath_spamMessage, 'utf8');
        const spamMessages = data.split('---').map(phrase => phrase.trim()).filter(phrase => phrase.length > 0);
        if (spamMessages.length > 0) {
            return spamMessages;
        } else {
            formattedConsoleMessage(chalk.hex('#ff0000').bold('No spam messages found in the file.\n'));
            return [];
        }
    } catch (err) {
        formattedConsoleMessage(chalk.hex('#ff0000').bold('Error reading spam message file. \n'));
        return [];
    }
};

const askSpamMessageMode = async () => {
    const msgArray = await getSpamMessages();

    let mode
    if (msgArray.length > 1) {
        
        do{
            formattedConsoleMessage(chalk.hex('#525252').bold('Choose The Spam Message Mode:\t '))
            mode = await askQuestion(chalk.hex('580087').bold('\t  ├ 1. ') + chalk.hex('#bababa').bold('Random Message Mode\n') + chalk.hex('580087').bold('\t  └ 2. ') + chalk.hex('#bababa').bold('Normal Message Mode\n') + chalk.hex('580087').bold('Mode: '))
            if (mode === '1' || mode === '2'){
                break;
            } else {
                console.log('\n');
                formattedConsoleMessage(chalk.hex('#ff0000').bold('ERROR: INVALID OPTION\n'));
            }
        }while(true)

        if (mode === '1') {
            await updateConfig('spamMsgMode', 'RANDOM')

            return {
                msgArray: msgArray,
                msgMode: 'RANDOM'
            };
        } else if (mode === '2') {
            await updateConfig('spamMsgMode', 'NORMAL')

            return {
                msgArray: msgArray,
                msgMode: 'NORMAL'
            };
        }
    } else if (msgArray.length == 1) {
        await updateConfig('spamMsgMode', 'NORMAL')

        return {
            msgArray: msgArray,
            msgMode: 'NORMAL'
        };
    }
};

const askSpamTimerMode = async () => {
    let timerMode

    do{
        formattedConsoleMessage(chalk.hex('#525252').bold('Choose The Spam Timer Mode:\t '))
        timerMode = await askQuestion(chalk.hex('580087').bold('\t  ├ 1. ') + chalk.hex('#bababa').bold('Random Timer Mode\n') + chalk.hex('580087').bold('\t  └ 2. ') + chalk.hex('#bababa').bold('Normal Timer Mode\n') + chalk.hex('580087').bold('Mode: '))
        if (timerMode === '1' || timerMode === '2'){
            break;
        } else {
            console.log('\n');
            formattedConsoleMessage(chalk.hex('#ff0000').bold('ERROR: INVALID OPTION\n'));
        }
    }while(true)

    if (timerMode === '1') {
        await updateConfig('spamTimerMode', 'RANDOM')

        const minMax = await getMinMax();
        return {
            timerMode: 'RANDOM',
            min: minMax.min,
            max: minMax.max
        };
    } else if (timerMode === '2') {
        await updateConfig('spamTimerMode', 'NORMAL')

        let timer;
        do{
            timer = parseInt(await askQuestion(chalk.hex('#636363').bold('[') + chalk.hex('#a600ff').bold('Octo') + chalk.hex('#d400ff').bold('Bot') + chalk.hex('#636363').bold(']') + chalk.hex('#636363').bold(' : ') + chalk.hex('#bababa').bold('Enter the time in seconds: ') ));
            if(isNaN(timer)){
                formattedConsoleMessage(chalk.hex('#ff0000').bold('ERROR: INVALID TIME\n'));
            } else {
                if(timer < 0){
                    formattedConsoleMessage(chalk.hex('#ff0000').bold('ERROR: TIME CANNOT BE NEGATIVE\n'));
                } else {
                    break;
                }
            }
        }while(true)

        await updateConfig('spamTimer', timer)

        setTimeout(async () => {
            await updateConfig('spamMin', null)
        }, 1000);
        setTimeout(async () => {
            await updateConfig('spamMax', null)
        }, 1500);
        
        return {
            timerMode: 'NORMAL',
            timer: timer
        };
    }
};

const getChannelSpamAll = async (spamMessage, channelId, timerMode) => {
    if (spamMessage.msgMode === 'RANDOM') {
        spamMessage = spamMessage.msgArray[Math.floor(Math.random() * spamMessage.msgArray.length)];

        if (channelId.idMode === 'RANDOM') {
            channelId = channelId.idArray[Math.floor(Math.random() * channelId.idArray.length)];

            if (timerMode.timerMode === 'RANDOM') {
                const timer = Math.floor(Math.random() * (timerMode.max - timerMode.min + 1)) + timerMode.min;
                //console.log('Timer (Random):', timer); // Debugging line
                return {
                    spamMessage: spamMessage,
                    channelId: channelId,
                    idMode: 'RANDOM',
                    timer: timer
                };
            } else if (timerMode.timerMode === 'NORMAL') {
                return {
                    spamMessage: spamMessage,
                    channelId: channelId,
                    idMode: 'RANDOM',
                    timer: timerMode.timer
                };
            }
        } else if (channelId.idMode === 'NORMAL') {
            channelId = channelId.idArray;

            if (timerMode.timerMode === 'RANDOM') {
                //console.log('Random Timer Min and Max:', timerMode.min, timerMode.max); // Debugging line
                const timer = Math.floor(Math.random() * (timerMode.max - timerMode.min + 1)) + timerMode.min;
                //console.log('Random Timer:', timer); // Debugging line
                return {
                    spamMessage: spamMessage,
                    channelId: channelId,
                    idMode: 'NORMAL',
                    timer: timer
                };
            } else if (timerMode.timerMode === 'NORMAL') {
                return {
                    spamMessage: spamMessage,
                    channelId: channelId,
                    idMode: 'NORMAL',
                    timer: timerMode.timer
                };
            }
        }
    } else if (spamMessage.msgMode === 'NORMAL') {
        spamMessage = spamMessage.msgArray[0];

        if (channelId.idMode === 'RANDOM') {
            channelId = channelId.idArray[Math.floor(Math.random() * channelId.idArray.length)];

            if (timerMode.timerMode === 'RANDOM') {
                const timer = Math.floor(Math.random() * (timerMode.max - timerMode.min + 1)) + timerMode.min;
                //console.log('Timer (Random):', timer); // Debugging line
                return {
                    spamMessage: spamMessage,
                    channelId: channelId,
                    idMode: 'RANDOM',
                    timer: timer
                };
            } else if (timerMode.timerMode === 'NORMAL') {
                return {
                    spamMessage: spamMessage,
                    channelId: channelId,
                    idMode: 'RANDOM',
                    timer: timerMode.timer
                };
            }
        } else if (channelId.idMode === 'NORMAL') {
            channelId = channelId.idArray;

            if (timerMode.timerMode === 'RANDOM') {
                const timer = Math.floor(Math.random() * (timerMode.max - timerMode.min + 1)) + timerMode.min;
                //console.log('Timer (Random):', timer); // Debugging line
                return {
                    spamMessage: spamMessage,
                    channelId: channelId,
                    idMode: 'NORMAL',
                    timer: timer
                };
            } else if (timerMode.timerMode === 'NORMAL') {
                return {
                    spamMessage: spamMessage,
                    channelId: channelId,
                    idMode: 'NORMAL',
                    timer: timerMode.timer
                };
            }
        }
    }
};



/*let spamTimer;
let spamMessage;
let channelId;

const initSpam = async () => {
    spamTimer = await askSpamTimerMode();
    spamMessage = await askSpamMessageMode();
    channelId = await askChannelIdMode();
    console.log('Initial Timer Mode:', spamTimer); // Debugging line
};

const test = async () => {
    await initSpam();
    let spamMessageAll = await getChannelSpamAll(spamMessage, channelId, spamTimer);
    console.log(spamMessageAll.timer);

    spamMessageAll = await getChannelSpamAll(spamMessage, channelId, spamTimer);
    console.log(spamMessageAll.timer);

    spamMessageAll = await getChannelSpamAll(spamMessage, channelId, spamTimer);
    console.log(spamMessageAll.timer);

    spamMessageAll = await getChannelSpamAll(spamMessage, channelId, spamTimer);
    console.log(spamMessageAll.timer);

    spamMessageAll = await getChannelSpamAll(spamMessage, channelId, spamTimer);
    console.log(spamMessageAll.timer);

    spamMessageAll = await getChannelSpamAll(spamMessage, channelId, spamTimer);
    console.log(spamMessageAll.timer);

    spamMessageAll = await getChannelSpamAll(spamMessage, channelId, spamTimer);
    console.log(spamMessageAll.timer);

    spamMessageAll = await getChannelSpamAll(spamMessage, channelId, spamTimer);
    console.log(spamMessageAll.timer);
};

(async () => {
    await test();
})();*/

export { askSpamTimerMode, askSpamMessageMode, askChannelIdMode, getChannelSpamAll };
