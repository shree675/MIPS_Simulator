import React, {useState} from "react";
import "./Sidebar.css";

const Sidebar = props =>
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

  var prevRegisters=props.prevRegisters;
  // console.log('prev',prevRegisters);
  // console.log('currnent',registersmap);

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
    // if(value!=null)
    registersmaphex.set(key,value.toString(16));
    // console.log(value.toString(16));
    // console.log(registersmaphex.get(key));
    // if(value!=null)
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

export default Sidebar;