const fs = require('fs');
const path = require('path');
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const moment = require('moment');

moment.locale('zh-tw');

class Sensor {
    constructor({ port, baudRate, mode }) {
        this.port = port;
        this.baudRate = baudRate;
        this.mode = mode;

        console.log(`port: ${this.port}`);
        console.log(`baudRate: ${this.baudRate}`);

        this.createDir();

        this.startTime = moment().format('YYYY-MM-DD HH:mm:ss');
        console.log(`Start ${this.mode} from`, this.startTime);
        console.log('=================================');
    }

    run(callback) {
        this.sensor = new SerialPort(this.port, {
            baudRate: this.baudRate,
        })
            .pipe(new Readline({ delimiter: '\n' }))
            .on('data', callback);
    }

    createDir() {
        // 依開始接收的時間作為檔名
        this.pathName = `./data/${process.env.NAME}/${process.env.STAGE}/${this.mode}/`;
        fs.promises.mkdir(this.pathName, { recursive: true }).catch(console.error);
    }

    saveFile(data = [], msg = '') {
        this.fileName = `${moment().format('YYYYMMDD-HHmmsss')}.js`;
        fs.writeFile(path.resolve(this.pathName, this.fileName), `const csv = ${JSON.stringify(data)}; export default csv;`, err => {
            if (err) console.log(err);
            console.log(`已儲存，${msg}。`, moment(this.startTime).fromNow());
        });
    }
}

module.exports = Sensor;
