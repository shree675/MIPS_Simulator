import React, { useState, useEffect } from "react";
import "./SideBar.css";

// var initial=0;

const SideBar = props =>
{

  // var d=0;
  // var h=0;
  // var b=0;
  const [b,setB] = useState(false);
  const [h,setH] = useState(false);
  const [d,setD] = useState(true);

  // const [registersmap, setRegisters] = useState(props.registersmap);
  // const [pc, setPC] = useState(props.programCounter); 
  var pc=props.programCounter;
  var registersmap=props.registersmap;

  var registersmaphex=new Map();
  var registersmapbin=new Map();

  var memoryArr=props.memoryArray;
  
  // console.log('sidebar',memoryArr);

  var str="";
  var strdec="";
  var strbin="";

  var start=0;
  var prev=0;
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
        // if(i==(prev+2)){
        //   str+=(4*(prev+1)+268500992).toString(16) + ": 0" + "<br/>";
        //   prev=i;
        // }
        // else{
        str+=(start==prev?("[0x" + (4*i+268500992).toString(16) + "]: " + memoryArr[i].toString(16) + "<br/>"):("<br>" + "[0x" + (4*(prev+1)+268500992).toString(16) + "...<br/>..." + "0x" + (4*(i)+268500992).toString(16) + "]: 0<br></br>" + "[0x" + (4*i+268500992).toString(16) + "]: " + memoryArr[i].toString(16) + "<br/>"));
        strdec+=(start==prev?("[0x" + (4*i+268500992).toString(16) + "]: " + memoryArr[i].toString(10) + "<br/>"):("<br>" + "[0x" + (4*(prev+1)+268500992).toString(16) + "...<br/>..." + "0x" + (4*(i)+268500992).toString(16) + "]: 0<br></br>" + "[0x" + (4*i+268500992).toString(16) + "]: " + memoryArr[i].toString(10) + "<br/>"));
        strbin+=(start==prev?("[0x" + (4*i+268500992).toString(16) + "]: " + memoryArr[i].toString(2) + "<br/>"):("<br>" + "[0x" + (4*(prev+1)+268500992).toString(16) + "...<br/>..." + "0x" + (4*(i)+268500992).toString(16) + "]: 0<br></br>" + "[0x" + (4*i+268500992).toString(16) + "]: " + memoryArr[i].toString(2) + "<br/>"));
        // strdec+=(start==prev?((4*i+268500992).toString(16) + ": " + memoryArr[i].toString(10) + "<br/>"):("<br>" + (4*(prev+1)+268500992).toString(16) + "...<br/>..." + (4*(i)+268500992).toString(16) + ": 0<br></br>" + (4*i+268500992).toString(16) + ": " + memoryArr[i].toString(10) + "<br/>"));
        // strbin+=(start==prev?((4*i+268500992).toString(16) + ": " + memoryArr[i].toString(2) + "<br/>"):("<br>" + (4*(prev+1)+268500992).toString(16) + "...<br/>..." + (4*(i)+268500992).toString(16) + ": 0<br></br>" + (4*i+268500992).toString(16) + ": " + memoryArr[i].toString(2) + "<br/>"));
        prev=i;
        // }
        // setString(s+((4*start+268500992).toString(16) + "..." + (4*(i-1)+268500992).toString(16) + ": 0\n" + memoryArr[i].toString(16) + "\n" + (4*i+268500992).toString(16) + ": " + memoryArr[i].toString(16) + "\n"));
      }
    }
    start=i;
    // prev=start;
  }

  if(c===0){
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

  // setString(str);

  // console.log(str);

  // if(pc!=0){
  //   // console.log("hello");
  //   for(var [key,value] of registersmap){
  //     // console.log(parseInt(registersmaphex.get(key)));
  //     console.log(registersmaphex);
  //     if(registersmap.get(key)!=parseInt(registersmaphex.get(key),16)){
  //       console.log(parseInt(registersmaphex.get(key),16));
  //       document.getElementById(key).style.backgroundColor="yellowgreen";
  //       for(var [key2,value2] of registersmap){
  //         if(key2!=key){
  //           document.getElementById(key2).style.backgroundColor="";
  //         }
  //       }
  //     }
  //   }
  // }

  // console.log(registersmap);

  for(var [key,value] of registersmap){
    // console.log(key," ",value);
    // registersmaphex.set(key,(value).toString(16));
    // console.log(value);
    // registersmap[key]=value.toString(16);
    
    registersmaphex.set(key,value.toString(16));
    // console.log(value.toString(16));
    // console.log(registersmaphex.get(key));
    registersmapbin.set(key,value.toString(2));
    // console.log(registermapbin.get(key));
  }

  function reg() {
    {document.getElementById("mem").style.display="none";}
    {document.getElementById("regs").style.display="block";}
    {document.getElementById("b1").style.backgroundColor="gray"}
    {document.getElementById("b2").style.backgroundColor="#333333"}
    console.log("registers");
  }

  function memory() {
    {document.getElementById("regs").style.display="none";}
    {document.getElementById("mem").style.display="block";}
    {document.getElementById("b1").style.backgroundColor="#333333"}
    {document.getElementById("b2").style.backgroundColor="gray"}
    console.log("memory");
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

  return (
    <div className="sidebar">
      
      <div className="sidebar-menu">
        <button id="b1" onClick={reg}>REGISTERS</button>
        <button id="b2" onClick={memory}>MEMORY</button>
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
                      <td id="r0">R0 [r0]: {registersmaphex.get("r0")}</td>
                      <td id="s0">R16 [s0]: {registersmaphex.get("s0")}</td>
                    </tr>
                    <tr>
                      <td id="at">R1 [at]: {registersmaphex.get("at")}</td>
                      <td id="s1">R17 [s1]: {registersmaphex.get("s1")}</td>
                    </tr>
                    <tr>
                      <td id="v0">R2 [v0]: {registersmaphex.get("v0")}</td>
                      <td id="s2">R18 [s2]: {registersmaphex.get("s2")}</td>
                    </tr>
                    <tr>
                      <td id="v1">R3 [v1]: {registersmaphex.get("v1")}</td>
                      <td id="s3">R19 [s3]: {registersmaphex.get("s3")}</td>
                    </tr>
                    <tr>
                      <td id="a0">R4 [a0]: {registersmaphex.get("a0")}</td>
                      <td id="s4">R20 [s4]: {registersmaphex.get("s4")}</td>
                    </tr>
                    <tr>
                      <td id="a1">R5 [a1]: {registersmaphex.get("a1")}</td>
                      <td id="s5">R21 [s5]: {registersmaphex.get("s5")}</td>
                    </tr>
                    <tr>
                      <td id="a2">R6 [a2]: {registersmaphex.get("a2")}</td>
                      <td id="s6">R22 [s6]: {registersmaphex.get("s6")}</td>
                    </tr>
                    <tr>
                      <td id="a3">R7 [a3]: {registersmaphex.get("a3")}</td>
                      <td id="s7">R23 [s7]: {registersmaphex.get("s7")}</td>
                    </tr>
                    <tr>
                      <td id="t0">R8 [t0]: {registersmaphex.get("t0")}</td>
                      <td id="t8">R24 [t8]: {registersmaphex.get("t8")}</td>
                    </tr>
                    <tr>
                      <td id="t1">R9 [t1]: {registersmaphex.get("t1")}</td>
                      <td id="t9">R25 [t9]: {registersmaphex.get("t9")}</td>
                    </tr>
                    <tr>
                      <td id="t2">R10 [t2]: {registersmaphex.get("t2")}</td>
                      <td id="k0">R26 [k0]: {registersmaphex.get("k0")}</td>
                    </tr>
                    <tr>
                      <td id="t3">R11 [t3]: {registersmaphex.get("t3")}</td>
                      <td id="k1">R27 [k1]: {registersmaphex.get("k1")}</td>
                    </tr>
                    <tr>
                      <td id="t4">R12 [t4]: {registersmaphex.get("t4")}</td>
                      <td id="gp">R28 [gp]: {registersmaphex.get("gp")}</td>
                    </tr>
                    <tr>
                      <td id="t5">R13 [t5]: {registersmaphex.get("t5")}</td>
                      <td id="sp">R29 [sp]: {registersmaphex.get("sp")}</td>
                    </tr>
                    <tr>
                      <td id="t6">R14 [t6]: {registersmaphex.get("t6")}</td>
                      <td id="s8">R30 [s8]: {registersmaphex.get("s8")}</td>
                    </tr>
                    <tr>
                      <td id="t7">R15 [t7]: {registersmaphex.get("t7")}</td>
                      <td id="ra">R31 [ra]: {registersmaphex.get("ra")}</td>
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
                      <td id="r0">R0 [r0]: {registersmapbin.get("r0")}</td>
                      <td id="s0">R16 [s0]: {registersmapbin.get("s0")}</td>
                    </tr>
                    <tr>
                      <td id="at">R1 [at]: {registersmapbin.get("at")}</td>
                      <td id="s1">R17 [s1]: {registersmapbin.get("s1")}</td>
                    </tr>
                    <tr>
                      <td id="v0">R2 [v0]: {registersmapbin.get("v0")}</td>
                      <td id="s2">R18 [s2]: {registersmapbin.get("s2")}</td>
                    </tr>
                    <tr>
                      <td id="v1">R3 [v1]: {registersmapbin.get("v1")}</td>
                      <td id="s3">R19 [s3]: {registersmapbin.get("s3")}</td>
                    </tr>
                    <tr>
                      <td id="a0">R4 [a0]: {registersmapbin.get("a0")}</td>
                      <td id="s4">R20 [s4]: {registersmapbin.get("s4")}</td>
                    </tr>
                    <tr>
                      <td id="a1">R5 [a1]: {registersmapbin.get("a1")}</td>
                      <td id="s5">R21 [s5]: {registersmapbin.get("s5")}</td>
                    </tr>
                    <tr>
                      <td id="a2">R6 [a2]: {registersmapbin.get("a2")}</td>
                      <td id="s6">R22 [s6]: {registersmapbin.get("s6")}</td>
                    </tr>
                    <tr>
                      <td id="a3">R7 [a3]: {registersmapbin.get("a3")}</td>
                      <td id="s7">R23 [s7]: {registersmapbin.get("s7")}</td>
                    </tr>
                    <tr>
                      <td id="t0">R8 [t0]: {registersmapbin.get("t0")}</td>
                      <td id="t8">R24 [t8]: {registersmapbin.get("t8")}</td>
                    </tr>
                    <tr>
                      <td id="t1">R9 [t1]: {registersmapbin.get("t1")}</td>
                      <td id="t9">R25 [t9]: {registersmapbin.get("t9")}</td>
                    </tr>
                    <tr>
                      <td id="t2">R10 [t2]: {registersmapbin.get("t2")}</td>
                      <td id="k0">R26 [k0]: {registersmapbin.get("k0")}</td>
                    </tr>
                    <tr>
                      <td id="t3">R11 [t3]: {registersmapbin.get("t3")}</td>
                      <td id="k1">R27 [k1]: {registersmapbin.get("k1")}</td>
                    </tr>
                    <tr>
                      <td id="t4">R12 [t4]: {registersmapbin.get("t4")}</td>
                      <td id="gp">R28 [gp]: {registersmapbin.get("gp")}</td>
                    </tr>
                    <tr>
                      <td id="t5">R13 [t5]: {registersmapbin.get("t5")}</td>
                      <td id="sp">R29 [sp]: {registersmapbin.get("sp")}</td>
                    </tr>
                    <tr>
                      <td id="t6">R14 [t6]: {registersmapbin.get("t6")}</td>
                      <td id="s8">R30 [s8]: {registersmapbin.get("s8")}</td>
                    </tr>
                    <tr>
                      <td id="t7">R15 [t7]: {registersmapbin.get("t7")}</td>
                      <td id="ra">R31 [ra]: {registersmapbin.get("ra")}</td>
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

          {/* <li id="decimal">
            Decimal
            <div>
              <ul>
                <li id="regs">REGISTERS</li>
                <li id="mem">MEMORY</li>
              </ul>
            </div>
          </li>

          <li id="hexadecimal">
            Hexadecimal
            <div>
              <ul>
                <li id="regs">REGISTERS</li>
                <li id="mem">MEMORY</li>
              </ul>
            </div>
          </li>

          <li id="binary">
            Binary
            <div>
              <ul>
                <li id="regs">REGISTERS</li>
                <li id="mem">MEMORY</li>
              </ul>
            </div>
          </li>*/}

        </ul>
      </div> 

    </div>
  );

};

export default SideBar;
/*   

const SideBar = props => {
  
  // console.log(props.registers)
  // console.log("Memory Used: " + props.memoryUsed)
  var [isOpen, setIsOpen] = useState({
    registers: false,
    dataSegment: false,
    sampleProgram: false,
    analysis: false,
    cacheTable: false
  })

  var [isCacheConfShow, setIsCacheConfShow] = useState(false)

  var [cacheNumber, setCacheNumber] = useState(1)
  var [cacheToDisplay, setCacheToDisplay] = useState(1)

  var registers = []
  props.registers.forEach((val, key) => {
    registers.push({
      name: key,
      val: val
    })
  });

  var dataSegment = []
  for (let i = 0; i < props.memoryUsed / 4; i++) {
    var bin = props.dataSegment[i]
    dataSegment.push({
      dec: parseInt(bin, 2),
      bin: bin
    })
  }
  // console.log(dataSegment)

  var performance = ""
  if (Object.keys(props.performance).length === 0 && props.running === 0) {
    performance = <div className="pa-program">Run your assemble code to check performance</div>
  }
  else if (props.running === 1) {
    performance = <span className="pa-program">Running...</span>
  }
  else {
    let pert = "%"
    let l1MissRate = ((props.performance.l1CacheMiss / (props.performance.l1CacheMiss + props.performance.l1CacheHits)) * 100).toString().slice(0, 3)
    if (isNaN(l1MissRate)) {
      l1MissRate = "Memory Not Accessed"
      pert = ""
    }
    let l2MissRate = ((props.performance.l2CacheMiss / (props.performance.l2CacheHits + props.performance.l2CacheMiss)) * 100).toString().slice(0, 3)
    if (isNaN(l2MissRate)) {
      l2MissRate = "Memory Not Accessed"
    }
    performance = (<div>
      <div className="pa-program">Number of cycles: {props.performance.cycles}</div>
      <div className="pa-program">Number of stalls: {props.performance.stalls}</div>
      <div className="pa-program">IPC: {(1 / (1 + (props.performance.stalls / props.performance.cycles))).toFixed(2)}</div>
      <div className="pa-program">L1 Cache Misses: {props.performance.l1CacheMiss}</div>
      <div className="pa-program">L1 Cache Hits: {props.performance.l1CacheHits}</div>
      <div className="pa-program">L2 Cache Misses: {props.performance.l2CacheMiss}</div>
      <div className="pa-program">L2 Cache Hits: {props.performance.l2CacheHits}</div>
      <div className="pa-program">L1 Cache Miss Rate: {l1MissRate}{pert}</div>
      <div className="pa-program">L2 Cache Miss Rate: {l2MissRate}{pert}</div>
    </div>)
  }

  useEffect(() => {
    if (props.isShowing) {
      setIsOpen({
        registers: false,
        dataSegment: false,
        sampleProgram: false,
        analysis: false,
        cacheTable: false
      })
    }
  }, [props.isShowing])

  useEffect(() => {
    setIsCacheConfShow(props.isShowing)
  }, [props.isShowing])

  useEffect(() => {
    if (isOpen.analysis || isOpen.dataSegment || isOpen.registers || isOpen.sampleProgram || isOpen.cacheTable) {
      setIsCacheConfShow(false)
    }
  }, [isOpen.analysis, isOpen.dataSegment, isOpen.registers, isOpen.sampleProgram, isOpen.cacheTable])

  const { hideCacheSettings } = props

  useEffect(() => hideCacheSettings(isCacheConfShow), [isCacheConfShow, hideCacheSettings])

  var cacheSettingsDisplay = ""

  if (cacheNumber === 1) {
    cacheSettingsDisplay = (
      <div className="cache-settings">
        <div className="cache-options">
          Cache Size:
          <select className="display-value" onChange={(x) => props.configureCache(1, parseInt(x.target.value), props.l1CacheInfo.blockSize, props.l1CacheInfo.associativity, props.l1CacheInfo.latency)}>
            <option value={16} selected={props.l1CacheInfo.cacheSize === 16}>16 Bytes</option>
            <option value={32} selected={props.l1CacheInfo.cacheSize === 32}>32 Bytes</option>
            <option value={64} selected={props.l1CacheInfo.cacheSize === 64}>64 Bytes</option>
          </select>
        </div>
        <div className="cache-options">
          Block Size:
          <select className="display-value" onChange={(x) => props.configureCache(1, props.l1CacheInfo.cacheSize, parseInt(x.target.value), props.l1CacheInfo.associativity, props.l1CacheInfo.latency)}>
            <option value={4} selected={props.l1CacheInfo.blockSize === 4}>4 Bytes</option>
            <option value={8} selected={props.l1CacheInfo.blockSize === 8}>8 Bytes</option>
            <option value={16} selected={props.l1CacheInfo.blockSize === 16}>16 Bytes</option>
            <option value={32} selected={props.l1CacheInfo.blockSize === 32}>32 Bytes</option>
          </select>
        </div>
        <div className="cache-options">
          Associativity:
          <select className="display-value" onChange={(x) => props.configureCache(1, props.l1CacheInfo.cacheSize, props.l1CacheInfo.blockSize, parseInt(x.target.value), props.l1CacheInfo.latency)}>
            <option value={props.l1CacheInfo.cacheSize / props.l1CacheInfo.blockSize} selected={props.l1CacheInfo.associativity === props.l1CacheInfo.cacheSize / props.l1CacheInfo.blockSize}>Direct Mapped</option>
            <option value={2} selected={props.l1CacheInfo.associativity === 2}>2 Way</option>
            <option value={4} selected={props.l1CacheInfo.associativity === 4}>4 Way</option>
            <option value={1} selected={props.l1CacheInfo.associativity === 1}>Fully Associative</option>
          </select>
        </div>
        <div className="cache-options">
          Latency:
          <select className="display-value" onChange={(x) => props.configureCache(1, props.l1CacheInfo.cacheSize, props.l1CacheInfo.blockSize, props.l1CacheInfo.associativity, parseInt(x.target.value))}>
            <option value={2} selected={props.l1CacheInfo.latency === 2}>2 Cycles</option>
            <option value={3} selected={props.l1CacheInfo.latency === 3}>3 Cycles</option>
          </select>
        </div>
      </div>
    )
  }
  else {
    cacheSettingsDisplay = (
      <div className="cache-settings">
        <div className="cache-options">
          Cache Size:
          <select className="display-value" onChange={(x) => props.configureCache(2, parseInt(x.target.value), props.l2CacheInfo.blockSize, props.l2CacheInfo.associativity, props.l2CacheInfo.latency)}>
            <option value={64} selected={props.l2CacheInfo.cacheSize === 64}>64 Bytes</option>
            <option value={128} selected={props.l2CacheInfo.cacheSize === 128}>128 Bytes</option>
            <option value={256} selected={props.l2CacheInfo.cacheSize === 256}>256 Bytes</option>
            <option value={512} selected={props.l2CacheInfo.cacheSize === 512}>512 Bytes</option>
          </select>
        </div>
        <div className="cache-options">
          Block Size:
          <select className="display-value" onChange={(x) => props.configureCache(2, props.l2CacheInfo.cacheSize, parseInt(x.target.value), props.l2CacheInfo.associativity, props.l2CacheInfo.latency)}>
            <option value={16} selected={props.l2CacheInfo.blockSize === 16}>16 Bytes</option>
            <option value={32} selected={props.l2CacheInfo.blockSize === 32}>32 Bytes</option>
            <option value={64} selected={props.l2CacheInfo.blockSize === 64}>64 Bytes</option>
          </select>
        </div>
        <div className="cache-options">
          Associativity:
          <select className="display-value" onChange={(x) => props.configureCache(2, props.l2CacheInfo.cacheSize, props.l2CacheInfo.blockSize, parseInt(x.target.value), props.l2CacheInfo.latency)}>
            <option value={props.l2CacheInfo.cacheSize / props.l2CacheInfo.blockSize} selected={props.l2CacheInfo.associativity === props.l2CacheInfo.cacheSize / props.l2CacheInfo.blockSize}>Direct Mapped</option>
            <option value={2} selected={props.l2CacheInfo.associativity === 2}>2 Way</option>
            <option value={4} selected={props.l2CacheInfo.associativity === 4}>4 Way</option>
            <option value={8} selected={props.l2CacheInfo.associativity === 8}>8 Way</option>
            <option value={1} selected={props.l2CacheInfo.associativity === 1}>Fully Associative</option>
          </select>
        </div>
        <div className="cache-options">
          Latency:
          <select className="display-value" onChange={(x) => props.configureCache(2, props.l2CacheInfo.cacheSize, props.l2CacheInfo.blockSize, props.l2CacheInfo.associativity, parseInt(x.target.value))}>
            <option value={3} selected={props.l2CacheInfo.latency === 3}>3 Cycles</option>
            <option value={4} selected={props.l2CacheInfo.latency === 4}>4 Cycles</option>
            <option value={5} selected={props.l2CacheInfo.latency === 5}>5 Cycles</option>
          </select>
        </div>
      </div>
    )
  }

  const handleRefreshClick = e => {
    if (e) e.stopPropagation()
    if (isOpen.cacheTable) {
      props.refreshCacheContents(cacheToDisplay)
    }
  }

  useEffect(() => {
    if (isOpen.cacheTable) {
      if (cacheToDisplay === 1) {
        let cnt = 0
        var table = document.getElementById("cache-tableL1")
        table.innerHTML = ""
        for (let i = 0; i < props.l1CacheInfo.cacheSize / props.l1CacheInfo.blockSize; i++) {
          var cacheRow = table.insertRow(i)
          cacheRow.className = "cache-row"
          for (let j = 0; j < props.l1CacheInfo.blockSize / 4; j++) {
            var cacheBlock = cacheRow.insertCell(j)
            cacheBlock.setAttribute("nowrap", "nowrap")
            cacheBlock.className = `cache-block cache-blockL1${cnt}`
            cnt++
          }
        }
        handleRefreshClick()
      }
      else {
        let cnt = 0
        table = document.getElementById("cache-tableL2")
        table.innerHTML = ""
        for (let i = 0; i < props.l2CacheInfo.cacheSize / props.l2CacheInfo.blockSize; i++) {
          cacheRow = table.insertRow(i)
          cacheRow.className = "cache-row"
          for (let j = 0; j < props.l2CacheInfo.blockSize / 4; j++) {
            cacheBlock = cacheRow.insertCell(j)
            cacheBlock.setAttribute("nowrap", "nowrap")
            cacheBlock.className = `cache-block cache-blockL2${cnt}`
            cnt++
          }
        }
        handleRefreshClick()
      }
    }
    else {
      table = document.getElementById("cache-tableL1")
      table.innerHTML = ""
      table = document.getElementById("cache-tableL2")
      table.innerHTML = ""
    }
  }, [isOpen, cacheToDisplay, props.l2CacheInfo.cacheSize, props.l2CacheInfo.blockSize, props.l1CacheInfo.cacheSize, props.l1CacheInfo.blockSize])

  return (
    <div className="sidebar">
      <div>
        <div
          className="sidebar-options"
          onClick={() => setIsOpen({
            ...isOpen,
            registers: !isOpen.registers
          })}
        >
          {isOpen.registers ? <i className="fas fa-folder-open"></i> : <i className="fas fa-folder"></i>}
          REGISTERS
        </div>
        <div className="registers" style={isOpen.registers ? { display: 'block' } : { display: 'none' }}>
          <div className="register">
            <span className="register_no">PC = </span> <span className="register_val">{props.pc}</span>
          </div>
          {registers.map((ele, idx) => {
            if (idx < 32) { // temporary solution
              const { name, val } = ele;
              if (idx < 10) {
                return (
                  <div className="register" key={idx}>
                    <span className="register_no">R{idx}</span>&nbsp;&nbsp;<span className="register_name">[{name}]</span> = <span className="register_val">{val}</span>
                  </div>
                );
              }
              return (
                <div className="register" key={idx}>
                  <span className="register_no">R{idx}</span> <span className="register_name">[{name}]</span> = <span className="register_val">{val}</span>
                </div>
              )
            }
            return null
          })}
        </div>
      </div>

      <div>
        <div
          className="sidebar-options"
          onClick={() => setIsOpen({
            ...isOpen,
            dataSegment: !isOpen.dataSegment
          })}
        >
          {isOpen.dataSegment ? <i className="fas fa-folder-open"></i> : <i className="fas fa-folder"></i>}
          DATA SEGMENT
          <span style={{ color: 'white', float: 'right', paddingRight: '7px', fontSize: '12px', alignItems: 'center' }}>{props.memoryUsed} bytes/ 4 KB</span>
        </div>
        <div style={isOpen.dataSegment ? { display: 'block' } : { display: 'none' }}>
          {
            dataSegment.map((ele, idx) => {
              return (
                <div key={idx} className="data-segment">{ele.dec}&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ fontSize: "11px" }}>{ele.bin}</span></div>
              )
            })
          }
        </div>
      </div>

      <div>
        <div
          className="sidebar-options"
          onClick={() => setIsOpen({
            ...isOpen,
            analysis: !isOpen.analysis
          })}
        >
          {isOpen.analysis ? <i className="fas fa-folder-open"></i> : <i className="fas fa-folder"></i>}
          PERFORMANCE ANALYSIS
        </div>
        <div style={isOpen.analysis ? { display: 'block', color: 'white' } : { display: 'none' }}>
          {performance}
        </div>
      </div>

      <div>
        <div
          className="sidebar-options"
          onClick={() => setIsOpen({
            ...isOpen,
            cacheTable: !isOpen.cacheTable
          })}
        >
          {isOpen.cacheTable ? <i className="fas fa-folder-open"></i> : <i className="fas fa-folder"></i>}
          CACHE TABLE
          <span style={isOpen.cacheTable?{ float: 'right' }:{display:'none'}} onClick={e => handleRefreshClick(e)}><i className="fas fa-redo-alt"></i></span>
        </div>
        <div style={isOpen.cacheTable ? { display: 'block', color: 'white' } : { display: 'none' }}>
          <div className="cache-headers">
            <span className="cache-labels" style={cacheToDisplay === 1 ? { backgroundColor: '#696b6a' } : {}}
              onClick={() => {
                setCacheToDisplay(1)
              }}
            >L1 Cache</span>
            <span className="cache-labels" style={cacheToDisplay === 2 ? { backgroundColor: '#696b6a' } : {}}
              onClick={() => {
                setCacheToDisplay(2)
              }}
            >L2 Cache</span>
          </div>

          <table border='2' id='cache-tableL1' style={cacheToDisplay !== 1 ? { display: 'none' } : {}}>
          </table>

          <table border='2' id='cache-tableL2' style={cacheToDisplay !== 2 ? { display: 'none' } : {}} >
          </table>
        </div>
      </div>

      <div>
        <div
          className="sidebar-options"
          onClick={() => setIsOpen({
            ...isOpen,
            sampleProgram: !isOpen.sampleProgram
          })}
        >
          {isOpen.sampleProgram ? <i className="fas fa-folder-open"></i> : <i className="fas fa-folder"></i>}
          SAMPLE PROGRAMS
        </div>
        <div style={isOpen.sampleProgram ? { display: 'block' } : { display: 'none' }}>
          <div className="s-program" onClick={() => { props.sampleProgram("bubbleSort") }}><span style={{ color: 'yellow', fontSize: '11px' }}>asm </span>Bubble Sort</div>
          <div className="s-program" onClick={() => { props.sampleProgram("sumOfNums") }}><span style={{ color: 'yellow', fontSize: '11px' }}>asm </span>Sum of first 10 natural numbers</div>
          <div className="s-program" onClick={() => { props.sampleProgram("tryOutPipeline") }}><span style={{ color: 'yellow', fontSize: '11px' }}>asm </span>Try Out Pipeline</div>
          <div className="s-program" onClick={() => { props.sampleProgram("checkOutCache") }}><span style={{ color: 'yellow', fontSize: '11px' }}>asm </span>Check Out Cache</div>
        </div>
      </div>

      <div style={isCacheConfShow ? { display: 'block', color: 'white' } : { display: 'none' }} className="cache-counter">
        <div className="cache-headers">
          <span className="cache-labels" style={cacheNumber === 1 ? { backgroundColor: '#696b6a' } : {}}
            onClick={() => setCacheNumber(1)}
          >L1 Cache</span>
          <span className="cache-labels" style={cacheNumber === 2 ? { backgroundColor: '#696b6a' } : {}}
            onClick={() => setCacheNumber(2)}
          >L2 Cache</span>
        </div>
        <div>
          {cacheSettingsDisplay}
          <div className="cache-options">
            Main Memory Latency:
              <select className="display-value" onChange={(x) => props.mainMemoryConfig(parseInt(x.target.value))}>
              <option value={6} selected={props.mainMemory === 6}>6 Cycles</option>
              <option value={8} selected={props.mainMemory === 8}>8 Cycles</option>
              <option value={10} selected={props.mainMemory === 10}>10 Cycles</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

};

export default SideBar;
   */