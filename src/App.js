// import logo from './logo.svg';
// import './App.css';
// import React, { Component } from 'react';
// import ace from 'ace-builds/src-min-noconflict/ace';

// // import "brace/mode/{mode_name}";
// // import "brace/snippets/{mode_name}";
// // import "brace/ext/language_tools";
// import IDE from './container/IDE/ide';
// import Navbar from './component/navbar/Navbar';
// import Console from './component/console/Console'
// import SideBar from './component/sidebar/SideBar'

// import processor from './simulator/processor'
// import parser from './simulator/parser'
// import execute from './simulator/execute'
// import { Editor } from 'brace';
// import AceEditor from "react-ace";
// // var Range = ace.require('ace/range').Range;
// import {Range} from 'ace-builds';
// import DropDownCard from './component/Card';

// var editor = ace.edit(document.getElementById("editor"));



// class App extends Component {

//   // console.log(document.getElementById("editor"));
//   constructor(props) {
//     super(props);
//     this.ideMan = React.createRef();
//   }

//   state = {
// 		code: '',
//     //isRunning: false,
// 		lines: null,
//     tags: null,
// 		registers: processor.registers,
//     print: "*Read Only*\n",
// 		pc: 0,
//     memory: processor.memory,
//     prevRegisters: new Map(
//       [
//           ["r0", 0],
//           ["at", 0],
//           ["v0", 0],
//           ["v1", 0],
//           ["a0", 0],
//           ["a1", 0],
//           ["a2", 0],
//           ["a3", 0],
//           ["t0", 0],
//           ["t1", 0],
//           ["t2", 0],
//           ["t3", 0],
//           ["t4", 0],
//           ["t5", 0],
//           ["t6", 0],
//           ["t7", 0],
//           ["s0", 0],
//           ["s1", 0],
//           ["s2", 0],
//           ["s3", 0],
//           ["s4", 0],
//           ["s5", 0],
//           ["s6", 0],
//           ["s7", 0],
//           ["t8", 0],
//           ["t9", 0],
//           ["k0", 0],
//           ["k1", 0],
//           ["gp", 0],
//           ["sp", 0],
//           ["s8", 0],
//           ["ra", 0]
//       ]),
//     // prevRegisters: processor.registers
//     // tempRegisters: processor.registers
// 	}

//   setCode = (newCode)=>{
//     // console.log('here');
//     // console.log(newCode);
//     this.deleteFile();
//     this.setState({
//       code: newCode
//     });
//     this.state.code=newCode;
//     console.log(this.state.code);
//     this.render();
//   }

//   run = () => {
// 		processor.reset()
//     this.state.print = "*Read Only*\n"
//     //console.log(this.state.print)
//     this.setState({
//       // print: "*Read Only*\n"
//       print: this.state.print
//     });
//     //console.log(this.state.print);
// 		//parser.reset()
//     //console.log(this.state.code)
//     //console.log("run");
//     do
//     {
//       this.step()
//       console.log(this.state.pc);
//     }while(this.state.pc!=0);
//     //this.state.lines = parser.parse(this.state.code)
//     //[this.state.lines, this.state.tags] = parser.parse(this.state.code)
//     //console.log(this.state.lines)
    
// 		//numCompInstr = 0
		
// /* 
// 		this.setState({
// 			running: 0
// 		})	
// 		this.setState({
// 			instructions: parser.parse(textArea)
// 		})
//  */
		
// 	}

//   step = () =>{
    
//     if(this.state.pc===0)
//     { 
//       this.state.print = "*Read Only*\n"  
//       this.setState({
//         lines: null,
//         tags: null,
//         print: this.state.print
//       })
//     }
//     if(this.state.lines==null)
//     {
//       [this.state.lines, this.state.tags] = parser.parse(this.state.code)
//     }
//     // console.log("Going to execute")
//     for(var [key,value] of processor.registers){
//       this.state.prevRegisters.set(key,value);
//     }
//     // console.log('prev', this.state.prevRegisters);
//     [this.state.pc, this.state.print] = execute.exe(this.state.lines, this.state.tags, this.state.pc, this.state.print)
    
//     this.setState({
//       // pc: execute.exe(this.state.lines, this.state.tags, this.state.pc)
//       pc: this.state.pc,
//       registers: processor.registers,
//       memory: processor.memory,
//       print: this.state.print
//       // prevRegisters: this.state.tempRegisters
//     });

//     //IDE.highlight(this.state.pc);
//     this.ideMan.current.highlight(this.state.pc)
//     //IDE.highlight(pc);

//     // this.state.prevRegisters=processor.registers;
    
//     // console.log('current', this.state.registers);
//     // console.log('reg', processor.registers);
//     // console.log(this.state.prevRegisters===processor.registers);
//     // this.state.tempRegisters=this.state.registers;
//     // this.setState({
    
//     // });
    

//     // if(this.state.pc===0){
//     //   this.setState({
//     //     memory: new Array(1024).fill(0)
//     //   });
//     // }
//     // this.render();

//     //console.log("Checking Registers")
//     // console.log(processor.registers)
//     //console.log('current', this.state.registers);
//     // console.log("Checking pc")
//     // console.log(this.state.pc)
//     //console.log("Checking Memory")
//     //console.log(this.state.memory)

