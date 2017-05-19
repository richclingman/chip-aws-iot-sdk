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

        this.registerThing();
    },

    registerThing: function() {
        this.thingShadow.registerThing(
            this.args.thingName,
            {
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
        this.thingShadow.on('connect', function () {
            console.log('connected to AWS IoT');
        });

        this.thingShadow.on('close', function () {
            console.log('close');
            this.thingShadow.unregister(thingName);
        });

        this.thingShadow.on('reconnect', function () {
            console.log('reconnect');
        });

        this.thingShadow.on('offline', function () {
            //
            // If any timeout is currently pending, cancel it.
            //
            if (this.currentTimeout !== null) {
                clearTimeout(this.currentTimeout);
                this.currentTimeout = null;
            }
            //
            // If any operation is currently underway, cancel it.
            //
            while (stack.length) {
                stack.pop();
            }
            console.log('offline');
        });

        this.thingShadow.on('error', function (error) {
            console.log('error', error);
        });

        this.thingShadow.on('message', function (topic, payload) {
            console.log('message', topic, payload.toString());
        });

        this.thingShadow.on('status', function (thingName, stat, clientToken, stateObject) {
            handleStatus(thingName, stat, clientToken, stateObject);
        });

        this.thingShadow.on('delta', function (thingName, stateObject) {
            handleDelta(thingName, stateObject);
        });

        this.thingShadow.on('timeout', function (thingName, clientToken) {
            handleTimeout(thingName, clientToken);
        });
    }

};

console.log('end');
module.exports = shadowDevice;
