import React, { Component } from 'react';
import { withRouter } from 'react-router';

import styles from './GameMatch.module.css';



class GameMatch extends Component {

  handleClick = (event) => {
    console.log('game match props:', this.props);
    let request = event.target.innerText;
    switch (request) {
      case '创建房间':
        console.log('user click to create room');
        // redirect to room select
        this.props.history.push('/room-select');
        break;
      case '搜索房间':
        break;
      default:
        console.log("Sorry, we cannot understand your request, Please click either 'Create Room' or 'Search Room'.")
    }
  }

  render() {
    return (
      <div className={styles.FakeContainer}>
        <div className={styles.GameMatchContainer}>
          <div className={styles.Card} onClick={this.handleClick}>创建房间</div>
          <div className={styles.Card} onClick={this.handleClick}>搜索房间</div>

        </div>
      </div>

    )
  }
}

export default withRouter(GameMatch);
