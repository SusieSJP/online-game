import React, { Component } from 'react';
import { connect } from 'react-redux';

import styles from './GameRoom.module.css';
import { startLeaveRoom } from '../redux/action';

class GameRoom extends Component {
  componentWillUnmount() {
    // clear the curr room and pwd state
    this.props.startLeaveRoom();
  }

  render() {
    let playerNum = this.props.room.players.length;
    let items = [];

    for (let i = 0; i < Math.floor(playerNum/2); i++) {
      const secondIndex = i + Math.floor(playerNum/2);
      console.log('photo url:', this.props.room.photos[i]);

      items.push(
        <div className={styles.Row} key={`playerRow-${i}`}>
          <div className={styles.Player}>
            <div className={styles.SelfieLeft}><img src={this.props.room.photos[i]} alt=""></img></div>
            <div className={styles.NameTagLeft}>
              <p className={styles.Name}>{`Player ${i+1}`}</p>
              <div className={styles.Chips}>
              {
                Array(this.props.room.chips[i]).fill(1).map((el, index) => {
                  return (
                    <div key={index} className={styles.Chip}></div>
                  )
                })
              }
              </div>
            </div>
          </div>
          <div className={styles.Player}>
            <div className={styles.SelfieRight}><img src={this.props.room.photos[secondIndex]} alt=""></img></div>
            <div className={styles.NameTagRight}>
              <p className={styles.Name}>{`Player ${secondIndex+1}`}</p>
              <div className={styles.Chips}>
              {
                Array(this.props.room.chips[secondIndex]).fill(1).map((el, index) => {
                  return (
                    <div key={index} className={styles.Chip}></div>
                  )
                })
              }
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className={styles.GameRoomContainer}>
        {items}
      </div>
    )
  }
}

const mapStateToProps = (state, props) => {
  return {
    room: state.rooms
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    startLeaveRoom: () => dispatch(startLeaveRoom())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GameRoom);
