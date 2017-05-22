'use strict';

const approvals = require('approvals').mocha('./test/approvals');

const approvalsConfig = {
    failOnLineEndingDifferences: false,
    errorOnStaleApprovedFiles: false,
    normalizeLineEndingsTo: '\r\n',
    appendEOL: true
};
approvals.configure(approvalsConfig);

const sinon = require('sinon');

describe('chipProDev', function () {
    let chipProDev;
    let executeSet;
    let executeGet;

    beforeEach(function () {
        const chipProDevClass = require('../driver/chipProDev');
        chipProDev = new chipProDevClass();
        executeSet = sinon.stub(chipProDev, 'executeSet');
        executeGet = sinon.stub(chipProDev, 'executeGet').returns(0);
    });

    afterEach(function () {
        executeSet.restore();
        executeGet.restore();
    });

    describe('init', function () {
        it('should initialize ports', function () {
            chipProDev.init();

            this.verifyAsJSON(executeSet.args);
        });
    });

    describe('teardown', function () {
        it('should unexport all ports', function () {
            chipProDev.teardown();

            this.verifyAsJSON(executeSet.args);
        });

    });

    describe('getPinList', function () {
        it('should return name to pin list', function () {
            const pinList = chipProDev.getPinList();

            this.verifyAsJSON(pinList);
        });

    });

    describe('getState', function () {
        it('should return current state of each pin', function () {
            const currentState = chipProDev.getState();

            this.verifyAsJSON(currentState);
        });

    });

    describe('isValidOutput', function () {
        it('should reject invalid values', function () {
            const outputValues = [
                {type: "IO", value: 1},
                {type: "IO", value: 0},
                {type: "IO", value: 2},
                {type: "IO", value: "2"},
                {type: "IO", value: "string"},
                {type: "IO", value: null},
            ];

            const result = outputValues.map(function ({type, value}) {
                return {[type]: value, "isValid": chipProDev.isValidOutput(type, value)};
            }.bind(this));

            this.verifyAsJSON(result);
        });

    });

    describe('updateState', function () {
        it('should merge deltas and write json to console', function () {

            const messages = [
                {
                    state: {
                        D0: 1,
                        D1: 0,
                    }
                },
                {
                    state: {
                        D3: 1,
                        D4: 'invalid',
                        PWM0: 123,
                        PWM1: 456
                    }
                },
                {
                    state: {
                        D0: 0,
                        D2: 0,
                        D3: 0,
                        D4: null,
                        PWM0: null,
                    }
                },
            ];

            messages.map(function (message) {
                chipProDev.updateState(message);
            });

            const result = chipProDev.executeSet.args;
            this.verifyAsJSON(result);
        });

    });

    describe('PWM', function () {
        it('should operate all functions', function () {
            let results = [];

            [
                {name: 'exportPwm', params: [[0], [1]]},
                {name: 'unexportPwm', params: [[0], [1]]},
                {name: 'setPwmEnable', params: [[0, 0], [0, 1], [1, 0], [1, 1]]},
                {name: 'setPwmPolarity', params: [[0, 'normal'], [1, 'inversed']]},
                {name: 'setPwmPeriod', params: [[0, 1000000000], [1, 505050]]},
                {name: 'setPwmDutyCycle', params: [[0, 454545], [1, 300000000]]},
            ].map(function (testObj) {
                results.push('- - - - -');
                results.push(JSON.stringify(testObj));

                testObj.params.map(function (params) {
                    executeSet.reset();
                    chipProDev[testObj.name].apply(chipProDev, params);
                    results.push(executeSet.args[0][0]);
                });
            });

            this.verifyAsJSON(results);
        });

    });

});
