const Seneor = require('./Sensor');

class EMGSensor extends Seneor {
    constructor({ port }) {
        super({ port, baudRate: 115200, mode: 'emg' });
    }
}

module.exports = EMGSensor;
