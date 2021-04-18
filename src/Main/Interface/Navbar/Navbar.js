import React from 'react'
import './Navbar.css';
import '../Help/Card.js';

class Navbar extends React.Component{

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
                                
            <div>
            
                <span id="navbar-buttons-id" className="nav-buttons upload">
                
                    <span className="file">
                        <label for="fileInput">UPLOAD</label>
                        <input style={{borderLeft: `1px solid grey`}} width="4" maxlength="0" type="file" name="file" id ="fileInput" size="0" accept=".asm" onChange={this.props.setFile.bind(this)} multiple/>
                    </span>
                </span>
                
                <button className="file" onClick={this.props.deleteFile.bind(this)} style={{borderRight: `1px solid grey`, float: `left`, borderLeft: `1px solid grey`}}>CLEAR ALL</button>
            
            </div>

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