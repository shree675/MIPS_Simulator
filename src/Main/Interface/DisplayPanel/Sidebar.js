import React, {useState} from "react";
import { ListGroupItem } from "react-bootstrap";
import { Dropdown } from "reactjs-dropdown-component";
import "./Sidebar.css";
import Checkbox from '@material-ui/core/Checkbox';
import CacheDisplay from "./CacheDisplay";

const Sidebar = props =>
{
  const [b,setB] = useState(false);
  const [h,setH] = useState(false);
  const [d,setD] = useState(true);
  const [checked, setChecked] = useState(false);
  var customcheck=false;

  var pc=props.programCounter;
  var registersmap=props.registersmap;

  var registersmaphex=new Map();
  var registersmapbin=new Map();

  var memoryArr=props.memoryArray;

  var prevRegisters=props.prevRegisters;

  for(var [key,value] of registersmap){
    if(document.getElementById(key+'hex')!=null){
      if(prevRegisters.get(key)!=registersmap.get(key)){
        document.getElementById(key+'hex').style.backgroundColor="#bd93f9";
      }
      else{
        document.getElementById(key+'hex').style.backgroundColor="#383144";
      }
    }
    if(document.getElementById(key)!=null){
      if(prevRegisters.get(key)!=registersmap.get(key)){
        document.getElementById(key).style.backgroundColor="#bd93f9";
      }
      else{
        document.getElementById(key).style.backgroundColor="#383144";
      }
    }
    if(document.getElementById(key+'bin')!=null){
      if(prevRegisters.get(key)!=registersmap.get(key)){
        document.getElementById(key+'bin').style.backgroundColor="#bd93f9";
      }
      else{
        document.getElementById(key+'bin').style.backgroundColor="#383144";
      }
    }
  }

  var str="";
  var strdec="";
  var strbin="";

  var start=-1;
  var prev=-1;
  var c=0;
  var lastSeen=0;

  for(var i=0;i<1024;i++){
    if(memoryArr[i]!=0){
      c=1;
      lastSeen=i;
      if(start==prev){
        str+=("[0x" + (4*i+268500992).toString(16) + "]: " + memoryArr[i].toString(16) + "<br/>");
        strdec+=("[0x" + (4*i+268500992).toString(16) + "]: " + memoryArr[i].toString(10) + "<br/>");
        strbin+=("[0x" + (4*i+268500992).toString(16) + "]: " + memoryArr[i].toString(2) + "<br/>");
        prev=i;
      }
      else{
        str+=(start==prev?("[0x" + (4*i+268500992).toString(16) + "]: " + memoryArr[i].toString(16) + "<br/>"):("<br>" + "[0x" + (4*(prev+1)+268500992).toString(16) + "...<br/>..." + "0x" + (4*(i)+268500992).toString(16) + "]: 0<br></br>" + "[0x" + (4*i+268500992).toString(16) + "]: " + memoryArr[i].toString(16) + "<br/>"));
        strdec+=(start==prev?("[0x" + (4*i+268500992).toString(16) + "]: " + memoryArr[i].toString(10) + "<br/>"):("<br>" + "[0x" + (4*(prev+1)+268500992).toString(16) + "...<br/>..." + "0x" + (4*(i)+268500992).toString(16) + "]: 0<br></br>" + "[0x" + (4*i+268500992).toString(16) + "]: " + memoryArr[i].toString(10) + "<br/>"));
        strbin+=(start==prev?("[0x" + (4*i+268500992).toString(16) + "]: " + memoryArr[i].toString(2) + "<br/>"):("<br>" + "[0x" + (4*(prev+1)+268500992).toString(16) + "...<br/>..." + "0x" + (4*(i)+268500992).toString(16) + "]: 0<br></br>" + "[0x" + (4*i+268500992).toString(16) + "]: " + memoryArr[i].toString(2) + "<br/>"));
        
        prev=i;        
      }
    }
    start=i;
  }

  if(c===0){
    prev=0;
    str+=("[0x" + (4*prev+268500992).toString(16) + "...<br/>...0x" + (4*(1024)+268500992).toString(16) + "]: 0<br/>");
    strdec+=("[0x" + (4*prev+268500992).toString(16) + "...<br/>...0x" + (4*(1024)+268500992).toString(16) + "]: 0<br/>");
    strbin+=("[0x" + (4*prev+268500992).toString(16) + "...<br/>...0x" + (4*(1024)+268500992).toString(16) + "]: 0<br/>");
  }

  else{
    if(lastSeen!=1023){
      // console.log(start);
      str+=("<br>" + "[0x" + (4*(lastSeen+1)+268500992).toString(16) + "...<br/>...0x" + (4*(1024)+268500992).toString(16) + "]: 0<br/>");
      strdec+=("<br>" + "[0x" + (4*(lastSeen+1)+268500992).toString(16) + "...<br/>...0x" + (4*(1024)+268500992).toString(16) + "]: 0<br/>");
      strbin+=("<br>" + "[0x" + (4*(lastSeen+1)+268500992).toString(16) + "...<br/>...0x" + (4*(1024)+268500992).toString(16) + "]: 0<br/>");
    }
  }

  if(document.getElementById("memory-table")!=null){
    document.getElementById("memory-table").innerHTML=str;
  }

  if(document.getElementById("memory-tabledec")!=null){
    document.getElementById("memory-tabledec").innerHTML=strdec;
  }

  if(document.getElementById("memory-tablebin")!=null){
    document.getElementById("memory-tablebin").innerHTML=strbin;
  }

  for(var [key,value] of registersmap){
    registersmaphex.set(key,value.toString(16));
    registersmapbin.set(key,value.toString(2));    
  }

  function reg() {
    {document.getElementById("mem").style.display="none";}
    {document.getElementById("regs").style.display="block";}
    {document.getElementById("cache-display").style.display="none";}
    {document.getElementById("b3").style.backgroundColor="#333333"}
    {document.getElementById("b1").style.backgroundColor="gray"}
    {document.getElementById("b2").style.backgroundColor="#333333"}
    document.getElementById("sb1").style.opacity="1";
    document.getElementById("sb2").style.opacity="1";
    document.getElementById("sb3").style.opacity="1";
    // console.log("registers");
  }

  function memory() {
    {document.getElementById("regs").style.display="none";}
    {document.getElementById("mem").style.display="block";}
    {document.getElementById("cache-display").style.display="none";}
    {document.getElementById("b3").style.backgroundColor="#333333"}
    {document.getElementById("b1").style.backgroundColor="#333333"}
    {document.getElementById("b2").style.backgroundColor="gray"}
    document.getElementById("sb1").style.opacity="1";
    document.getElementById("sb2").style.opacity="1";
    document.getElementById("sb3").style.opacity="1";
    // console.log("memory");
  }

  function cache() {
    {document.getElementById("regs").style.display="none";}
    {document.getElementById("mem").style.display="none";}
    {document.getElementById("cache-display").style.display="block";}
    {document.getElementById("b3").style.backgroundColor="gray"}
    {document.getElementById("b1").style.backgroundColor="#333333"}
    {document.getElementById("b2").style.backgroundColor="#333333"}
    document.getElementById("sb1").style.opacity="0.5";
    document.getElementById("sb2").style.opacity="0.5";
    document.getElementById("sb3").style.opacity="0.5";
    // console.log("memory");
  }

  function dec() {
    // d=true;
    // h=false;
    // b=false;
    setB(false);
    setD(true);
    setH(false);
    {document.getElementById("decimal").style.display="block"}
    {document.getElementById("hexadecimal").style.display="none"}
    {document.getElementById("binary").style.display="none"}
    {document.getElementById("sb1").style.backgroundColor="grey"}
    {document.getElementById("sb2").style.backgroundColor="#333333"}
    {document.getElementById("sb3").style.backgroundColor="#333333"}
    console.log("decimal");
  }

  function hex() {
    // d=false;
    // h=true;
    // b=false;
    setB(false);
    setD(false);
    setH(true);
    {document.getElementById("decimal").style.display="none"}
    {document.getElementById("hexadecimal").style.display="block"}
    {document.getElementById("binary").style.display="none"}
    {document.getElementById("sb1").style.backgroundColor="#333333"}
    {document.getElementById("sb2").style.backgroundColor="grey"}
    {document.getElementById("sb3").style.backgroundColor="#333333"}
    console.log("hexadecimal");
  }

  function bin() {
    // d=false;
    // h=false;
    // b=true;
    setB(true);
    setD(false);
    setH(false);
    {document.getElementById("decimal").style.display="none"}
    {document.getElementById("hexadecimal").style.display="none"}
    {document.getElementById("binary").style.display="block"}
    {document.getElementById("sb1").style.backgroundColor="#333333"}
    {document.getElementById("sb2").style.backgroundColor="#333333"}
    {document.getElementById("sb3").style.backgroundColor="grey"}
    console.log("binary");
  }

  function changeChbox(event){        
    setChecked(event.target.checked);
    customcheck=!checked;
    // console.log(customcheck);
    onCacheChange();
  }

  var l1cachesize=16;
  var l2cachesize=64;
  var l1blocksize=4;
  var l2blocksize=4;
  var l1assoc=1;
  var l2assoc=1;
  var l1latency=1;
  var l2latency=2;
  var memlatency=10;

  var l1cachetable=props.l1cache;
  var l2cachetable=props.l2cache;

  var l1sets,l2sets;

  l1sets=[];
  l2sets=[];

  // console.log('cache data',l1cachetable)

  var x=0;

  try{

  for(var i=0;i<l1cachetable._data.length;i++){
    // console.log('fasd',l1cachetable._data[i])
    l1sets.push(l1cachetable._data[i]);
    x=0;
    
  }
  }
  catch(error){
    x=1;
  }

  try{

    console.log(l2cachetable);

  for(var i=0;i<l2cachetable._data.length;i++){
    // console.log('fasd',l2cachetable._data)
    l2sets.push(l2cachetable._data[i]);
    x=0;
  }
  }
  catch(error){
    x=1;
  }

  // console.log('fasasasffsasdaffasfdasadfsfasas',l1sets);

  // console.log(l1cachetable);
  // console.log(l2cachetable);

  function onCacheChange(){
    props.onCacheChange(l1cachesize,l1blocksize,l1assoc,l1latency,l2cachesize,l2blocksize,l2assoc,l2blocksize,l2latency,memlatency,customcheck);
  }

  function changeCacheSizel1(item,value) {
    l1cachesize=parseInt(item.value);    
    onCacheChange();
  }

  function changeCacheSizel2(item,value) {
    l2cachesize=parseInt(item.value);
    onCacheChange();
  }

  function changeBlockSizel1(item,value) {
    l1blocksize=parseInt(item.value);
    onCacheChange();
  }

  function changeBlockSizel2(item,value) {
    l2blocksize=parseInt(item.value);
    onCacheChange();
  }

  function changeAssocl1(item,value) {
    if(item.value==="Direct Mapped"){
      l1assoc=1;
    }
    else if(item.value==="Fully Associative"){
      l1assoc=l1cachesize/l1blocksize;
    }
    else{
      l1assoc=parseInt(item.value);
    }
    onCacheChange();
  }

  function changeAssocl2(item,value) {
    if(item.value==="Direct Mapped"){
      l2assoc=1;
    }
    else if(item.value==="Fully Associative"){
      l2assoc=l2cachesize/l2blocksize;
    }
    else{
      l2assoc=parseInt(item.value);
    }
    onCacheChange();
  }

  function changeLatl1(item,value) {
    l1latency=parseInt(item.value);
    onCacheChange();
  }

  function changeLatl2(item,value) {
    l2latency=parseInt(item.value);
    onCacheChange();
  }

  function changeLatMem(item,value) {
    memlatency=parseInt(item.value);
    onCacheChange();
  }

  let cachesizesl1=[
    {
      label: '16 bytes',
      value: '16'
    },
    {
      label: '32 bytes',
      value: '32'
    }
  ];

  let cachesizesl2=[
    {
      label: '64 bytes',
      value: '64'
    },
    {
      label: '128 bytes',
      value: '128'
    }
  ];

  let blocksizes=[
    {
      label: '4 bytes',
      value: '4'
    },
    {
      label: '8 bytes',
      value: '8'
    }
  ];

  let assocl1=[
    {
      label: 'Direct Mapped',
      value: 'Direct Mapped'
    },
    {
      label: '2 way',
      value: '2'
    },
    {
      label: '4 way',
      value: '4'
    },
    {
      label: 'Fully Associative',
      value: 'Fully Associative'
    }
  ];

  let assocl2=[
    {
      label: 'Direct Mapped',
      value: 'Direct Mapped'
    },
    {
      label: '2 way',
      value: '2'
    },
    {
      label: '4 way',
      value: '4'
    },
    {
      label: '8 way',
      value: '8'
    },
    {
      label: 'Fully Associative',
      value: 'Fully Associative'
    }
  ];

  let latencyl1=[
    {
      label: '1 cycle',
      value: '1'
    },
    {
      label: '2 cycles',
      value: '2'
    }
  ];

  let latencyl2=[
    {
      label: '2 cycles',
      value: '2'
    },
    {
      label: '3 cycles',
      value: '3'
    },
    {
      label: '4 cycles',
      value: '4'
    }
  ];

  let latencymem=[
    {
      label: '10 cycles',
      value: '10'
    },
    {
      label: '20 cycles',
      value: '20'
    },
    {
      label: '30 cycles',
      value: '30'
    }
  ];

  return (
    <div className="sidebar">
      
      <div className="sidebar-menu">
        <button id="b1" onClick={reg}>REGISTERS</button>
        <button id="b2" onClick={memory}>MEMORY</button>
        <button id="b3" onClick={cache}>CACHE</button>
      </div>
      
      <br></br>
      <hr style={{margin:`0px`, clear:`both`, padding:`0px`, height:`2px`, border:`none`, backgroundColor:`gray`}}></hr>

      <div className="sidebar-options">
        <button id="sb1" onClick={dec}>DECIMAL</button>
        <button id="sb2" onClick={hex}>HEXADECIMAL</button>
        <button id="sb3" onClick={bin}>BINARY</button>
      </div>
      <br></br>
      <hr style={{margin:`0px`, clear:`both`, padding:`0px`, height:`1px`, border:`none`, backgroundColor:`gray`}}></hr>

      <div>
        <ul>

          <li id="regs">
            <div>
              <ul>
                <li id="decimal" style={{display: d?`block`:`none`}}>
                  {/* Decimal */}
                  {/* <br></br> */}

                  <table className="registers-table">

                    <tr className="tr-table">
                      <td id="pc-table">PC: {pc}</td>
                      <td></td>
                    </tr>
                    <tr>
                      <td id="r0">R0 [r0]: {registersmap.get("r0")}</td>
                      <td id="s0">R16 [s0]: {registersmap.get("s0")}</td>
                    </tr>
                    <tr>
                      <td id="at">R1 [at]: {registersmap.get("at")}</td>
                      <td id="s1">R17 [s1]: {registersmap.get("s1")}</td>
                    </tr>
                    <tr>
                      <td id="v0">R2 [v0]: {registersmap.get("v0")}</td>
                      <td id="s2">R18 [s2]: {registersmap.get("s2")}</td>
                    </tr>
                    <tr>
                      <td id="v1">R3 [v1]: {registersmap.get("v1")}</td>
                      <td id="s3">R19 [s3]: {registersmap.get("s3")}</td>
                    </tr>
                    <tr>
                      <td id="a0">R4 [a0]: {registersmap.get("a0")}</td>
                      <td id="s4">R20 [s4]: {registersmap.get("s4")}</td>
                    </tr>
                    <tr>
                      <td id="a1">R5 [a1]: {registersmap.get("a1")}</td>
                      <td id="s5">R21 [s5]: {registersmap.get("s5")}</td>
                    </tr>
                    <tr>
                      <td id="a2">R6 [a2]: {registersmap.get("a2")}</td>
                      <td id="s6">R22 [s6]: {registersmap.get("s6")}</td>
                    </tr>
                    <tr>
                      <td id="a3">R7 [a3]: {registersmap.get("a3")}</td>
                      <td id="s7">R23 [s7]: {registersmap.get("s7")}</td>
                    </tr>
                    <tr>
                      <td id="t0">R8 [t0]: {registersmap.get("t0")}</td>
                      <td id="t8">R24 [t8]: {registersmap.get("t8")}</td>
                    </tr>
                    <tr>
                      <td id="t1">R9 [t1]: {registersmap.get("t1")}</td>
                      <td id="t9">R25 [t9]: {registersmap.get("t9")}</td>
                    </tr>
                    <tr>
                      <td id="t2">R10 [t2]: {registersmap.get("t2")}</td>
                      <td id="k0">R26 [k0]: {registersmap.get("k0")}</td>
                    </tr>
                    <tr>
                      <td id="t3">R11 [t3]: {registersmap.get("t3")}</td>
                      <td id="k1">R27 [k1]: {registersmap.get("k1")}</td>
                    </tr>
                    <tr>
                      <td id="t4">R12 [t4]: {registersmap.get("t4")}</td>
                      <td id="gp">R28 [gp]: {registersmap.get("gp")}</td>
                    </tr>
                    <tr>
                      <td id="t5">R13 [t5]: {registersmap.get("t5")}</td>
                      <td id="sp">R29 [sp]: {registersmap.get("sp")}</td>
                    </tr>
                    <tr>
                      <td id="t6">R14 [t6]: {registersmap.get("t6")}</td>
                      <td id="s8">R30 [s8]: {registersmap.get("s8")}</td>
                    </tr>
                    <tr>
                      <td id="t7">R15 [t7]: {registersmap.get("t7")}</td>
                      <td id="ra">R31 [ra]: {registersmap.get("ra")}</td>
                    </tr>

                  </table>

                </li>
                <li id="hexadecimal" style={{display: h?`block`:`none`}}>
                  {/* Hexadecimal */}

                  <table className="registers-table">

                    <tr className="tr-table">
                      <td id="pc-table">PC: {pc}</td>
                      <td></td>
                    </tr>
                    <tr>
                      <td id="r0hex">R0 [r0]: {registersmaphex.get("r0")}</td>
                      <td id="s0hex">R16 [s0]: {registersmaphex.get("s0")}</td>
                    </tr>
                    <tr>
                      <td id="athex">R1 [at]: {registersmaphex.get("at")}</td>
                      <td id="s1hex">R17 [s1]: {registersmaphex.get("s1")}</td>
                    </tr>
                    <tr>
                      <td id="v0hex">R2 [v0]: {registersmaphex.get("v0")}</td>
                      <td id="s2hex">R18 [s2]: {registersmaphex.get("s2")}</td>
                    </tr>
                    <tr>
                      <td id="v1hex">R3 [v1]: {registersmaphex.get("v1")}</td>
                      <td id="s3hex">R19 [s3]: {registersmaphex.get("s3")}</td>
                    </tr>
                    <tr>
                      <td id="a0hex">R4 [a0]: {registersmaphex.get("a0")}</td>
                      <td id="s4hex">R20 [s4]: {registersmaphex.get("s4")}</td>
                    </tr>
                    <tr>
                      <td id="a1hex">R5 [a1]: {registersmaphex.get("a1")}</td>
                      <td id="s5hex">R21 [s5]: {registersmaphex.get("s5")}</td>
                    </tr>
                    <tr>
                      <td id="a2hex">R6 [a2]: {registersmaphex.get("a2")}</td>
                      <td id="s6hex">R22 [s6]: {registersmaphex.get("s6")}</td>
                    </tr>
                    <tr>
                      <td id="a3hex">R7 [a3]: {registersmaphex.get("a3")}</td>
                      <td id="s7hex">R23 [s7]: {registersmaphex.get("s7")}</td>
                    </tr>
                    <tr>
                      <td id="t0hex">R8 [t0]: {registersmaphex.get("t0")}</td>
                      <td id="t8hex">R24 [t8]: {registersmaphex.get("t8")}</td>
                    </tr>
                    <tr>
                      <td id="t1hex">R9 [t1]: {registersmaphex.get("t1")}</td>
                      <td id="t9hex">R25 [t9]: {registersmaphex.get("t9")}</td>
                    </tr>
                    <tr>
                      <td id="t2hex">R10 [t2]: {registersmaphex.get("t2")}</td>
                      <td id="k0hex">R26 [k0]: {registersmaphex.get("k0")}</td>
                    </tr>
                    <tr>
                      <td id="t3hex">R11 [t3]: {registersmaphex.get("t3")}</td>
                      <td id="k1hex">R27 [k1]: {registersmaphex.get("k1")}</td>
                    </tr>
                    <tr>
                      <td id="t4hex">R12 [t4]: {registersmaphex.get("t4")}</td>
                      <td id="gphex">R28 [gp]: {registersmaphex.get("gp")}</td>
                    </tr>
                    <tr>
                      <td id="t5hex">R13 [t5]: {registersmaphex.get("t5")}</td>
                      <td id="sphex">R29 [sp]: {registersmaphex.get("sp")}</td>
                    </tr>
                    <tr>
                      <td id="t6hex">R14 [t6]: {registersmaphex.get("t6")}</td>
                      <td id="s8hex">R30 [s8]: {registersmaphex.get("s8")}</td>
                    </tr>
                    <tr>
                      <td id="t7hex">R15 [t7]: {registersmaphex.get("t7")}</td>
                      <td id="rahex">R31 [ra]: {registersmaphex.get("ra")}</td>
                    </tr>

                  </table>

                </li>
                <li id="binary" style={{display: b?`block`:`none`}}>
                  {/* Binary */}

                  <table className="registers-table">

                    <tr className="tr-table">
                      <td id="pc-table">PC: {pc}</td>
                      <td></td>
                    </tr>
                    <tr>
                      <td id="r0bin">R0 [r0]: {registersmapbin.get("r0")}</td>
                      <td id="s0bin">R16 [s0]: {registersmapbin.get("s0")}</td>
                    </tr>
                    <tr>
                      <td id="atbin">R1 [at]: {registersmapbin.get("at")}</td>
                      <td id="s1bin">R17 [s1]: {registersmapbin.get("s1")}</td>
                    </tr>
                    <tr>
                      <td id="v0bin">R2 [v0]: {registersmapbin.get("v0")}</td>
                      <td id="s2bin">R18 [s2]: {registersmapbin.get("s2")}</td>
                    </tr>
                    <tr>
                      <td id="v1bin">R3 [v1]: {registersmapbin.get("v1")}</td>
                      <td id="s3bin">R19 [s3]: {registersmapbin.get("s3")}</td>
                    </tr>
                    <tr>
                      <td id="a0bin">R4 [a0]: {registersmapbin.get("a0")}</td>
                      <td id="s4bin">R20 [s4]: {registersmapbin.get("s4")}</td>
                    </tr>
                    <tr>
                      <td id="a1bin">R5 [a1]: {registersmapbin.get("a1")}</td>
                      <td id="s5bin">R21 [s5]: {registersmapbin.get("s5")}</td>
                    </tr>
                    <tr>
                      <td id="a2bin">R6 [a2]: {registersmapbin.get("a2")}</td>
                      <td id="s6bin">R22 [s6]: {registersmapbin.get("s6")}</td>
                    </tr>
                    <tr>
                      <td id="a3bin">R7 [a3]: {registersmapbin.get("a3")}</td>
                      <td id="s7bin">R23 [s7]: {registersmapbin.get("s7")}</td>
                    </tr>
                    <tr>
                      <td id="t0bin">R8 [t0]: {registersmapbin.get("t0")}</td>
                      <td id="t8bin">R24 [t8]: {registersmapbin.get("t8")}</td>
                    </tr>
                    <tr>
                      <td id="t1bin">R9 [t1]: {registersmapbin.get("t1")}</td>
                      <td id="t9bin">R25 [t9]: {registersmapbin.get("t9")}</td>
                    </tr>
                    <tr>
                      <td id="t2bin">R10 [t2]: {registersmapbin.get("t2")}</td>
                      <td id="k0bin">R26 [k0]: {registersmapbin.get("k0")}</td>
                    </tr>
                    <tr>
                      <td id="t3bin">R11 [t3]: {registersmapbin.get("t3")}</td>
                      <td id="k1bin">R27 [k1]: {registersmapbin.get("k1")}</td>
                    </tr>
                    <tr>
                      <td id="t4bin">R12 [t4]: {registersmapbin.get("t4")}</td>
                      <td id="gpbin">R28 [gp]: {registersmapbin.get("gp")}</td>
                    </tr>
                    <tr>
                      <td id="t5bin">R13 [t5]: {registersmapbin.get("t5")}</td>
                      <td id="spbin">R29 [sp]: {registersmapbin.get("sp")}</td>
                    </tr>
                    <tr>
                      <td id="t6bin">R14 [t6]: {registersmapbin.get("t6")}</td>
                      <td id="s8bin">R30 [s8]: {registersmapbin.get("s8")}</td>
                    </tr>
                    <tr>
                      <td id="t7bin">R15 [t7]: {registersmapbin.get("t7")}</td>
                      <td id="rabin">R31 [ra]: {registersmapbin.get("ra")}</td>
                    </tr>

                  </table>

                </li>
              </ul>
            </div>
            {/* Register segment */}
          </li>

          <li id="mem">
            <div>
              <ul>
                <li id="decimal" style={{display: d?`block`:`none`}}>
                  {/* Decimal */}

                  <div id="memory-tabledec">

                  </div>

                </li>
                <li id="hexadecimal" style={{display: h?`block`:`none`}}>
                  {/* Hexadecimal */}

                  <div id="memory-table">
                    {/* {str} */}
                  </div>

                </li>
                <li id="binary" style={{display: b?`block`:`none`}}>
                  {/* Binary */}

                  <div id="memory-tablebin">
                    {/* {str} */}
                  </div>

                </li>
              </ul>
            </div>
            {/* Memory segment */}
          </li>

          <li id="cache-display">
            <div>
              <table className="cache-settings-table">

                <tr className="table-row">

                  <td className="table-row" style={{width: `50%`}}>

                    <div style={{fontWeight: `bold`, textAlign: `center`, fontSize: `20px`}}>L1</div>
                    <hr style={{padding: `0px`, margin: `1px`}}></hr>
                    <div className="query">

                      <span style={{textAlign: `left`}}>Cache Size</span>
                      <span style={{float: `right`, color: `black`, fontSize: '12px', padding: `3px`}}>
                      <Dropdown
                        name="16 bytes"
                        title="16 bytes"
                        list={cachesizesl1}
                        onChange={changeCacheSizel1}
                        color="black"
                        styles={{
                          list: {fontWeight: `bold`, fontSize: `12px`, padding: `0px`, margin: `0px`},
                          listItem: {fontWeight: `bold`, fontSize: `12px`, padding: `3px`},
                          headerTitle: {fontWeight: `bold`, fontSize: `11px`, padding: `0px`},
                          wrapper: {height: `20px`, paddingLeft: `0px`, margin: `0px`, paddingRight: `-20px`, width: `auto`},
                          headerArrowUpIcon: {display: `none`, fontSize: `0px`},
                          headerArrowDownIcon: {fontSize: `0px`, display: `none`,},
                          scrollList: {width: `auto`}
                        }}
                      />
                      </span>

                      </div>

                      <div className="query">

                        <span style={{textAlign: `left`}}>Block Size</span>
                        <span style={{float: `right`, color: `black`, fontSize: '12px', padding: `3px`}}>
                        <Dropdown
                          name="4 bytes"
                          title="4 bytes"
                          list={blocksizes}
                          onChange={changeBlockSizel1}
                          fontSize="12px"
                          color="black"
                          styles={{
                            list: {fontWeight: `bold`, fontSize: `12px`, padding: `0px`, margin: `0px`},
                            listItem: {fontWeight: `bold`, fontSize: `12px`, padding: `3px`},
                            headerTitle: {fontWeight: `bold`, fontSize: `11px`, padding: `0px`},
                            wrapper: {height: `20px`, paddingLeft: `-5px`, margin: `0px`, width: `auto`},
                            headerArrowUpIcon: {display: `none`, fontSize: `0px`},
                            headerArrowDownIcon: {fontSize: `0px`, display: `none`,},
                            scrollList: {width: `auto`}
                          }}
                        />

                        </span>

                      </div>

                      <div className="query">

                        <span style={{textAlign: `left`, width: `auto`}}>Associativity</span>
                        <span style={{float: `right`, color: `black`, fontSize: '12px', padding: `3px`}}>
                        <Dropdown
                          name="Direct Mapped"
                          title="Direct Mapped"
                          list={assocl1}
                          onChange={changeAssocl1}
                          color="black"
                          styles={{
                            list: {fontWeight: `bold`, fontSize: `12px`, padding: `0px`, margin: `0px`},
                            listItem: {fontWeight: `bold`, fontSize: `12px`, padding: `3px`},
                            headerTitle: {fontWeight: `bold`, fontSize: `11px`, padding: `0px`},
                            wrapper: {height: `20px`, paddingLeft: `-5px`, margin: `0px`, width: `auto`},
                            headerArrowUpIcon: {display: `none`, fontSize: `0px`},
                            headerArrowDownIcon: {fontSize: `0px`, display: `none`,},
                            scrollList: {width: `auto`}
                          }}
                        />

                        </span>

                      </div>

                      <div className="query" style={{paddingBottom: `0px`}}>

                        <span style={{textAlign: `left`, width: `auto`}}>Latency</span>
                        <span style={{float: `right`, color: `black`, fontSize: '12px', padding: `3px`}}>
                        <Dropdown
                          name="1 cycle"
                          title="1 cycle"
                          list={latencyl1}
                          onChange={changeLatl1}
                          color="black"
                          styles={{
                            list: {fontWeight: `bold`, fontSize: `12px`, padding: `0px`, margin: `0px`},
                            listItem: {fontWeight: `bold`, fontSize: `12px`, padding: `3px`},
                            headerTitle: {fontWeight: `bold`, fontSize: `11px`, padding: `0px`},
                            wrapper: {height: `20px`, paddingLeft: `-5px`, margin: `0px`, width: `auto`},
                            headerArrowUpIcon: {display: `none`, fontSize: `0px`},
                            headerArrowDownIcon: {fontSize: `0px`, display: `none`,},
                            scrollList: {width: `auto`}
                          }}
                        />

                        </span>

                      </div>

                  </td>

                  <td className="table-row" style={{width: `50%`}}>

                  <div style={{fontWeight: `bold`, textAlign: `center`, fontSize: `20px`}}>L2</div>
                  <hr style={{padding: `0px`, margin: `1px`}}></hr>
                    <div className="query">

                      <span style={{textAlign: `left`}}>Cache Size</span>
                      <span style={{float: `right`, color: `black`, fontSize: '12px', padding: `3px`}}>
                      <Dropdown
                        name="64 bytes"
                        title="64 bytes"
                        list={cachesizesl2}
                        onChange={changeCacheSizel2}
                        color="black"
                        styles={{
                          list: {fontWeight: `bold`, fontSize: `12px`, padding: `0px`, margin: `0px`},
                          listItem: {fontWeight: `bold`, fontSize: `12px`, padding: `3px`},
                          headerTitle: {fontWeight: `bold`, fontSize: `11px`, padding: `0px`},
                          wrapper: {height: `20px`, paddingLeft: `0px`, margin: `0px`, width: `auto`},
                          headerArrowUpIcon: {display: `none`, fontSize: `0px`},
                          headerArrowDownIcon: {fontSize: `0px`, display: `none`,},
                          scrollList: {width: `auto`}
                        }}
                      />
                      </span>

                      </div>

                      <div className="query">

                        <span style={{textAlign: `left`}}>Block Size</span>
                        <span style={{float: `right`, color: `black`, fontSize: '12px', padding: `3px`}}>
                        <Dropdown
                          name="4 bytes"
                          title="4 bytes"
                          list={blocksizes}
                          onChange={changeBlockSizel2}
                          color="black"
                          styles={{
                            list: {fontWeight: `bold`, fontSize: `12px`, padding: `0px`, margin: `0px`},
                            listItem: {fontWeight: `bold`, fontSize: `12px`, padding: `3px`},
                            headerTitle: {fontWeight: `bold`, fontSize: `11px`, padding: `0px`},
                            wrapper: {height: `20px`, paddingLeft: `-5px`, margin: `0px`, width: `auto`},
                            headerArrowUpIcon: {display: `none`, fontSize: `0px`},
                            headerArrowDownIcon: {fontSize: `0px`, display: `none`,},
                            scrollList: {width: `auto`}
                          }}
                        />

                        </span>

                      </div>

                      <div className="query">

                        <span style={{textAlign: `left`, width: `auto`}}>Associativity</span>
                        <span style={{float: `right`, color: `black`, fontSize: '12px', padding: `3px`}}>
                        <Dropdown
                          name="Direct Mapped"
                          title="Direct Mapped"
                          list={assocl2}
                          onChange={changeAssocl2}
                          color="black"
                          styles={{
                            list: {fontWeight: `bold`, fontSize: `12px`, padding: `0px`, margin: `0px`},
                            listItem: {fontWeight: `bold`, fontSize: `12px`, padding: `3px`},
                            headerTitle: {fontWeight: `bold`, fontSize: `11px`, padding: `0px`},
                            wrapper: {height: `20px`, paddingLeft: `-5px`, margin: `0px`, width: `auto`},
                            headerArrowUpIcon: {display: `none`, fontSize: `0px`},
                            headerArrowDownIcon: {fontSize: `0px`, display: `none`,},
                            scrollList: {width: `auto`}
                          }}
                        />

                        </span>

                      </div>

                      <div className="query" style={{paddingBottom: `0px`}}>

                        <span style={{textAlign: `left`, width: `auto`}}>Latency</span>
                        <span style={{float: `right`, color: `black`, fontSize: '12px', padding: `3px`}}>
                        <Dropdown
                          name="2 cycles"
                          title="2 cycles"
                          list={latencyl2}
                          onChange={changeLatl2}
                          color="black"
                          styles={{
                            list: {fontWeight: `bold`, fontSize: `12px`, padding: `0px`, margin: `0px`},
                            listItem: {fontWeight: `bold`, fontSize: `12px`, padding: `3px`},
                            headerTitle: {fontWeight: `bold`, fontSize: `11px`, padding: `0px`},
                            wrapper: {height: `20px`, paddingLeft: `-5px`, margin: `0px`, width: `auto`},
                            headerArrowUpIcon: {display: `none`, fontSize: `0px`},
                            headerArrowDownIcon: {fontSize: `0px`, display: `none`,},
                            scrollList: {width: `auto`}
                          }}
                        />

                        </span>

                      </div>

                  </td>

                </tr>
                
                </table>

                <table className="cache-settings-table">

                <tr className="table-row">

                  <td className="table-row" style={{textAlign: `left`}}>
                      
                  <div className="query" style={{paddingBottom: `0px`}}>

                      <span style={{textAlign: `left`, width: `auto`}}>Memory Latency</span>
                      <span style={{float: `right`, color: `black`, fontSize: '12px', padding: `3px`}}>
                      <Dropdown
                        name="10 cycles"
                        title="10 cycles"
                        list={latencymem}
                        onChange={changeLatMem}
                        fontSize="12px"
                        color="black"
                        styles={{
                          list: {fontWeight: `bold`, fontSize: `12px`, padding: `0px`, margin: `0px`},
                          listItem: {fontWeight: `bold`, fontSize: `12px`, padding: `3px`},
                          headerTitle: {fontWeight: `bold`, fontSize: `12px`, padding: `0px`},
                          wrapper: {height: `20px`, paddingLeft: `-5px`, margin: `0px`, width: `auto`},
                          headerArrowUpIcon: {display: `none`, fontSize: `0px`},
                          headerArrowDownIcon: {fontSize: `0px`, display: `none`,},
                          scrollList: {width: `auto`}
                        }}
                      />

                      </span>

                    </div>

                  </td>

                </tr>

              </table>

              <table className="cache-settings-table">

                <tr className="table-row">

                  <td className="table-row" style={{textAlign: `left`}}>
                      
                  <div className="query" style={{paddingBottom: `0px`}}>

                      <span style={{textAlign: `left`, width: `auto`}}>Hypothetical Ideal Case</span>
                      <span style={{float: `right`, color: `black`, fontSize: '10px', marginTop: `-8px`, marginBottom: `-8px`}}>
                      <Checkbox
                        checked={checked}
                        // disableRipple
                        onChange={changeChbox}                                         
                      />

                      </span>

                    </div>

                  </td>

                </tr>

              </table>

            </div>
            
            <hr style={{fontSize: `18px`, borderColor: `tomato`}}></hr>

            <CacheDisplay l1sets={l1sets} l2sets={l2sets} valid={x} />

          </li>          

        </ul>
      </div> 

    </div>
  );

};

export default Sidebar;