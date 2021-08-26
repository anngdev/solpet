import React from 'react';
import * as mask from './Metamask';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      address: "0x",
      balance: 0,
      buttons: (<div></div>),
      items: [],
      loading: (<div></div>),
      fighting: (<div></div>),
      message: ""
    }
    // this.requestPermission = this.requestPermission.bind(this);
    this.spawn = this.spawn.bind(this);
    this.battle = this.battle.bind(this);
    this.initMask = this.initMask.bind(this);
    this.getItems = this.getItems.bind(this);
    this.handleBattle = this.handleBattle.bind(this);
    this.showToastMessage = this.showToastMessage.bind(this);
  }

  // async requestPermission() {
  //   await mask.requestPermission()
  //     .then(() => {
  //       var adr = mask.getAddress()
  //       console.log("adddr " + adr)
  //       this.setState({
  //         address: adr
  //       });
  //     });
  // }

  async spawn() {
    let tokenblc = await mask.getTokenBalance()
    let price = await mask.getSpawnPrice()
    if (tokenblc < price){
      this.showToastMessage("Blance error")
      return
    }
    let cmp = this;
    this.loading(true)
    await mask.spawn().then(function (receipt) {
      console.log("spawn")
      console.log(receipt)
      cmp.getItems()
      cmp.getBalance()
    })
  }

  async battle(tokenId) {
    let cmp = this;
    this.loading(true)
    await mask.battle(1, 2).then(function (reward) {
      console.log("battle reward ")
      console.log(reward)
      cmp.showToastMessage("Battle reward: "+reward)
      cmp.loading(false)
      cmp.getBalance()
    })
  }
  loading(show) {
    var loading = (<div></div>)
    if (show) {
      loading = (
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      )
    }
    this.setState({
      loading: loading
    })
  }

  async getItems() {
    this.loading(true)
    let cmp = this;

    await mask.getItems().then(function (items) {
      console.log(items)
      const itemList = items.map(item => (
        <Item data={item}  callback={cmp.handleBattle}/>
        // item.uri
      ));
      cmp.setState({
        items: itemList
      })

      cmp.loading(false)
    })
  }

  async initMask() {

    let cmp = this;
    var btns = (
      <div>
        <button type="button" class="btn btn-outline-dark" onClick={this.initMask}>Connect metamask</button>
      </div>
    )
    cmp.setState({
      buttons: btns
    })
    var accessible = await mask.initMask()
    if (!accessible) {
      this.showToastMessage("Metamask error")
      return
    }
    this.showToastMessage("")
    btns = (
      <div>
        <button type="button" class="btn btn-outline-dark" onClick={this.spawn}>Buy Pet</button>
        <button type="button" class="btn btn-outline-dark" onClick={this.getItems}>My Pets</button>
      </div>
    )
    var adr = await mask.getAddress()
    console.log("adddr " + adr)
    cmp.setState({
      buttons: btns,
      address: adr
    })
    cmp.getItems()
    cmp.getBalance()
  }

  async getBalance(){
    let cmp = this;
    let bl = await mask.getTokenBalance()

    cmp.setState({
      balance: bl
    })
  }

  handleBattle(tokenId){
    console.log("handleBattle " +tokenId)
    this.battle(tokenId)
  }
  showToastMessage(msg){
    this.setState({
      message: msg
    })
  }

  componentDidMount() {
    this.initMask()

  }

  render() {
    return (
      <div class="container">

        <div><p class="text-primary">{this.state.address}</p></div>
        <div><p class="text-secondary">Balance: {this.state.balance}</p></div>
        <div>
          {this.state.buttons}
        </div>
        <p class="text-warning"><div>{this.state.message}</div></p>

        <div>{this.state.loading}</div>
        <div>{this.state.items}</div>
      </div>
    )
  }

}

class Item extends React.Component {

  constructor(props) {
    super(props)
    this.battle = this.battle.bind(this);
  }

  battle() {
    this.props.callback(this.props.data.tokenId)
  }

  render() {
    return (
      <div style={{ height: 130 }} >
        <div class="row">
          <div class="col">
            <img src={this.props.data.uri} style={{ height: 130 }} class="img-responsive center-block" alt="..." />
          </div>
          <div class="col">
            <ul class="list-group" style={{ width: 150 }}>
              <li class="list-group-item d-flex justify-content-between align-items-center">
                HP
                <span class="badge bg-primary rounded-pill">{this.props.data.hp}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center">
                Attack
                <span class="badge bg-primary rounded-pill">{this.props.data.attack}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center">
                Speed
                <span class="badge bg-primary rounded-pill">{this.props.data.speed}</span>
              </li>
            </ul>
          </div>

          <div class="col">
            <button type="button" class="btn btn-outline-dark" onClick={this.battle}>Battle</button>
            {/* <button type="button" class="btn btn-outline-dark" onClick={this.spawn}>Sell</button> */}
          </div>
          <div>
            <form class="row g-3">
              <div class="col-auto">
                <label for="inputPassword2" class="visually-hidden">Password</label>
                <input type="password" class="form-control" id="inputPassword2" placeholder="Password" />
              </div>
              <div class="col-auto">
                <button type="submit" class="btn btn-primary mb-3">Confirm identity</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default App;
