'use strict';

/**
 * Provide an interface to C.H.I.P. Pro Dev Kit I/O
 * https://docs.getchip.com/chip_pro_devkit.html#gpio
 *
 * sudo sh -c 'echo 132 > /sys/class/gpio/export'
 *
 *
 */

const child = require('child');


// *** SERIOUS SECURITY RISK ***
// SHOULD NOT ALLOW BUILDING A SHELL COMMAND WITH UNTESTED VALUES

const chipPinDev = {
    pinList: {
        'D0': {type: 'IO', pin: 132},
        'D1': {type: 'IO', pin: 133},
        'D2': {type: 'IO', pin: 134},
        'D3': {type: 'IO', pin: 135},
        'D4': {type: 'IO', pin: 136},
        'D5': {type: 'IO', pin: 137},
        'D6': {type: 'IO', pin: 138},
        'D7': {type: 'IO', pin: 139},

        'PWM0': {type: 'PWM', pin: 9},
        'PWM1': {type: 'PWM', pin: 10}
    },

    getPinList: function() {
        return chipPinDev.pinList;
    },

    getPin: function(pinName) {
        return chipPinDev.pinList[pinName] || null;
    },

    exportPin: function (pin) {
        const cmd = 'echo ' + pin + ' > /sys/class/gpio/export';
        chipPinDev.execute(cmd);
    },

    unexportPin: function (pin) {
        const cmd = 'echo ' + pin + ' > /sys/class/gpio/unexport';
        chipPinDev.execute(cmd);
    },

    setDirection: function (pin, direction) {
        const cmd = 'echo ' + direction + ' > /sys/class/gpio/gpio' + pin + '/direction';
        chipPinDev.execute(cmd);
    },

    setValue: function (pin, value) {
        const cmd = 'echo ' + value + ' > /sys/class/gpio/gpio' + pin + '/value';
        chipPinDev.execute(cmd);
    },


    init: function () {
        const leds = [132, 133, 134, 135, 136, 137, 138, 139];
        leds.map(function (led) {
            chipPinDev.exportPin(led);
            chipPinDev.setDirection(led, 'out');
        });
    },

    teardown: function() {
        for (var pinName in chipPinDev.pinList) {
            chipPinDev.unexportPin(chipPinDev.pinList[pinName].pin);
        }
    },

    execute: function (cmd) {
        console.log('in execute');
        console.log(cmd);
    }

};

module.exports = chipPinDev;
