import '../App.css';
import React, { Component } from 'react';
import Editor from './Interface/Editor/Editor.js';
import Navbar from './Interface/Navbar/Navbar.js';
import Console from './Interface/Console/Console.js'
import Sidebar from './Interface/DisplayPanel/Sidebar';
import processor from './Simulator/processor.js'
import parser from './Simulator/parser.js'
import execute from './Simulator/execute.js'
import PWOF from './Simulator/PWOF.js'
import PWF from './Simulator/PWF.js'
import DropDownCard from './Interface/Help/Card.js';
// import {Resizable} from 're-resizable';

class MainPage extends Component {

  constructor(props) {
    super(props);
    this.ideMan = React.createRef();
  }

  state = {
		code: '',
		lines: null,
    tags: null,
		registers: processor.registers,
    print: "📖 Read Only\n",    // 🕮 📖
		pc: 0,
    PWOFMatrix: null,
    PWFMatrix: null,
    memory: processor.memory,
    prevRegisters: new Map(
      [
          ["r0", 0],
          ["at", 0],
          ["v0", 0],
          ["v1", 0],
          ["a0", 0],
          ["a1", 0],
          ["a2", 0],
          ["a3", 0],
          ["t0", 0],
          ["t1", 0],
          ["t2", 0],
          ["t3", 0],
          ["t4", 0],
          ["t5", 0],
          ["t6", 0],
          ["t7", 0],
          ["s0", 0],
          ["s1", 0],
          ["s2", 0],
          ["s3", 0],
          ["s4", 0],
          ["s5", 0],
          ["s6", 0],
          ["s7", 0],
          ["t8", 0],
          ["t9", 0],
          ["k0", 0],
          ["k1", 0],
          ["gp", 0],
          ["sp", 0],
          ["s8", 0],
          ["ra", 0]
      ]),
      l1cachesize: 16,
      l1blocksize: 4,
      l1assoc: 1,
      l1latency: 1,
      l2cachesize: 64,
      l2blocksize: 4,
      l2assoc: 1,
      l2latency: 2,
      memlatency: 10,
      isidealcase: false,
      L1: processor.L1,
      L2: processor.L2
	}

  setCode = (newCode)=>{
    this.deleteFile();
    this.setState({
      code: newCode
    });
    this.state.code=newCode;
    this.render();
  }

  run = () => {
    //call processor.updateCachesettings
    processor.updateCacheSettings(this.state.l1cachesize,this.state.l1blocksize,this.state.l1assoc,this.state.l2cachesize,this.state.l2blocksize,this.state.l2assoc,this.state.l1latency,this.state.l2latency,this.state.memlatency,this.state.isidealcase);
		processor.reset()
    this.state.print = "📖 Read Only\n"
    this.state.pc = 0
    this.setState({
      pc:0,
      print: "📖 Read Only\n",
    });
    
    do
    {
      this.step()
    }while(this.state.pc!=0);

    //IMPORTANT: here call both PWF and PWOF.updateCacheSettings() along with appropriate cache input paramenters before calling run
    PWF.updateCacheSettings(this.state.l1cachesize,this.state.l1blocksize,this.state.l1assoc,this.state.l2cachesize,this.state.l2blocksize,this.state.l2assoc,this.state.l1latency,this.state.l2latency,this.state.memlatency,this.state.isidealcase);
    PWOF.updateCacheSettings(this.state.l1cachesize,this.state.l1blocksize,this.state.l1assoc,this.state.l2cachesize,this.state.l2blocksize,this.state.l2assoc,this.state.l1latency,this.state.l2latency,this.state.memlatency,this.state.isidealcase);
    
    this.state.PWFMatrix = PWF.run(this.state.lines, this.state.tags)
    this.state.PWOFMatrix = PWOF.run(this.state.lines, this.state.tags)
    this.setState({
      PWOFMatrix: this.state.PWOFMatrix,
      PWFMatrix: this.state.PWFMatrix,
    });

    this.ideMan.current.highlight(-1);

    //console.log('PWOF :',this.state.PWOFMatrix)
    //console.log('PWF: ',this.state.PWFMatrix)
    /* let a = PWOF.run(this.state.lines, this.state.tags)
    console.log(a) */
    /* let b = PWF.run(this.state.lines, this.state.tags)
    console.log(b) */
    /* this.state.PWOFMatrix = PWOF.run(this.state.lines, this.state.tags)
    console.log('PWOF :',this.state.PWOFMatrix)

    this.state.PWFMatrix = PWF.run(this.state.lines, this.state.tags)
    console.log('PWF: ',this.state.PWFMatrix) */
	}

