

if( String.prototype.includes==undefined )
{
    String.prototype.includes=function(x)
    {
        return this.indexOf(x)>=0;
    }
}

if( String.prototype.startsWith==undefined )
{
    String.prototype.startsWith=function(x)
    {
        return this.indexOf(x)==0;
    }
}

if( String.prototype.endsWith==undefined )
{
    String.prototype.endsWith=function(x)
    {
        return this.lastIndexOf(x)==(this.length-x.length);
    }
}

if( String.prototype.repeat==undefined )
{
    String.prototype.repeat=function(x)
    {
        var r="";
        while(x>0.5)
        {
            r+=this;
            x--;
        } 
        return r;
    }
}


var WEBAPP={};


WEBAPP.xlib={}; //objektumtár
WEBAPP.xlib.isdefined=function(id)
{
    if( WEBAPP.xlib[id]!=undefined  )
    {
        WEBAPP.echo('<isdefined>true</isdefined>');
    }
    else
    {
        WEBAPP.echo('<isdefined>false</isdefined>');
    }
};



//------------------------------------------------------------------------------
WEBAPP.div=function(id,cl) //div-et tartalmazo burkolokat gyart
//------------------------------------------------------------------------------
{
    var x=WEBAPP.document.x.createElement("div");
    if(id!=undefined) x.id=id;
    if(cl!=undefined) x.className=cl;
    return {x:x};
}

//------------------------------------------------------------------------------
WEBAPP.region=function(id)
//------------------------------------------------------------------------------
{
    var reg=WEBAPP.div("region_"+id,"region");    
    reg.scroll=WEBAPP.div("scroll_"+id,"scroll");    
    reg.x.appendChild(reg.scroll.x);

    reg.display=WEBAPP.div("display_"+id,"display"); 
    reg.scroll.x.appendChild(reg.display.x);

    reg.resize=WEBAPP.div("resize_"+id,"resize"); 
    reg.x.appendChild(reg.resize.x);
    
    
    var elem=reg.resize.x;
    elem.active=false;
    elem.start=function(e)
    {
        document.body.style.cursor="row-resize";
        elem.active=true;
        e.preventDefault();
    }
    elem.addEventListener('mousedown',elem.start,false);
    elem.stop=function(e)
    {
        if( elem.active )
        {
            document.body.style.cursor="default";
            elem.active=false;
            e.preventDefault();
        }
    }
    window.addEventListener('mouseup',elem.stop,false);
    elem.move=function(e)
    {
        if( elem.active )
        {
            var par=elem.parentElement;
            par.style.height=String(e.clientY-par.offsetTop+WEBAPP.body.x.scrollTop)+'px';
            e.preventDefault();
        }
    }
    window.addEventListener('mousemove',elem.move,false);

    return reg;
}

//------------------------------------------------------------------------------
WEBAPP.menuicon_clicked=function()
//------------------------------------------------------------------------------
{
    WEBAPP.frmaux.visible(WEBAPP.frmaux.x.style.display=="none");
}

//------------------------------------------------------------------------------
WEBAPP.onload=function(uri)
//------------------------------------------------------------------------------
{
    //burkolo objektumok
    WEBAPP.window={x:window};
    WEBAPP.document={x:window.document};
    WEBAPP.body={x:window.document.body};

    WEBAPP.websckuri=uri;
    WEBAPP.connected=false;
    WEBAPP.privatedata=[]; //array
    WEBAPP.debug=true;

    WEBAPP.websocket = new window.WebSocket(uri);
    WEBAPP.window.x.onkeydown=function(event)
    {
        //a websocket lezáródása ellen
        if( event.which==27 )
        {
            event.preventDefault();
        }
    }
    WEBAPP.websocket.onopen = function(evt) { WEBAPP.onopen(evt) };
    WEBAPP.websocket.onclose = function(evt) { WEBAPP.onclose(evt) };
    WEBAPP.websocket.onmessage = function(evt) { WEBAPP.onmessage(evt) };
    WEBAPP.websocket.onerror = function(evt) { WEBAPP.onerror(evt) };

    WEBAPP.webapp=WEBAPP.region("webapp");
    WEBAPP.body.x.appendChild(WEBAPP.webapp.x);

    WEBAPP.menuicon=WEBAPP.div("menuicon");
    WEBAPP.webapp.scroll.x.insertBefore(WEBAPP.menuicon.x,WEBAPP.webapp.display.x);
    WEBAPP.menuicon.x.appendChild(WEBAPP.document.x.createElement("div"))
    WEBAPP.menuicon.x.appendChild(WEBAPP.document.x.createElement("div"))
    WEBAPP.menuicon.x.appendChild(WEBAPP.document.x.createElement("div"))
    WEBAPP.menuicon.x.accessKey="m";
    WEBAPP.menuicon.x.onclick=function(){WEBAPP.menuicon_clicked()};

    WEBAPP.overlay=WEBAPP.div("overlay");
    WEBAPP.body.x.appendChild(WEBAPP.overlay.x);
    WEBAPP.blind=WEBAPP.div("blind");
    WEBAPP.overlay.x.appendChild(WEBAPP.blind.x);

    WEBAPP.dnloadlink=WEBAPP.document.x.createElement("a");
    WEBAPP.body.x.appendChild(WEBAPP.dnloadlink);
    WEBAPP.dnloadlink.id="dnloadlink";
    WEBAPP.dnloadlink.download="";
    WEBAPP.dnloadlink.target="_blank";
    WEBAPP.dnloadlink.style.display="none";


    WEBAPP.frmaux=WEBAPP.region("frmaux"); 
    WEBAPP.body.x.appendChild(WEBAPP.frmaux.x);
    WEBAPP.frmaux.clear=function(){WEBAPP.frmaux.display.x.innerHTML='';}
    WEBAPP.frmaux.write=function(message){WEBAPP.frmaux.display.x.innerHTML+=message+' ';}
    WEBAPP.frmaux.writeln=function(message)
    {
        var x=WEBAPP.frmaux.display.x.innerHTML;
        var n=24, pos=x.length;
        while( n>0 && (pos=x.lastIndexOf("###",pos-1))>=0 )
        {
            n--;
            if( x.length-pos>100*1024  )
            {
                n=0;
                break;
            }
        }
        if( n==0 && pos>=0 )
        {
            x=x.substring(pos);
        }
        WEBAPP.frmaux.display.x.innerHTML=x+message+' <br/>';
        //az aljára scrolloz
        var scr=WEBAPP.frmaux.scroll.x;
        scr.scrollTop=scr.scrollHeight-scr.clientHeight; 
    }
    WEBAPP.frmaux.visible=function(flag)
    {
        // true-ra debug mode on
        // false-ra debug mode off
        
        if( flag )
        {
            WEBAPP.frmaux.x.style.display="block";
            WEBAPP.webapp.resize.x.style.display="block";
            WEBAPP.webapp.x.style.flex="0 0 auto";
            //WEBAPP.webapp.x.style.height="300px";
            WEBAPP.webapp.x.style.height=(WEBAPP.window.x.innerHeight*0.66+"px")   ;
        }
        else
        {
            WEBAPP.frmaux.x.style.display="none";
            WEBAPP.webapp.resize.x.style.display="none";
            WEBAPP.webapp.x.style.flex="1 0 auto";
            WEBAPP.webapp.x.style.height="initial";
        }
    }

    //ezzel ebred
    WEBAPP.debug=false;
    WEBAPP.frmaux.visible(WEBAPP.debug);
    
    //console.log(WEBAPP);
}

//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
WEBAPP.onopen=function(evt)
//------------------------------------------------------------------------------
{
    WEBAPP.frmaux.writeln("CONNECTED");
    WEBAPP.connected=true;
}

//------------------------------------------------------------------------------
WEBAPP.onclose=function(evt)
//------------------------------------------------------------------------------
{
    alert("websocket closed");
    WEBAPP.frmaux.writeln("DISCONNECTED");
    WEBAPP.connected=false;
}

//------------------------------------------------------------------------------
WEBAPP.onmessage=function(evt)
//------------------------------------------------------------------------------
{
    var txt=evt.data;

    try
    {
        if( WEBAPP.debug )
        {
            //mutatja, mit kapott
            WEBAPP.frmaux.writeln('###<span style="color: blue;">'+WEBAPP.htmlstring(txt)+'</span>');
        }
        eval(txt);
    }
    catch(err)
    {
        //üzenet: webconsole-ra
        console.log(err);
        console.log(txt);

        //üzenet: frmaux-ba        
        WEBAPP.frmaux.writeln('<span style="color: red;">'+err+'</span>');
        WEBAPP.frmaux.writeln('###<span style="color: red;">'+WEBAPP.htmlstring(txt)+'</span>');

        //üzenet: szervernek
        WEBAPP.senderror(err.toString(),txt);
    }
}

//------------------------------------------------------------------------------
WEBAPP.onerror=function(evt)
//------------------------------------------------------------------------------
{
    WEBAPP.frmaux.write('websocket error:');
    WEBAPP.frmaux.writeln(evt.toString());
    WEBAPP.connected=false;
}


//------------------------------------------------------------------------------
WEBAPP.send=function(message)
//------------------------------------------------------------------------------
{
    if( WEBAPP.connected )
    {
        WEBAPP.websocket.send(message);
        //mutatja, mit küldött
        if( WEBAPP.debug )
        {
            var x='###<span style="color:COLOR;">'
            if( 0==message.indexOf("<error>") )
            {
                x=x.replace("COLOR","red");
            }
            else if( 0==message.indexOf("<warning>") )
            {
                x=x.replace("COLOR","#bbaa00"); //yellow
            }
            else
            {
                x=x.replace("COLOR","green");
            }
            x+=WEBAPP.htmlstring(message);
            x+='</span>';
            WEBAPP.frmaux.writeln(x);
        }
    }
    else
    {
        alert("session closed");
    }
}

