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

    var array=['CC1','CC2','CC3','CC4','CC5','CC1','CC2','CC3','CC4','CC5','CC1','CC2','CC3','CC4','CC5','CC1','CC2','CC3','CC4','CC5','CC1','CC2','CC3','CC4','CC5']
    var ar2=[array,array,array,array,array,array,array,array];

    function generateTable(rows,columns){
        return (
            <div className="inside-pip">
                <div>Cycles, Stalls</div>
                <table className="pipeline-table">
                    {ar2.map((eh)=>(<tr className="pip">
                        {eh.map((e)=>(<td className="pip">{e}</td>))}
                    </tr>))}
                    
                </table>
            </div>
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
                {generateTable(1,5)}
            </div>
            <div id="pipeline-area-nf">
                {generateTable(1,5)}
            </div>
        </div>
    );
}

export default Console