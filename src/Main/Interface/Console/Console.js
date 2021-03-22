import React from 'react';
import './Console.css'
import AceEditor from "react-ace";
import 'brace/theme/dracula'; 
// import { ResizableArea } from 'react-resizable-area'

const Console = props => {

    function openConsole(){
        document.getElementById("console-area").style.display="block";
        document.getElementById("pipeline-area-nf").style.display="none";
        document.getElementById("pipeline-area").style.display="none";
        document.getElementById("console-btn").style.backgroundColor="grey";
        document.getElementById("pipeline-f").style.backgroundColor="#2e2e2e";
        document.getElementById("pipeline-nf").style.backgroundColor="#2e2e2e";
    }

    function openPipelinef(){
        document.getElementById("console-area").style.display="none";
        document.getElementById("pipeline-area").style.display="block";
        document.getElementById("pipeline-area-nf").style.display="none";
        document.getElementById("console-btn").style.backgroundColor="#2e2e2e";
        document.getElementById("pipeline-f").style.backgroundColor="grey";
        document.getElementById("pipeline-nf").style.backgroundColor="#2e2e2e";
    }

    function openPipelinenf(){
        document.getElementById("console-area").style.display="none";
        document.getElementById("pipeline-area").style.display="none";
        document.getElementById("pipeline-area-nf").style.display="block";
        document.getElementById("console-btn").style.backgroundColor="#2e2e2e";
        document.getElementById("pipeline-nf").style.backgroundColor="grey";
        document.getElementById("pipeline-f").style.backgroundColor="#2e2e2e";
    }

    // var array=['CC1','CC2','CC3','CC4','CC5','CC1','CC2','CC3','CC4','CC5','CC1','CC2','CC3','CC4','CC5','CC1','CC2','CC3','CC4','CC5','CC1','CC2','CC3','CC4','CC5']
    // var ar2=[array,array,array,array,array,array,array,array];

    const pwofarr = props.pwofmatrix;
    const pwfarr = props.pwfmatrix;
    // console.log(pwofarr);
    // console.log(pwfarr);

    function generateNoForwardTable(){

        var cycles, stalls;

        var tablex=null;

        if(pwofarr!=null){
            cycles=pwofarr._data[0].length-1;
            stalls=cycles-(pwofarr._data.length+4);

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

            // console.log(table);

        }

        return (
            (pwfarr!=null?
            
                (<div className="inside-pip">
                <div style={{color: `#acacac`}}>Number of Cycles: <span style={{color: `white`}}>{cycles} |</span> Number of Stalls: <span style={{color: `white`}}>{stalls}</span></div>
                {/* <hr></hr> */}
                <table  className="pipeline-table" style={{borderColor: `#8be9fd`}}>
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
            (<div className="write-code">
                ⚠ <span id="normal-text">Write some code and click 'RUN' to generate the pipeline</span>
            </div>)   
            )
            
        );
    }

    function generateForwardTable(){

        var cycles, stalls;

        var tablex=null;

        if(pwfarr!=null){
            cycles=pwfarr._data[0].length-1;
            stalls=cycles-(pwfarr._data.length+4);

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

            // console.log(table);

        }

        return (
            (pwfarr!=null?
            
                (<div className="inside-pip">
                <div style={{color: `#acacac`}}>Number of Cycles: <span style={{color: `white`}}>{cycles} |</span> Number of Stalls: <span style={{color: `white`}}>{stalls}</span></div>
                {/* <hr></hr> */}
                <table  className="pipeline-table" style={{borderColor: `#8be9fd`}}>
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
            (<div className="write-code">
                ⚠ <span id="normal-text">Write some code and click 'RUN' to generate the pipeline</span>
            </div>)   
            )
            
        );
    }

    return (
        <div className="console-wrapper">
        
            <div className="console-nav">
                <span id="console-btn" onClick={() => openConsole()}>Console</span>
                <span id="pipeline-f" onClick={() => openPipelinef()}>Pipeline-Forwarding</span>
                <span id="pipeline-nf" onClick={() => openPipelinenf()}>Pipeline-NoForwarding</span>
                {/* <span className={classPipeline} onClick={() => pipelineScreen()}>Pipeline</span> */}
            </div>
            <div id="console-area">
                <AceEditor
                    className={"console"}
                    theme="dracula"
                    fontSize={14}
                    style={{ width: "100%", height: "180px" }}
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