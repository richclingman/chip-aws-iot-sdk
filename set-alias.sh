# alias ll="ls -l"
# alias l.="ls -la"

alias wifilist="nmcli device wifi list"
alias wificonnect="sudo nmcli device wifi connect WIFI-SSID password WIFI-PASSWORD ifname wlan0"
alias wifistatus="nmcli device status"

# these ports must be opened first...

alias pwm0off="echo 50000 > /sys/class/pwm/pwmchip0/pwm0/period"
alias pwm0dim="echo 1100 > /sys/class/pwm/pwmchip0/pwm0/period"
alias pwm0half="echo 200 > /sys/class/pwm/pwmchip0/pwm0/period"
alias pwm0full="echo 100 > /sys/class/pwm/pwmchip0/pwm0/period"

alias pwm1off="echo 50000 > /sys/class/pwm/pwmchip0/pwm1/period"
alias pwm1dim="echo 1100 > /sys/class/pwm/pwmchip0/pwm1/period"
alias pwm1half="echo 200 > /sys/class/pwm/pwmchip0/pwm1/period"
alias pwm1full="echo 100 > /sys/class/pwm/pwmchip0/pwm1/period"

setled() {
  echo $1 > /sys/class/gpio/gpio$2/value
}

# this is how to open and use a port -- LED0
alias led0setup="sudo sh -c 'echo 132 > /sys/class/gpio/export; echo out > /sys/class/gpio/gpio132/direction'"
alias led0on="sudo sh -c 'echo 1 > /sys/class/gpio/gpio132/value'"
alias led0off="sudo sh -c 'echo 0 > /sys/class/gpio/gpio132/value'"

