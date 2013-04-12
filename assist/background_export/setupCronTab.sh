#!/bin/bash

(crontab -l; echo "30 15 * * 1-5 $HOME/bin/autoBackup.sh > /dev/null") | crontab -
