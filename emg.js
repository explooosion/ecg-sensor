require('dotenv').config();

const fs = require('fs');
const path = require('path');
const moment = require('moment');
const EMGSensor = require('./lib/EMGSensor');

const selectShell = require('select-shell');

const exec = require('child_process').exec;

let DATA = [];

exec('ls /dev/tty.*', (err, stdout, stderr) => {

    if (err) return console.log(err);

    // 終端機選單
    const select = new selectShell({
        inverse: true,
        multiSelect: false,
        pointerColor: 'yellow',
    });

    // 新增終端機選單項目
    stdout.split(/\n/)
        .filter(d => d !== '')
        .forEach(d => select.option(d.trim()));

    // 顯示終端機選單
    console.log('\n=============================');
    console.log('\nPlease choose the serial port:\n');
    select.list();

    select.on('select', (res) => worker(res[0]));
    select.on('cancel', () => process.exit(0));
});

/**
 * Start to work Sensor
 * @param {string} value serialport
 */
function worker({ value }) {

    const sensor = new EMGSensor({ port: value });

    sensor.run(data => {
        DATA.push({
            data: Number(data),
            time: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
        });
        if (DATA.length === 1)
            setInterval(() => sensor.saveFile(DATA, `共 ${DATA.length} 筆`), 10000);
    });
}
