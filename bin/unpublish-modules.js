const PATH = require('path');
const fs = require('fs');
const { exec } = require('child_process');

const Target = PATH.resolve(__dirname, '../modules/@cloudpivot');

let folders = fs.readdirSync(Target);

console.log('modules:', folders);


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


function publish(index) {

  const folder = folders[index];
  const fullPath = PATH.join(Target, folder);

  // 定义执行指令
  const command = 'cd ' + fullPath + ' && npm unpublish --force';

  if (index < folders.length - 1) {
    return execAsync(command).then(() => {
      return publish(++index);
    });
  } else {
    return execAsync(command);
  }

}


publish(0);
