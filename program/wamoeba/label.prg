
/*
 *  CCC - The Clipper to C++ Compiler
 *  Copyright (C) 2005 ComFirm BT.
 *
 *  This library is free software; you can redistribute it and/or
 *  modify it under the terms of the GNU Lesser General Public
 *  License as published by the Free Software Foundation; either
 *  version 2 of the License, or (at your option) any later version.
 *
 *  This library is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 *  Lesser General Public License for more details.
 *
 *  You should have received a copy of the GNU Lesser General Public
 *  License along with this library; if not, write to the Free Software
 *  Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
 */


#include "amoeba.ch"
#include "pvalue.h"

******************************************************************************
function label_bestline(x)
local fd:=fd(),v

    if( infolevel()<=0 )
        x:=""

    elseif( time_limit_reached() )
        x:="<span color='#d00000'><b>time limit overrun ("+time_limit()::str::alltrim+"sec)</b></span>"

    elseif( x==NIL )
        if( !empty(v:=recalc_string()) )
            v::=val
        elseif( !empty(v:=rating_string()) )
            v::=val
        else
            v:=0
        end
        if( !empty(x:=bestline_array())  )
            x:=bestline_format(x,v,if(turn_x(),1,0))
        else
            x:=""
        end
    end

    x::=strtran("color='","style='color:")

    x+="<span style='color:#b8b8b8'><big><big>|</big></big></span>"
    fd:put("bestline","Best line: "+x)
    fd:update

******************************************************************************
function label_state(flag)
local fd:=fd()
    if( flag )
        fd:put("statfig",svgcircle("green"))
        fd:put("statlab","Ready")
    else
        fd:put("statfig",svgcircle("red"))
        fd:put("statlab","Think")
    end
    fd:update


******************************************************************************
function label_move()
local fd:=fd()
local m:=movecount()
local x:=topcell()

    if( x==NIL )
        fd:put("lastmove","Last move: <big>"+m::str::alltrim+"</big>")
    else
        x:=pos2rcx(x,.t.)
        fd:put("lastmove","Last move: <big>"+m::str::alltrim+":"+x+"</big>")
    end


******************************************************************************
function label_turn()
local fd:=fd()
local m:=movecount()
    if( (m%2)==0 )
        fd:put("turnfig",svgcircle("black"))
    else
        fd:put("turnfig",svgcircle("white"))
    end
    fd:update


******************************************************************************
function label_rate(x)
local rating:=rating_string()
local recalc:=recalc_string()
    if( !empty(recalc) )
        if( abs(val(recalc))>PVALUE_INFIN-100 )
            //recalc:="<span style='color:red'>"+recalc+"</span>"
            recalc:="<span style='color:#d00000'>"+recalc+"</span>"
        else
            recalc:="<span style='color:green'>"+recalc+"</span>"
        end
    end

    fd():put("rating","Rating: <big>"+rating+" "+recalc+"</big>")


******************************************************************************
