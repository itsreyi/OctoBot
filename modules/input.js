import readline from 'readline';
import { promisify } from 'util';


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = promisify(rl.question).bind(rl);

const askQuestion = async (query) => {
    const answer = await question(query);
    return answer;
};

const closeInterface = () => {
    rl.close();
};

export { askQuestion, closeInterface };