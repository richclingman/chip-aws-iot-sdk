'use strict';

/**
 * A simple IoT device driver for testing.
 * Write a formatted version of message to console.log().
 *
 * When used as the chosen IoT device driver,
 * the current state of the device will be displayed.
 *
 * This is a write-only device. There is currently no way to have
 * this device change states and generate change messages.
 */

const prompt = require('prompt');

let consoleLogDriver = function () {

};

consoleLogDriver.prototype = {
    value: {},
    eventHandlers: {},
    init: function () {
        this.value = {};
        this.writeOutput('init() called');
    },
    on: function (event, handler) {
        this.eventHandlers[event] = handler;
    },
    updateState: function (message) {
        Object.assign(this.value, message.state);

        // clone object so test sees distinct values for each call
        const reportedOutput = Object.assign({}, this.value);
        this.writeOutput(reportedOutput);
    },
    get: function () {
        return this.value;
    },
    writeOutput: function (arg) {
        console.log('\nDRIVER OUT: ', arg);
    },
    loopForStateChange() {
        prompt.start();
        prompt.message = 'New State or "exit"';

        const callback = this.eventHandlers['change'];
        if (!callback) {
            throw new Error('Must set a "change" callback.');
        }

        const pattern = /^(D[0-7]:[01])|(P[01]:[0-9][0-9])|(exit)$/;
        prompt.get([{
            name: 'State',
            required: true,
            pattern: pattern,
            message: 'Ex: D3:1 (pattern: ' + pattern + ').'
        }], function (err, data) {
            if (err) {
                callback(err);
                return;
            }

            const stateString = data.State;
            if (stateString.toLowerCase() === 'exit') {

                const eventHandler = this.eventHandlers['exit'];
                if (eventHandler) {
                    eventHandler(null, 'exit');
                    return;
                }

                throw new Error('Exiting without handler');
            }

            const commandLetter = stateString.substr(0, 1);
            const parser = this.parsers[commandLetter];

            if (!parser) {
                callback('Undefined command letter: "' + commandLetter + '"');
            } else {
                const state = parser(stateString);
                callback(null, state);
            }

            this.loopForStateChange();
        }.bind(this));
    },

    parsers: {
        'D': function (stateString) {
            // to turn 'D2:1' to object {D2:1}
            const parts = stateString.split(':');
            const json = '{"' + parts[0] + '":' + parts[1] + '}';
            return JSON.parse(json);
        },
        'P': function (stateString) {
            // duty_cycle centers around 1us which is center for servo, "50" on input
            // each "1" is 10ns so "100" is 1,000ns + 500ns (1,500ns); "0" = 1,000ns - 500ns (500ns)

            const parts = stateString.split(':');

            const value = parseInt(parts[1]);
            const offset = value * 10 - 500;
            const dutyCycle = 1000 + offset;

            const json = '{"' + parts[0] + '":' + dutyCycle + '}';
            return JSON.parse(json);


        }
    }
};

module.exports = consoleLogDriver;
