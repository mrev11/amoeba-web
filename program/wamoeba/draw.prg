
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


#define FIG_EMPTY   0
#define FIG_X       1
#define FIG_O       2
#define FIG_XA      3
#define FIG_OA      4
#define FIG_XT      5
#define FIG_OT      6


static ascx:=asc("X")
static asco:=asc("O")


******************************************************************************************
function drawcell(cx,fig)

local x,y,code

    if( cx==NIL )
        return NIL
    end

    code:="WEBAPP.draw_circle(xx,yy,fig)"

    if( fig==NIL )
        fig:=figure(cx)
        if( fig==ascx )
            fig:=FIG_X
        elseif( fig==asco )
            fig:=FIG_O
        else
            fig:=FIG_EMPTY
        end
    end

    x:=cx%TABLESIZE
    y:=int(cx/TABLESIZE)

    code::=strtran("xx",x::str::alltrim)    
    code::=strtran("yy",y::str::alltrim)
    code::=strtran("fig",fig::str::alltrim)
    webapp.script(code)



******************************************************************************************
function drawalt()
local top,fig
    top:=topcell()
    if( top==NIL )
        return NIL
    end
    fig:=figure(top)
    if( fig==ascx )
        fig:=FIG_XA
    elseif( fig==asco )
        fig:=FIG_OA
    else
        fig:=FIG_EMPTY
    end
    drawcell(top,fig)


******************************************************************************************
function drawtop()
local top,fig
    top:=topcell()
    if( top==NIL )
        return NIL
    end
    fig:=figure(top)
    if( fig==ascx )
        fig:=FIG_XT
    elseif( fig==asco )
        fig:=FIG_OT
    else
        fig:=FIG_EMPTY
    end
    drawcell(top,fig)


******************************************************************************************
function drawall()
local cx
    for cx:=0 to ROWCOL-1
        drawcell(cx)
    next

******************************************************************************************

