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

class MainPage extends Component { //this is the Mainpage where all components of the simulator are integrated
  constructor(props) {
    super(props);
    this.ideMan = React.createRef();
  }

  state = {
		code: '', //the MIPS code input from the editor as a string
		lines: null, //MIPS code input parsed linewise
    tags: null, //array containing tags such as "main:"
		registers: processor.registers, 
    print: "📖 Read Only\n",    // 🕮 📖 contains the string contents of the Read only console
		pc: 0, //program counter
    PWOFMatrix: null, //The 2D array used to display the pipeline diagram without forwarding
    PWFMatrix: null, //The 2D array used to display the pipeline diagram with forwarding
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
      ]), //previous state of registers is maintained to enable highlighting of registers when the corresponding values change
      l1cachesize: 16, //size of L1 cache in bytes
      l1blocksize: 4, //size of the blocks in L1 cache in bytes
      l1assoc: 1, //associativity of L1 cache
      l1latency: 1, //latency of L1 cache
      l2cachesize: 64, //size of L2 cache in bytes
      l2blocksize: 4, //size of the blocks in L2 cache in bytes
      l2assoc: 1, //associativity of L2 cache
      l2latency: 2, //latency of L2 cache
      memlatency: 10, //latency of Man Memory access
      isidealcase: false, //if this is checked, the memory heirarchy is disabled and all memory are operations are assumed to be 1 cycle
      L1: processor.L1, //L1 cache data table
      L2: processor.L2 //L2 cache data table
	}

  setCode = (newCode)=>{ //updates the MIPS code input when changes are made in the editor
    this.deleteFile();
    this.setState({
      code: newCode
    });
    this.state.code=newCode;
    this.render();
  }

  run = () => {//runs the entire MIPS code, displays updated Registers, Memory, Cache Table and both pipeline tables, with and without forwarding
    processor.updateCacheSettings(this.state.l1cachesize,this.state.l1blocksize,this.state.l1assoc,this.state.l2cachesize,this.state.l2blocksize,this.state.l2assoc,this.state.l1latency,this.state.l2latency,this.state.memlatency,this.state.isidealcase);
		processor.reset()
    this.state.print = "📖 Read Only\n"
    this.state.pc = 0
    this.setState({
      pc:0,
      print: "📖 Read Only\n",
    });
    do//repeatedly calls the step function to execute each line step by step
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
    }); //the pipeline diagram tables are now generated
    this.ideMan.current.highlight(-1); 
	}

  step = () =>{ //executes the instruction pointed to by pc
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
    this.ideMan.current.highlight(this.state.pc)//updates the parameter used to move the highlight of the line to be executed on the next click of step
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
    this.ideMan.current.highlight(0);
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
    this.setState({ //updates the state variables of the cache when the inputs of cache settings are changed in the UI
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