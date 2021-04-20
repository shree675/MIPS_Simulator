import React, { Component } from 'react';
import './InstructionPage.css';
import svg1 from '../Assets/InstructionsPhase1.svg';
import svg2 from '../Assets/InstructionsPhase2.svg';

// this is the information page component

class InfoPage extends Component {

    render(){                           // renders the whole page
        return (
            <div className="instructionpage">
                <nav className="navbar">
                    <div className="heading">Instructions <span className="nutshell">in a nutshell</span></div>
                </nav>
                {/* displaying image */}
                <div className="svg-image"><img style={{height: `100%`, width: `100%`, objectFit: `cover`}} src={svg2}></img></div>
            </div>
        );
    }

}

export default InfoPage;