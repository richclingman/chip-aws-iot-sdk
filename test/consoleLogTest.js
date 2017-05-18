'use strict';

const expect = require("chai").expect;
const sinon = require('sinon');

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

        const expected = JSON.stringify(message, null, 4);
        consoleLog.update(message);

        const result = console.log.args[0][0];

        expect(result).to.equal(expected);
    });


});
