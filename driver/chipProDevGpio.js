'use strict';

/**
 * Provide an interface to C.H.I.P. Pro Dev Kit I/O using GPIO package
 * https://www.npmjs.com/package/chip-gpio
 * https://github.com/jeremyscalpello/chip-gpio
 *
 */

const Gpio = require('chip-gpio').Gpio;

let ChipPinDevGpio = function () {

};
ChipPinDevGpio.prototype = {
    pinList: {
        'D0': {type: 'IO', pin: 132, gpio: null},
        'D1': {type: 'IO', pin: 133, gpio: null},
        'D2': {type: 'IO', pin: 134, gpio: null},
        'D3': {type: 'IO', pin: 135, gpio: null},
        'D4': {type: 'IO', pin: 136, gpio: null},
        'D5': {type: 'IO', pin: 137, gpio: null},
        'D6': {type: 'IO', pin: 138, gpio: null},
        'D7': {type: 'IO', pin: 139, gpio: null}
    },

    init: function () {

        Object.keys(this.pinList).map(function (pinName) {
            const pinObj = this.pinList[pinName];
            pinObj.gpio = new Gpio(pinObj.pin, 'out');
            pinObj.gpio.write(0);
        }.bind(this));
    },

    teardown: function () {
        Object.keys(this.pinList).map(function (pinName) {
            const pinObj = this.pinList[pinName];
            pinObj.gpio.unexport(0);
        }.bind(this));
    }
};

module.exports = ChipPinDevGpio;
