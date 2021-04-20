import React, { Component } from 'react';
import AceEditor from "react-ace";
import 'brace/mode/mips_assembler';
import 'brace/theme/dracula';
import './Editor.css'

class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      markers:[],
      pc:this.props.pc
    };
  }
  onChange(newValue, e) {
    this.props.onCodeChange(String(newValue))
  }
  highlight=(pc)=>{                     // function to implement line highlight on editor during step-run
    if(this.state.markers!=null)
    {
      this.state.markers.pop();
    }
    this.state.markers.push({startRow: pc, startCol: 0, endRow: (pc+1), endCol: -1, className: 'highlight-marker', type: 'fullline' });
    this.setState({
      markers: this.state.markers
    })
  }
  render() {
      return (
          <div className={"Editor-wrapper"}>
            <div id="editor">
              <AceEditor 
                  key={this.props.pc}
                  className={"IDE"}
                  placeholder="# Type your code here:"
                  fontSize={16} 
                  showPrintMargin={false}
                  value = {this.props.code}
                  onChange={this.onChange.bind(this)}
                  highlight = {this.highlight.bind(this)}
                  style={{width: "100%", zIndex: `0`, height: `440px`}}
                  name="mipsIDE" 
                  editorProps={{$blockScrolling: true}}
                  setOptions={{tabSize: 4, wrap: false}}
                  markers={this.state.markers}
                  enableBasicAutocompletion
                  autoScrollEditorIntoView
                  mode="mips_assembler" 
                  theme="dracula"
              />
              </div>
          </div>
      );
  }
}
export default Editor;