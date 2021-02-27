import React, {Component} from 'react';
import './Card.css';
import '../App.js';
import '../codes.js';
import Codes from '../codes.js';
// import '../../BubbleSort.asm';

class DropDownCard extends Component{

    constructor() {
        super();
        
        this.state = {
          displayMenu: false,
        //   app: new App(),
          
        }
        
        this.displayMenu = this.displayMenu.bind(this);
        // this.app=this.app.bind(this);
        this.bubbleSort=this.bubbleSort.bind(this);
        this.testcodes=this.testcodes.bind(this);
      }

      

      bubbleSort(){
        //   console.log('hello');
        // const app = new App();
        
        const codes = new Codes();
        this.props.setCode(codes.bubbleSort);
        this.setState({
            displayMenu: false,
        });
      }

      testcodes(){
        //   console.log('hello');
        // const app = new App();
        const codes = new Codes();
        this.props.setCode(codes.testcode);
        this.setState({
            displayMenu: false,
        });
      }
      
      displayMenu(event) {
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

    render(){
        
        // console.log(app.state.pc);

        return(
            <div id="help-menu">
                <button id="help-button" onClick={this.displayMenu}>
                    <p id="help-menu-button"> HELP </p>
                </button>
                {this.state.displayMenu===true?(
                <div>
                    <button id="opened" className="a-button">Instructions</button>
                    <span id="opened" className="non-button">Sample Programs</span>
                    <button onClick={this.bubbleSort} id="opened" className="ns a-button">BubbleSort.asm</button>
                    <button onClick={this.testcodes} id="opened" className="ns a-button">test.asm</button>
                </div>):(null)
                }
                
            </div>
        );
    }

}
 
export default DropDownCard;