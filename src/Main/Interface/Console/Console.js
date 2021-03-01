import React from 'react';
import './Console.css'
import AceEditor from "react-ace";
import 'brace/theme/dracula'; 
// import { ResizableArea } from 'react-resizable-area'

const Console = props => {

    return (
        <div className={"console-wrapper"}>
        
            <div className="console-nav">
                <span className="console-btn">Console</span>
                {/* <span className={classPipeline} onClick={() => pipelineScreen()}>Pipeline</span> */}
            </div>
            <div style={{display: 'block'}}>
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
        </div>
    );
}

export default Console