//------------------------------------------------------------------------------
WEBAPP.senderror=function(desc,args)
//------------------------------------------------------------------------------
{
    var msg="";
    msg+='<error>';
    msg+='<description>';
    msg+=WEBAPP.cdataif( desc );
    msg+='</description>';
    msg+='<args>';
    msg+=WEBAPP.cdataif(args);
    msg+='</args>';
    msg+='</error>';
    WEBAPP.send(msg);
}

//------------------------------------------------------------------------------
WEBAPP.sendwarning=function(desc,args)
//------------------------------------------------------------------------------
{
    var msg="";
    msg+='<warning>';
    msg+='<description>';
    msg+=WEBAPP.cdataif( desc );
    msg+='</description>';
    msg+='<args>';
    msg+=WEBAPP.cdataif(args);
    msg+='</args>';
    msg+='</warning>';
    WEBAPP.send(msg);
}

//------------------------------------------------------------------------------



//------------------------------------------------------------------------------
WEBAPP.privatelength=function()
//------------------------------------------------------------------------------
{
    WEBAPP.send("<PRIVATELENGTH>"+WEBAPP.privatedata.length.toString()+"</PRIVATELENGTH>");
}

//------------------------------------------------------------------------------
WEBAPP.privatepop=function(len)
//------------------------------------------------------------------------------
{
    while(WEBAPP.privatedata.length>len)
    {
        WEBAPP.privatedata.pop();
    }
}

//------------------------------------------------------------------------------
WEBAPP.privatepush=function()
//------------------------------------------------------------------------------
{
    WEBAPP.privatedata.push(new Array());
}

//------------------------------------------------------------------------------
WEBAPP.setprivatedata=function(key,data)
//------------------------------------------------------------------------------
{
    tail=WEBAPP.privatedata[ WEBAPP.privatedata.length-1 ]; //utolsó elem
    tail[key]=data;
}

//------------------------------------------------------------------------------
WEBAPP.getprivatedata=function(key)
//------------------------------------------------------------------------------
{
    tail=WEBAPP.privatedata[ WEBAPP.privatedata.length-1 ]; //utolsó elem
    return tail[key];
}

//------------------------------------------------------------------------------
WEBAPP.savedisplay=function(key)
//------------------------------------------------------------------------------
{
    WEBAPP.webapp.display.savefocus=WEBAPP.document.x.activeElement;
    WEBAPP.setprivatedata(key,WEBAPP.webapp.display); //burkolo
}

//------------------------------------------------------------------------------
WEBAPP.emptydisplay=function()
//------------------------------------------------------------------------------
{
    var dsp=WEBAPP.div("display_webapp","display");
    WEBAPP.webapp.display.x.parentNode.replaceChild(dsp.x,WEBAPP.webapp.display.x);
    WEBAPP.webapp.display=dsp;
}

//------------------------------------------------------------------------------
WEBAPP.restoredisplay=function(key)
//------------------------------------------------------------------------------
{
    var dsp=WEBAPP.getprivatedata(key) //burkolo
    WEBAPP.webapp.display.x.parentNode.replaceChild(dsp.x,WEBAPP.webapp.display.x);
    WEBAPP.webapp.display=dsp;
    WEBAPP.webapp.display.savefocus.focus();
    delete WEBAPP.webapp.display.savefocus;
}

//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
WEBAPP.cdataif=function(x)
//------------------------------------------------------------------------------
{
    if( 0<=x.indexOf("<") || 0<=x.indexOf(">") || 0<=x.indexOf("&") )
    {
        x=WEBAPP.cdata(x);
    }
    return x;
}


//------------------------------------------------------------------------------
WEBAPP.cdata=function(x)
//------------------------------------------------------------------------------
{
    //<![CDATA[ xxx ]]>
    var y="",n;
    while( 0<=(n=x.indexOf("]]>")) )
    {
        y+='<![CDATA['+x.substr(0,n+1)+']]>';
        x=x.substr(n+1);
    }
    y+='<![CDATA['+x+']]>';
    return y;
}


//------------------------------------------------------------------------------
WEBAPP.evententer=function(event)
//------------------------------------------------------------------------------
{
    return event.which==13;
}


//------------------------------------------------------------------------------
function chr(code)
//------------------------------------------------------------------------------
{
    return String.fromCharCode(code);
}


//------------------------------------------------------------------------------
WEBAPP.htmlstring=function(x)
//------------------------------------------------------------------------------
{
    x=x.replace(/&/g,"&amp;");
    x=x.replace(/>/g,"&gt;");
    x=x.replace(/</g,"&lt;");
    return x;
}


//------------------------------------------------------------------------------
WEBAPP.click=function(id)
//------------------------------------------------------------------------------
{
    var ctrl=WEBAPP.document.x.getElementById(id);
    if( ctrl==null )
    {
        console.log( "click: getElementById("+id+") returned null" );
    }
    else
    {
        ctrl.click();
        //console.log("click on "+ctrl.id);
    }
}

//------------------------------------------------------------------------------
WEBAPP.onclick_row=function(row)
//------------------------------------------------------------------------------
{
    //<table><tbody><tr></tr></tbody></table>
    var sec=row.parentElement; //HTMLTableSectionElement 
    var tab=sec.parentElement; //HTMLTableElement
    WEBAPP.unclick_row(tab.selectedrow);
    tab.selectedrow=row;
    row.className+="X";
}


//------------------------------------------------------------------------------
WEBAPP.unclick_row=function(row)
//------------------------------------------------------------------------------
{
    if( row )
    {
        if( row.className=="evenX" )
        {
            row.className="even";
        }
        else if( row.className=="oddX" )
        {
            row.className="odd";
        }
    }
}


//------------------------------------------------------------------------------
WEBAPP.echo=function(x)
//------------------------------------------------------------------------------
{
    WEBAPP.send(x);
}


//------------------------------------------------------------------------------
WEBAPP.settle=function()
//------------------------------------------------------------------------------
{
    var ctrl,n;
    ctrl=WEBAPP.document.x.getElementsByTagName("input");
    for( n=0; n<ctrl.length; n++ )
    {
        if( ctrl[n].onblur!=undefined )
        {
            ctrl[n].onblur();
        }
    }
}


//------------------------------------------------------------------------------
WEBAPP.edit_in_progress=function(ctrl)
//------------------------------------------------------------------------------
{
    //console.log('edit_in_progress',ctrl.id)
    ctrl.edit_in_progress={};
    ctrl.edit_in_progress.settle=false;
    ctrl.edit_in_progress.origvalue=ctrl.value;
}


//------------------------------------------------------------------------------
WEBAPP.loadscript=function(url)
//------------------------------------------------------------------------------
{
    var element=WEBAPP.document.x.createElement("script");
    element.src=url;
    WEBAPP.document.x.head.appendChild(element);
}

//------------------------------------------------------------------------------
WEBAPP.loadstyle=function(url)
//------------------------------------------------------------------------------
{
    var element=WEBAPP.document.x.createElement("link");
    element.rel="stylesheet";
    element.type="text/css";
    element.href=url;
    WEBAPP.document.x.head.appendChild(element);
}

//------------------------------------------------------------------------------
WEBAPP.unloadstyle=function(url)
//------------------------------------------------------------------------------
{
    var rx=new RegExp(url);
    var styles=WEBAPP.document.x.getElementsByTagName("link");
    for( var i=styles.length-1; i>=0; i-- )
    {
        if( styles[i].getAttribute("href")!=null )
        {
            if( rx.test(styles[i].getAttribute("href")) )
            {
                console.log("removed:",styles[i]);
                styles[i].parentNode.removeChild(styles[i]);
            }
        }
    }
}

//------------------------------------------------------------------------------
WEBAPP.bringintoview=function(div,elmnt)
{
    //div: ebben scrollozodik elmnt
    //elmnt: ezt akarjuk lathato helyre scrollozni
    //
    //elmnt.scrollIntoView()-t helyettesiti,
    //ami nem jo, mert az egesz ablakot rangatja

    if( div.scrollTop>elmnt.offsetTop )
    {
        div.scrollTop=elmnt.offsetTop;
    }
    else if( div.scrollTop<elmnt.offsetTop+elmnt.scrollHeight-div.offsetHeight )
    {
        div.scrollTop=elmnt.offsetTop+elmnt.scrollHeight-div.offsetHeight
    }

}

//------------------------------------------------------------------------------



