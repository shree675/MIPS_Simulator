import React, { Component } from 'react';
import './InstructionPage.css';
import svg1 from '../Assets/instfinal1.svg';
import svg2 from '../Assets/instfinal2.svg';

// this is the information page component

class InfoPage extends Component {

    render(){                           // renders the whole page
        return (
            <div className="instructionpage">
                <nav className="navbar">
                    <div className="heading">Instructions <span className="nutshell">in a nutshell</span></div>
                </nav>
                {/* displaying images */}
                <div className="svg-image"><img style={{height: `100%`, width: `100%`, objectFit: `cover`}} src={svg1}></img></div>
                <div className="svg-image"><img style={{height: `100%`, width: `100%`, objectFit: `cover`}} src={svg2}></img></div>
                <br></br>
            </div>
        );
    }

}

export default InfoPage;