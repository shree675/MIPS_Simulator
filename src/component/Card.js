import React, {Component} from 'react';

class DropDownCard extends Component{

    constructor() {
        super();
        
        this.state = {
          display: false
        }
      }

    render(){
        return(
            <div>
                <button>
                    HELP
                </button>
                <div>
                    <button>Sample Programs</button>
                    {/* <br></br> */}
                    <button>Instructions</button>
                </div>
            </div>
        );
    }

}
 
export default DropDownCard;