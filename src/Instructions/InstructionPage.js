import React, { Component } from 'react';
import './InstructionPage.css';
import {Link} from 'react-router-dom';

class InfoPage extends Component {

    return(){
        console.log('return');
    }

    render(){
        return (
            <div className="instructionpage">
                <nav className="navbar">
                    <div className="heading">Instructions</div>
                    <div>
                        {/* <Link className="link" to='\'><button onClick={this.return} className="return-button">HOME</button></Link> */}
                    </div>
                </nav>
            </div>
        );
    }

}

export default InfoPage;