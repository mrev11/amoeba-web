

function keypress()

local code:=<<CODE>>
XCODE.keydn=function(e)
{
    //console.log("<keydown>"+e.key+"</keydown>")

    if( e.key=="Shift" );
    else if( e.key=="ArrowLeft" );
    else if( e.key=="ArrowRight" );
    else
        return

    e.preventDefault()
    XCODE.send("<keydown>"+e.key+"</keydown>")
}
XCODE.keyup=function(e)
{
    //console.log("<keyup>"+e.key+"</keyup>")

    if( e.key=="Shift" );
    else
        return

    e.preventDefault()
    XCODE.send("<keyup>"+e.key+"</keyup>")
}

document.onkeydown=XCODE.keydn;
document.onkeyup=XCODE.keyup;
<<CODE>>

    return code

