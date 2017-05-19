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
    exportPin: function (pin) {
        const cmd = 'echo ' + pin + ' > /sys/class/gpio/export';
        chipPinDev.execute(cmd);
    },

    unexportPin: function (pin) {
        const cmd = 'echo ' + pin + ' > /sys/class/gpio/unexport'
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

    execute: function (cmd) {
        console.log('in execute');
        console.log(cmd);
    }

};

module.exports = chipPinDev;
