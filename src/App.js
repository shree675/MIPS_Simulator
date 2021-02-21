import logo from './logo.svg';
import './App.css';
import React, { Component } from 'react';

import IDE from './container/IDE/ide';
import Navbar from './component/navbar/Navbar';
import Console from './component/console/Console'
import SideBar from './component/sidebar/SideBar'

import processor from './simulator/processor'
import parser from './simulator/parser'
import execute from './simulator/execute'

class App extends Component {

  state = {
		code: "",
    //isRunning: false,
		lines: null,
    tags: null,
		registers: processor.registers,
		pc: 0,
	}

  run = () => {
		processor.reset()
		//parser.reset()
    //console.log(this.state.code)
    console.log("run");
    do
    {
      this.step()

    }while(this.state.pc!=0);
    //this.state.lines = parser.parse(this.state.code)
    //[this.state.lines, this.state.tags] = parser.parse(this.state.code)
    //console.log(this.state.lines)
    
		//numCompInstr = 0
		
/* 
		this.setState({
			running: 0
		})	
		this.setState({
			instructions: parser.parse(textArea)
		})
 */
		
	}

  step = () =>{
    if(this.state.pc===0)
    {   this.setState({
        lines: null,
        tags: null,
      })
    }
    if(this.state.lines==null)
    {
      [this.state.lines, this.state.tags] = parser.parse(this.state.code)
    }
    console.log("Going to execute")
    this.state.pc = execute.exe(this.state.lines, this.state.tags, this.state.pc)
    console.log("Checking Registers")
    console.log(processor.registers)
    console.log("Checking pc")
    console.log(this.state.pc) 
    console.log("Checking Memory")
    console.log(processor.memory)

  }


  onCodeChange = changedCode => {
		this.setState({
			code: changedCode,
      lines: null,
      tags: null,
      pc:0
		})
	}

  render = () => {
    return (
      <div className="main-screen">
        <div className="App">
          <div style={{width: '35%'}}>
            <SideBar
              /*registers={this.state.registers}
              pc={this.state.pc}
              
              clicked={this.state.clicked}
              onNavClick={this.onSideNavClick}
              dataSegment={processor.memory}
              memoryUsed={parser.memPtr * 4}
              sampleProgram={this.onSampleProgramClick}
              running={this.state.running}
              performance={this.state.performance}
              configureCache={this.configureCache}
              l1CacheInfo={this.state.l1CacheConfig}
              l2CacheInfo={this.state.l2CacheConfig}
              isShowing={this.state.showCacheConfig}
              hideCacheSettings={this.onToggleCacheSettings}
              mainMemoryConfig={this.onMainMemoryConfig}
              mainMemory={this.state.mainMemoryLatency}
              refreshCacheContents={this.showCacheContents}  */
            />
          </div> 
          <div style={{width: '65%', height: '722px'}}>
          <div>
          <Navbar
            run={this.run}
            step={this.step}
            /* setFile={this.setFile}
            deleteFile={this.deleteFile}
            assemble={this.assemble}
            execute={this.Execute}
            stepRun={this.StepRun}
            toggleDF={this.onDataForwardEnable}
            dataForw={this.state.dataForwarding}
            running={this.state.running}
            toggleMS={this.onEnableMoreStats}
            moreStats={this.state.enableMoreStats}
            toggleCacheSettings={this.onToggleCacheSettings}
            isShowing={this.state.showCacheConfig} */
          />
        </div>
            <IDE
              onCodeChange={this.onCodeChange}
              code={this.state.code}
              pc={this.state.pc} 
            />
            <div style={{height: '1px', backgroundColor: 'white'}}></div>
            <Console
              /* console={this.state.print}
              operations={currentOperations}
              moreStats={this.state.enableMoreStats} */
            />
          </div>
        </div>
      </div>
    )
  }
}

export default App;