//------------------------------------------------------------------------------
WEBAPP.formdata=function(srcid)
//------------------------------------------------------------------------------
{
    //console.log("formdata",srcid);

    var ctrl,n;
    var x="<formdata>";
    x+="<source>"+srcid+"</source>";
    
    var sctrl=WEBAPP.document.x.getElementById(srcid);
    if( sctrl!=null )
    {
        if( sctrl.type!=null )
        {
            x+="<sourcetype>"+sctrl.type+"</sourcetype>";
        }
        else
        {
            x+="<sourcetype>"+sctrl.nodeName+"</sourcetype>";
        }
    }

    ctrl=WEBAPP.document.x.getElementsByTagName("input");
    for( n=0; n<ctrl.length; n++ )
    {
        if( ctrl[n].type=="text" ||
            ctrl[n].type=="hidden" ||
            ctrl[n].type=="file" ||
            ctrl[n].type=="password" ||
            ctrl[n].type=="checkbox" ||
            ctrl[n].type=="radio" )
        {
            x+="<control>";
            x+="<id>"+ctrl[n].id+"</id>";
            x+="<type>"+ctrl[n].type+"</type>";
            
            if( ctrl[n].type=="radio" )
            {
                x+="<value>"+ctrl[n].checked+"</value>";
                x+="<group>"+ctrl[n].name+"</group>";
            }
            else if( ctrl[n].type=="checkbox" )
            {
                x+="<value>"+ctrl[n].checked+"</value>";
            }
            else if( ctrl[n].type=="password" )
            {
                x+="<value>"+"*".repeat(ctrl[n].value.length)+"</value>";
            }
            else if( ctrl[n].type=="file" )
            {
                x+="<value>"
                x+="<filelist>"
                var i;
                for(i=0; i<ctrl[n].files.length; i++ )
                {
                    //console.log( i, ctrl[n].files[i].name );
                    x+="<file>"
                    x+=WEBAPP.cdataif( ctrl[n].files[i].name );
                    x+="</file>"
                }
                x+="</filelist>"
                x+="</value>"
            }
            else
            { 
                if( ctrl[n].onblur && ctrl[n].edit_in_progress )
                {
                    //console.log('settle',ctrl[n].id);
                    ctrl[n].edit_in_progress.settle=true;
                    ctrl[n].onblur();
                }  
                x+="<value>"+WEBAPP.cdataif(WEBAPP.xreadvalue(ctrl[n]))+"</value>";
            }
            x+="</control>";
        }
    }

    ctrl=WEBAPP.document.x.getElementsByTagName("textarea");
    for( n=0; n<ctrl.length; n++ )
    {
        x+="<control>";
        x+="<id>"+ctrl[n].id+"</id>";
        x+="<type>"+ctrl[n].type+"</type>";
        //x+="<value><![CDATA["+ctrl[n].value+"]]></value>";
        x+="<value>"+WEBAPP.cdataif(ctrl[n].value)+"</value>";
        x+="</control>";
    }

    ctrl=WEBAPP.document.x.getElementsByTagName("select");
    for( n=0; n<ctrl.length; n++ )
    {
        x+="<control>";
        x+="<id>"+ctrl[n].id+"</id>";
        x+="<type>select</type>";
        //x+="<value><![CDATA["+ctrl[n].value+"]]></value>";
        x+="<value>"+WEBAPP.cdataif(ctrl[n].value)+"</value>";
        x+="</control>";
    }

    ctrl=WEBAPP.document.x.getElementsByTagName("table");
    for( n=0; n<ctrl.length; n++ )
    {
        if( ctrl[n].id )
        {
            var sel="";
            if( ctrl[n].selectedrow )
            {
                sel=ctrl[n].selectedrow.id
            }
            x+="<control>";
            x+="<id>"+ctrl[n].id+"</id>";
            x+="<type>table</type>";
            x+="<value>"+sel+"</value>";
            x+="</control>";
        }
    }

    x+="</formdata>";

    WEBAPP.send(x);
}


//------------------------------------------------------------------------------
WEBAPP.xreadvalue=function(ctrl)
//------------------------------------------------------------------------------
{
    if( ctrl.xreadvalue!=undefined )
    {
        return ctrl.xreadvalue();    
    }
    else
    {
        return ctrl.value;    
    }
}


//------------------------------------------------------------------------------
WEBAPP.updatecontrol=function(id,value)
//------------------------------------------------------------------------------
{
    var ctrl=WEBAPP.document.x.getElementById(id);

    if( ctrl==null )
    {
        console.log("updatecontrol - unknown ctrlid "+id);
        WEBAPP.sendwarning( "updatecontrol - unknown ctrlid",id)
    }
    else if( ctrl.nodeName=="LABEL" )
    {
        ctrl.innerHTML=value;
    }
    else if( ctrl.nodeName=="SELECT" )
    {
        //a szöveges kiválasztás magától csak az option teljes szövegével működik;
        //(pl. ctrl.value="optiontext" az option teljes szövegével működne)
        //nekünk jobb, ha a szöveg elejének egyezésével működik a kiválasztás;
        //segítünk neki:

        for( var n=0; n<ctrl.options.length; n++ )
        {
            if( ctrl.options[n].text.indexOf(value)==0 )
            {
                ctrl.selectedIndex=n;
                break;
            }
        }
    }
    else if( ctrl.nodeName=="TABLE" )
    {
        WEBAPP.unclick_row(ctrl.selectedrow);
        ctrl.selectedrow=null;
        var body=ctrl.getElementsByTagName("tbody")[0];
        var row=body.getElementsByTagName("tr"); //összes tr tag
        for( var i=0; i<row.length; i++ ) 
        {
            if( row[i].id==value )
            {
                WEBAPP.onclick_row(row[i]);
                WEBAPP.bringintoview(ctrl.parentNode,row[i]);
                break;
            }
        }
    }
    else if( ctrl.nodeName=="TEXTAREA" )
    {
        ctrl.value=value;
    }

    else if( ctrl.nodeName!="INPUT" )
    {
        //kihagy
        //alert(ctrl.nodeName);
    }
    else if( ctrl.type=="radio" )
    {
        ctrl.checked=(value=="true");
    }
    else if( ctrl.type=="checkbox" )
    {
        ctrl.checked=(value=="true");
    }
    else
    {
        ctrl.value=value;
        if( ctrl.onblur!=undefined )
        {
            ctrl.onblur(ctrl);
        }
    }
}

//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
WEBAPP.openalert=function(alert_as_html)
//------------------------------------------------------------------------------
{
    var ovl=WEBAPP.overlay.x;
    var bln=WEBAPP.blind.x;
    bln.style.height="0px";
    bln.innerHTML=alert_as_html;

    var alr=bln.firstChild;
    var style=WEBAPP.window.x.getComputedStyle(alr);
    var height=style.getPropertyValue("height");
    height=(Number(height.replace("px",""))+16).toString()+"px";
    WEBAPP.document.savefocus=WEBAPP.document.x.activeElement;
    ovl.style.transitionDelay="0s, 0s";
    ovl.style.backgroundColor="rgba(0,0,0,0.3)" //transition!
    ovl.style.height="100%"; //transition=0!
    bln.style.height=height; //transition!
}

//------------------------------------------------------------------------------
WEBAPP.closealert=function()
//------------------------------------------------------------------------------
{
    var ovl=WEBAPP.overlay.x;
    var bln=WEBAPP.blind.x;
    var alr=bln.firstChild;
    bln.style.height="0%"; //transition
    ovl.style.transitionDelay="0s, 0.3s";
    ovl.style.backgroundColor="rgba(0,0,0,0.0)" //transition
    ovl.style.height="0px"; //transition-delay 0.3s
    WEBAPP.document.savefocus.focus();
    delete WEBAPP.document.savefocus;
}

//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
WEBAPP.dat2str=function(d) //datumok formazasa: YYYY-MM-DD
//------------------------------------------------------------------------------
{
    var yyyy=(d.getFullYear()).toString();
    var mm=(1+d.getMonth()).toString();
    var dd=(d.getDate()).toString();
    yyyy=("0000"+yyyy);yyyy=yyyy.slice(yyyy.length-4); //padl
    mm=("00"+mm);mm=mm.slice(mm.length-2); //padl
    dd=("00"+dd);dd=dd.slice(dd.length-2); //padl
    return yyyy+"-"+mm+"-"+dd;
}


//------------------------------------------------------------------------------
WEBAPP.datisvalid=function(s) //datumstring ellenorzes
//------------------------------------------------------------------------------
{
    //elfogadja, ha kiegeszitheto (!) ervenyes datumma 

    s=s.replace(/-/g,""); //kiszedi a szemetet
    s=s.replace(/ /g,""); //kiszedi a szemetet
    s+="19991010".slice(s.length); //kiegesziti 8 hosszura
    s=s.slice(0,4)+"-"+s.slice(4,6)+"-"+s.slice(6); //tagol:yyyy-mm-ddx*
    s=s.replace("-00","-01"); //korrekcio
    return s==WEBAPP.dat2str(new Date(s));
}

//------------------------------------------------------------------------------
WEBAPP.datreadvalue=function(ctrl)
//------------------------------------------------------------------------------
{
    var v=ctrl.value;
    var x=v;
    if( v=="" )
    {
        return x;
    }
    x=x.replace(/-/g,"" );
    x=x.replace(/ /g,"" );
    if( x.length!=8 || !WEBAPP.datisvalid(x) )
    {
        return "? "+x;  //invalid
    }
    return x;
} 

//------------------------------------------------------------------------------
WEBAPP.datsettlevalue=function(ctrl)
//------------------------------------------------------------------------------
{
    var edit=false;
    var settle=false;
    var origvalue;
    if( ctrl.edit_in_progress )
    {
        edit=true;
        settle=ctrl.edit_in_progress.settle;
        origvalue=ctrl.edit_in_progress.origvalue;
        ctrl.edit_in_progress=null;
    }
    //console.log("datsettlevalue",ctrl.id,"edit=",edit,"settle=",settle,origvalue);
 
    if( ctrl.xreadvalue==undefined )
    {
        ctrl.xreadvalue=function()
        {
            return WEBAPP.datreadvalue(this);                
        }
    }
    var v=ctrl.value;
    var x="";
    if( v=="" )
    {
        if( edit && !settle && ctrl.value!=origvalue )
        {
            //console.log("dispatch");
            ctrl.dispatchEvent(new Event('change'));
        }
        return x;
    }
    v=v.replace(/-/g,"" );
    v=v.replace(/ /g,"" );
    var num="0123456789";
    var pic="9999-99-99";
    var i=0,j=0;
    for(i=0,j=0; i<pic.length && j<v.length; i++,j++)
    {
        var t=pic.charAt(i);
        if( t=="9" )
        {
            if((num).includes(v.charAt(j))) 
            {
                x+=v.charAt(j);
            }
            else
            {
                return "? "+x;
            }
        }
        else 
        {
            x+=t;
            if( t!=v.charAt(j) )
            {
                --j;
            }
        }
    }
    if( j<v.length )
    {
        return "? "+x;
    }
    if( i<pic.length )
    {
        return "? "+x;
    }
    if( !WEBAPP.datisvalid(x) )
    {
        x+=" " //ne illeszkedjen!
    }
    ctrl.value=x;

    if( edit && !settle && ctrl.value!=origvalue )
    {
        //console.log("dispatch");
        ctrl.dispatchEvent(new Event('change'));
    }
    return x;
    
    //a return ertek nincs sehol felhasznalva
    //egyedul a ctrl.value beallitasa szamit
} 

