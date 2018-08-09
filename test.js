const fs = require('fs')
const zlib = require('zlib')
const packager = require('electron-packager')
const { exec } = require('child_process');
// const path = require('path')
// const fse = require('fs-extra')

// fse.copy('output_', '_output', (err) => {
//   if (err) throw err;
//   console.log('source.txt was copied to destination.txt');
// })

// // fs.rmdir('_ouput', (err) => {
// //   if (err) throw err;
// // })

// function findDir(startPath, filter, cb) {
//   const filenames = []
//   if (!fs.existsSync(startPath)) {
//     throw new Error('not exsit dir')
//   }
//   const files = fs.readdirSync(startPath)
//   for (let i = 0; i < files.length; i++) {
//     const filename = path.join(startPath, files[i])
//     const stat = fs.lstatSync(filename)
//     if (stat.isDirectory()) {
//       // findDir(filename, filter, cb)
//     } else if (filename.match(filter)) {
//       filenames.push(filename)
//     }
//   }
//   if (!filenames.length) {
//     cb(`not found ${filter} file`)
//     return
//   }
//   cb(null, filenames)
// }

// findDir('output_', '.html', function (err, filenames) {
//   if (err) {
//     throw new Error(err)
//   }
//   console.log(filenames)
// })

// fs.writeFileSync('output/test.js', '(function(){ console.log("hello world") })()', { encoding: 'utf8' })

// const gzip = zlib.createGzip();
// const inp = fs.createReadStream('app.js');
// const out = fs.createWriteStream('app.js.gz');

// inp.pipe(gzip).pipe(out);

// packager({
//   dir: '/Users/shin/project/jinx/output',
//   name: 'output',
//   electronVersion: '2.0.5',
// }, function (err) {
//   if (err) throw new Error(err)
// })

const vm = require('vm');

const x = 1;

const sandbox = { x: 2 };
vm.createContext(sandbox); // Contextify the sandbox.

const code = 'x += 40; var y = 17;';
// x and y are global variables in the sandboxed environment.
// Initially, x has the value 2 because that is the value of sandbox.x.
vm.runInContext(code, sandbox);

console.log(sandbox.x); // 42
console.log(sandbox.y); // 17

console.log(x); // 1; y is not defined.