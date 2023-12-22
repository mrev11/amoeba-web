
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


******************************************************************************
function label_bestline(x)
    label_fdbestline(fd(),x)

function label_fdbestline(fd,x)
    if( infolevel()>0 )
        x::=strtran("color='","style='color:")
        fd:put("bestline","Best line: <b>"+x+"</b>")
        fd:update
    end

******************************************************************************
function label_state(fd,flag)
    if( flag )
        fd:put("statfig",svgcircle("green"))
        fd:put("statlab","Ready")
    else
        fd:put("statfig",svgcircle("red"))
        fd:put("statlab","Thinking")
    end
    fd:update


******************************************************************************
function label_move(fd)
local m:=movecount()
local x:=topcell()

    if( x==NIL )
        fd:put("lastmove","Last move: <b>"+m::str::alltrim+"</b>")
    else
        x:=rc(x)
        fd:put("lastmove","Last move: <b>"+m::str::alltrim+":"+x+"</b>")
    end


******************************************************************************
function label_turn(fd)
local m:=movecount()
    if( (m%2)==0 )
        fd:put("turnfig",svgcircle("black"))
    else
        fd:put("turnfig",svgcircle("white"))
    end
    fd:update


******************************************************************************
function label_rate(x)
    label_fdrate(fd(),x)


function label_fdrate(fd,x)
static rating
local mc1:=movecount()+1

    if( x==NIL )
        x:=rating[mc1]
        if( x==NIL )
            x:="n.a."
        else
            x::=str::alltrim
        end

    elseif( valtype(x)=="A" )
        rating:=x
        x:="0"

    else
        rating[mc1]:=x
        x::=str::alltrim
    end

    fd:put("rating","Rating: "+"<b>"+x+"</b>")


******************************************************************************
