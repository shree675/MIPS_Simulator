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
  highlight=(pc)=>{
    
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
    /* const row = this.aceRef.editor.session.getLength();
    this.aceRef.editor.gotoLine(row); */
    // this.highlight(this.props.pc);
    /* console.log("highlighting");
    var pc = this.state.pc
    console.log(pc)
    if(this.state.markers!=null)
    {
      this.state.markers.pop();
    }
    this.state.markers.push({startRow: pc, startCol: 0, endRow: (pc+1), endCol: -1, className: 'highlight-marker', type: 'text' });
     *//* this.setState(
    {
      markers: this.state.markers
    }); */
    //var Range = require("ace/range").Range
    //editor.session.addMarker(new Range(8, 0, 8, 1), 'ace_highlight-marker', 'fullLine');
    /* var editor = ace.edit("editor");
    var Range = ace.require('ace/range').Range;
    editor.session.addMarker(new Range(2, 3,2, 11), 'ace_highlight-marker', 'fullLine'); */
    /* let markers = [];
markers.push({startRow: 0, startCol: 0, endRow: 1, endCol: 6, className: 'replacement_marker', type: 'text' });
 */
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
                  style={{width: "100%", zIndex: `0`, height: `440px`}}    /* 440px act*/ /* 470px */
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