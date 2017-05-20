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


});
