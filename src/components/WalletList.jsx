import React, {Component, useState} from 'react';
import { InputGroup, FormControl, Button, Modal} from 'react-bootstrap';
import { MDBDataTable } from 'mdbreact';
import { database,  auth } from './firebase/firebase';



class WalletList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            prevLabel : '',
            prevAddress : '',
            newLabel : '',
            newAddress : '',
  
            editKey: '',
            walletLists : [],
            show : false,
        }
        this.closeModal = e =>{
          this.setState({
            show: false
          });
        }
    }

    async componentWillMount() {
      await this.Init()
    }
    Init(){
        database.ref('wallet/').get().then((snapshot) => {
            if (snapshot.exists) {
              var walletList = [];
                const newArray = snapshot.val();
                if (newArray) {
                    Object.keys(newArray).map((key, index) => {
                        const value = newArray[key];
                        walletList.push({
                            id: index+1,
                            key,
                            Address : value.Address,
                            Label   : value.Label,
                        })
                    })
                }
                this.setState({
                walletLists : walletList
              })
            }
        });
    }

    onReload = () => {
      this.Init()
    }

    closeModal(){
      console.log("close")
    }

    deleteWalletList(id){
      console.log(id)
      database.ref('wallet/' + id).remove();
      this.Init(); 
    }


    editWalletList(key,Label, Address){

      this.setState({
        show: true
      });

      console.log(key,Label, Address)
      this.setState({
          prevLabel : Label,
          prevAddress : Address,
          editKey : key,
          newAddress : Address,
          newLabel : Label
      })

    }
    
    saveWallet(){

        if(this.state.newAddress==''||this.state.newLabel==''){
          alert("input date")
          return
        }




        const load = {
          Address : this.state.newAddress,
          Label : this.state.newLabel
        }

        var updates = {}
        updates['wallet/'+ this.state.editKey] = load;
        database.ref().update(updates).then(function(){
          alert("Data saved successfully.");
        }).catch(function(error) {
          alert("Data could not be saved." + error);
        });;
        this.setState({
          show : false
        })



        this.Init();

    }

    

    render () {
      const rows = this.state.walletLists.map((walletList) => {
        walletList.Actions =  <div>
                                   <Button variant="outline-primary"  size = "sm" onClick={()=>this.editWalletList(walletList.key, walletList.Label, walletList.Address)}> Edits</Button>{' '}
                                   <Button variant="outline-danger"  size = "sm" onClick= {()=>this.deleteWalletList(walletList.key)}> Delete</Button>{' '}
                              </div>
        return walletList
      })
          const data = {
            columns: [
              {
                label: 'WalletID',
                field: 'id',
                sort: 'asc',
                width: 150
              },
              {
                label: 'Wallet Address',
                field: 'Address',
                sort: 'asc',
                width: 270
              },
              {
                label: 'Label',
                field: 'Label',
                sort: 'asc',
                width: 200
              },
              {
                label: 'Actions',
                field: 'Actions',
                sort: 'asc',
                width: 100
              }
            ],
            rows : rows
          };
          const handlePrevAddress = (e) => {
            let addAddress  = e.target.value
            this.setState({
              newAddress : addAddress
            })
            console.log(this.state.newAddresss)
          }
        
          const handlePrevLabel = (e) => {
            let addLabel  = e.target.value
            this.setState({
              newLabel : addLabel
            })
            console.log(this.state.newLabel)
          }

        return (
            <div>
                <h2>MY WALLET LIST</h2>
                <hr/><br/><br/>
                <Example onReload={this.onReload} walletData = {this.state.walletLists}/>
                <br/><br/>
                <MDBDataTable
                striped
                bordered
                small
                data={data}
                 />
                <Modal show = {this.state.show}> 
                  <Modal.Header closeButton>
                    <Modal.Title>Add Wallet</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                  <InputGroup className="mb-3">

                    <InputGroup.Text id="basic-addon3">
                      Address
                    </InputGroup.Text>
                    <FormControl id="basic-url1" aria-describedby="basic-addon3"  type="text"  defaultValue = {this.state.prevAddress} 
                    onChange={handlePrevAddress}
                    placeholder="0x"/>
                  </InputGroup>
                  <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon3">
                      Label 
                    </InputGroup.Text>
                    <FormControl id="basic-url" aria-describedby="basic-addon3" type="text"   defaultValue = {this.state.prevLabel} 
                    onChange={handlePrevLabel}
                    placeholder="name"  />
                  </InputGroup>

                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={()=>this.closeModal()}>
                      Close
                    </Button>
                    <Button variant="primary"   onClick={()=>this.saveWallet()}>
                      Save Address
                    </Button>
                  </Modal.Footer>
                </Modal>
            </div>
        );
    }
  }
export default WalletList;




function Example(props) {
  var  addLabel = ''
  var  addAddress = ''

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow  =  () => setShow(true);
  const addwallet   =   () =>{
    setShow(false)
    if(addLabel==""||addAddress==""){
      alert("Please check Label or Address")
      return
    }
        const walletList= {
          Label   : addLabel,
          Address : addAddress,
        }
        var userListRef = database.ref('wallet')
        var newUserRef = userListRef.push();
        newUserRef.set(walletList);
        props.onReload();
      }

  const handleAddress = (e) => {
    addAddress  = e.target.value
  }

  const handleLabel = (e) => {
    addLabel  = e.target.value
  }

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Add Wallet
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Wallet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <InputGroup className="mb-3">
          <InputGroup.Text id="basic-addon3">
            Address
          </InputGroup.Text>
          <FormControl id="basic-url1" aria-describedby="basic-addon3"  type="text" 
          placeholder="0x" defaultValue={addAddress} onChange={handleAddress} />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text id="basic-addon3">
             Label 
          </InputGroup.Text>
          <FormControl id="basic-url" aria-describedby="basic-addon3" type="text" 
          placeholder="open Value" defaultValue={addLabel} onChange={handleLabel} />
        </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary"   onClick={addwallet}>
            Save Address
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}



