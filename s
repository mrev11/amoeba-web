#!/bin/bash
rm  -f log-webapp*


export AMOEBA_TABLESIZE=12
export AMOEBA_CELLSIZE=56
export PATH=`pwd`/program:$PATH

webapp.exe  #1>/dev/null 

