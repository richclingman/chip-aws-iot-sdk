'use strict';

const thingShadow = require('aws-iot-device-sdk').thingShadow;

const isUndefined = require('aws-iot-device-sdk/common/lib/is-undefined');


// @todo - change to using async.waterfall instead of hidden callbacks


let shadowDevice = function (args, driver) {
    console.log('main');

    this.args = args;
    this.driver = driver;

    console.log('thing name:', this.args.thingName);

    function exit() {
        console.log('exiting');

        process.exit();
    }

    driver.on('exit', exit);

    process.on('SIGINT', exit);

    driver.on('change', function (err, state) {
        console.log('change', err, state);

        const message = {
            state: {
                desired: state
            }
        };
        this.publishUpdate(message);
    }.bind(this));

    driver.init();

    const willPayload = {
        "state": {
            "reported": {
                "connected": "false"
            }
        }
    };
    const willTopic = 'myIot/lwt/' + args.thingName + '/update';

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

        // last will & testament -- mqtt server publishes report if client disconnects badly
        // http://docs.aws.amazon.com/iot/latest/developerguide/thing-shadow-data-flow.html
        will: {
            topic: willTopic,
            payload: JSON.stringify(willPayload),
            qos: 1,
            retain: false
        }
    });

    this.deviceConnect();
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

    registerThing: function () {
        this.thingShadow.register(
            this.args.thingName,
            {
                ignoreDeltas: false
            },
            this.registeredCallback.bind(this)
        );
    },

    registeredCallback: function (err, failedTopics) {
        if (isUndefined(err) && isUndefined(failedTopics)) {
            console.log('Device thing registered.');

            // report current state and then use delta message to update current state
            // @todo - get current state from driver
            let message = {
                state: {
                    reported: {
                        connected: true,
                        // a: 1,
                        // b: 544,
                        // c: 3,
                        // d: 4,
                        // color: "",
                        "e": {"key": "value2", "another": "thing4"}
                    }
                }
            };
            const clientToken = this.publishUpdate(message);
            console.log('sending update', clientToken);

            this.driver.loopForStateChange();
        }
    },

    publishUpdate(message) {
        console.log('send publish', message);
        return this.thingShadow.update(this.args.thingName, message);
    },

    registerEventHandlers: function () {
        this.thingShadow.on('connect', function () {
            console.log('rcvd connected to AWS IoT');
        });

        this.thingShadow.on('close', function () {
            console.log('rcvd close');
            this.thingShadow.unregister(this.args.thingName);
        }.bind(this));

        this.thingShadow.on('reconnect', function () {
            console.log('rcvd reconnect');
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
            // while (stack.length) {
            //     stack.pop();
            // }
            console.log('rcvd offline');
        }.bind(this));

        this.thingShadow.on('error', function (error) {
            console.log('rcvd error', error);
        });

        this.thingShadow.on('message', function (topic, payload) {
            console.log('rcvd message', topic, payload.toString());
        });

        this.thingShadow.on('status', function (thingName, stat, stateObject) {
            console.log('rcvd status', stat, stateObject);
            // handleStatus(thingName, stat, clientToken, stateObject);
        });

        this.thingShadow.on('delta', function (thingName, stateObject) {
            console.log('rcvd delta', JSON.stringify(stateObject));
            this.driver.updateState(stateObject);
        }.bind(this));

        this.thingShadow.on('timeout', function (thingName, clientToken) {
            console.log('rcvd timeout', clientToken);
            // handleTimeout(thingName, clientToken);
        });
    }

};

console.log('end');
module.exports = shadowDevice;
