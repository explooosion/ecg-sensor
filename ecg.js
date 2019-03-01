require('dotenv').config();

const fs = require('fs');
const path = require('path');
const moment = require('moment');
const ECGSensor = require('./lib/ECGSensor');

const selectShell = require('select-shell');

const exec = require('child_process').exec;

let DATA = [];

// npm install -g @serialport/list
exec('serialport-list -f json', (err, stdout, stderr) => {

    if (err) return console.log(err);

    // 終端機選單
    const select = new selectShell({
        inverse: true,
        multiSelect: false,
        pointerColor: 'yellow',
    });

    // 新增終端機選單項目
    JSON.parse(stdout)
        .forEach(({ comName, manufacturer }) =>
            select.option(manufacturer ? `${comName}(${manufacturer})` : comName)
        );

    // 顯示終端機選單
    console.log('\n=============================');
    console.log('\nPlease choose the serial port:\n');
    select.list();

    select.on('select', (res) => worker(String(res[0].value).split('(')[0]));
    select.on('cancel', () => process.exit(0));
});

/**
 * Start to work Sensor
 * @param {string} value serialport
 */
function worker({ value }) {

    const sensor = new ECGSensor({ port: value });

    sensor.run(data => {
        if (isNaN(Number(data))) return;
        DATA.push({
            data: Number(data),
            time: moment().format('YYYY-MM-DDTHH:mm:ss.SSS'),
        });
        if (DATA.length === 1)
            setInterval(() => sensor.saveFile(DATA, `共 ${DATA.length} 筆`), 10000);
    });
}