//------------------------------------------------------------------------------
WEBAPP.datkeypress=function(e) 
//------------------------------------------------------------------------------
{
    var ctrl=e.target; //input mezo

    if( WEBAPP.evententer(e) && e.target.onblur!=undefined )
    {
        ctrl.onblur(ctrl);
    }
    else if( e.charCode==0 )
    {
        //del,bs,right,left,...
    }
    else
    {
        var v=ctrl.value.trim(); //eredeti tartalom
        var pos=ctrl.selectionStart; //caret pozicio
        var chr=String.fromCharCode(e.charCode); //aktualis karakter
        var x=v.slice(0,pos)+chr; //balfel + uj karakter
        var xr=v.slice(pos); //jobbfel
        var num="0123456789";
        var pic="9999-99-99";

        var i=0, j=0;
        for(i=0, j=0; i<pic.length && j<x.length; i++ )
        {
            var t=pic.charAt(i);
            if( t=="9" )
            {
                if((num).includes(x.charAt(j)))
                {
                    j++;
                } 
                else 
                {
                    break;
                }
            }
            else 
            {
                if( t==x.charAt(j) )
                {
                    j++;
                }
                else
                {
                    x=x.slice(0,j)+t+x.slice(j);
                    j++;
                    pos++;
                }
            }
        }

        if( j>=x.length && WEBAPP.datisvalid(x) )
        {
            //(balfel + uj karakter) illeszkedik
            //(balfel + uj karakter) kiegeszitheto datumma
            //ha ez fennall, akkor beengedjuk a leutest

            var offs=x.length+xr.length-pic.length;
            if( offs>0 )
            {
                xr=xr.slice(offs)
            }
            ctrl.value=x+xr;
            if( !WEBAPP.datisvalid(ctrl.value) )
            {
                ctrl.value+=" " //ne illeszkedjen!
            }
            ctrl.selectionStart=pos+1;
            ctrl.selectionEnd=pos+1;
            ctrl.focus();
        }
        e.preventDefault();
    }
}

//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
WEBAPP.num2str=function(num,dec) //szamok formazasa
//------------------------------------------------------------------------------
// dec=undef: tizedesek nelkul, elvalaszto vesszok nelkul
// dec=0    : tizedesek nelkul, elvalaszto vesszokkel
// dec>=1   : tizedesekkel, elvalaszto vesszokkel

{
    var x;
    if( dec!=undefined  )
    {
        x=num.toLocaleString("en-US",{minimumFractionDigits:dec,maximumFractionDigits:dec});
    }
    else
    {
        x=num.toString();
    }
    return x;
} 

//------------------------------------------------------------------------------
WEBAPP.numsettlevalue=function(ctrl,dec,zero)
//------------------------------------------------------------------------------
{
    var edit=false;
    var settle=false;
    var origvalue;
    if( ctrl.edit_in_progress )
    {
        edit=true;
        settle=ctrl.edit_in_progress.settle;
        origvalue=ctrl.edit_in_progress.origvalue;
        ctrl.edit_in_progress=null;
    }
    //console.log("numsettlevalue",ctrl.id,"edit=",edit,"settle=",settle,origvalue);

    if( ctrl.xreadvalue==undefined )
    {
        ctrl.xreadvalue=function()
        {
            return this.value.replace(/,/g,"").replace(/ /g,"");
        }
    }
    var text=ctrl.xreadvalue();
    var num=Number(text);
    if( num==0 && zero!=undefined && zero=="blank" )
    {
        ctrl.value="";
    }
    else
    {
        ctrl.value=WEBAPP.num2str(num,dec);
    }
}


//------------------------------------------------------------------------------
WEBAPP.numkeypress=function(e) 
//------------------------------------------------------------------------------
{
    var ctrl=e.target; //input mezo

    if( WEBAPP.evententer(e) && e.target.onblur!=undefined )
    {
        ctrl.onblur(ctrl);
    }
    else if( e.charCode==0 )
    {
        //del,bs,right,left,...
    }
    else
    {
        var x=ctrl.value; //tartalom az aktualis karakter nelkul
        var pos=ctrl.selectionStart; //caret pozicio
        var chr=String.fromCharCode(e.charCode); //aktualis karakter
        x=x.slice(0,pos)+chr+x.slice(pos); //karakter beillesztve
        
        if( !/^[+-]?[,0-9]*(\.[0-9]*)?$/.test(x) )
        {
            //beillesztes letiltva
            e.preventDefault();
        }
    }
}

//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
WEBAPP.xpicture=function(ctrl)
//------------------------------------------------------------------------------
{
    if( ctrl.xpicture==undefined )
    {
        ctrl.xpicture=ctrl.getAttribute("data-picture");
        var xpat="^";
        var p="",r=0;
        var last=false;

        var addexp=function()
        {
            //console.log(xpat,p,r);
            if( p=="" )
            {
            }
            else if( "09".includes(p) )
            {
                xpat+="[0-9]";
            }   
            else if("aA".includes(p))
            {
                xpat+="[a-zA-Z]";
            }   
            else if("nN".includes(p))
            {
                xpat+="[0-9a-zA-Z]";
            }   
            else if( "X".includes(p) )
            {
                xpat+=".";
            }   
            else if("?*+{}()[]|^$".includes(p) )
            {
                xpat+="\\"+p;
            }
            else if(p=="\\")
            {
                xpat+="\\\\";
            }   
            else
            {
                xpat+=p;
            } 
        
            if( last && p=='X' )
            {
                xpat+="{0,"+r.toString()+"}" //X-ek a vegen elhagyhatok
            }
            else if(r>1)
            {
                xpat+="{"+r.toString()+"}"
            }
        }

        for(var n=0; n<ctrl.xpicture.length; n++)
        {
            var c=ctrl.xpicture[n];
            if( c==p )
            {
                r++;
            }
            else
            {
                addexp();
                p=c;
                r=1;
            }
        }
        if(r>0)
        {
            last=true;
            addexp();
        }
        xpat+="$";
        //console.log(new Error("testing WEBAPP.xpicture").stack);
        //console.log(ctrl.xpicture);
        //console.log(xpat);
        ctrl.pattern=xpat;
    }
    return ctrl.xpicture;

}

//------------------------------------------------------------------------------
WEBAPP.picreadvalue=function(ctrl)
//------------------------------------------------------------------------------
{
    var v=ctrl.value;
    var x="";
    if( v=="" )
    {
        return x;
    }
    var num="0123456789";
    var abc="abcdefghijklmnopqrstuvwxyz";
    var ABC="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var pic=WEBAPP.xpicture(ctrl);
    for(var i=0, j=0; i<pic.length && j<v.length; i++,j++ )
    {
        var t=pic.charAt(i);
        if( "09".includes(t) )
        {
            if((num).includes(v.charAt(j))) {x+=v.charAt(j);}else{return "? "+x;}
        }
        else if( "Aa".includes(t) )
        {
            if((abc+ABC).includes(v.charAt(j))) {x+=v.charAt(j);}else{return "? "+x;}
        }
        else if( "Nn".includes(t) )
        {
            if((num+abc+ABC).includes(v.charAt(j))) {x+=v.charAt(j);}else{return "? "+x;}
        }
        else if( "X".includes(t) )
        {
            x+=v.charAt(j);
        }
        else 
        {
            if( t!=v.charAt(j) ) {return "? "+x;}
        }
    }

    //1) lehet, hogy pic es v egyszerre elfogyott -> kesz
    //2) lehet, hogy v-bol maradt -> hibas adat
    //3) lehet, hogy pic-bol maradt -> el kell fogyasztani

    for( ; j<v.length; j++  )
    {
        return "? "+x;
    }


    //a picture vegen levo X-ek trimelve
    var len=pic.length;
    while( 0<len && pic.charAt(len-1)=='X' )
    {
        len--;
    }

    for( ; i<len; i++  )
    {
        var t=pic.charAt(i);
        if( "9AaNnX".includes(t) )
        { 
            return "? "+x;
        }
    }
    return x;
} 


//------------------------------------------------------------------------------
WEBAPP.picsettlevalue=function(ctrl)
//------------------------------------------------------------------------------
{
    var edit=false;
    var settle=false;
    var origvalue;
    if( ctrl.edit_in_progress )
    {
        edit=true;
        settle=ctrl.edit_in_progress.settle;
        origvalue=ctrl.edit_in_progress.origvalue;
        ctrl.edit_in_progress=null;
    }
    //console.log("picsettlevalue",ctrl.id,"edit=",edit,"settle=",settle,origvalue);

    if( ctrl.xreadvalue==undefined )
    {
        ctrl.xreadvalue=function()
        {
            return WEBAPP.picreadvalue(this);                
        }
    }
    var v=ctrl.value;
    var x="";
    if( v=="" )
    {
        if( edit && !settle && ctrl.value!=origvalue )
        {
            //console.log("dispatch");
            ctrl.dispatchEvent(new Event('change'));
        }
        return x;
    }
    var num="0123456789";
    var abc="abcdefghijklmnopqrstuvwxyz";
    var ABC="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var pic=WEBAPP.xpicture(ctrl);
    var i=0,j=0;
    for(i=0,j=0; i<pic.length && j<v.length; i++,j++)
    {
        var t=pic.charAt(i);
        if( "09".includes(t) )
        {
            if((num).includes(v.charAt(j))) {x+=v.charAt(j);}else{return "? "+x;}
        }
        else if( "a".includes(t) )
        {
            if((abc+ABC).includes(v.charAt(j))){x+=v.charAt(j);}else{return "? "+x;}
        }
        else if( "A".includes(t) )
        {
            if((abc+ABC).includes(v.charAt(j))){x+=v.charAt(j).toUpperCase();}else{return "? "+x;}
        }
        else if( t=="n" )
        {
            if((num+abc+ABC).includes(v.charAt(j))) {x+=v.charAt(j);}else{return "? "+x;}
        }
        else if( t=="N" )
        {
            if((num+abc+ABC).includes(v.charAt(j))) {x+=v.charAt(j).toUpperCase();}else{return "? "+x;}
        }
        else if( t=="X" )
        {
            x+=v.charAt(j);
        }
        else 
        {
            x+=t;
            if( t!=v.charAt(j) )
            {
                --j;
            }
        }
    }

    //1) lehet, hogy pic es v egyszerre elfogyott -> kesz
    //2) lehet, hogy v-bol maradt -> hibas adat
    //3) lehet, hogy pic-bol maradt -> el kell fogyasztani

    for( ; j<v.length; j++  )
    {
        return "? "+x;
    }

    //a picture vegen levo X-ek trimelve
    var len=pic.length;
    while( 0<len && pic.charAt(len-1)=='X' )
    {
        len--;
    }

    for( ; i<len; i++  )
    {
        var t=pic.charAt(i);
        if( "9AaNnX".includes(t) )
        { 
            return "? "+x;
        }
        else
        {
            x+=t;
        }
    }

    if( edit && !settle && ctrl.value!=origvalue )
    {
        //console.log("dispatch");
        ctrl.dispatchEvent(new Event('change'));
    }
    ctrl.value=x;
    return x;
} 


