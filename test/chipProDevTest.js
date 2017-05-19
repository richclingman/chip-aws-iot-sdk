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

describe.only('chipProDev', function () {
    let chipProDev;
    let execute;

    beforeEach(function () {
        chipProDev = require('../driver/chipProDev');
        execute = sinon.stub(chipProDev, 'execute');
    });

    afterEach(function () {
        execute.restore();
    });

    describe('init', function () {
        it('should initialize ports', function () {
            chipProDev.init();

            this.verifyAsJSON(execute.args);
        });
    });

    describe('teardown', function () {
        it('should unexport all ports', function () {
            chipProDev.teardown();

            this.verifyAsJSON(execute.args);
        });

    });


    describe('getPinList', function () {
        it('should return name to pin list', function () {
            const pinList = chipProDev.getPinList();

            this.verifyAsJSON(pinList);
        });

    });


});
