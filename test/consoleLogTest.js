'use strict';

const sinon = require('sinon');

require('approvals').mocha('./test/approvals');

describe('consoleLog', function () {
    let consoleLogDriver;

    beforeEach(function () {
        consoleLogDriver = require('../driver/consoleLog');
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

    describe('update', function () {
        it('should write json to console', function () {

            const message = {
                state: {
                    reported: {
                        firstAttribute: 1,
                        secondAttribute: 2,
                        attribute3: 3,
                        attribute4: 4,
                        attribute5: 5,
                        attribute6: 6,
                        attribute7: 7
                    },
                    desired: null
                }
            };

            consoleLogDriver.update(message);

            const result = consoleLogDriver.writeOutput.args[0][0];
            this.verify(result);
        });

    });

    describe('get', function () {
        it('should return values from update', function () {
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

            consoleLogDriver.update(message);

            const result = consoleLogDriver.get();

            this.verifyAsJSON(result);
        });

    });


});
