

function keypress()

local code:=<<CODE>>
WEBAPP.keydn=function(e)
{
    //console.log("<keydown>"+e.key+"</keydown>")

    if( e.key=="Shift" );
    else if( e.key=="ArrowLeft" );
    else if( e.key=="ArrowRight" );
    else
        return

    e.preventDefault()
    WEBAPP.send("<keydown>"+e.key+"</keydown>")
}
WEBAPP.keyup=function(e)
{
    //console.log("<keyup>"+e.key+"</keyup>")

    if( e.key=="Shift" );
    else
        return

    e.preventDefault()
    WEBAPP.send("<keyup>"+e.key+"</keyup>")
}

document.onkeydown=WEBAPP.keydn;
document.onkeyup=WEBAPP.keyup;
<<CODE>>

    return code

