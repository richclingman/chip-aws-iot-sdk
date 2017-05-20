'use strict';

// test run the shadowDevice

const cmdLineProcess = require('aws-iot-device-sdk/examples/lib/cmdline');
const shadowDeviceClass = require('./shadowDevice');

function startDevice(args) {
    const shadowDevice = new shadowDeviceClass(args);
}

if (process.argv.length === 2) {
    console.log('\n\nnode runShadowDevice.js -f certs -F config.json\n\n');
    return;
}

if (require.main === module) {
    cmdLineProcess('connect to the AWS IoT service and demonstrate thing shadow APIs, test modes 1-2',
        process.argv.slice(2), startDevice);
}