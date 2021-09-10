import React, {Component} from 'react';
import { Navbar,} from 'react-bootstrap';
import { MDBIcon} from 'mdbreact';
import Web3 from 'web3';





class TopNav extends Component {
    constructor(props) {
        super(props)
        this.state = {
            connectedAddress : ''
        }
    }

    async componentWillMount() {
        if(window.ethereum) {
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable()
            } else if(window.web3) {
                window.web3 = new Web3(window.web3.currentProvider)
            } else {
                window.alert('Non-Ethereum browser detected. Your should consider trying MetaMask!')
            }
              const isMetaMaskInstalled = () => {
                const { ethereum } = window;
                return Boolean(ethereum && ethereum.isMetaMask);
              };
              const accounts = await window.ethereum.request({ method: 'eth_accounts' });
              this.setState({
                  connectedAddress : accounts
              })
              window.ethereum.on('accountsChanged', (accounts) => {
                  this.setState({
                      connectedAddress : accounts
                  })
            });
            console.log("this is a connected address", this.state.accounts)

    }

    render () {




        return (


            <nav className="navbar navbar-expand-lg navbar-light bg-dark" style={{  backgroundImage: `url(./topnav.jpg)` 
              }} >
                {/* <!-- Container wrapper --> */}
                <div className="container-fluid">
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <Navbar.Brand href="#home"><MDBIcon icon="home" fixed />  <h1 className="text-light"><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-currency-exchange" viewBox="0 0 16 16">
                    <path d="M0 5a5.002 5.002 0 0 0 4.027 4.905 6.46 6.46 0 0 1 .544-2.073C3.695 7.536 3.132 6.864 3 5.91h-.5v-.426h.466V5.05c0-.046 0-.093.004-.135H2.5v-.427h.511C3.236 3.24 4.213 2.5 5.681 2.5c.316 0 .59.031.819.085v.733a3.46 3.46 0 0 0-.815-.082c-.919 0-1.538.466-1.734 1.252h1.917v.427h-1.98c-.003.046-.003.097-.003.147v.422h1.983v.427H3.93c.118.602.468 1.03 1.005 1.229a6.5 6.5 0 0 1 4.97-3.113A5.002 5.002 0 0 0 0 5zm16 5.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0zm-7.75 1.322c.069.835.746 1.485 1.964 1.562V14h.54v-.62c1.259-.086 1.996-.74 1.996-1.69 0-.865-.563-1.31-1.57-1.54l-.426-.1V8.374c.54.06.884.347.966.745h.948c-.07-.804-.779-1.433-1.914-1.502V7h-.54v.629c-1.076.103-1.808.732-1.808 1.622 0 .787.544 1.288 1.45 1.493l.358.085v1.78c-.554-.08-.92-.376-1.003-.787H8.25zm1.96-1.895c-.532-.12-.82-.364-.82-.732 0-.41.311-.719.824-.809v1.54h-.005zm.622 1.044c.645.145.943.38.943.796 0 .474-.37.8-1.02.86v-1.674l.077.018z"/>
                    </svg>  Flash Loan Arbitrage Bot</h1></Navbar.Brand>
                    </div>
                  
                    <div className="d-flex align-items-center">
                    <div> 
                        <h5 className="text-light">USER:</h5>                   
                        <p  className="text-light">{this.state.connectedAddress}</p>
                    </div>

                    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16" className="text-light">
                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                            <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                            </svg>
                    </div>
                  
                </div>
                </nav>
        );
    }
}

export default TopNav;