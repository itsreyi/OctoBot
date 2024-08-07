import chalk from 'chalk';


const formattedConsoleMessage = (message) => {
    const prefix= (chalk.hex('#636363').bold('[') + chalk.hex('#a600ff').bold('Octo') + chalk.hex('#d400ff').bold('Bot') + chalk.hex('#636363').bold(']') + chalk.hex('#636363').bold(' : ') );
    console.log(prefix + message);
    return;
};

export { formattedConsoleMessage };