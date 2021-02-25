import React from 'react'
import './Navbar.css';
import Dropdown from 'react-dropdown';
// import Button from 'react-button';
// import CODE from '../code';
// const fs = require('fs');

class Navbar extends React.Component{
    // state = {
    //     result: "",
    //     clicked: (event) => {
    //         // alert("hello");
    //         console.log("hello");
    //     }
    // }

    list=["abc", "hello", "aldfj"];

    clicked() {
        console.log("hello");    
    }

    clearAll(){
        console.log("clear");
    }

    steprun(){
        console.log("step-run");
    }

    run(){
        console.log("run");
    }

    help(){
        console.log("help");
    }
    
    render(){
        return(
            <nav className="main-nav">
                
                
            {/*  <button className="file">UPLOAD</button> */}
            <div>
            
                <span id="navbar-buttons-id" className="nav-buttons upload">
                
                    <span className="file">
                        <label for="fileInput">UPLOAD</label>
                        <input width="4" maxlength="0" type="file" name="file" id ="fileInput" size="0" accept=".asm" onChange={this.props.setFile.bind(this)} multiple/>
                        {/* <br></br> */}
                        
                    </span>
                    {/* <span> */}
                        
                    {/* </span> */}
                </span>
                {/* <span style={{float:`left`}} className="navbar-buttons-left"> */}
                    {/* <button className="file" onClick={this.props.deleteFile.bind(this)} style={{borderRight: `1px solid grey`, float: `left`}}>CLEAR ALL</button> */}
                {/* </span> */}
                <button className="file" onClick={this.props.deleteFile.bind(this)} style={{borderRight: `1px solid grey`, float: `left`}}>CLEAR ALL</button>
            </div>

                {/* <div>

                <span id="left-buttons">
                    <div>
                        UPLOAD<input className="file" type="file" name="file" id ="fileInput" accept=".asm" onChange={this.props.setFile.bind(this)} multiple/>
                    </div>
                    <button className="file" onClick={this.props.deleteFile.bind(this)} style={{borderRight: `1px solid grey`, float: `left`}}>CLEAR ALL</button>
                </span> */}

                <span id="navbar-right-id">
                    <span className="navbar-buttons-right">
                    <button onClick={this.props.step}>STEP</button>
                    <button onClick={this.props.run}>RUN</button>
                    <button onClick={this.help}>HELP</button> 
                    </span>
                </span>

                {/* </div> */}
        

            </nav>
        )

    }
}
export default Navbar;

/* class Navbar extends React.Component{
    state = {
        result: ""
    }

    render(){
        var runButton = ""
        if(this.props.running === 1){
            runButton = <span href="#" ><i className="fas fa-spinner" style={{color: "yellow"}}></i> Running</span>
        }
        else if(this.props.running === 2){
            runButton = <span href="#" ><i className="fas fa-check" style={{color: '"yellow'}}></i> Done</span>
        }
        else{
            runButton = <span href="#" ><i className="fas fa-play" style={{color: "yellow"}}></i> Run</span>
        }
        return (
            <nav className="main-nav">
                <div className="leftSide">
                    <div className="brand-icon">
                        <i className="fas fa-microchip"></i>
                    </div>

                    <div className="nav-item nav-buttons upload">
                        <span className="file">
                            Upload
                            <input type="file" name="file" id ="fileInput" accept=".asm" onChange={this.props.setFile.bind(this)} multiple/>
                        </span>
                    </div>

                    <div className="nav-item nav-buttons" style={this.props.isShowing?{backgroundColor: '#72757a'}:{}}>
                        <span onClick={() => this.props.toggleCacheSettings()}>
                            Cache Settings
                        </span>

                    </div>

                    <div className="nav-item nav-buttons"> 
                        <span className="file" onClick={this.props.deleteFile.bind(this)} >
                            Clear
                        </span>
                    </div>


                    <div className="nav-item nav-buttons" onClick={() => this.props.toggleDF()} style={this.props.dataForw? {backgroundColor: "green"}: {}}> 
                        <span>
                            Data Forward
                        </span>
                    </div>

                    <div className="nav-item nav-buttons" onClick={() => this.props.toggleMS()} style={this.props.moreStats? {backgroundColor: "green"}: {}}> 
                        <span>
                            More Stats
                        </span>
                    </div>

                    <div className="nav-item nav-buttons" onClick={() => alert(
                        `Using The Simulator\n1. Upload or Write Your Code\n2. Enable/Disable DataForwarding Option (Disabled By Default)\n3. Enable/Disable MoreStats To View Pipeline (Disabled By Default)\n4. Configure The Cache\n5. StepRun/Run Your MIPS Code\n\nCache Table does not get updated automatically, please use refresh button to get latest contents of the cache\n\nCheck Performance Of Program and Simulator in SideBar\n** Execution may take few seconds depending on Configuration of Simulator` 
                    )}> 
                        <span>
                            Help
                        </span>
                    </div>

                </div>

                <div className="title" style={{display: 'inline'}}>
                    Mips Simulator
                </div>

                <div className="rightSide" style={{display: 'inline'}}>
                    <span className="nav-item  nav-buttons" onClick={this.props.assemble}>
                        <span href="#" >Assemble</span>
                    </span>
                    <span className="nav-item  nav-buttons" onClick={this.props.execute}>
                        {runButton}
                    </span>
                    <span className="nav-item  nav-buttons" onClick={this.props.stepRun}>
                         <span href="#" >Step-Run</span>
                    </span>
                </div>
            </nav>
        )
    }
}
export default Navbar; */