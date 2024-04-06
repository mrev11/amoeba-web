
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
        webapp.alert('<span style="font-size:20px">Game over, black won!</span>')
    elseif( winner()==asc('O') )
        webapp.alert('<span style="font-size:20px">Game over, white won!</span>')
    elseif( movecount()>=ROWCOL )
        webapp.alert("Table is full, draw!")
    else
        return .f.     
    end
    //callstack()
    return .t.



******************************************************************************

