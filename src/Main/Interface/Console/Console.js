import React from 'react';
import './Console.css'
import AceEditor from "react-ace";
import 'brace/theme/dracula'; 

const Console = props => {               // Console component (main)

    function openConsole(){             // display console only on toggle
        document.getElementById("console-area").style.display="block";
        document.getElementById("pipeline-area-nf").style.display="none";
        document.getElementById("pipeline-area").style.display="none";
        document.getElementById("console-btn").style.backgroundColor="grey";
        document.getElementById("pipeline-f").style.backgroundColor="#2e2e2e";
        document.getElementById("pipeline-nf").style.backgroundColor="#2e2e2e";
    }

    function openPipelinef(){           // display pipeline-forwarding only on toggle
        document.getElementById("console-area").style.display="none";
        document.getElementById("pipeline-area").style.display="block";
        document.getElementById("pipeline-area-nf").style.display="none";
        document.getElementById("console-btn").style.backgroundColor="#2e2e2e";
        document.getElementById("pipeline-f").style.backgroundColor="grey";
        document.getElementById("pipeline-nf").style.backgroundColor="#2e2e2e";
    }

    function openPipelinenf(){          // display pipeline-noforwarding only on toggle
        document.getElementById("console-area").style.display="none";
        document.getElementById("pipeline-area").style.display="none";
        document.getElementById("pipeline-area-nf").style.display="block";
        document.getElementById("console-btn").style.backgroundColor="#2e2e2e";
        document.getElementById("pipeline-nf").style.backgroundColor="grey";
        document.getElementById("pipeline-f").style.backgroundColor="#2e2e2e";
    }

    const pwofarr = props.pwofmatrix;
    const pwfarr = props.pwfmatrix;

    function generateNoForwardTable(){              // formatting 2D pipeline-withoutforwarding array into a suitable list

        let cycles;
        let stalls;
        let ipc;
        var tablex=null;

        if(pwofarr!=null){
            cycles=pwofarr._data[0].length-1;
            stalls=cycles-(pwofarr._data.length+4);
            ipc=(pwofarr._data.length/cycles).toFixed(2);

            var initrow=new Array();
            initrow.push('');

            tablex=[];

            for(var i=0;i<cycles;i++){
                if((i+1)<10)
                    initrow.push('CC-0'+(i+1));
                else
                    initrow.push('CC-'+(i+1));
            }

            tablex.push(initrow);

            for(var i=0;i<pwofarr._data.length;i++){
                tablex.push(pwofarr._data[i]);
            }

            /* trimming pipeline table if too long */

            if(tablex.length>100){
                tablex=tablex.slice(0,100);
            }

            if(tablex[0].length>200){
                for(var i=0;i<tablex.length;i++){
                    tablex[i]=tablex[i].slice(0,200);
                }
            }

        }

        return (                        // rendering pipeline UI
            (pwfarr!=null?
            
                (<div className="inside-pip">
                <div style={{color: `#acacac`}}>Number of Cycles: <span style={{color: `white`}}>{cycles} |</span> Number of Stalls: <span style={{color: `white`}}>{stalls} |</span> IPC: <span style={{color: `white`}}>{ipc}</span></div>
                
                <table  className="pipeline-table" style={{borderColor: `#8be9fd`}}>
                    {/* converting 2D list into pipeline table */}
                    {tablex.map((eh)=>(eh!=tablex[0]?(<tr>
                        {eh.map((e)=>((e===eh[0])?(<td  id="pip" style={{backgroundColor: `#343434`, color: `#abcdef`, width: `0px`, textAlign: `left`}}>{e}</td>):(
                            (e.trim()==='STALL')?(<td style={{width: `0px`, color: `#797d99`}} id="pip">{e}</td>):
                            (<td style={{width: `0px`}} id="pip">{e}</td>)
                        )))}
                    </tr>):
                    (
                        (<tr>
                            {eh.map((e)=>((e===eh[0])?(<td  id="pip" style={{backgroundColor: `#343434`, width: `0px`, textAlign: `left`}}>{e}</td>):(
                                <td style={{backgroundColor: `#343434`, width: `0px`, color: `#abcdef`}} id="pip">{e}</td>
                            )))}
                        </tr>)
                    )))}
                    
                </table>
            </div>):
            (                               // if editor is empty, display message
            <div className="write-code">
                ⚠ <span id="normal-text">Write some code and click 'RUN' to generate the pipeline</span>
                <p>
            
            <div style={{color: `#acacac`}}>
            <p style={{color: `#acacac`}}>Note:</p>
                <ol style={{marginTop: `-10px`}}>
                    <li>
                    Lengthy codes may take around a minute to execute. In case the page is unresponsive, please click on 'Wait' until it finishes executing.
                    </li>
                    <li>
                    Large pipeline diagrams are truncated to improve performance of the simulator.
                    </li>
                </ol>
            {/* </span> */}
            </div>
            </p>
            </div>)  
            )
            
        );
    }

    function generateForwardTable(){              // formatting 2D pipeline-withforwarding array into a suitable list

        var cycles, stalls, ipc;

        var tablex=null;

        if(pwfarr!=null){
            cycles=pwfarr._data[0].length-1;
            stalls=cycles-(pwfarr._data.length+4);
            ipc=(pwfarr._data.length/cycles).toFixed(2);

            var initrow=new Array();
            initrow.push('');

            tablex=[];

            for(var i=0;i<cycles;i++){
                if((i+1)<10)
                    initrow.push('CC-0'+(i+1));
                else
                    initrow.push('CC-'+(i+1));
            }

            tablex.push(initrow);

            for(var i=0;i<pwfarr._data.length;i++){
                tablex.push(pwfarr._data[i]);
            }

            /* trimming pipeline table if too long */

            if(tablex.length>100){
                tablex=tablex.slice(0,100);
            }

            if(tablex[0].length>200){
                for(var i=0;i<tablex.length;i++){
                    tablex[i]=tablex[i].slice(0,200);
                }
            }

        }

        return (                        // rendering pipeline UI
            (pwfarr!=null?
            
                (<div className="inside-pip">
                <div style={{color: `#acacac`}}>Number of Cycles: <span style={{color: `white`}}>{cycles} |</span> Number of Stalls: <span style={{color: `white`}}>{stalls} |</span> IPC: <span style={{color: `white`}}>{ipc}</span></div>
                <table  className="pipeline-table" style={{borderColor: `#8be9fd`}}>
                    {/* converting 2D list into pipeline table */}
                    {tablex.map((eh)=>(eh!=tablex[0]?(<tr>
                        {eh.map((e)=>((e===eh[0])?(<td  id="pip" style={{backgroundColor: `#343434`, color: `#abcdef`, width: `0px`, textAlign: `left`}}>{e}</td>):(
                            (e.trim()==='STALL')?(<td style={{width: `0px`, color: `#797d99`}} id="pip">{e}</td>):
                            (<td style={{width: `0px`}} id="pip">{e}</td>)
                        )))}
                    </tr>):
                    (
                        (<tr>
                            {eh.map((e)=>((e===eh[0])?(<td  id="pip" style={{backgroundColor: `#343434`, width: `0px`, textAlign: `left`}}>{e}</td>):(
                                <td style={{backgroundColor: `#343434`, width: `0px`, color: `#abcdef`}} id="pip">{e}</td>
                            )))}
                        </tr>)
                    )))}
                    
                </table>
            </div>):
            (                               // if editor is empty, display messaage
            <div className="write-code">
            ⚠ <span id="normal-text">Write some code and click 'RUN' to generate the pipeline</span>
            <p>
            
            <div style={{color: `#acacac`}}>
            <p style={{color: `#acacac`}}>Note:</p>
                <ol style={{marginTop: `-10px`}}>
                    <li>
                    Lengthy codes may take around a minute to execute. In case the page is unresponsive, please click on 'Wait' until it finishes executing.
                    </li>
                    <li>
                    Large pipeline diagrams are truncated to improve performance of the simulator.
                    </li>
                </ol>
            {/* </span> */}
            </div>
            </p>
            </div>
            ))
            
        );
    }

    return (                                // rendering AceEditor UI
        <div className="console-wrapper">
            
            {/* buttons */}
            <div style={{zIndex: `0`}} className="console-nav">
                <span id="console-btn" onClick={() => openConsole()}>Console</span>
                <span id="pipeline-f" onClick={() => openPipelinef()}>Pipeline-Forwarding</span>
                <span id="pipeline-nf" onClick={() => openPipelinenf()}>Pipeline-NoForwarding</span>
            </div>

            <div id="console-area">
                {/* React ace-editor package */}
                <AceEditor
                    className={"console"}
                    theme="dracula"
                    fontSize={14}
                    style={{ width: "100%", zIndex: `0`, height: `210px`}}
                    name="console"
                    editorProps={{ $blockScrolling: true }}
                    setOptions={{ tabSize: 4, wrap: false }}
                    showPrintMargin={false}
                    value={props.console}
                    readOnly
                />
            </div>

            <div id="pipeline-area">
                {generateForwardTable()}
            </div>
            
            <div id="pipeline-area-nf">
               {generateNoForwardTable()}
            </div>

        </div>
    );
}

export default Console