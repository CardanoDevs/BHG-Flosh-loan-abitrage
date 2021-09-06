import React, { Component } from 'react';
import { Button,InputGroup, FormControl} from 'react-bootstrap';
import logo from '../logo.png';
import './App.css';
import Web3 from 'web3';
import { erc20abi , abi } from './abi';
import { MDBDataTable } from 'mdbreact';
import { database,  auth } from './firebase/firebase';


const options = {
  timeout: 30000,
  clientConfig: {
      maxReceivedFrameSize:   100000000,
      maxReceivedMessageSize: 100000000,
  },
  reconnect: {
      auto: true,
      delay: 5000,
      maxAttempts: 15,
      onTimeout: false,
  },
};

const web3 = new Web3(new Web3.providers.WebsocketProvider('wss://purple-wispy-flower.quiknode.pro/a2ae460515f061ce64f526edcb10eda275f62585/', options));

const uniswap_address = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'
const pancake_address = '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F'
const usdt_address   = '0xdAC17F958D2ee523a2206206994597C13D831ec7'
class Display extends Component {
    constructor(props){
      super(props)
      this.state={
        uni_buy : 0,
        uni_sell : 0,
        sushi_buy : 0,
        sushi_sell : 0,
        tableDatas : [],
        tableData : [],
        inputAddress : "",
        tokenAddresses : []
      }
    }

    async componentWillMount() {
        this.loadAddresses()
    }

    async loadAddresses(){
      database.ref('TokenAddress/').get().then((snapshot) => {
        if (snapshot.exists) {
            var walletList = [];
            const newArray = snapshot.val();
            if (newArray) {
                Object.keys(newArray).map((key, index) => {
                    const value = newArray[key];

                    walletList.push({
                            Address : web3.utils.toChecksumAddress(value.Address),
                    })
                })
            }
            this.setState({
              tokenAddresses : walletList
            })
            console.log("load ", this.state.tokenAddresses)
        }
      });
    }

    async start (){
      for (let index = 0; index < this.state.tokenAddresses.length; index++) {
        this.setState({
            tableDatas : [],
        })
        this.getData(this.state.tokenAddresses[index]["Address"])
      }
      console.log("start ", this.state.tokenAddresses)
    }

    async getData (token_address) {

      let tokenContract= new web3.eth.Contract(erc20abi,token_address);
      let tokenName    = await tokenContract.methods.symbol().call().then(function(res) {  return res;  })
      let tokenDecimal = await tokenContract.methods.decimals().call()
    
    
      let mycontract1  = new web3.eth.Contract(abi, uniswap_address)
      let uni_buy      = await mycontract1.methods.getAmountsOut(1000000,[usdt_address,token_address]).call();
      let uni_sell     = await mycontract1.methods.getAmountsOut(Math.pow(10, 15), [token_address,usdt_address]).call();
      uni_buy          = Math.round(Math.pow(10, tokenDecimal+3) /uni_buy[1]) /1000  
      uni_sell         = Math.round(uni_sell[1]) /1000

      let mycontract2  = new web3.eth.Contract(abi, pancake_address)
      let sushi_buy    = await mycontract2.methods.getAmountsOut(1000000 , [usdt_address,token_address]).call();
      let sushi_sell   = await mycontract2.methods.getAmountsOut(Math.pow(10, 15) , [token_address,usdt_address]).call();
      sushi_buy        = Math.round(Math.pow(10, tokenDecimal+3) / sushi_buy[1] ) /1000
      sushi_sell       = Math.round(sushi_sell[1]) / 1000

      let uni2sushiRate = Math.round((sushi_sell - uni_buy) * 100000 / sushi_sell) /1000
      let sushi2uniRate = Math.round(( uni_sell - sushi_buy) * 100000/ uni_sell)/1000

      let tableData = {
        tokenName     : tokenName,
        tokenDecimal  : tokenDecimal,
        uni_buy      : uni_buy,
        uni_sell      : uni_sell,
        sushi_buy    : sushi_buy,
        sushi_sell    : sushi_sell,
        uni2sushiRate : uni2sushiRate,
        sushi2uniRate : sushi2uniRate,
      }

      let tableDatas = this.state.tableDatas
      tableDatas.push(tableData)
      this.setState({
        tableDatas : tableDatas
      })
    }

    async addAddress(){
      console.log(this.state.inputAddress)
      if(this.state.inputAddress==""){
        alert("Please check  Address")
        return
      }
      const tokenAddressList= {
        Address   : web3.utils.toChecksumAddress(this.state.inputAddress),
      }
      var userListRef = database.ref('TokenAddress')
      var newUserRef = userListRef.push();
      newUserRef.set(tokenAddressList);
      this.loadAddresses();
    }




    render() {

        var rows = this.state.tableDatas

        const data = {
          columns : [
            {
                label : 'Token',
                field : 'tokenName',
            },
            {
                label : 'Uni buy price',
                field : 'uni_buy',
            },
            {
                label : 'sushi sell price',
                field : 'sushi_sell',
            },
            {
                label : 'rate',
                field : 'uni2sushiRate',
            },
            {
                label : 'sushi buy price',
                field : 'sushi_buy',
            },
            {
                label : 'uni sell price',
                field : 'uni_sell',
            },
            {
                label : 'Rate',
                field : 'sushi2uniRate',
            },
          ],
          rows : rows,
        }

        const handleInputAddress = (e) => {
          let addLabel  = e.target.value
          this.setState({
            inputAddress : addLabel
          })
          console.log(this.state.inputAddress)
        }
        
        return (
          <div>
            <h2>UniSwap SushiSwap Token Price Monitor</h2> <hr/><br/><br/>
            

            <div className= "row">
              <div className = "col-1"></div>
              <div className = "col-10">
                <InputGroup className="mb-3">
                  <FormControl
                    placeholder="Add Token address  "
                    aria-label="Recipient's username"
                    aria-describedby="basic-addon2"
                    defaultValue = {this.state.inputAddress}
                    onChange={handleInputAddress}
                  />
                  <Button variant="primary" id="button-addon2"  onClick={()=>this.addAddress()}>
                    Add Token Address
                  </Button>
                  <Button variant="primary" id="button-addon2"  onClick={()=>this.start()}>
                    Get Price
                  </Button>
                </InputGroup>
                </div>
              <div className = "col-1"></div>
            </div>
            <br/><br/><br/>
            <MDBDataTable 
                    striped
                    bordered
                    small
                    data={
                        data
                    }
            />
          </div>
        );
    }
}

export default Display;