//   }

//   // --- logic to upload and clear file ---
// 	setFile = async (event) => {
// 		let file = event.target.files[0];
// 		//creating a reader object
// 		var reader = new FileReader();
//     //console.log("SetFile")

// 		//reading file
// 		reader.onload = () => {
// 			// console.log(reader.result);
// 			this.setState({
// 				code: String(reader.result)
// 			})
// 		}

//     try{
// 		  reader.readAsText(file);
//     }
//     catch (error){

//     }
// 	}

// 	deleteFile = (event) => {
// 		// localStorage.removeItem("result");
// 		// window.location.reload()
// 		this.setState({
// 			code: "",
//       processor: processor.reset(),
//       memory: processor.memory,
//       registers: processor.registers,
//       pc: 0,
//       print: "*Read Only*\n"
// 		})
//     console.log(this.state.print)
    
// 	}


//   onCodeChange = changedCode => {
// 		this.setState({
// 			code: changedCode,
//       lines: null,
//       tags: null,
//       pc:0,
// 		})
// 	}

//   /* printToConsole = (regV0, regA0) => {
// 		//printing logic
//     console.log("getting a0", regA0)
// 		if (regV0 === 1) {
// 			console.log("getting a0", regA0)
// 			const printNew = this.state.print + regA0 + " "
// 			this.setState({
// 				print: printNew
// 			})
// 		}
// 	} */


//   render = () => {
//     // console.log(document.getElementById("editor"));
//     /* var Range = require("ace/range").Range
//     editor.session.addMarker(new Range(8, 0, 8, 1), 'ace_highlight-marker', 'fullLine');  */
//     /* var ac = require('brace');
//     var Range = ac.require('ace/range').Range;
//     editor.session.addMarker(new Range(2, 0, 0, 1), 'myMarker', 'fullLine', true); */
    
//    /*  var editor = ace.edit("ace-editor");
//     var Range = ace.require('ace/range').Range;
//     editor.session.addMarker(new Range(2, 3,2, 11), 'ace_highlight-marker', 'fullLine'); */
//     return (
//       <div className="main-screen">
//         <div className="App">
//           {/* <span style={{width: `2%`}}> */}
//             <DropDownCard setCode={this.setCode}/>
//           {/* </span> */}
//           <div style={{width: '35%'}}>
//             <SideBar
//               registersmap={this.state.registers}
//               programCounter={this.state.pc}
//               memoryArray={this.state.memory}
//               prevRegisters={this.state.prevRegisters}
//               /*registers={this.state.registers}
//               pc={this.state.pc}
              
//               clicked={this.state.clicked}
//               onNavClick={this.onSideNavClick}
//               dataSegment={processor.memory}
//               memoryUsed={parser.memPtr * 4}
//               sampleProgram={this.onSampleProgramClick}
//               running={this.state.running}
//               performance={this.state.performance}
//               configureCache={this.configureCache}
//               l1CacheInfo={this.state.l1CacheConfig}
//               l2CacheInfo={this.state.l2CacheConfig}
//               isShowing={this.state.showCacheConfig}
//               hideCacheSettings={this.onToggleCacheSettings}
//               mainMemoryConfig={this.onMainMemoryConfig}
//               mainMemory={this.state.mainMemoryLatency}
//               refreshCacheContents={this.showCacheContents}  */
//             />
//           </div> 
//           <div style={{width: '65%', height: '722px'}}>
//           <div>
//           {/* <DropDownCard /> */}
//           <Navbar
//             run={this.run}
//             step={this.step}
//             setFile={this.setFile}
//             deleteFile={this.deleteFile}
//             /*assemble={this.assemble}
//             execute={this.Execute}
//             stepRun={this.StepRun}
//             toggleDF={this.onDataForwardEnable}
//             dataForw={this.state.dataForwarding}
//             running={this.state.running}
//             toggleMS={this.onEnableMoreStats}
//             moreStats={this.state.enableMoreStats}
//             toggleCacheSettings={this.onToggleCacheSettings}
//             isShowing={this.state.showCacheConfig} */
//           />
          
//         </div>
        
//           <div id="editor">
//           {/* <DropDownCard /> */}
//             <IDE ref={this.ideMan}
//               onCodeChange={this.onCodeChange}
//               code={this.state.code}
//               pc={this.state.pc} 
//             />
//           </div>
//             <div style={{height: '1px', backgroundColor: 'white'}}></div>
//             <Console
//               console={this.state.print}
              
//               /*operations={currentOperations}
//               moreStats={this.state.enableMoreStats} */
//             />
//           </div>
//         </div>
//       </div>
//     )
//   }
// }

// export default App;

import React, {Component} from 'react';
import logo from './logo.svg';
import {BrowserRouter as Router, Route, Switch, Link} from 'react-router-dom';
import MainPage from './mainpage.js';
import InfoPage from './informationpage';

class App extends Component {
  render(){
    return (
      <Router>
        <Switch>
          <Route exact path='/' component={MainPage} />
          <Route exact path='/information' component={InfoPage} />
        </Switch>
      </Router>
    );
  }
}

export default App;