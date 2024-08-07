import { promises as fs } from 'fs';
import { get } from 'http';
import { askQuestion } from './input.js';
import chalk from 'chalk';
import { formattedConsoleMessage } from './formatConsoleMessage.js';
import path from 'path';
import { updateConfig } from './saveConfig.js';


const getRandomIndex = async (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);

}

const getMessagesFromFile = async (filePath) => {
    const data = await fs.readFile(filePath, 'utf8');
    const dmMessages = data.split('---').map(phrase => phrase.trim()).filter(phrase => phrase.length > 0);

    return {
        msg: dmMessages,
        count: dmMessages.length
    };
}

const getMessage = async (filePath) => {
    const msgArray = await getMessagesFromFile(filePath)
    //console.log(msgArray)  //debug
    const fileName = path.basename(filePath, path.extname(filePath));

    let mode;

    if(msgArray.count > 1){
        do{
            formattedConsoleMessage(chalk.hex('bababa').bold('Select the message mode for ' + fileName));
            mode = await askQuestion(chalk.hex('580087').bold('\t  ├ 1. ') + chalk.hex('#bababa').bold('Random Message\n') + chalk.hex('580087').bold('\t  └ 2. ') + chalk.hex('#bababa').bold('Only First Message\n') + chalk.hex('580087').bold('Mode: '))

            if(mode === '1' || mode === '2'){
                break;
            }else{
                console.log('\n');
                formattedConsoleMessage(chalk.hex('#ff0000').bold('ERROR: INVALID OPTION\n'));
            }
        }while(true);
        if(mode === '1'){
            formattedConsoleMessage(chalk.hex('#525252').bold(`Message Mode for ${fileName}:\t`) + chalk.hex('#00ff04').bold('LOADED [RANDOM]\n'));
            
            if(fileName === 'dmMessage1'){
                await updateConfig('responseMsgMode1', 'RANDOM')
            } else if(fileName === 'dmMessage2'){
                await updateConfig('responseMsgMode2', 'RANDOM')
            }

            return{
                msgArray: msgArray.msg,
                msgMode: 'RANDOM'
            };
        } else if(mode === '2'){
            formattedConsoleMessage(chalk.hex('#525252').bold(`Message Mode for ${fileName}:\t`) + chalk.hex('#00ff04').bold('LOADED [ONLY FIRST MESSAGE]\n'));
            
            if(fileName === 'dmMessage1'){
                await updateConfig('responseMsgMode1', 'NORMAL')
            } else if(fileName === 'dmMessage2'){
                await updateConfig('responseMsgMode2', 'NORMAL')
            }
            
            return{
                msgArray: msgArray.msg,
                msgMode: 'NORMAL'
            };
        }
    }else if(msgArray.count == 1){
        formattedConsoleMessage(chalk.hex('#525252').bold(`Message Mode for ${fileName}:\t`) + chalk.hex('#00ff04').bold('LOADED [ONLY FIRST MESSAGE]\n'));
        
        if(fileName === 'dmMessage1'){
            await updateConfig('responseMsgMode1', 'NORMAL')
        } else if(fileName === 'dmMessage2'){
            await updateConfig('responseMsgMode2', 'NORMAL')
        }
        
        return{
            msgArray: msgArray.msg,
            msgMode: 'NORMAL'
        };
    }
}

const getMinMax= async () =>{
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
        
    }while(true);
    
    formattedConsoleMessage(chalk.hex('#525252').bold('DM Timer:\t\t ') + chalk.hex('#00ff04').bold(`LOADED [${min}s - ${max}s]\n`));

    setTimeout(async () => {
        await updateConfig('dmTimer', null)
    }, 900);
    
    return{
        min: min,
        max: max
    }

}

const responseMode = async () => {
    let mode;

    do{
        formattedConsoleMessage(chalk.hex('#525252').bold('Choose The Response Mode:\t '));
        mode = await askQuestion(chalk.hex('580087').bold('\t  ├ 1. ') + chalk.hex('#bababa').bold('First & Second\n') + chalk.hex('580087').bold('\t  └ 2. ') + chalk.hex('#bababa').bold('First Only\n') + chalk.hex('580087').bold('Mode: '))
        if(mode === '1' || mode === '2'){
            break;
        } else{
            console.log('\n');
            formattedConsoleMessage(chalk.hex('#ff0000').bold('ERROR: INVALID OPTION\n'));
        }
    }while(true)
    
    if (mode === '1') {
        await updateConfig('responseMode', 'FIRST & SECOND')

        return 'FIRST & SECOND';
    } else if (mode === '2') {
        await updateConfig('responseMode', 'FIRST')

        return 'FIRST';
    }
};


