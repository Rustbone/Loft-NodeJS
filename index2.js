const yargs = require('yargs');
const path = require('path');
const fs = require('fs');
//require('dotenv').config()

// console.log(process.env.PORT)
// console.log(process.env.INTERVAL)

const args = yargs
   .usage('Usage: node $0 [options]')
   .help('help')
   .alias('help', 'h')
   .version('0.0.1')
   .alias('version', 'v')
   .example('node $0 --entry ./path/ --dist ./path/ --delete')
   .option('entry', {
    alias: 'e',
    describe: 'Указать путь к исходной директории',
    demandOption: true
   })
   .option('dist',{
    alias: 'd',
    describe: 'Куда сортировать?',
    default: './output'
   })
   .option('delete', {
    alias: 'D',
    describe: 'Удалять ли ?',
    boolean: true,
    default: false
   })
   .epilog('Мое ДЗ')
   .argv

const config = {
    entry: path.join(__dirname, args.entry),
    dist: path.join(__dirname, args.dist),
    delete: args.delete
}

// async function copyFile(src, dest) {
//   return new Promise((resolve, reject) => {
//     fs.copyFile(src, dest, (err) => {
//       if (err) {
//         reject(err);
//       } else {
//         console.log(`'${src}' скопирован в '${dest}'`);
//         resolve(dest);
//       }
//     });
//   });
// }

async function copyFile(src, dest) {
  return new Promise((resolve, reject) =>{
      fs.link(src, dest, (err, stat) => {
          // if (err) reject(err)          

          // resolve(stat)
          // console.log( `'${src} скопирован'`)
          // if (err.code === 'EEXIST'){           
          //   resolve(stat)
          //   console.log(`'${src}' уже создан`)
          // } else {
          //   reject(err)          
          //   console.error(`Ошибка при создании '${src}':`, err)
          // }
          if (err && err.code === 'EEXIST') {
            if (err.code === 'EEXIST'){           
              resolve(stat)
              console.log(`'${src}' уже создан`)
            } else {
              reject(err)          
              console.error(`Ошибка при создании '${src}':`, err)
            }
          } else {
            resolve(stat)
            console.log(`'${src}' создан`)
          }
      })
  })
}

async function createDir(src) {
  return new Promise((resolve, reject) =>{
      fs.mkdir(src, { recursive: true }, (err, stat) => {
        if (err && err.code === 'EEXIST') {
          if (err.code === 'EEXIST'){           
            resolve(stat)
            console.log(`'${src}' уже создан`)
          } else {
            reject(err)          
            console.error(`Ошибка при создании '${src}':`, err)
          }
        } else {
          resolve(stat)
          console.log(`'${src}' создан`)
        }
      })
  })
}

async function stats(src) {
  return new Promise((resolve, reject) =>{
      fs.stat(src, (err, stat) => {
          if (err) reject(err)

          resolve(stat)
      })
  })
}

async function readdir(src) {
  return new Promise((resolve, reject) => {
      fs.readdir(src, (err, files) => {
          if (err) reject(err)

          resolve(files)
      })
  })
}

async function sorter(src) {
  const files = await readdir(src)

  for (const file of files) {
      const currentPath = path.join(src, file)
      const stat = await stats(currentPath)

      if (stat.isDirectory()) {
          await sorter(currentPath)
      } else { 
        //const dist = await createDir('./dist')
        //console.log('errorrwrehjwmwm') 
        //try {
         // console.log('перешли в try')
          const firstLetter = file[0].toUpperCase()
          const pathFolder = path.join('./dist', firstLetter)
          //console.log(firstLetter)
          await createDir(pathFolder)
          const destinationPath = `${pathFolder}/${file}`
          //console.log(file)          
          //console.log(destinationPath)
          await copyFile(currentPath, destinationPath)  
      }
  }
  
}

(async() => {
  try {
      await sorter(config.entry)
     
      if (config.delete) {
          console.log('Удалить папку')
      }
  } catch (error) {
      console.error(error)
  }
})()