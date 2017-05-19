'use strict';

const approvals = require('approvals').mocha();

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

    beforeEach(function () {
        chipProDev = require('../driver/chipProDev');
    });

    describe('init', function () {
        it('should initialize ports', function () {
            let execute = sinon.stub(chipProDev, 'execute');

            chipProDev.init();

            this.verifyAsJSON(execute.args);
        });
    });


});
