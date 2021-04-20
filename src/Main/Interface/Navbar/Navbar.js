import React from 'react'
import './Navbar.css';
import '../Help/Card.js';

// navbar component (main)

class Navbar extends React.Component{

    /* empty functions for testing click events */

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
    
    render(){                           // rendering navbar UI
        return(
            <nav className="main-nav">
                                
            <div>
            
                <span id="navbar-buttons-id" className="nav-buttons upload">

                    {/* button to perform upload from drive function */}
                    <span className="file">
                        <label for="fileInput">UPLOAD</label>
                        <input style={{borderLeft: `1px solid grey`}} width="4" maxlength="0" type="file" name="file" id ="fileInput" size="0" accept=".asm" onChange={this.props.setFile.bind(this)} multiple/>
                    </span>
                </span>
                
                {/* button that resets everything */}
                <button className="file" onClick={this.props.deleteFile.bind(this)} style={{borderRight: `1px solid grey`, float: `left`, borderLeft: `1px solid grey`}}>CLEAR ALL</button>
            
            </div>

                {/* step-run and run buttons */}
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