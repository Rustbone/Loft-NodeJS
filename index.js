const yargs = require('yargs');
const path = require('path');
const fs = require('fs');

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

function createFolder(src, cb) {
  fs.mkdir(src, (err) => {
    if (err && err.code === 'EEXIST') {
      cb()
    } else if (err) {
      throw err
    } else {
      cb()
    }
})
}

function sorter(src) {
   fs.readdir(src, (err, files) => {
        if(err) throw err
        //console.log(files)

        files.forEach((file) => {
            const currentPath = path.join(src, file)

            fs.stat(currentPath, (err, stat) => {
                if(err) throw err

                if (stat.isDirectory()) {
                    sorter(currentPath)
                } else {
                    //создать папку dist если её нет!
                    const dist = './dist'
                    // fs.mkdir(dist, { recursive: true }, (err) => {
                    //   if (err) throw err;
                      
                    //   console.log('Папка "dist" создана.')

                    //   //создать папку для файлов (первая буква файла: M)
                    //   const firstLetter = file[0].toUpperCase()
                    //   const distFolder = path.join(dist, firstLetter)

                    //   fs.access(distFolder, (err) => {
                    //       if (err) {
                    //         console.log(`'${distFolder} не существует'`)

                    //         fs.mkdir(distFolder, { recursive: true },(err) => {
                    //           if (err) throw err;                    
                    //         })
                    //       } else {
                    //         console.log(`'${distFolder} существует'`)

                    //         //Копируем текущий файл
                    //         const destinationPath = `${distFolder}/${file}`
                    //         console.log(currentPath)
                    //         fs.link(currentPath, destinationPath, (err) => {
                    //           if (err) {
                    //             console.log(`'${file} не скопирован'`)
                    //             return
                    //           } else {
                    //             console.log(`'${file} скопирован'`)
                    //           }
                    //         })
                    //       }
                    //    })
                    // })                           
                    
                    createFolder(dist, () => {
                      const firstLetter = file[0].toUpperCase()
                      const distFolder = path.join(dist, firstLetter)
                    
                      createFolder(distFolder, () => {
                        const destinationPath = `${distFolder}/${file}`
                        fs.link(currentPath, destinationPath, (err) => {
                          if (err) throw err;
                        })
                      })
                    })
                }
            })
        })
   })
}

try {
    sorter(config.entry)
} catch (error) {
    console.error(error)
}

