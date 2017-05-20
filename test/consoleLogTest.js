'use strict';

const sinon = require('sinon');

const approvals = require('approvals').mocha('./test/approvals');

const approvalsConfig = {
    failOnLineEndingDifferences: false,
    errorOnStaleApprovedFiles: false,
    normalizeLineEndingsTo: '\r\n',
    appendEOL: true
};
approvals.configure(approvalsConfig);

describe('consoleLog', function () {
    let consoleLogDriver;

    beforeEach(function () {
        const consoleLogDriverClass = require('../driver/consoleLog');
        consoleLogDriver = new consoleLogDriverClass();
        sinon.stub(consoleLogDriver, 'writeOutput');
    });

    afterEach(function () {
        consoleLogDriver.writeOutput.restore();
    });

    describe('init', function () {
        it('should output to console', function () {
            consoleLogDriver.init();

            const result = consoleLogDriver.writeOutput.args[0][0];
            this.verify(result);
        });
    });

    describe('updateState', function () {
        it('should merge deltas and write json to console', function () {

            const messages = [
                {
                    state: {
                        desired: {
                            firstAttribute: 1,
                            secondAttribute: 2
                        },
                        reported: null
                    }
                },
                {
                    state: {
                        desired: {
                            attribute3: 3,
                            attribute4: 4,
                            attribute5: 5,
                            attribute6: 6,
                            attribute7: 7
                        },
                        reported: null
                    }
                },
                {
                    state: {
                        desired: {
                            attribute4: null,
                            attribute5: null
                        },
                        reported: null
                    }
                },
            ];

            messages.map(function (message) {
                consoleLogDriver.updateState(message);
            });

            const result = consoleLogDriver.writeOutput.args;
            this.verifyAsJSON(result);
        });

    });

    describe('get', function () {
        it('should return values from current state', function () {
            const message = {
                state: {
                    desired: {
                        firstAttribute: 11,
                        secondAttribute: 22,
                        attribute3: 33,
                        attribute4: 44,
                        attribute5: 55,
                        attribute6: 66,
                        attribute7: 77
                    },
                    reported: null
                }
            };

            consoleLogDriver.updateState(message);

            const result = consoleLogDriver.get();

            this.verifyAsJSON(result);
        });

    });


});
