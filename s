#!/bin/bash
rm  -f log-webapp*

export PATH=`pwd`/program:$PATH

# teszteleshez  : export AMOEBA_CONTINUOUS_PLAY=1
# hatastalan    : export AMOEBA_CELLSIZE=32
# lehetseges    : export AMOEBA_TABLESIZE=14

export AMOEBA_POWER=0+
#export AMOEBA_POWER_BLACK=3+
#export AMOEBA_POWER_WHITE=3+

webapp.exe   | tee log-amoeba