//------------------------------------------------------------------------------
WEBAPP.pickeypress=function(e)                                                  
//------------------------------------------------------------------------------
{
    var ctrl=e.target; //input mezo

    if( WEBAPP.evententer(e) && e.target.onblur!=undefined )
    {
        ctrl.onblur(ctrl);
    }
    else if( e.charCode==0 )
    {
        //del,bs,right,left,...
    }
    else
    {
        var v=ctrl.value; //tartalom az aktualis karakter nelkul
        var pos=ctrl.selectionStart; //caret pozicio
        var chr=String.fromCharCode(e.charCode); //aktualis karakter
        var x=v.slice(0,pos)+chr; //balfel + uj karakter
        var xr=v.slice(pos); //jobbfel
        var num="0123456789";
        var abc="abcdefghijklmnopqrstuvwxyz";
        var ABC="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var pic=WEBAPP.xpicture(ctrl);

        var i=0, j=0;
        for(i=0, j=0; i<pic.length && j<x.length; i++ )
        {
            var t=pic.charAt(i);
            if( "09".includes(t) )
            {
                if((num).includes(x.charAt(j))){j++;} else {break;}
            }
            else if( "a".includes(t) )
            {
                if((abc+ABC).includes(x.charAt(j))){j++;} else {break;}
            }
            else if( "A".includes(t) )
            {
                if( abc.includes(x.charAt(j)) )
                {
                    if( x.charAt(j)!=x.charAt(j).toUpperCase() )
                    {
                        x=x.slice(0,j)+x.charAt(j).toUpperCase()+x.slice(j+1);
                    }
                    j++;
                }
                else if( ABC.includes(x.charAt(j)) )
                {
                    j++;
                }
                else
                {
                    break;
                }
            }
            else if( "n".includes(t) )
            {
                if((num+abc+ABC).includes(x.charAt(j))){j++;} else {break;}
            }
            else if( "N".includes(t) )
            {
                if( (abc).includes(x.charAt(j))) 
                {
                    x=x.slice(0,j)+x.charAt(j).toUpperCase()+x.slice(j+1);
                    j++;
                } 
                if( (num+ABC).includes(x.charAt(j))) 
                {
                    j++;
                } 
                else   
                {
                    break;
                }
            }
            else if( "X".includes(t) )
            {
                j++;
            }
            else 
            {
                if( t==x.charAt(j) )
                {
                    j++;
                }
                else
                {
                    x=x.slice(0,j)+t+x.slice(j);
                    j++;
                    pos++;
                }
            }
        }
        if( j>=x.length )
        {
            var offs=x.length+xr.length-pic.length;
            if( offs>0 )
            {
                xr=xr.slice(offs)
            }
            ctrl.value=x+xr;
            ctrl.selectionStart=pos+1;
            ctrl.selectionEnd=pos+1;
            ctrl.focus();
        }
        e.preventDefault();
    }
}

//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
WEBAPP.xpattern=function(ctrl)
//------------------------------------------------------------------------------
{
    if( ctrl.xpattern==undefined )
    {
        var pat=ctrl.pattern;
        if(!pat.startsWith("^")){pat="^"+pat;}
        if(!pat.endsWith("$")){pat+="$";}
        var match=pat.match(/(\[[^\]]+\])|(\{[^}]+\})|(\\.)|(.)/g);
        // (\[[^\]]+\])
        // (\{[^}]+\})
        // (\\.)
        // (.)
        var xpat="";
        for( var n=0; n<match.length; n++ )
        {
            var x=match[n];
            if( x[0]=='[' )
            {
                x='[\\v'+x.slice(1); // [0-9] -> [\v0-9]
            }
            else if( x[0]=='\\' )
            {
                x='[\\v'+x+']'; // \x -> [\v\x]
            }
            else if( "^?*+{()|".includes(x[0]) )
            {
            }
            else if( "$".includes(x[0]) )
            {
                x='\\v*$'; // $ -> \v*$
            }
            else
            {
                //x='[\\v'+x+']'; //x -> [\vx]  hiba:  [\v.] rossz
                x='(\\v|'+x+')'; //x -> (\v|x)
            }
            xpat+=x;
        }
        //console.log(pat);
        //console.log(match.toString());
        //console.log(xpat);
        ctrl.xpattern=xpat;
    }
    return ctrl.xpattern;
}

//------------------------------------------------------------------------------
WEBAPP.patsettlevalue=function(ctrl)
//------------------------------------------------------------------------------
{
    var edit=false;
    var settle=false;
    var origvalue;
    if( ctrl.edit_in_progress )
    {
        edit=true;
        settle=ctrl.edit_in_progress.settle;
        origvalue=ctrl.edit_in_progress.origvalue;
        ctrl.edit_in_progress=null;
    }
    //console.log("patsettlevalue",ctrl.id,"edit=",edit,"settle=",settle,origvalue);

    if( ctrl.xreadvalue==undefined )
    {
        //honnan hivodik?
        //modszer a callstack megtekintesere
        //console.log(new Error().stack);

        ctrl.xreadvalue=function()
        {
            var v=this.value;
            if( v!="" )
            {
                var r=new RegExp(this.pattern)
                if( !r.test(v) )
                {
                    v="? "+v;
                }
            }
            return v;
        }
    }

    if( edit && !settle && ctrl.value!=origvalue )
    {
        //console.log("dispatch");
        ctrl.dispatchEvent(new Event('change'));
    }
}

//------------------------------------------------------------------------------
WEBAPP.patkeypress=function(e)
//------------------------------------------------------------------------------
{
    var ctrl=e.target; //input mezo

    if( e.charCode==0 )
    {
        //del,bs,right,left,...
    }
    else
    {
        var v=ctrl.value; //tartalom az aktualis karakter nelkul
        var pos=ctrl.selectionStart; //caret pozicio
        var chr=String.fromCharCode(e.charCode); //aktualis karakter
        var x=v.slice(0,pos)+chr; //balfel + uj karakter
        var xr=v.slice(pos); //jobbfel

        var pat=WEBAPP.xpattern(ctrl);
        var reg=new RegExp(pat);
        var str=x+String.fromCharCode(11).repeat(1024);  // chr(11)=\v (vertical tab)

        //console.log(str);
        //console.log(reg);
        //console.log(reg.test(str));

        if( !reg.test(str) ) 
        {
            e.preventDefault();
        }
    }
} 

//------------------------------------------------------------------------------



//------------------------------------------------------------------------------
WEBAPP.getpwstrength=function(srcid)
//------------------------------------------------------------------------------
{
    var ctrl=WEBAPP.document.x.getElementById(srcid);
    var pswd=ctrl.value


    var score = 0;
    if (!pswd){
        return score;
    }

    // award every unique letter until 5 repetitions
    var letters = new Object();
    for (var i=0; i<pswd.length; i++) {
        letters[pswd[i]] = (letters[pswd[i]] || 0) + 1;
        score += 5.0 / letters[pswd[i]];
    }

    // bonus points for mixing it up
    var variations = {
        digits: /\d/.test(pswd),
        lower: /[a-z]/.test(pswd),
        upper: /[A-Z]/.test(pswd),
        nonWords: /\W/.test(pswd),
    }

    variationCount = 0;
    for (var check in variations) {
        variationCount += (variations[check] == true) ? 1 : 0;
    }
    score += (variationCount - 1) * 10;

    var x="<pwstrength>"
    x+=parseInt(score).toString();
    x+="</pwstrength>"
    WEBAPP.send(x);
}



