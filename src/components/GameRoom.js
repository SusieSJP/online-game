import React, { Component } from 'react';
import { connect } from 'react-redux';

import styles from './GameRoom.module.css';

class GameRoom extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.GameRoomContainer}>
        <div className={styles.Row}>
          <div className={styles.PlayerSelfie}>1</div>
          <div className={styles.PlayerSelfie}>2</div>
        </div>

      </div>
    )
  }
}

// export default connect(mapPropsToState, mapDispatchToState)(GameRoom);
export default GameRoom;
