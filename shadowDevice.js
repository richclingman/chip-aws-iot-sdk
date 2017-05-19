'use strict';

const thingShadow = require('aws-iot-device-sdk').thingShadow;

const isUndefined = require('aws-iot-device-sdk/common/lib/is-undefined');

let shadowDevice = function (args) {
    console.log('main');

    this.args = args;

    const willPayload = {
        "state": {
            "reported": {
                "connected": "false"
            }
        }
    };

    this.thingShadow = thingShadow({
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

    this.deviceConnect();

    //
    // Operation timeout in milliseconds
    //
    // const operationTimeout = 10000;

    // const thingName = 'RGBLedLamp';

};

shadowDevice.prototype = {
    args: null,
    thingShadow: null,
    currentTimeout: null,
    deviceConnect: function () {
        console.log('connect');

        this.registerEventHandlers();

        this.thingShadow.register(this.args.thingName, {
                ignoreDeltas: true
            },
            this.registeredCallback
        );
    },

    registeredCallback: function (err, failedTopics) {
        if (isUndefined(err) && isUndefined(failedTopics)) {
            console.log('Device thing registered.');
        }
    },
    registerEventHandlers: function () {
    }

};

console.log('end');
module.exports = shadowDevice;