const askDmTimerMode = async () =>{
    let timerMode;
    do{
        formattedConsoleMessage(chalk.hex('#bababa').bold('Select DM Timer Mode'));
        timerMode = await askQuestion(chalk.hex('580087').bold('\t  ├ 1. ') + chalk.hex('#bababa').bold('Random Timer\n') + chalk.hex('580087').bold('\t  └ 2. ') + chalk.hex('#bababa').bold('Normal Timer\n') + chalk.hex('580087').bold('Mode: '));
        if(timerMode === '1' || timerMode === '2'){
            break;
        }else{
            console.log('\n');
            formattedConsoleMessage( chalk.hex('#ff0000').bold('ERROR: INVALID OPTION\n'));
        }

    }while(true);
    if(timerMode === '1'){
        await updateConfig('dmTimerMode', 'RANDOM')

        const MinMax = await getMinMax()
        return{
            timerMode: 'RANDOM',
            min: MinMax.min,
            max: MinMax.max
        }
    }else if(timerMode === '2'){
        await updateConfig('dmTimerMode', 'NORMAL')

        let timer;
        
        do{
            timer = parseInt(await askQuestion(chalk.hex('#636363').bold('[') + chalk.hex('#a600ff').bold('Octo') + chalk.hex('#d400ff').bold('Bot') + chalk.hex('#636363').bold(']') + chalk.hex('#636363').bold(' : ') + chalk.hex('#bababa').bold('Enter the time in seconds: ') ))
        
            if(isNaN(timer)){
                formattedConsoleMessage(chalk.hex('#ff0000').bold('ERROR: INVALID TIME\n'));
            } else{
                if(timer < 0){
                    formattedConsoleMessage(chalk.hex('#ff0000').bold('ERROR: TIME CANNOT BE NEGATIVE\n'));
                }else{
                    break;
                }
            }
        }while(true);

        formattedConsoleMessage(chalk.hex('#525252').bold('DM Timer:\t\t ') + chalk.hex('#00ff04').bold(`LOADED [${timer}s]\n`));
        
        
        setTimeout(async () => {
            await updateConfig('dmTimer', timer)
        }, 900);

        setTimeout(async () => {
            await updateConfig('dmMin', null)
        }, 1000);
        setTimeout(async () => {
            await updateConfig('dmMax', null)
        }, 1500);

        
        return{
            timerMode: 'NORMAL',
            timer: timer
        }
    }
}

const getMessageAll = async (message, timer) => {
    if(message.msgMode === 'RANDOM'){
        if(timer.timerMode === 'RANDOM'){
            const randomIndex = await getRandomIndex(0, message.msgArray.length)
            const randomTime = await getRandomIndex(timer.min, timer.max)
            return{
                message: message.msgArray[randomIndex],
                time: randomTime
            }
        }else if(timer.timerMode === 'NORMAL'){
            const randomIndex = await getRandomIndex(0, message.msgArray.length)
            return{
                message: message.msgArray[randomIndex],
                time: timer.timer
            }
        }
    } else if(message.msgMode === 'NORMAL'){
        if(timer.timerMode === 'RANDOM'){
            const randomTime = await getRandomIndex(timer.min, timer.max)
            return{
                message: message.msgArray[0],
                time: randomTime
            }
        }else if(timer.timerMode === 'NORMAL'){
            return{
                message: message.msgArray[0],
                time: timer.timer
            }
        }
    }
        
            
};

const test = async () =>{
    const path = './settings/dmMessage1.txt'
    const message = await getMessage(path)
    const timer = await askDmTimerMode()
    console.log('Message'+ message.msgArray) 
    console.log('Timer'+ timer)
    const array = await getMessageAll(message, timer)
    console.log(array)
};

/*(async () => {
    await test();
})();*/

export { getMessage, askDmTimerMode, responseMode, getMessageAll};