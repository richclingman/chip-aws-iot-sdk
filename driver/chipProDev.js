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
        'D7': {type: 'IO', pin: 139}

        // 'PWM0': {type: 'PWM', pin: 9},
        // 'PWM1': {type: 'PWM', pin: 10}
    },

    getPinList: function() {
        return chipPinDev.pinList;
    },

    getPin: function(pinName) {
        return chipPinDev.pinList[pinName] || null;
    },

    exportPin: function (pin) {
        const cmd = pin + ' > /sys/class/gpio/export';
        chipPinDev.executeSet(cmd);
    },

    unexportPin: function (pin) {
        const cmd = pin + ' > /sys/class/gpio/unexport';
        chipPinDev.executeSet(cmd);
    },

    setDirection: function (pin, direction) {
        const cmd = direction + ' > /sys/class/gpio/gpio' + pin + '/direction';
        chipPinDev.executeSet(cmd);
    },

    setValue: function (pin, value) {
        const cmd = value + ' > /sys/class/gpio/gpio' + pin + '/value';
        chipPinDev.executeSet(cmd);
    },

    getValue: function (pin) {
        const cmd = '/sys/class/gpio/gpio' + pin + '/value';
        return chipPinDev.executeGet(cmd);
    },

    init: function () {
        const leds = [132, 133, 134, 135, 136, 137, 138, 139];
        leds.map(function (led) {
            chipPinDev.exportPin(led);
            chipPinDev.setDirection(led, 'out');
            chipPinDev.setValue(led, 0);
        });
    },

    teardown: function() {
        for (var pinName in chipPinDev.pinList) {
            chipPinDev.unexportPin(chipPinDev.pinList[pinName].pin);
        }
    },

    executeSet: function (cmd) {
        cmd = 'echo ' + cmd;
        console.log('in executeSet');
        console.log(cmd);
    },

    executeGet: function (cmd) {
        cmd = 'cat ' + cmd;
        console.log('in executeGet');
        console.log(cmd);

        return '* NEED TO GET VALUE *';
    },

    getState: function() {
        let state = {};
        Object.keys(chipPinDev.pinList).map(function(pinName) {
            state[pinName] = chipPinDev.getValue(chipPinDev.pinList[pinName].pin);
        });
        return state;
    }

};

module.exports = chipPinDev;
