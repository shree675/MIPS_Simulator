import React, { useState } from 'react';
import './Console.css'
import AceEditor from "react-ace";
import 'brace/theme/dracula'; 
import { ResizableArea } from 'react-resizable-area'

const Console = props => {
    var [isConsole, setIsConsole] = useState(true)

    var classConsole = isConsole ? "console-btn active" : "console-btn"
    var classPipeline = isConsole ? "console-btn" : "console-btn active"

    const consoleScreen = () => {
        setIsConsole(true)
    }
    const pipelineScreen = () => {
        setIsConsole(false)
    }
    // console.log("Ops: ")
    // console.log(props.operations.length)

    return (
        <div className={"console-wrapper"}>
        
            <div className="console-nav">
                <span className={classConsole} onClick={() => consoleScreen()}>Console</span>
                {/* <span className={classPipeline} onClick={() => pipelineScreen()}>Pipeline</span> */}
            </div>
            <div style={!isConsole ? { display: 'none' } : { display: 'block' }}>
                <AceEditor
                    className={"console"}
                    theme="dracula"
                    fontSize={14}
                    style={{ width: "100%", height: "220px" }}
                    name="console"
                    editorProps={{ $blockScrolling: true }}
                    setOptions={{ tabSize: 4, wrap: false }}
                    showPrintMargin={false}
                    value={props.console}
                    readOnly
                />
            </div>
            {/* <div className="pipeline-screen" style={!isConsole && (props.operations.length === 0 || !props.moreStats) ? { display: 'block', color: 'white'  } : { display: 'none' }}>
                Enable More Stats And Run Your Program To See Instructions In Their Pipeline Stages ( Works Best With Step-Run )
                <div style={{color: 'orange'}}><span style={{fontWeight:'bold'}}>Warning:</span> Do Not Turn On For Large Programs Like 'Bubble Sort', As Time Taken To Complete The Task May Increase By Large Amount Or System May Hang!!</div>
            </div>
            <div className="pipeline-screen" style={!isConsole && props.operations.length > 0 && props.moreStats ? { display: 'block' } : { display: 'none' }}>
                <table border='2' id="table-main">
					<tr id="cycle-number">
						<td align='center' nowrap="nowrap" className="instr-cell" id="instr-cell-heading">Cycle/Instruction</td>
					</tr>
				</table>
            </div> */}
            </div>
    );
}

export default Console