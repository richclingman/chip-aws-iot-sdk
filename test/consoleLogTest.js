'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const mockery = require('mockery');

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
    let promptMock;
    let promptCallback;

    beforeEach(function () {
        promptMock = {
            start: sinon.stub(),
            get: function (config, callback) {
                promptCallback = callback;
            }
        };

        mockery.enable({
            warnOnUnregistered: false
        });
        mockery.registerMock('prompt', promptMock);

        const consoleLogDriverClass = require('../driver/consoleLog');
        consoleLogDriver = new consoleLogDriverClass();

        sinon.stub(consoleLogDriver, 'writeOutput');
    });

    afterEach(function () {
        consoleLogDriver.writeOutput.restore();

        mockery.deregisterAll();
        mockery.disable()
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
                        firstAttribute: 1,
                        secondAttribute: 2
                    }
                },
                {
                    state: {
                        attribute3: 3,
                        attribute4: 4,
                        attribute5: 5,
                        attribute6: 6,
                        attribute7: 7
                    }
                },
                {
                    state: {
                        attribute4: null,
                        attribute5: null
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
                    firstAttribute: 11,
                    secondAttribute: 22,
                    attribute3: 33,
                    attribute4: 44,
                    attribute5: 55,
                    attribute6: 66,
                    attribute7: 77
                }
            };

            consoleLogDriver.updateState(message);

            const result = consoleLogDriver.get();

            this.verifyAsJSON(result);
        });

    });

    describe('loopForStateChange', function () {
        it('should require "change" handler', function () {
            let handlerIsRequired = false;

            try {
                consoleLogDriver.loopForStateChange();
            } catch (e) {
                handlerIsRequired = true;
            }

            expect(handlerIsRequired).to.be.true;
        });

        it('should pass through various inputs', function () {
            const changeHandler = sinon.stub();
            const exitHandler = sinon.stub();

            consoleLogDriver.on('change', changeHandler);
            consoleLogDriver.on('exit', exitHandler);

            consoleLogDriver.loopForStateChange();

            [
                'D0:0',
                'D0:1',
                'D1:0',
                'D2:1',
                'D5:1',
                'D7:1',
                'exit'
            ].map(function (change) {
                promptCallback(null, {State: change});
            });

            this.verifyAsJSON([
                changeHandler.args,
                exitHandler.args
            ]);
        });

    });


});
