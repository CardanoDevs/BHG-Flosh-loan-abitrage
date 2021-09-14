import React, {Component} from 'react';
import TopNav from './TopNav.js';
import Display from './Display.jsx';
import './App.css'
import Web3 from 'web3';




class App extends Component {
    
    async componentWillMount() {
    }

    render () {
        return (
            <div>
                <TopNav/><br/><br/>
                <div className= "row">
                    <div className = "col-1"></div>
                    <div className = "col-10">
                    <Display/>
                    </div>
                    <div className = "col-1"></div>
                </div>

            </div>
        );
    }
}
export default App;