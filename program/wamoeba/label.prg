
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

******************************************************************************
function label_bestline(x)
local fd:=fd()
    if( infolevel()>0 )
        x::=strtran("color='","style='color:")
        fd:put("bestline","Best line: "+x)
        fd:update
    end

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
        fd:put("lastmove","Last move: <b>"+m::str::alltrim+"</b>")
    else
        x:=pos2rc(x)
        fd:put("lastmove","Last move: <b>"+m::str::alltrim+":"+x+"</b>")
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
local recalc:=recalc_string(),r
    if( !empty(recalc) )
        r:=recalc_load()[1]
        if( abs(r)>PVALUE_INFIN-100 )
            recalc:="<span style='color:red'>"+recalc+"</span>"
        else
            recalc:="<span style='color:green'>"+recalc+"</span>"
        end
    end

    fd():put("rating","Rating: <b>"+rating+recalc+"</b>")


******************************************************************************
