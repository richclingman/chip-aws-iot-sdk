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

let value;

module.exports = {
    init: function() {
        value = {};
        this.writeOutput('init() called');
    },
    updateState: function(message) {
        value = message.state.desired;

        const json = JSON.stringify(message, null, 4);
        this.writeOutput(json);
    },
    get: function() {
        return value;
    },
    writeOutput: function(arg) {
        console.log(arg);
    }
};
