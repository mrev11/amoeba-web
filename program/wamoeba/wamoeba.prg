
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



static bestnavig:=.f.
static beststack:={}
static bestline:=NIL
static bestvalue:=NIL
static bestturn:=NIL
static besttop:=NIL

******************************************************************************************
function main(sessionid,sckstr,*)

local msg,data,power,xb,xp,cx

    //printlog()
    ? {*}
    webapp.demo.defaults()

    //tablesize(12)
    cellsize(48)
    cell_classinit()

    setpower(opt_power(parse_power()))
    power:=width()
    power::=any2str[2..len(power)-1] // listbox text
    setwidth()

    webapp.uploaddisplay(table_canvas())
    webapp.script(table_script())
    webapp.script(keypress())

    // init
    fd(data:=webapp.formdataNew())
    label_bestline("")
    label_state(.t.)
    label_move()
    label_turn()
    label_rate(array(576))
    data:put("info",.t.)
    data:put("power",power)
    //data:list
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
            elseif( data:source=="demo" )
                cb_demo(data)
            end
            data:update

        elseif( msg=="keyup" )
            if( data:gettext=="Shift" )
                bestnavig:=.f.
                if( !empty(bestline) )
                    webapp.script("XCODE.draw_normal()")
                    while( len(beststack)>0 )
                        xb:=back()
                        xp:=apop(beststack)
                        if( xp!=xb )
                            break( "bestline pop all error" )
                        end
                        drawcell(xb)
                    end
                    forw(besttop)
                    drawtop()
                    label_bestline( bestline_format(bestline,bestvalue,bestturn,NIL) )
                    bestline:=NIL
                    bestvalue:=NIL
                    bestturn:=NIL
                    besttop:=NIL
                    cell_restore()
                end
            end

        elseif( msg=="keydown" )
            if( data:gettext=="Shift" )
                bestnavig:=.t.
                if( !empty(bestline:=bestline_array()[..]) )
                    cell_save()
                    bestvalue:=recalc_value()|rating_value()
                    bestturn:=if(turn_x(),1,0)
                    besttop:=topcell()
                    xb:=back()
                    drawcell(xb)
                    webapp.script("XCODE.draw_small()")
                    forw(bestline[1])
                    drawtop()
                    beststack::apush( bestline[1] )
                    label_bestline( bestline_format(bestline,bestvalue,bestturn,1) )
                end

            elseif( data:gettext=="ArrowRight" )
                webapp.focus("table")
                if( !bestnavig )
                    cb_forw() // mint korabban
                else
                    cb_bestright()
                end

            elseif( data:gettext=="ArrowLeft" )
                webapp.focus("table")
                if( !bestnavig )
                    cb_back() // mint korabban
                else
                    cb_bestleft()
                end
            end

        end
    end


******************************************************************************************
static function cb_bestright()
      if( len(beststack)+1<=len(bestline) )
        drawcell(topcell())
        if( !forw(bestline[len(beststack)+1]) )
            break("bestline push error")
        end
        drawtop()
        beststack::apush( bestline[len(beststack)+1] )
        label_bestline( bestline_format(bestline,bestvalue,bestturn,len(beststack)) )
    end


******************************************************************************************
static function cb_bestleft()
local xb,xp
    if( len(beststack)>1  )
        xb:=back()
        xp:=apop(beststack)
        if( xp!=xb )
            break( "bestline pop error" )
        end
        drawcell(xb)
        drawtop()
        label_bestline( bestline_format(bestline,bestvalue,bestturn,len(beststack)) )
    end

******************************************************************************************
static function cb_table(fd)

local x:=fd["coord_x"]::val
local y:=fd["coord_y"]::val
local cx

    if(bestnavig)
        return NIL
    end

    cx:=y*TABLESIZE+x
    if( !game_over() .and. figure(cx)==32  )
        if( topcell()!=NIL )
            drawcell(topcell()) // -> normal shape
        end
        forw(cx)
        markmovecount()
        rating_store() //delete
        recalc_store() //delete
        drawtop()
        label_move()
        label_turn()
        label_rate()
        bestline_store({})
        if( winner()==32 )
            cb_move(fd)
        end
    end


******************************************************************************************
static function cb_move(fd)
local cp:=.t.

    if(bestnavig)
        return NIL
    end

    while( !game_over() .and. cp )

        if( movecount()==0 )
            cell_randomize()
        elseif( movecount()==1 )
            cell_randomize(topcell())
        end

        label_state(.f.)
        if( topcell()!=NIL )
            //drawcell(topcell()) // -> normal shape
        end
        go_move()
        label_state(.t.)
        markmovecount()
        label_move()
        label_turn()

        cp:=0<val( getenv("AMOEBA_CONTINUOUS_PLAY") )
    end


******************************************************************************************
static function cb_back(fd)
local cx:=topcell()

    if(bestnavig)
        cb_bestleft()
        return NIL
    end

    if( cx!=NIL )
        c_cb_back()
        drawcell(cx)
        drawtop()
    end
    label_move()
    label_turn()
    label_rate()
    label_bestline()


******************************************************************************************
static function cb_forw(fd)
local cx:=topcell()

    if(bestnavig)
        cb_bestright()
        return NIL
    end

    c_cb_forward()
    if( cx!=NIL )
        drawcell(cx)
    end
    drawtop()

    label_move()
    label_turn()
    label_rate()
    label_bestline()


******************************************************************************************
static function cb_info(fd)
local info:=fd["info"]=="true"
    infolevel( info )
    label_bestline()


******************************************************************************************
static function cb_recalc(fd)

    if(bestnavig)
        return NIL
    end

    label_state(.f.)
    go_recalc()
    label_state(.t.)
    label_bestline()


******************************************************************************************
static function cb_power(fd)
    setpower( val(fd["power"]) )


******************************************************************************************
static function cb_new(fd)

    if(bestnavig)
        return NIL
    end

    c_cb_new()
    drawall()
    label_bestline("")
    label_move()
    label_rate(array(576))


******************************************************************************************
static function cb_demo(fd)

local top,msg,data

    if(bestnavig)
        return NIL
    end

    if( !game_over() )
        webapp.setattrib("demo","value","Stop")
    end

    while( !game_over() )

        if( movecount()==0 )
            cell_randomize()
        elseif( movecount()==1 )
            cell_randomize(topcell())
        end

        label_state(.f.)
        go_move()
        label_state(.t.)
        markmovecount()
        label_move()
        label_turn()

        msg:=webapp.getmessage(@data,100)
        if( msg==NIL )
            quit
        elseif( "formdata."$msg )
            if( data:source=="demo" )
                exit // normal mode
            elseif( data:source=="info" )
                cb_info(data)
            elseif( data:source=="power" )
                cb_power(data)
            end
        end
    end

    webapp.setattrib("demo","value","Demo")


******************************************************************************************
