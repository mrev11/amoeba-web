
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
#include "tabsize.ch"

******************************************************************************************
function main(sessionid,sckstr,*)

local msg,data

    printlog()
    ? {*}
    webapp.demo.defaults()

    webapp.uploaddisplay(table_canvas())
    webapp.script(table_script())

    // init
    fd(data:=webapp.formdataNew())
    label_bestline("")
    label_state(.t.)
    label_move()
    label_turn()
    label_rate(array(576))
    data:put("info",.t.)
    data:update

    // message loop
    while( NIL!=(msg:=webapp.getmessage(@data)) )
        if( "formdata."$msg )
            //data:list
            fd(data)

            if( data:source=="table" )
                cb_table(data)
            elseif( data:source=="move" )
                cb_move(data)
            elseif( data:source=="back" )
                cb_back(data)
            elseif( data:source=="forw" )
                cb_forw(data)
            elseif( data:source=="info" )
                cb_info(data)
            elseif( data:source=="recalc" )
                cb_recalc(data)
            elseif( data:source=="power" )
                cb_power(data)
            elseif( data:source=="new" )
                cb_new(data)
            end

            data:update
        end
    end 


******************************************************************************************
static function cb_table(fd)

local x:=fd["coord_x"]::val
local y:=fd["coord_y"]::val
local cx

    if( movecount()==0 )
        ? "RANDOMIZE",y,x
        cell_randomize(y,x)
    end
    
    if( !game_over() )
        //label_bestline("")
        if( topcell()!=NIL )
            drawcell(topcell()) // -> normal shape
        end
        cx:=y*TABLESIZE+x
        forw(cx)
        drawtop()
        markmovecount()
        label_move()
        label_turn()
        if( winner()==32 )
            cb_move(fd)
        end
    end


******************************************************************************************
static function cb_move(fd)
    if( !game_over() )
        label_state(.f.)
        if( topcell()!=NIL )
            drawcell(topcell()) // -> normal shape
        end
        go_move()
        label_state(.t.)
        markmovecount()
        label_move()
        label_turn()
    end


******************************************************************************************
static function cb_back(fd)
local cx:=topcell()
    if( cx!=NIL )
        c_cb_back()
        drawcell(cx)
        drawtop()
    end
    label_move()
    label_turn()
    label_rate()


******************************************************************************************
static function cb_forw(fd)
local cx:=topcell()
    c_cb_forward()
    if( cx!=NIL )
        drawcell(cx)
    end
    drawtop()

    label_move()
    label_turn()
    label_rate()


******************************************************************************************
static function cb_info(fd)
local info:=fd["info"]=="true"
    if( !info )
        label_bestline("")
    end
    infolevel( info )

******************************************************************************************
static function cb_recalc(fd)
    label_state(.f.)
    go_recalc()
    label_state(.t.)


******************************************************************************************
static function cb_power(fd)
    setpower( val(fd["power"]) )


******************************************************************************************
static function cb_new(fd)
    c_cb_new()
    drawall()
    label_bestline("")
    label_move()
    label_rate(array(576))


******************************************************************************************
