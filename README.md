# chip-aws-iot-sdk
Running AWS IoT SDK on Next Thing Co's C.H.I.P. 
https://getchip.com/


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

## Install OS Requirements

* sudo apt-get update
* sudo apt-get install nano
* sudo apt-get install dig
* sudo apt-get install dnsutils
* sudo apt-get install openssh-server
* sudo apt-get install net-tools
* sudo apt-get install iptables
* sudo apt-get install dos2unix
* sudo apt-get install man
* sudo apt-get install nodejs
* sudo apt-get install nvm

* In browser, get 
https://raw.githubusercontent.com/NextThingCo/CHIP-buildroot/34a8cfdab2bbecd6741c435d6c400e46848436f1/package/rtl8723ds_mp_driver/set_antenna

## Install Package Requirements

    npm install
    
## Verify Installed Okay

    npm test
    
## Run Device Example

    npm run devices

## Run Thing Example


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

