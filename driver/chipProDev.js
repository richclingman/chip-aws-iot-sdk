'use strict';

/**
 * Provide an interface to C.H.I.P. Pro Dev Kit I/O
 * https://docs.getchip.com/chip_pro_devkit.html#gpio
 *
 * sudo sh -c 'echo 132 > /sys/class/gpio/export'
 *
 *
 */


// *** SERIOUS SECURITY RISK ***
// SHOULD NOT ALLOW BUILDING A SHELL COMMAND WITH UNTESTED VALUES


function exportPin(pin) {


    const cmd = "sudo sh -c 'echo " + pin + " > /sys/class/gpio/export";
    console.log(cmd);
}

function unexportPin(pin) {
    const cmd = 'echo 132 > /sys/class/gpio/unexport'
}

function setPinDirection(pin, direction) {
    const cmd = 'echo ' + direction + ' > /sys/class/gpio/gpio' + pin + '/direction';
}





module.exports = {
    init: function() {
        const leds = [132, 133, 134, 135, 136, 137, 138, 139];
        leds.map(function(led) {
            exportPin(led);
            setPinDirection(led, 'out');
        });
    }
};
