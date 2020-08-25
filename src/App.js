import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { startLogin, startSetDefaultPhoto } from './redux/action';
import { connect } from 'react-redux';

import PrivateRoute from './PrivateRoute';

import styles from './App.module.css';
import GameMatch from './components/GameMatch';
import RoomSelect from './components/RoomSelect';
import Nav from './components/Nav';
import GameRoom from './components/GameRoom';
// import { Redirect } from 'react-router/cjs/react-router';


class App extends Component {
  componentDidMount() {
    console.log(this.props)
    this.props.startSetDefaultPhoto();
  }

  render() {
    return (
      <div className={styles.App}>
        <Nav />

        <div className={styles.BodyContainer}>

          <Switch>
            <Route path="/" exact>
            {
              this.props.user ?
              <GameMatch /> :
              <div className={styles.Button} onClick={this.props.startLogin}>Login with Gmail</div>
            }
            </Route>
            <Route path="/room-select" render={(props) => {
              console.log(props, this.props, "from app.js")
              return (
                this.props.user ?
                <RoomSelect  {...props}/> :
                <Redirect to="/" />
              )
            }}>
            </Route>
            <Route path="/room/:roomid" render={(props) => {
              console.log('time to render game room', this.props.user, this.props.room)
              return (
                this.props.user && this.props.room ?
                <GameRoom {...props}/> :
                <Redirect to="/" />
              )
            }} >
            </Route>
          </Switch>
        </div>

      </div>
    );
  }
}


const mapStateToProps = (state, props) => {
  return {
    user: state.users.user,
    room: state.rooms.room
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    startLogin: () => dispatch(startLogin()),
    startSetDefaultPhoto: () => dispatch(startSetDefaultPhoto()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