//----------------------------------------------------------------------------------------
WEBAPP.password=async function(srcid,srvkey,envelope,challenge)
//----------------------------------------------------------------------------------------
{
//az alábbi függvények mind belsők
//----------------------------------------------------------------------------------------
function arrayBufferToBase64(buffer)
//----------------------------------------------------------------------------------------
{
    var bytes=new Uint8Array(buffer);
    return bytes.toBase64();
}

//----------------------------------------------------------------------------------------
function base64ToArrayBuffer(base64)
//----------------------------------------------------------------------------------------
{
    var bytes=Uint8Array.fromBase64(base64);
    return bytes.buffer.slice();
}

//----------------------------------------------------------------------------------------
function buf2str(buf) // ArrayBuffer -> UTF-8 string  (kivételt dob hibás UTF-8 esetén)
//----------------------------------------------------------------------------------------
{
    var view=new Uint8Array(buf);
    var str=new TextDecoder().decode(view);
    return str; // UTF-8 string
}

//----------------------------------------------------------------------------------------
function str2buf(str)  // UTF-8 string -> ArrayBuffer
//----------------------------------------------------------------------------------------
{
    var arr=new TextEncoder().encode(str); // Uint8Array
    var buf=arr.buffer.slice(); // ArrayBuffer
    return buf;
}


//----------------------------------------------------------------------------------------
async function generatePair()
//----------------------------------------------------------------------------------------
{
    var pair = await crypto.subtle.generateKey(
        {name: "Ed25519"},
        true,
        ["sign", "verify"]
    );
    return pair;
}

//----------------------------------------------------------------------------------------
async function exportPublicKey(key)
//----------------------------------------------------------------------------------------
{
    var exp=await window.crypto.subtle.exportKey("raw",key);  // spki helyett raw
    var view=new Uint8Array(exp);
    return view.toBase64();
};

//----------------------------------------------------------------------------------------
async function exportPrivateKey(key)
//----------------------------------------------------------------------------------------
{
    var exp=await window.crypto.subtle.exportKey("pkcs8",key);
    var view=new Uint8Array(exp);
    return view.toBase64();
}

//----------------------------------------------------------------------------------------
async function importPublicKey(pem)
//----------------------------------------------------------------------------------------
{
    var imp=Uint8Array.fromBase64(pem);
    var key = window.crypto.subtle.importKey(
        "raw",   // spki helyett raw
        imp,
        {name:"Ed25519"},
        true,
        ["verify"]
    );
    return key;
}

//----------------------------------------------------------------------------------------
async function importPrivateKey(pem)
//----------------------------------------------------------------------------------------
{
    var imp=Uint8Array.fromBase64(pem); // Uint8Array
    var key = await window.crypto.subtle.importKey(
        "pkcs8",
        imp,
        {name:"Ed25519"},
        true,
        ["sign"]
    );
    return key;
}

//----------------------------------------------------------------------------------------
async function ED25519sign(key,msg)
//----------------------------------------------------------------------------------------
{
    msg=new TextEncoder().encode(msg); Uint8Array
    msg=await crypto.subtle.sign(
        {name:"Ed25519"},
        key,
        msg
    ); // ArrayBuffer
    msg=new Uint8Array(msg); // Uint8Array
    msg=msg.toBase64(); // base64 string
    return msg;
}

//----------------------------------------------------------------------------------------
async function ED25519verify(key,sig,msg)
//----------------------------------------------------------------------------------------
{
    sig=Uint8Array.fromBase64(sig); // Uint8Array
    msg=new TextEncoder().encode(msg); // Uint8Arrayc
    var res=await crypto.subtle.verify(
        {name:"Ed25519"},
        key,
        sig,
        msg
    );
    return res; // true/false
}

//--------------------------------------------------------------------
async function generateAesKey(sharedSecret)
//--------------------------------------------------------------------
{
    const encoder=new TextEncoder();
    const secret=encoder.encode(sharedSecret);
    const salt=encoder.encode("HUSZg1f3");

    // shared secre -> PBKDF2 alapkulcs
    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        secret,
        "PBKDF2",
        false,
        ["deriveKey"]
    );

    // ugyanaz a salt + iterations + hash + key length
    // => ugyanabból a shared secretből ugyanaz az AES kulcs
    const key=crypto.subtle.deriveKey(
        {name:"PBKDF2", salt:salt, iterations:100000, hash:"SHA-256"},
        keyMaterial,
        {name:"AES-CBC", length:256},
        false,
        ["encrypt", "decrypt"]
    );
    return key;
}

//--------------------------------------------------------------------
async function generateIV(key)
//--------------------------------------------------------------------
{
    var iv=new TextEncoder().encode(key);
    iv = await crypto.subtle.digest('SHA-256',iv);
    iv=iv.slice(0,16);
    return iv;
}

//----------------------------------------------------------------------------------------
async function AESencrypt(passkey,msg) // UTF-8 string -> base64
//----------------------------------------------------------------------------------------
{
    var key=await generateAesKey(passkey);
    var iv=await generateIV(passkey);

    msg=new TextEncoder().encode(msg);
    msg = await window.crypto.subtle.encrypt(
        {name:"AES-CBC",iv},
        key,
        msg
    );
    msg=arrayBufferToBase64(msg);
    return msg;
};

//----------------------------------------------------------------------------------------
async function AESdecrypt(passkey,msg) // base64 -> UTF-8 string
//----------------------------------------------------------------------------------------
{
    var key=await generateAesKey(passkey);
    var iv=await generateIV(passkey);

    msg=base64ToArrayBuffer(msg);
    msg=await window.crypto.subtle.decrypt(
        {name: "AES-CBC", iv},
        key,
        msg
    );
    msg=new TextDecoder().decode(msg);
    return msg;
};

//----------------------------------------------------------------------------------------
//belső függvények vége
//WEBAPP.password=async function(srcid,srvkey,envelope,challenge)
//----------------------------------------------------------------------------------------

    var ctrl=WEBAPP.document.x.getElementById(srcid);
    var password=ctrl.value // tudjuk a jelszavunkat

    // envelope==null esetén regisztráció
    // envelope!=null esetén jelszó ellenőrzés

    var msg;
    var prvkey;
    var pubkey;
    var response

    if( envelope==null )
    {
        // REGISZTRÁCIÓ
        var pair = await generatePair();
        prvkey = await exportPrivateKey(pair.privateKey);
        pubkey = await exportPublicKey(pair.publicKey);
        envelope = await AESencrypt(password+srvkey,prvkey);

        msg="<password>"
        msg+="<pubkey>"+pubkey+"</pubkey>"
        msg+="<envelope>"+envelope+"</envelope>"
        msg+="</password>"
        WEBAPP.send(msg);
    }
    else
    {
        // LOGIN
        // srvkey: ugyanaz a string, mint a regisztrációban
        // envelope: AES kulccsal titkositott private kulcs
        // nem szabad elszállni, mert a szerver örökké vár a válaszra
        try
        {
            prvkey=await AESdecrypt(password+srvkey,envelope); // kivesszük a borítékból
            prvkey=await importPrivateKey(prvkey); // importáljuk
            response=await ED25519sign(prvkey,challenge); // alkalmazzuk -> signature
        }
        catch
        {
            response="!";
        }

        msg="<password>";
        msg+=response;
        msg+="</password>";
        WEBAPP.send(msg);
    }
}

//----------------------------------------------------------------------------------------




//------------------------------------------------------------------------------
WEBAPP.readfile=function(ctrlid,x,mode) 
//------------------------------------------------------------------------------
{
    var ctrl=document.getElementById(ctrlid); //browse: <input type="file">
    var file=ctrl.files[x-1] // 0-tol indexel
    var reader = new FileReader();

    reader.onerror=function()
    {
        //üzenet: webconsole-ra
        var err="read error: "+reader.error.message;
        console.log(err);

        //üzenet: frmaux-ba        
        WEBAPP.frmaux.writeln('<span style="color: red;">'+err+'</span>');

        var x="<readfile>"+err+"</readfile>";
        WEBAPP.send(x);
    }

    reader.onload=function()
    {
        //console.log( reader.result );
        var x="<readfile>"
        x+=WEBAPP.cdataif(reader.result);
        x+="</readfile>";
        WEBAPP.send(x);
    }
    
    if( mode==null )
    {
        reader.readAsDataURL(file);
    }

    else if( mode=="dataurl" )
    {
        reader.readAsDataURL(file);
    }

    else if( mode=="binary" )
    {
        reader.readAsBinaryString(file);
    }

    else if( mode.indexOf("text")==0 )  // pl. "text-ISO-9959-2"
    {
        if( mode=="text" )
        {
            reader.readAsText(file); // UTF-8
        }
        else
        {
            var encoding=mode.substring(5);
            reader.readAsText(file,encoding);
        }
    }

    else
    {
        reader.readAsDataURL(file);
    }

}



WEBAPP.xlib.combo={}

WEBAPP.xlib.combo.show=function(input_id) //input-onclick
{
    //console.log("show",input_id);
    var combo_id=input_id+"-combo";
    var input=document.getElementById(input_id);
    var combo=document.getElementById(combo_id);
    if( combo.style.display=="none" )
    {
        combo.style.display="block";
        row=WEBAPP.xlib.combo.findrow(combo,input.value);
        if(row)
        {
            WEBAPP.bringintoview(combo,row);
        }
    }
    else
    {
        combo.style.display="none";
    }
}


WEBAPP.xlib.combo.clear=function(combo_id) //input-onblur
{
    var combo=document.getElementById(combo_id);
    combo.style.display="none";
}


WEBAPP.xlib.combo.pick=function(event) // mousedown on a <tr> element
{
    event.preventDefault(); //maradjon a fokusz az inputon
    var ctrl=event.target;
    //console.log("pick",ctrl.textContent.trim().replace(/\n/g,';'));
    var input=WEBAPP.xlib.combo.getinput(ctrl);
    input.value=ctrl.textContent.trim().split('\n')[0];
    input.setAttribute("rowid",ctrl.id);
    input.dispatchEvent(new Event('change'));
    var combo_id=input.getAttribute("id")+"-combo";
    var combo=document.getElementById(combo_id);
    combo.style.display="none";
}


WEBAPP.xlib.combo.keyup=function(event)  //editalas
{ 
    var input=event.target; //input mezo
    var combo_id=input.id+"-combo";
    var combo=document.getElementById(combo_id);

    //console.log(event,input.value);

    if( event.key.length==1 )
    {
        combo.style.display="block";
        WEBAPP.xlib.combo.findrow(combo,input.value);
    }
}