  step = () =>{   
    if(this.state.pc===0)
    { 
      this.state.print = "📖 Read Only\n"  
      this.setState({
        lines: null,
        tags: null,
        print: this.state.print,
        valid: 0
      })
    }
    if(this.state.lines==null)
    {
      //here call processor.updateCacheSettings() ->pass 10 parameters
      processor.updateCacheSettings(this.state.l1cachesize,this.state.l1blocksize,this.state.l1assoc,this.state.l2cachesize,this.state.l2blocksize,this.state.l2assoc,this.state.l1latency,this.state.l2latency,this.state.memlatency,this.state.isidealcase);
      [this.state.lines, this.state.tags] = parser.parse(this.state.code)
    }
    for(var [key,value] of processor.registers){
      this.state.prevRegisters.set(key,value);
    }
    [this.state.pc, this.state.print] = execute.exe(this.state.lines, this.state.tags, this.state.pc, this.state.print)
    
    this.setState({
      pc: this.state.pc,
      registers: processor.registers,
      memory: processor.memory,
      print: this.state.print,
      L1: processor.L1,
      L2: processor.L2
    });

    //IDE.highlight(this.state.pc);
    this.ideMan.current.highlight(this.state.pc)
    //IDE.highlight(pc);

    // this.state.prevRegisters=processor.registers;
    
    // console.log('current', this.state.registers);
    // console.log('reg', processor.registers);
    // console.log(this.state.prevRegisters===processor.registers);
    // this.state.tempRegisters=this.state.registers;
    // this.setState({
    
    // });
    

    // if(this.state.pc===0){
    //   this.setState({
    //     memory: new Array(1024).fill(0)
    //   });
    // }
    // this.render();

    //console.log("Checking Registers")
    // console.log(processor.registers)
    //console.log('current', this.state.registers);
    // console.log("Checking pc")
    // console.log(this.state.pc)
    //console.log("Checking Memory")
    //console.log(this.state.memory)

  }

	setFile = async (event) => {
		let file = event.target.files[0];
		//creating a reader object
		var reader = new FileReader();

		reader.onload = () => {
			// console.log(reader.result);
			this.setState({
				code: String(reader.result)
			})
		}

    try{
		  reader.readAsText(file);
    }
    catch (error){

    }
	}

	deleteFile = (event) => {

		this.setState({
			code: "",
      processor: processor.reset(),
      memory: processor.memory,
      registers: processor.registers,
      pc: 0,
      print: "📖 Read Only\n",
      PWFMatrix: null,
      PWOFMatrix: null,
      valid: 1,      
		})

    this.ideMan.current.highlight(-1);

    processor.L1=new Array(0);
    processor.L2=new Array(0);    
    
	}


  onCodeChange = changedCode => {
		this.setState({
			code: changedCode,
      lines: null,
      tags: null,
      pc:0,
		})
	}

  onCacheChange = (l1csize,l1bsize,l1assoc,l1latency,l2csize,l2bsize,l2assoc,l2latency,memlatency,isideal)=>{
    this.setState({
      l1cachesize: l1csize,
      l1blocksize: l1bsize,
      l1assoc: l1assoc,
      l1latency: l1latency,
      l2cachesize: l2csize,
      l2blocksize: l2bsize,
      l2assoc: l2assoc,
      l2latency: l2latency,
      memlatency: memlatency,
      isidealcase: isideal,
      pc:0,
    });
    
  }


  render = () => {
    // console.log(this.state.l1cachesize);
    // console.log(document.getElementById("editor"));
    /* var Range = require("ace/range").Range
    editor.session.addMarker(new Range(8, 0, 8, 1), 'ace_highlight-marker', 'fullLine');  */
    /* var ac = require('brace');
    var Range = ac.require('ace/range').Range;
    editor.session.addMarker(new Range(2, 0, 0, 1), 'myMarker', 'fullLine', true); */
    // {console.log('afsdasdf',this.state.L2);}
   /*  var editor = ace.edit("ace-editor");
    var Range = ace.require('ace/range').Range;
    editor.session.addMarker(new Range(2, 3,2, 11), 'ace_highlight-marker', 'fullLine'); */
    return (
      <div className="main-screen">
        <div className="App">

            <DropDownCard setCode={this.setCode}/>
          
            <div style={{width: '35%'}}>
              <Sidebar
                registersmap={this.state.registers}
                programCounter={this.state.pc}
                memoryArray={this.state.memory}
                prevRegisters={this.state.prevRegisters}
                onCacheChange={this.onCacheChange}
                l1cache={processor.L1}
                l2cache={processor.L2}
              />
          </div> 
          {/* 722px */}
          <div style={{width: '65%', height: `100%`}}>
            <div>
              <Navbar
                run={this.run}
                step={this.step}
                setFile={this.setFile}
                deleteFile={this.deleteFile}
              />
          </div>
        
          <div id="editor" style={{height: ``, zIndex: `-20`}}>
            
            <Editor ref={this.ideMan}
              onCodeChange={this.onCodeChange}
              code={this.state.code}
              pc={this.state.pc} 
            />
            
          </div>
          <div>
            <div style={{height: '1px', backgroundColor: '#bd93f9'}}></div>
            
            <div style={{zIndex: `0`, height: `100%`}}>

              <Console
                console={this.state.print}
                pwfmatrix={this.state.PWFMatrix}
                pwofmatrix={this.state.PWOFMatrix}
              />
            
            </div>
            </div>
            </div>
          </div>
          
        </div>
    )
  }
}

export default MainPage;