import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { startLogin } from './redux/action';
import { connect } from 'react-redux';

import styles from './App.module.css';
import GameMatch from './components/GameMatch';
import RoomSelect from './components/RoomSelect';
import Nav from './components/Nav';
import GameRoom from './components/GameRoom';


class App extends Component {

  render() {
    return (
      <div className={styles.App}>
        <div className={styles.BodyContainer}>
          <Nav />
          <Switch>
            <Route path="/" exact>
              {
                this.props.user ?
                <GameMatch /> :
                <div className={styles.Button} onClick={() => {console.log('clicked'); this.props.startLogin()}}>Login with Gmail</div>
              }
            </Route>

            <Route path="/room-select" component={RoomSelect} />
            <Route path="/room/:roomid" component={GameRoom} />
          </Switch>

        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    user: state.users.user
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    startLogin: () => dispatch(startLogin())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
