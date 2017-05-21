'use strict';

// test run the shadowDevice

const path = require('path');
const cmdLineProcess = require('aws-iot-device-sdk/examples/lib/cmdline');
const shadowDeviceClass = require('./shadowDevice');

const shadowRunner = {
    driver: null,
    clientId: null,
    startDevice: function (args) {
        if (shadowRunner.clientId) {
            args.clientId = shadowRunner.clientId;
        }

        new shadowDeviceClass(args, shadowRunner.driver);
    },
    run: function (clientId) {
        console.log('run', shadowRunner.driver);

        shadowRunner.clientId = clientId;


        if (process.argv.length === 2) {
            console.log('\n\nRun with flags:\n  node '
                + path.basename(process.argv[1]) + ' -f certs -F config.json\n\n');
            return;
        }

        cmdLineProcess('connect to the AWS IoT service and demonstrate thing shadow APIs, test modes 1-2',
            process.argv.slice(2), shadowRunner.startDevice);
    }
};

module.exports = shadowRunner;
