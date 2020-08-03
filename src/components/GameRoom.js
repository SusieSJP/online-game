import React, { Component } from 'react';
import { connect } from 'react-redux';

import styles from './GameRoom.module.css';
import { startLeaveRoom, startGetReady, startNotReady, startGetStart, listenGameStates } from '../redux/action';
import InfoBoard from './InfoBoard';
import RoleModal from './RoleModal';
import game_start from '../assets/musics/game_start.wav';
import loading from '../assets/loading.svg';
import chip from '../assets/chip.svg';
import hat from '../assets/hat.svg';


class GameRoom extends Component {
  state = {
    isReady: false,
    canStart: false,
    showModal: false,
    loading: false,
  }

  componentDidMount() {
    console.log('game room mount', this.props.match.params.roomid);
    this.props.listenGameStates("252525");
  }
  componentWillUnmount() {
    // clear the curr room and pwd state
    window.onbeforeunload = () => {
      return "Leaving this page will reset the wizard";
    }
    this.props.startLeaveRoom();
  }

  componentDidUpdate(prevProps) {
    if (this.props.room.started && !prevProps.room.started) {
      const startAudio = new Audio(game_start);
      startAudio.play();
      this.setState({ loading: true})
      setTimeout(() => {
        this.setState({ showModal: true, loading: false})
      }, 3000)
    }
  }

  handleReady = () => {
    if (!this.state.isReady) {
      this.props.startGetReady();
      console.log(this.props.room.canStart);
      this.setState({
        isReady: true,
        canStart: this.props.room.canStart
      })
    } else {
      this.props.startNotReady();
      this.setState({
        isReady: false,
        canStart: false
      });
    }
  }

  handleStart = () => {
    this.props.startGetStart();
  }

  handleCloseModal = () => {
    this.setState({ showModal: false })
  }

  render() {
    const playerNum = this.props.room.players.length;
    const curUserIndex = this.props.room.players.indexOf(this.props.user);
    let items = [];

    for (let i = 0; i < Math.floor(playerNum/2); i++) {
      const secondIndex = i + Math.floor(playerNum/2);

      items.push(
        <div className={styles.Row} key={`playerRow-${i}`}>
          <div className={styles.Player}>
            {
              this.props.room.host === i && !this.props.room.started &&
              <img className={styles.HostLeft} src={hat}></img>
            }
            <div className={styles.SelfieLeft}><img src={this.props.room.photos[i]} alt=""></img></div>
            <div className={styles.GameInfoLeft}>
              <div className={this.props.room.gameStates[i] === "已准备" ? styles.StateButtonReady : styles.Button}>
                {this.props.room.gameStates[i]}
              </div>
              <div className={styles.NameTagLeft}>
                <div className={styles.TagInfoLeft}>
                  <p className={styles.Name}>{this.props.room.names[i]}</p>
                  <div className={styles.Chips}>
                  {
                    Array(this.props.room.chips[i]).fill(1).map((el, index) => {
                      return (
                        <img key={index} className={styles.Chip} src={chip}></img>
                      )
                    })
                  }
                  </div>
                </div>
                <div className={styles.Num}>{i+1}</div>
              </div>
            </div>
          </div>
          <div className={styles.Player}>
            {
              this.props.room.host === secondIndex &&
              <img className={styles.HostRight} src={hat}></img>
            }
            <div className={styles.SelfieRight}><img src={this.props.room.photos[secondIndex]} alt=""></img></div>
            <div className={styles.GameInfoRight}>
              <div className={this.props.room.gameStates[secondIndex] === "已准备" ? styles.StateButtonReady : styles.Button}>
                {this.props.room.gameStates[secondIndex]}
              </div>
              <div className={styles.NameTagRight}>
                <div className={styles.Num}>{secondIndex+1}</div>
                <div className={styles.TagInfoRight}>
                  <p className={styles.Name}>{this.props.room.names[secondIndex]}</p>
                  <div className={styles.Chips}>
                  {
                    Array(this.props.room.chips[secondIndex]).fill(1).map((el, index) => {
                      return (
                        <img key={index} className={styles.Chip} src={chip}></img>
                      )
                    })
                  }
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className={styles.GameRoomContainer}>
        {
          this.props.room.curRound > 0 &&
          <InfoBoard roundNo={this.props.room.curRound}/>
        }
        {items}
        <div className={this.props.room.started ? `${styles.ButtonArea} ${styles.Hidden}` : styles.ButtonArea}>
          <div className={this.state.isReady ? styles.ButtonNoReady : styles.ButtonReady} onClick={this.handleReady}>准备</div>
          {
            this.props.room.host === curUserIndex &&
            <button className={styles.StartButton}
              disabled={!this.props.room.canStart}
              onClick={this.handleStart}
            >
              开始
            </button>
          }
        </div>
        {
          this.state.loading &&
          <img className={styles.Loading} src={loading}/>
        }
        {
          this.state.loading &&
          <div className={styles.LoadingText}>分发身份牌</div>
        }
        <RoleModal
          showModal={this.state.showModal}
          closeModal={this.handleCloseModal}
          role={this.props.room.roles[curUserIndex]}
        />

      </div>
    )
  }
}

const mapStateToProps = (state, props) => {
  return {
    room: state.rooms,
    user: state.users.user
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    startLeaveRoom: () => dispatch(startLeaveRoom()),
    startGetReady: () => dispatch(startGetReady()),
    startNotReady: () => dispatch(startNotReady()),
    startGetStart: () => dispatch(startGetStart()),
    listenGameStates: () => dispatch(listenGameStates())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GameRoom);
