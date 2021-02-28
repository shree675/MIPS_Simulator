import React, { Component } from 'react';
import AceEditor from "react-ace";
import 'brace/mode/mips_assembler';
import 'brace/theme/dracula';
import './ide.css'
//import App from '.../App';
let warning = []
class IDE extends Component {

  constructor(props) {
    super(props);
    this.state = {
      markers:[],
      pc:this.props.pc
    };
  }
  
  onChange(newValue, e) {
    // console.log('onChange', newValue, e);
    this.props.onCodeChange(String(newValue))
  }
  highlight=(pc)=>{
    
    //console.log("highlighting");
    //console.log(pc)
    if(this.state.markers!=null)
    {
      this.state.markers.pop();
    }
    this.state.markers.push({startRow: pc, startCol: 0, endRow: (pc+1), endCol: -1, className: 'replacement_marker', type: 'fullline' });
    console.log(this.state.markers)
    this.setState({
      markers: this.state.markers
    })
    //this.state.markers.push({startRow: 3, startCol: 5, endRow: 5, endCol: 6, className: 'replacement_marker', type: 'text' });

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
    this.state.markers.push({startRow: pc, startCol: 0, endRow: (pc+1), endCol: -1, className: 'replacement_marker', type: 'text' });
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
          <div className={"IDE-wrapper"}>
            <div id="editor">
              <AceEditor 
                  key={this.props.pc}
                  className={"IDE"}
                  mode="mips_assembler" 
                  theme="dracula"
                  placeholder="// Type your code here:"
                  fontSize={16} 
                  style={{width: "100%", height: "470px"}}
                  name="mipsIDE" 
                  editorProps={{$blockScrolling: true}}
                  setOptions={{tabSize: 4, wrap: false}}
                  showPrintMargin={false}
                  value = {this.props.code}
                  onChange={this.onChange.bind(this)}
                  annotations = {warning}
                  highlight = {this.highlight.bind(this)}
                  markers={this.state.markers}
                  enableBasicAutocompletion
                  autoScrollEditorIntoView
              />
              </div>
          </div>
      );
  }
}
export default IDE;
