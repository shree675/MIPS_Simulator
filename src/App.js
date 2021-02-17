import logo from './logo.svg';
import './App.css';
import React, { Component } from 'react';

import IDE from './container/IDE/ide';
import Navbar from './component/navbar/Navbar';
import Console from './component/console/Console'
import SideBar from './component/sidebar/SideBar'

/* function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
} */

class App extends Component {
  render = () => {
    return (
      <div className="main-screen">
        <div>
          <Navbar
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
        <div className="App">
          <div style={{ width: '30%' }}>
            <SideBar
              /* registers={this.state.registers}
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
          <div style={{ width: '70%' }}>
            <IDE
              /* onCodeChange={this.onCodeChange}
              code={this.state.code}
              pc={this.state.pc} */
            />
            <div style={{ height: '1px', backgroundColor: 'white' }}></div>
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
