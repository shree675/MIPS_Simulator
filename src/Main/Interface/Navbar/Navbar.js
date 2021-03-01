import React from 'react'
import './Navbar.css';
import '../Help/Card.js';
// import Dropdown from 'react-dropdown';

class Navbar extends React.Component{

    // state={
    //     curdropdown: false
    // }
    // curdropdown=false;

    // list=["abc", "hello", "aldfj"];

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
        // this.setState({
            // this.curdropdown= !this.curdropdown
        // });
        // if(this.curdropdown && document.getElementById("dropdown")!=null){
        //     document.getElementById("dropdown").style.display="block";
        // }
        // else{
        //     if(document.getElementById("dropdown")!=null){
        //         document.getElementById("dropdown").style.display="none";
        //     }
        // }
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
                        <input style={{borderLeft: `1px solid grey`}} width="4" maxlength="0" type="file" name="file" id ="fileInput" size="0" accept=".asm" onChange={this.props.setFile.bind(this)} multiple/>
                    </span>
                </span>
                
                <button className="file" onClick={this.props.deleteFile.bind(this)} style={{borderRight: `1px solid grey`, float: `left`, borderLeft: `1px solid grey`}}>CLEAR ALL</button>
            
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
                    <button style={{borderLeft: `1px solid grey`}} onClick={this.props.step}>STEP</button>
                    <button style={{borderLeft: `1px solid grey`}} onClick={this.props.run}>RUN</button>
                    </span>
                </span>
        

            </nav>
        )

    }
}
export default Navbar;