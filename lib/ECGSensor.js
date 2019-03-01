const Seneor = require('./Sensor');

class ECGSensor extends Seneor {
    constructor({ port }) {
        super({ port, baudRate: 9600, mode: 'ecg' });
    }
}

module.exports = ECGSensor;
