'use strict';

const shadowRunner = require('./runShadowDevice');

const driverClass = require('./driver/chipProDev');
shadowRunner.driver = new driverClass();

console.log('dr', shadowRunner.driver);

shadowRunner.run('ChipDevice');
