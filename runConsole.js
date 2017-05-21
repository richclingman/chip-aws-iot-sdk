'use strict';

const shadowRunner = require('./runShadowDevice');

const driverClass = require('./driver/consoleLog');
shadowRunner.driver = new driverClass();

console.log('dr', shadowRunner.driver);

shadowRunner.run('ConsoleDevice');
