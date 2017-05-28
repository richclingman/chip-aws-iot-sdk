'use strict';

/**
 * Provide an interface to C.H.I.P. Pro Dev Kit I/O
 * https://docs.getchip.com/chip_pro_devkit.html#gpio
 *
 * sudo sh -c 'echo 132 > /sys/class/gpio/export'
 *
 *
 */

const child = require('child_process');


// *** SERIOUS SECURITY RISK ***
// SHOULD NOT ALLOW BUILDING A SHELL COMMAND WITH UNTESTED VALUES

let ChipPinDev = function () {

};
ChipPinDev.prototype = {
    value: {},
    eventHandlers: {},
    on: function (event, handler) {
        this.eventHandlers[event] = handler;
    },
    pinList: {
        'D0': {type: 'IO', pin: 132},
        'D1': {type: 'IO', pin: 133},
        'D2': {type: 'IO', pin: 134},
        'D3': {type: 'IO', pin: 135},
        'D4': {type: 'IO', pin: 136},
        'D5': {type: 'IO', pin: 137},
        'D6': {type: 'IO', pin: 138},
        'D7': {type: 'IO', pin: 139}
    },

    validators: {
        /**
         * @param value
         * @returns {boolean}
         */
        IO: function (value) {
            return value === 0 || value === 1;
        }
    },

    isValidOutput: function (pinType, value) {
        if (!pinType in this.validators) {
            return false;
        }

        return this.validators[pinType](value);
    },

    getPinList: function () {
        return this.pinList;
    },

    getPin: function (pinName) {
        return this.pinList[pinName] || null;
    },

    exportPin: function (pin) {
        const cmd = 'test ! -e /sys/class/gpio/gpio' + pin
            + ' && echo ' + pin + ' > /sys/class/gpio/export || echo "already exported"';
        this.executeSet(cmd);
    },

    unexportPin: function (pin) {
        const cmd = 'test -e /sys/class/gpio/gpio' + pin
            + ' && echo ' + pin + ' > /sys/class/gpio/unexport || echo "not exported"';
        this.executeSet(cmd);
    },

    setDirection: function (pin, direction) {
        const cmd = direction + ' > /sys/class/gpio/gpio' + pin + '/direction';
        this.executeSet(cmd);
    },

    setValue: function (pin, value) {
        const cmd = value + ' > /sys/class/gpio/gpio' + pin + '/value';
        this.executeSet(cmd);
    },

    getValue: function (pin) {
        const cmd = '/sys/class/gpio/gpio' + pin + '/value';
        return this.executeGet(cmd);
    },

    exportPwm: function (pwm) {
        const cmd = 'test ! -e /sys/class/pwm/pwmchip0/pwm' + pwm
            + ' && echo ' + pwm + ' > /sys/class/pwm/pwmchip0/export || echo "already exported"';
        this.executeSet(cmd);
    },

    unexportPwm: function (pwm) {
        const cmd = 'test -e /sys/class/pwm/pwmchip0/pwm' + pwm
            + ' && echo ' + pwm + ' > /sys/class/pwm/pwmchip0/unexport || echo "not exported"';
        this.executeSet(cmd);
    },

    setPwmEnable: function (pwm, isEnabled) {
        const cmd = isEnabled + ' > /sys/class/pwm/pwmchip0/pwm' + pwm + '/enable';
        this.executeSet(cmd);
    },

    setPwmPolarity: function (pwm, polarity) {
        const cmd = polarity + ' > /sys/class/pwm/pwmchip0/pwm' + pwm + '/polarity';
        this.executeSet(cmd);
    },

    setPwmPeriod: function (pwm, period) {
        const cmd = period + ' > /sys/class/pwm/pwmchip0/pwm' + pwm + '/period';
        this.executeSet(cmd);
    },

    setPwmDutyCycle: function (pwm, dutyCycle) {
        const cmd = dutyCycle + ' > /sys/class/pwm/pwmchip0/pwm' + pwm + '/duty_cycle';
        this.executeSet(cmd);
    },

    init: function () {

        Object.keys(this.pinList).map(function (pinName) {
            const pin = this.pinList[pinName].pin;
            this.exportPin(pin);
            this.setDirection(pin, 'out');
            this.setValue(pin, 0);
        }.bind(this));


        // testing - init pwm to 50% alternating

        // [0, 1].map(function(pwm) {
        //     this.exportPwm(pwm);
        //     this.setPwmEnable(pwm, 0);
        //     this.setPwmPolarity(pwm, pwm ? 'normal' : 'inversed');
        //     this.setPwmEnable(pwm, 1);
        //     this.setPwmPeriod(pwm, 1000000000);
        //     this.setPwmDutyCycle(pwm, 500000000);
        // }.bind(this));
    },

    teardown: function () {
        for (let pinName in this.pinList) {
            this.unexportPin(this.pinList[pinName].pin);
        }
    },

    executeSet: function (cmd) {
        cmd = 'echo ' + cmd;
        console.log('in executeSet');
        console.log(cmd);

        child.execSync(cmd);
    },

    executeGet: function (cmd) {
        cmd = 'cat ' + cmd;
        console.log('in executeGet');
        console.log(cmd);

        const buffer = child.execSync(cmd);
        console.log('buffer', buffer.toJSON);
        return '* NEED TO GET VALUE *';
    },

    getState: function () {
        let state = {};
        Object.keys(this.pinList).map(function (pinName) {
            state[pinName] = this.getValue(this.pinList[pinName].pin);
        }.bind(this));
        return state;
    },

    getPinObj: function (pinName) {
        return this.pinList[pinName] || null;
    },

    updateState: function (message) {
        const state = message.state;

        // @todo - should not update this.value until 'desired' has been processed
        // @todo - AFTER updating state THEN 'report' new state
        // @todo - for unsupported properties, report the value as set. (Store values.) This will remove from 'delta'
        Object.assign(this.value, state);

        console.log('VAL', this.value);

        const json = JSON.stringify(message, null, 4);
        console.log('UPDATE: ', json);

        Object.keys(state).map(function (pinName) {
            const pinObj = this.getPinObj(pinName);
            const value = state[pinName];
            console.log('po', pinObj, value);

            if (pinObj && this.isValidOutput(pinObj.type, value)) {
                console.log('good po');
                this.setValue(pinObj.pin, value);
                console.log('UPDATE PIN:', pinName, pinObj);

            } else {
                this.writeOutput('INVALID:', pinName);
            }


        }.bind(this));

    },

    writeOutput: function (arg) {
        console.log('\nDRIVER OUT: ', arg);
    },

    loopForStateChange: function () {

    }

};

module.exports = ChipPinDev;
