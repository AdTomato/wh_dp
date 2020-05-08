const PATH = require('path');
const fs = require('fs');
const { exec } = require('child_process');

const rootPath = PATH.join(__dirname, '..');

const Target = PATH.join(rootPath, 'entries');

const folders = fs.readdirSync(Target).filter(folder => !['.DS_Store'].includes(folder));

console.log('folders:', folders);


function execAsync(command) {

    return new Promise((resolve, reject) => {
        // 执行
        console.log('exec start:', command);

        exec(command, function (error, stdout, stderr) {
            if (error) {
                reject(error);
            } else {
                console.log('exec end:', stdout);
                resolve(stdout);
            }
        })
    });

}


function install(index) {

    const folder = folders[index];
    const fullPath = PATH.join(Target, folder);

    // 定义执行指令
    const command = 'cd ' + fullPath + ' && npm i';

    if (index < folders.length - 1) {
        return execAsync(command).then(() => {
            return install(++index);
        });
    } else {
        return execAsync(command);
    }

}


install(0).then(()=>{
    const command = `cd ${rootPath} && npm i && npm run package`
    execAsync(command);
});