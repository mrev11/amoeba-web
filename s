#!/bin/bash
rm  -f log-webapp*

export PATH=`pwd`/program:$PATH

export AMOEBA_TABLESIZE=12
export AMOEBA_CELLSIZE=56
export AMOEBA_POWER=0+

webapp.exe  #1>/dev/null 