WEBAPP.xlib.combo.keydown=function(event)  //navigalas
{
    var input=event.target; //input mezo
    var combo_id=input.id+"-combo";
    var combo=document.getElementById(combo_id);


    if( event.key=='Enter' )
    {
        var row=null;
        if( combo.style.display!='none' )
        {
            row=WEBAPP.xlib.combo.findselectedrow(combo);
        }
        if( !row )
        {
            row=WEBAPP.xlib.combo.findrow(combo,input.value);
        }

        if( row )
        {
            var v=row.textContent.trim().split('\n')[0];  
            if( input.value!=v )
            {
                input.value=v;
                input.setAttribute("rowid",row.id);
                input.dispatchEvent(new Event('change'));
            }
            input.dispatchEvent(new Event('blur'));
        }
    }

    else if( event.key=="Escape" )
    {
        combo.style.display='none';
    }

    else if( event.key=="ArrowDown" )
    {
        if( combo.style.display=='none' )
        {
            combo.style.display="block";
            WEBAPP.xlib.combo.findrow(combo,input.value);
        }
        else
        {
            var row=WEBAPP.xlib.combo.findselectedrow(combo);

            if( row )
            {
                var num1=Number(row.id.substr(5,row.id.length))+1;
                var rowid1='ROWID'+num1;
                var row1=WEBAPP.xlib.combo.findrowid(combo,rowid1);
                if( row1 )
                {
                    var cls=row.getAttribute('class');
                    var cls1=row1.getAttribute('class');
                    row.setAttribute('class',cls.replace('X',''));
                    row1.setAttribute('class',cls1+"X");
                    WEBAPP.bringintoview(combo,row1);
                }
            }
            else
            {
                WEBAPP.xlib.combo.findrow(combo,input.value);
            }
        }
    }

    else if( event.key=="ArrowUp" )
    {
        if( combo.style.display=='none' )
        {
            combo.style.display="block";
            WEBAPP.xlib.combo.findrow(combo,input.value);
        }
        else
        {
            var row=WEBAPP.xlib.combo.findselectedrow(combo);

            if( row  )
            {
                var num1=Number(row.id.substr(5,row.id.length))-1;
                var rowid1='ROWID'+num1;
                var row1=WEBAPP.xlib.combo.findrowid(combo,rowid1);
                if( row1 )
                {
                    var cls=row.getAttribute('class');
                    var cls1=row1.getAttribute('class');
                    row.setAttribute('class',cls.replace('X',''));
                    row1.setAttribute('class',cls1+"X");
                    WEBAPP.bringintoview(combo,row1);
                }
            }
            else
            {
                WEBAPP.xlib.combo.findrow(combo,input.value);
            }
        }
    }
}


WEBAPP.xlib.combo.findrow=function(node,value) //input.value egyezes alapjan keres
{
    var row=null;
    var ch=node.childNodes;
    for(var n=0; n<ch.length; n++)
    {
        var ch1=ch[n];
        if( ch1.tagName=="TR" )
        {
            var txt=ch1.textContent.trim(); 
            var cls=ch1.getAttribute('class');
            //console.log(cls,txt);
            if( cls )
            {
                cls=cls.replace('X','');
                if( txt.substr(0,value.length)==value )
                {
                    cls+='X';
                    value='???'+value;
                    //ch1.scrollIntoView(false);
                    row=ch1;
                }
                ch1.setAttribute('class',cls);
            }
        }
        else
        {
            ch1=WEBAPP.xlib.combo.findrow(ch1,value);
            if( !row )
            {
                row=ch1;
            }
        }
    }
    return row;
}


WEBAPP.xlib.combo.findselectedrow=function(node) // class='oddX/evenX'-et keres
{
    var ch=node.childNodes;
    for(var n=0; n<ch.length; n++)
    {
        var ch1=ch[n];
        if( ch1.tagName=="TR" )
        {
            var cls=ch1.getAttribute('class');
            //console.log("cls",cls);
            if( cls=="oddX" || cls=="evenX" )
            {
                //console.log(ch1);
                return ch1;
            }
        }
        else
        {
            ch1=WEBAPP.xlib.combo.findselectedrow(ch1);
            if( ch1 )
            {
                return ch1;
            }
        }
    }
}


WEBAPP.xlib.combo.findrowid=function(node,rowid) //ROWID<n>-et keres
{
    var ch=node.childNodes;
    for(var n=0; n<ch.length; n++)
    {
        var ch1=ch[n];
        if( ch1.tagName=="TR" )
        {  
            //console.log(ch1.getAttribute('id'));
            if( ch1.getAttribute('id')==rowid )
            {
                return ch1;
            }
        }
        else
        {
            ch1=WEBAPP.xlib.combo.findrowid(ch1,rowid);
            if( ch1 )
            {
                return ch1;
            }
        }
    }
}


WEBAPP.xlib.combo.getpicker=function(ctrl)
{
    while( ctrl!=null )
    {
        //console.log(ctrl.nodeName,ctrl.className);
        if( ctrl.className=="combo" )
        {
            var input_id=ctrl.id.replace("-combo","");
            var input=document.getElementById(input_id);
            return ctrl;
        }
        ctrl=ctrl.parentNode;
    }
}

WEBAPP.xlib.combo.getinput=function(ctrl)
{
    while( ctrl!=null )
    {
        //console.log(ctrl.nodeName,ctrl.className);
        if( ctrl.className=="combo" )
        {
            var input_id=ctrl.id.replace("-combo","");
            var input=document.getElementById(input_id);
            return input;
        }
        ctrl=ctrl.parentNode;
    }
}


WEBAPP.xlib.combo.gettable=function(combo)
{
    var children=combo.childNodes;
    for( var n=0; n<children.length; n++ )
    {
        if( children[n].tagName=="TABLE" )
        {
            return children[n];
        }
    }
}


WEBAPP.xlib.datepicker={};


WEBAPP.xlib.datepicker.show=function(input_id) //input-onclick
{
    //console.log("show",input_id);
    var datepicker_id=input_id+"-datepicker";
    var input=document.getElementById(input_id);
    var datepicker=document.getElementById(datepicker_id);
    datepicker.innerHTML=WEBAPP.xlib.datepicker.table(input.value);
    if( datepicker.style.display=="none" )
    {
        datepicker.style.display="block";
    }
    else
    {
        datepicker.style.display="none";
    }
    event.stopPropagation();
}


WEBAPP.xlib.datepicker.clear=function(datepicker_id) //input-onblur
{
    //console.log("clear",datepicker_id);
    var datepicker=document.getElementById(datepicker_id)
    datepicker.style.display="none";
}


WEBAPP.xlib.datepicker.pick=function(event,n_date,otherpage) //td-onmousedown
{
    event.preventDefault(); // maradjon a fokusz az inputon
    var ctrl=event.target;
    //console.log("pick",ctrl.textContent);
    var input=WEBAPP.xlib.datepicker.getinput(ctrl);
    var picker=WEBAPP.xlib.datepicker.getpicker(ctrl);

    if( otherpage ) 
    {
        // év vagy hónap váltás
        picker.innerHTML=WEBAPP.xlib.datepicker.table(input.value,n_date);
    }
    else 
    {
        // klikk a hónap napján
        var d_date=new Date(n_date);
        input.value=WEBAPP.dat2str(d_date);
        input.dispatchEvent(new Event('change'));
        var picker_id=input.getAttribute("id")+"-datepicker";
        var picker=document.getElementById(picker_id);
        picker.style.display="none";
    }

}

WEBAPP.xlib.datepicker.getpicker=function(ctrl)
{
    while( ctrl!=null )
    {
        //console.log(ctrl.nodeName,ctrl.className);
        if( ctrl.className=="datepicker" )
        {
            var input_id=ctrl.id.replace("-datepicker","");
            var input=document.getElementById(input_id);
            return ctrl;
        }
        ctrl=ctrl.parentNode;
    }
}

WEBAPP.xlib.datepicker.getinput=function(ctrl)
{
    while( ctrl!=null )
    {
        //console.log(ctrl.nodeName,ctrl.className);
        if( ctrl.className=="datepicker" )
        {
            var input_id=ctrl.id.replace("-datepicker","");
            var input=document.getElementById(input_id);
            return input;
        }
        ctrl=ctrl.parentNode;
    }
}


