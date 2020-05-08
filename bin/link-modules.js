const PATH = require('path');
const fs = require('fs');
const { exec } = require('child_process');

const Target = PATH.resolve(__dirname, '../modules/@cloudpivot');

const folders = fs.readdirSync(Target).filter(folder => {
  const url = PATH.join(Target, folder);
  const stat = fs.statSync(url);
  if (
    stat.isDirectory()
    && fs.readdirSync(url).length
  ) {
    return true
  } else {
    return false
  }
});


console.log('modules:', folders);

const rootPath = PATH.join(__dirname, '..');

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


function link1(index) {

  const folder = folders[index];
  const fullPath = PATH.join(Target, folder);

  // 定义执行指令
  const command = 'cd ' + fullPath + ' && npm link';

  if (index < folders.length - 1) {
    return execAsync(command).then(() => {
      return link1(++index);
    });
  } else {
    return execAsync(command);
  }

}


function link2(index) {

  const folder = folders[index];

  // 定义执行指令
  const command = 'cd ' + rootPath + ' && npm link @cloudpivot/' + folder;

  if (index < folders.length - 1) {
    return execAsync(command).then(() => {
      return link2(++index);
    });
  } else {
    return execAsync(command);
  }

}


link1(0).then(() => {
  link2(0);
});


// folders.forEach(function (folder) {
//   const fullPath = PATH.join(Target, folder);
//   console.log(fullPath);
//   // 定义执行指令
//   const comment = 'cd ' + rootPath + '&& npm link @cloudpivot/' + folder;
//   // 执行
//   exec(comment, function (error, stdout, stderr) {
//     if (error) {
//       throw error;
//     }
//     console.log(stdout);
//   });
// });


// const rootPath = PATH.join(__dirname, '..');


// setTimeout(() => {

  // folders.forEach(function (folder) {
  //   // 定义执行指令
  //   const comment = 'cd ' + rootPath + '&& npm link @cloudpivot/' + folder;
  //   // 执行
  //   exec(comment, function (error, stdout, stderr) {
  //     if (error) {
  //       throw error;
  //     }
  //     console.log(stdout);
  //   });
  // });

// }, 3000);