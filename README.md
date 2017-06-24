# chip-aws-iot-sdk
Running AWS IoT SDK on Next Thing Co's C.H.I.P. 
https://getchip.com/

# This is still very preliminary notes and code

## Use PuTTY or other tool to connect to chip
Windows: Look at device manager to find the COM port

# Documentation/References
Standard CHIP:
https://docs.getchip.com/chip.html

CHIP Pro Development Kit:
https://docs.getchip.com/chip_pro_devkit.html

AWS IoT Setup (You'll need to have an AWS account):
http://docs.aws.amazon.com/iot/latest/developerguide/iot-sdk-setup.html

Using AWS IoT SDK for JavaScript
http://docs.aws.amazon.com/iot/latest/developerguide/iot-device-sdk-node.html

# Set Up
The following steps set up the CHIP to run the AWS IoT SDK examples.

## Flash
If you've not already put the Debian operating system on your CHIP,
follow the process found on
http://flash.getchip.com/

* Power down your CHIP
* Restart the CHIP in FEL mode.
    * For the standard CHIP: Install a jumper 
    * For CHIP Pro, hold the tiny FEL button while powering on

## Turn on/off LED0

    sudo su
    echo 132 >/sys/class/gpio/export
    echo out >/sys/class/gpio/gpio132/direction
    echo 1 >/sys/class/gpio/gpio132/value

    echo 0 >/sys/class/gpio/gpio132/value
    echo 132 >/sys/class/gpio/unexport
    exit
    
## Turn off PWM1

    sudo su
    echo 1 > /sys/class/pwm/pwmchip0/export
    echo 0 > /sys/class/pwm/pwmchip0/pwm1/enable
    echo normal > /sys/class/pwm/pwmchip0/pwm1/polarity
    exit
    
## Flash PWM0

    sudo su
    echo 0 > /sys/class/pwm/pwmchip0/export
    echo 0 > /sys/class/pwm/pwmchip0/pwm0/enable
    echo "normal" > /sys/class/pwm/pwmchip0/pwm0/polarity
    echo 500000000 > /sys/class/pwm/pwmchip0/pwm0/period
    echo 1 > /sys/class/pwm/pwmchip0/pwm0/enable
    echo 100000000 > /sys/class/pwm/pwmchip0/pwm0/duty_cycle
   
    echo 250000000 > /sys/class/pwm/pwmchip0/pwm0/duty_cycle

    echo 0 > /sys/class/pwm/pwmchip0/pwm0/duty_cycle
    echo 0 > /sys/class/pwm/pwmchip0/pwm0/enable
    echo 0 > /sys/class/pwm/pwmchip0/unexport
    exit

## Connect to WiFi

* In this code, modify set-alias.sh with WiFi SSID and Password



## Install OS Requirements

    sudo apt-get update

    sudo apt-get install aptitude
    sudo aptitude full-upgrade # if want to ensure OS is current

    sudo aptitude install git
    sudo aptitude install nano

    curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
    sudo aptitude install -y nodejs

* //sudo aptitude install dos2unix
* //sudo aptitude install build-essential
* //sudo aptitude install man
* //sudo aptitude install dig
* //sudo aptitude install dnsutils
* //sudo aptitude install openssh-server
* //sudo aptitude install net-tools
* //sudo aptitude install iptables

* //To set antenna connector (does not seem to work): In browser, get 
* //https://raw.githubusercontent.com/NextThingCo/CHIP-buildroot/34a8cfdab2bbecd6741c435d6c400e46848436f1/package/rtl8723ds_mp_driver/set_antenna

## See how much disk space remains

    df -h
    
## Free up disk space

    apt-get clean

## Clone the git repository

    git clone https://github.com/richclingman/chip-aws-iot-sdk.git

## Install Package Requirements

    cd chip-aws-iot-sdk
    npm install
    
## Verify Installed Okay

    npm test

## Install IoT Certificates

    SORRY - TO BE ADDED
    * document config.json
    * document cert creation on AWS
    * document adding certs to device & console
    
## Run Device Example
This the AWS Device Shadow example in two background processes

    npm run devices
    * watch messages in AWS Console
    
#### Kill device processes

    ps
    * Note the "node" PIDs (number in first column)
    kill [first node PID]
    * eg: kill 32421
    kill [second node PID]

## Run chip code

    npm run chip
    
## Run console code

    // on another computer with this code
    npm run console

# Alias Commands
You can add commands to your CHIP shell by running the set-alias.sh command

    . set-alias.sh



# Research/Dev Notes

GetChip
https://getchip.com/
https://docs.getchip.com/chip_pro_devkit.html

AWS IoT SDK
http://docs.aws.amazon.com/iot/latest/developerguide/iot-sdk-setup.html
http://docs.aws.amazon.com/iot/latest/developerguide/iot-device-sdk-node.html 
https://github.com/aws/aws-iot-device-sdk-js

SSH Research
http://www.configserverfirewall.com/debian-linux/install-debian-ssh-server-openssh/
http://www.linuxquestions.org/questions/linux-newbie-8/can't-ssh-putty-into-debian-server-596152/

sudo apt-get update
sudo apt-get install -y dnsutils

## get my public ip
curl http://ipecho.net/plain

