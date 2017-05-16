'use strict';

const thingShadow = require('aws-iot-device-sdk').thingShadow;
const cmdLineProcess = require('aws-iot-device-sdk/examples/lib/cmdline');
const isUndefined = require('aws-iot-device-sdk/common/lib/is-undefined');


function main(args) {
    console.log('main');

    deviceConnect();

    const willPayload = {
        "state": {
            "reported": {
                "connected": "false"
            }
        }
    };

    const thingShadows = thingShadow({
        keyPath: args.privateKey,
        certPath: args.clientCert,
        caPath: args.caCert,
        clientId: args.clientId,
        region: args.region,
        baseReconnectTimeMs: args.baseReconnectTimeMs,
        keepalive: args.keepAlive,
        protocol: args.Protocol,
        port: args.Port,
        host: args.Host,
        debug: args.Debug,

        // last will & testiment -- mqtt server publishes report if client disconnects badly
        // http://docs.aws.amazon.com/iot/latest/developerguide/thing-shadow-data-flow.html
        will: {
            topic: 'chip/things/' + args.thingName + '/update',
            payload: willPayload,
            qos: 1,
            retain: false
        }
    });

    //
    // Operation timeout in milliseconds
    //
    // const operationTimeout = 10000;

    // const thingName = 'RGBLedLamp';

    // var currentTimeout = null;


    function deviceConnect() {
        console.log('connect');

        thingShadows.register(args.thingName, {
                ignoreDeltas: true
            },
            registeredCallback
        );
    }

    function registeredCallback(err, failedTopics) {
        if (isUndefined(err) && isUndefined(failedTopics)) {
            console.log('Device thing registered.');
            setEventHandlers();
        }
    }

    function setEventHandlers() {


    }


}

module.exports = main;

if (require.main === module) {
    cmdLineProcess(
        'shadowDevice sample code',
        process.argv.slice(2),
        main
    );
}


console.log('end');
