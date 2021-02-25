import React, { Component } from 'react';
import AceEditor from "react-ace";
import 'brace/mode/mips_assembler';
import 'brace/theme/dracula';
import './ide.css'
//import App from '.../App';
let warning = []
class IDE extends Component {
  state = {
    markers:[]
  }
  onChange(newValue, e) {
    // console.log('onChange', newValue, e);
    this.props.onCodeChange(String(newValue))
  }
  highlight=(pc)=>{
    console.log("highlighting");
    console.log(pc)
    if(this.state.markers!=null)
    {
      this.state.markers.pop();
    }
    this.state.markers.push({startRow: pc, startCol: 0, endRow: (pc+1), endCol: -1, className: 'replacement_marker', type: 'text' });
    //this.state.markers.push({startRow: 3, startCol: 5, endRow: 5, endCol: 6, className: 'replacement_marker', type: 'text' });

  }
  render() {
    //var Range = require("ace/range").Range
    //editor.session.addMarker(new Range(8, 0, 8, 1), 'ace_highlight-marker', 'fullLine');
    /* var editor = ace.edit("editor");
    var Range = ace.require('ace/range').Range;
    editor.session.addMarker(new Range(2, 3,2, 11), 'ace_highlight-marker', 'fullLine'); */
    /* let markers = [];
markers.push({startRow: 0, startCol: 0, endRow: 1, endCol: 6, className: 'replacement_marker', type: 'text' });
 */
      return (
          <div className={"IDE-wrapper"}>
            <div id="editor">
              <AceEditor
                  className={"IDE"}
                  mode="mips_assembler" 
                  theme="dracula"
                  placeholder="// Type your code here:"
                  fontSize={16} 
                  style={{width: "100%", height: "430px"}}
                  name="mipsIDE" 
                  editorProps={{$blockScrolling: true}}
                  setOptions={{tabSize: 4, wrap: false}}
                  showPrintMargin={false}
                  value = {this.props.code}
                  onChange={this.onChange.bind(this)}
                  annotations = {warning}
                  markers={this.state.markers}
                  enableBasicAutocompletion
              />
              </div>
          </div>
      );
  }
}
export default IDE;
