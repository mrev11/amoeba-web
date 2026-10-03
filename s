#!/bin/bash
# ez a script service-kent is es 
# parancssorbol is elinditja webapp-ot

HERE=${0%/*}
cd $HERE
. ~/bashrcx

export PATH=$(pwd)/program:$PATH

export AMOEBA_BLINK=1
export AMOEBA_POWER=auto.8+
export AMOEBA_TIME_LIMIT=300

webapp.exe | tee log-amoeba


