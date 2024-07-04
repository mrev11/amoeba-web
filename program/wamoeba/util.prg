
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
function fd(data)
static fd
    if( data!=NIL )
        fd:=data
    end
    return fd


******************************************************************************
function game_over()
    if( winner()==asc('X') )
        animate()
        webapp.alert('<span style="font-size:20px">Game over, black won!</span>')
    elseif( winner()==asc('O') )
        animate()
        webapp.alert('<span style="font-size:20px">Game over, white won!</span>')
    elseif( movecount()>=ROWCOL )
        webapp.alert("Table is full, draw!")
    else
        return .f.     
    end
    hit_depth_histogram()
    total_nodes() // print statistics
    return .t.



******************************************************************************
static function animate()
local wp,n,i
    wp:=winpattern()
    if( wp!=NIL )
        asort(wp)

        for n:=1 to 3
            for i:=1 to 5
                drawcell( wp[i], if(figure(topcell())==asc("X"),5,6) )
                sleep(100)
                drawcell(wp[i])
            next
        next
        sleep(200)

        for n:=1 to 3
            webapp.script("XCODE.draw_normal()")
            for i:=1 to len(wp)
                drawcell(wp[i],0)
            next
            webapp.script("XCODE.draw_small()")
            for i:=1 to len(wp)
                drawcell(wp[i])
            next
            sleep(300)
            webapp.script("XCODE.draw_normal()")
            for i:=1 to len(wp)
                drawcell(wp[i])
            next
            sleep(200)
        next

        drawtop()
    end


******************************************************************************