WEBAPP.xlib.datepicker.table=function(inputvalue,n_date) 
{
    //-----------------------
    var DATEPICKER_CONFIG = {
    'cssprefix'  : 'dp',
    'months'     : ['Január','Február','Március','Április','Május','Június','Július','Augusztus','Szeptember','Október','November','December'],
    'weekdays'   : ['Vas','Hét','Ked','Sze','Csü','Pén','Szo'],
    'longwdays'  : ['Vasárnap','Hétfő','Kedd','Szerda','Csütörtök','Péntek','Szombat'],
    'weekstart'  : 1, // first day of week: 0-Su or 1-Mo
    'prevyear'   : 'Előző év',
    'nextyear'   : 'Következő év',
    'prevmonth'  : 'Előző hónap',
    'nextmonth'  : 'Következő hónap',
    };

    //-----------------------
    function datepicker_resettime(d_date) 
    {
        d_date.setMilliseconds(0);
        d_date.setSeconds(0);
        d_date.setMinutes(0);
        d_date.setHours(12);
        return d_date;
    }

    //-----------------------
    function datepicker_makehandler(d_date,d_diff,s_units) 
    {
        var s_units=(s_units=='y'?'FullYear':'Month');
        var d_result=new Date(d_date);
        if(d_diff) 
        {
            d_result['set'+s_units](d_date['get'+s_units]()+d_diff); //interesting   
            if(d_result.getDate() != d_date.getDate())
            {
                d_result.setDate(0); //last day of previous month
            }
        }
        return ' onmousedown="WEBAPP.xlib.datepicker.pick(event,'+ d_result.valueOf() + (d_diff?',1':'')  +')"';
    }
    //-----------------------

    var s_pfx = DATEPICKER_CONFIG.cssprefix;

    var d_today = datepicker_resettime(new Date());

    var d_selected;
    var n_millisec=Date.parse(inputvalue);
    if( !isNaN(n_millisec) )
    {
        d_selected=datepicker_resettime(new Date(n_millisec));
    }
    else
    {
        d_selected=new Date(d_today);
    }

    var d_date;   
    if( n_date==null )
    {
        d_date=new Date(d_selected);
    }
    else
    {
        d_date=new Date(n_date);
    }

    //console.log(inputvalue,d_selected, d_date);

    var s_html;

    s_html='<table class="'+s_pfx+'Controls">';
    s_html+='<tbody>';
    s_html+='<tr>'
        + '<td class="'+s_pfx+'PrevYear" ' + datepicker_makehandler(d_date, -1, 'y') + ' title="' + DATEPICKER_CONFIG.prevyear  + '"><span style="font-size:large;">«</span></td>'
        + '<td class="'+s_pfx+'PrevMonth"' + datepicker_makehandler(d_date, -1, 'm') + ' title="' + DATEPICKER_CONFIG.prevmonth + '"><span style="font-size:large;">‹</span></td>'
        + '<th>' + d_date.getFullYear() + ' ' + DATEPICKER_CONFIG.months[d_date.getMonth()]+'</th>'
        + '<td class="'+s_pfx+'NextMonth"' + datepicker_makehandler(d_date,  1, 'm') + ' title="' + DATEPICKER_CONFIG.nextmonth + '"><span style="font-size:large;">›</span></td>'
        + '<td class="'+s_pfx +'NextYear"' + datepicker_makehandler(d_date,  1, 'y') + ' title="' + DATEPICKER_CONFIG.nextyear  + '"><span style="font-size:large;">»</span></td>'
        + '</tr>';
    s_html+='</tbody>';
    s_html+='</table>';
    
    
    s_html+='<table class="'+s_pfx+'Grid">';
    s_html+='<tbody>';

    // print weekdays titles
    s_html+='<tr>';
    for( var i=0; i<7; i++ )
    {
        s_html+='<th>' + DATEPICKER_CONFIG.weekdays[(DATEPICKER_CONFIG.weekstart+i)%7] + '</th>';
    }
    s_html+='</tr>';

    // print calendar table

    var d_firstDay = new Date(d_date);
    d_firstDay.setDate(1);
    d_firstDay.setDate(1-(7+d_firstDay.getDay()-DATEPICKER_CONFIG.weekstart)%7);
    var d_current = new Date(d_firstDay);

    while( d_current.getMonth()==d_date.getMonth() || d_current.getMonth()==d_firstDay.getMonth()) 
    {
        s_html+='<tr>';
        for( var n_wday=0; n_wday<7; n_wday++ ) 
        {
            var a_class = [];
            var n_date  = d_current.getDate();
            var n_month = d_current.getMonth();

            if( d_current.getMonth() != d_date.getMonth() )
            {
                a_class[a_class.length] = s_pfx+'OtherMonth';
            }
            if( d_current.getDay() == 0 || d_current.getDay() == 6 )
            {
                a_class[a_class.length] = s_pfx+'Weekend';
            }
            if( d_current.valueOf() == d_today.valueOf() )
            {
                a_class[a_class.length]=s_pfx+'Today';
            }
            if( d_current.valueOf() == d_selected.valueOf() )
            {
                a_class[a_class.length] = s_pfx + 'Selected';
            }

            s_html+='<td'+datepicker_makehandler(d_current)+(a_class.length?'class="'+ a_class.join(' ')+'">':'>')+n_date+'</td>';

            d_current.setDate(++n_date);
        }
        s_html+='</tr>';
    }
    s_html+='</tbody>';
    s_html+='</table>';

    return s_html;
}



WEBAPP.xlib.popup={};


WEBAPP.xlib.popup.clicked=function(ctrl)
{
    //console.log("popup_clicked");

    var popup=WEBAPP.xlib.popup;
    if(!popup.active)
    {
        popup.ctrl=ctrl;
        popup.posx=event.clientX;
        popup.posy=event.clientY;
        popup.popupid=ctrl.getAttribute("popupid");
        popup.popuptag=ctrl.getAttribute("popuptag");
        popup.popupcls=ctrl.getAttribute("popupcls");

        var msg="<"+popup.popuptag+">"
        msg+=popup.popupid
        msg+="</"+popup.popuptag+">"
        WEBAPP.echo(msg)
    }
}


WEBAPP.xlib.popup.show=function(html)
{
    //console.log("popup_show");

    if( WEBAPP.xlib.popup.active==null && 
        WEBAPP.xlib.popup.posx!=null && 
        WEBAPP.xlib.popup.posy!=null )
    {
        WEBAPP.xlib.popup.active=true;
        WEBAPP.xlib.popup.x=WEBAPP.document.x.createElement("div");
        var popup=WEBAPP.xlib.popup.x;
        popup.innerHTML=html;
    
        var parent=WEBAPP.xlib.popup.ctrl;
        while(parent)
        {
            //console.log(parent.nodeName);
            if( parent.nodeName=="FIELDSET" )
            {
                break;
            }
            parent=parent.parentElement;
        }
        if(!parent)
        {
            parent=WEBAPP.webapp.scroll.x;
        }
        else
        {
            var rect=parent.getBoundingClientRect(); 
            WEBAPP.xlib.popup.posx-=rect.left;
            WEBAPP.xlib.popup.posy-=rect.top;
        }
        WEBAPP.xlib.popup.parent=parent;
    
        popup.style.top=WEBAPP.xlib.popup.posy.toString()+"px";
        popup.style.left=WEBAPP.xlib.popup.posx.toString()+"px";
        popup.style.display='block';
        popup.setAttribute("class",WEBAPP.xlib.popup.popupcls);
        popup.setAttribute("onclick","event.stopPropagation()"); //mukodjon a drag
    
        parent.appendChild(popup);
        document.body.setAttribute("onclick","WEBAPP.xlib.popup.clear()");
        WEBAPP.xlib.dragElement(popup); 
    }
}


WEBAPP.xlib.popup.clear=function()
{   
    //console.log("popup_clear");

    var popup=WEBAPP.xlib.popup.x;
    WEBAPP.xlib.popup.parent.removeChild(popup);
    WEBAPP.xlib.popup.x=null;
    WEBAPP.xlib.popup.ctrl=null;
    WEBAPP.xlib.popup.parent=null;
    WEBAPP.xlib.popup.popupid=null;
    WEBAPP.xlib.popup.popupcls=null;
    WEBAPP.xlib.popup.popuptag=null;
    WEBAPP.xlib.popup.posx=null;
    WEBAPP.xlib.popup.posy=null;
    WEBAPP.xlib.popup.active=null;
    document.body.removeAttribute("onclick")
}



WEBAPP.xlib.dragElement=function(elmnt) 
{
    //console.log("dragElement");

    var pos1=0,pos2=0,pos3=0,pos4=0;
    elmnt.onmousedown=dragMouseDown;

    //nem vilagos:
    //hova definialodik dragMouseDown?
    //ujradefinialodik-e dragMouseDown dragElement minden hivasakor?
    //hol vannak a pos1... valtozok?
    //hogyan latja dragMouseDown pos1-et?

    function dragMouseDown(e) 
    {
        //console.log("dragMouseDown");

        //e = e || window.event;  //ez mi?
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = dragMouseUp;
        document.onmousemove = dragMouseMove;
    }

    function dragMouseMove(e) 
    {
        //console.log("dragMouseMove");

        //e = e || window.event;
        e.preventDefault();
        pos1=pos3-e.clientX;
        pos2=pos4-e.clientY;
        pos3=e.clientX;
        pos4=e.clientY;
        elmnt.style.top=(elmnt.offsetTop-pos2)+"px";
        elmnt.style.left=(elmnt.offsetLeft-pos1)+"px";
    }

    function dragMouseUp(e) 
    {
        //console.log("dragMouseUp");

        //e = e || window.event;
        e.preventDefault();
        document.onmouseup = null;
        document.onmousemove = null;
    }
}


//------------------------------------------------------------------------------
WEBAPP.register_focus=function(element)
//------------------------------------------------------------------------------
{
    var p=element.parentElement;
    while( p!=null )
    {
        if( p.getAttribute("class")=="subform" )
        {
            //console.log("LASTFOCUS",p.id,"<-",element.id);
            p.setAttribute("lastfocus",element.id);
            break;
        }
        p=p.parentElement;
    }
}

//------------------------------------------------------------------------------
WEBAPP.page_focus_handler=function( inputid )
//------------------------------------------------------------------------------
{
    //console.log("page_focus_handler",inputid);

    var inputs=document.querySelectorAll('input[type="text"],select'); // SELECTOR: osszes input mezore
    for(inp of inputs)
    {
        // console.log("ONFOCUS",inp.id);
        inp.setAttribute("onfocus","WEBAPP.register_focus(this)");
    }

    var callback_subform_visibility=function(mutList,observer)
    {
        for( mutation of mutList )
        {
            var subform=mutation.target; // ennek valtozhatott a lathatosaga
            var lastid=subform.getAttribute("lastfocus"); // ezen volt utoljara a focus
            if( lastid!=null && subform.style.display!=="none" )
            {
                var element=document.getElementById(lastid);
                if( element!=null )
                {
                    element.focus();
                }
                break;
            }
        }
    }
    var observer_subform_visibility=new MutationObserver( callback_subform_visibility );
    var subforms=document.getElementsByClassName("subform"); // osszes subform
    for( i=0; i<subforms.length; i++ )
    {
        var sub=subforms[i];
        observer_subform_visibility.observe( sub, {attributes:"true",attributeFilter:['style']})
        var inp=sub.querySelector("input[type='text'],select"); // SELECTOR:  elso input elem sub-ban
        if( inp!=null && inp.id!=null )
        {
            sub.setAttribute("lastfocus",inp.id);
        }
        if( inp!=null &&  i==0 )
        {
            inp.focus(); // elso subform elso input elemere
        }
    }
    
    if( inputid!=null ) 
    { 
        inp=document.getElementById(inputid);
        if( inp!=null )
        {
            //console.log("FOCUS on",inp);
            WEBAPP.register_focus(inp)
            inp.focus(); // fokusz a megadott elemre
        }
    }
}


//------------------------------------------------------------------------------
