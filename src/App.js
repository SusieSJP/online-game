import React, { Component } from 'react';
import styles from './App.module.css';
import GameMatch from './components/GameMatch';
import Nav from './components/Nav';
import { provider, auth } from './firebase/firebase';

class App extends Component {
  constructor() {
    super();
    this.state = {
      curUser: null
    }
  }

  handleSignIn = () => {
    auth.signInWithPopup(provider).then((result) => {
      console.log('curr user: ', result.user)
      this.setState({
        curUser: result.user.email
      })
    }).catch(error => console.log('error logging in with Google', error))
  }

  render() {
    return (
      <div className={styles.App}>
        <div className={styles.BodyContainer}>
          <Nav />
          {
            this.state.curUser ?
            <GameMatch user={this.state.curUser}/> :
            <div className={styles.Button} onClick={this.handleSignIn}>Login with gmail</div>
          }
        </div>
      </div>
    );
  }
}

export default App;
