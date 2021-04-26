import React, {Component} from 'react';
import './Card.css';
import Codes from './Codes.js';
import {Link} from 'react-router-dom';

// this is the HELP panel component

class DropDownCard extends Component{

    constructor() {
        super();
        
        this.state = {
          displayMenu: false,          
        }
        
        this.displayMenu = this.displayMenu.bind(this);
        this.bubbleSort=this.bubbleSort.bind(this);
        this.testcodes=this.testcodes.bind(this);
        this.fibonacci=this.fibonacci.bind(this);
        this.arithmetic=this.arithmetic.bind(this);
        this.piptest1=this.piptest1.bind(this);
        this.piptest2=this.piptest2.bind(this);
        this.piptest3=this.piptest3.bind(this);
        this.cachetest1=this.cachetest1.bind(this);
        this.cachetest2=this.cachetest2.bind(this);

      }

      /* the below functions display appropriate codes on the editor on selecting an asm program from the HELP panel */

      bubbleSort(){
        const codes = new Codes();
        this.props.setCode(codes.bubbleSort);
        this.setState({
            displayMenu: false,
        });
      }

      testcodes(){
        const codes = new Codes();
        this.props.setCode(codes.testcode);
        this.setState({
            displayMenu: false,
        });
      }

      fibonacci(){
        const codes = new Codes();
        this.props.setCode(codes.fibonacci);
        this.setState({
            displayMenu: false,
        });
      }

      arithmetic(){
        const codes = new Codes();
        this.props.setCode(codes.arithmetic);
        this.setState({
            displayMenu: false,
        });
      }

      piptest1(){
        const codes = new Codes();
        this.props.setCode(codes.piptest1);
        this.setState({
            displayMenu: false,
        });
      }

      piptest2(){
        const codes = new Codes();
        this.props.setCode(codes.piptest2);
        this.setState({
            displayMenu: false,
        });
      }

      piptest3(){
        const codes = new Codes();
        this.props.setCode(codes.piptest3);
        this.setState({
            displayMenu: false,
        });
      }

      cachetest1(){
        const codes = new Codes();
        this.props.setCode(codes.cachetest1);
        this.setState({
            displayMenu: false,
        });
      }

      cachetest2(){
        const codes = new Codes();
        this.props.setCode(codes.cachetest2);
        this.setState({
            displayMenu: false,
        });
      }
      
      displayMenu(event) {                // function that expands the HELP panel on click
        event.preventDefault();
        if(!this.state.displayMenu){
            this.setState({
                displayMenu: true,
            });
        }
        else{
            this.setState({
                displayMenu: false,
            });
        }
      }

    render(){                       // rendering HELP panel UI
        
        return(
            <div id="help-menu">
                {/* HELP button */}
                <button id="help-button" onClick={this.displayMenu}>
                    <p id="help-menu-button"> HELP </p>
                </button>
                {this.state.displayMenu===true?(
                <div style={{textAlign: `center`}}>
                    {/* navigate to instructions page on click */}
                    <Link id="link-id" to='/information'><button id="opened" className="a-button" style={{paddingTop: `5px`, paddingBottom: `5px`, fontSize: `16px`}}>Instructions</button></Link>
                    <span id="opened" className="non-button">Sample Programs</span>
                    {/* asm codes buttons */}
                    <button onClick={this.bubbleSort} id="opened" className="ns a-button">BubbleSort.asm</button>
                    <button onClick={this.fibonacci} id="opened" className="ns a-button">Fibonacci.asm</button>
                    <button onClick={this.arithmetic} id="opened" className="ns a-button">SimpleOps.asm</button>
                    <button onClick={this.testcodes} id="opened" className="ns a-button">LogiCall.asm</button>
                    <button onClick={this.piptest2} id="opened" className="ns a-button">PipeLD/ST.asm</button>
                    <button onClick={this.piptest3} id="opened" className="ns a-button">PipeBranch.asm</button>
                    <button onClick={this.piptest1} id="opened" className="ns a-button">PipeUnited.asm</button>
                    <button onClick={this.cachetest1} id="opened" className="ns a-button">CacheReads.asm</button>
                    <button onClick={this.cachetest2} id="opened" className="ns a-button">CacheWrites.asm</button>
                </div>):(null)
                }
                
            </div>
        );
    }

}
 
export default DropDownCard;