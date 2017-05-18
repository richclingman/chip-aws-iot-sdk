'use strict';

const sinon = require('sinon');

require('approvals').mocha();

const consoleLog = require('../driver/consoleLog');

describe.only('consoleLog', function () {

    beforeEach(function () {
        sinon.spy(console, 'log');
    });


    it('should write the input as json', function () {

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

        consoleLog.update(message);

        const result = console.log.args[0][0];
        this.verify(result);
    });


});
