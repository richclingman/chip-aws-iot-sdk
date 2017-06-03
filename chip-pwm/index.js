'use strict';

const os = require("os");
const fs = require('fs');
const Epoll = require('epoll').Epoll;

const PWM_ROOT = '/sys/class/pwm/pwmchip0/pwm';

// constructor
// export & init pwm pin
// -- no watch ?? (output only)
// unexport
// set period
// set duty cycle
// set polarity
// init as servo (50hz period, positive polarity)
// set servo angle 0 == centered is 1,000ns duty cycle
// set servo increment (angle * increment is nanosecond offset from 1,000ns center)

// fn this.initAsServo(period = 50hz, centered = 1,000ns, increment = 10ns)
// fn this.setServoAngle(degrees)
