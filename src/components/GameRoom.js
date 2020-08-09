import React, { Component } from 'react';
import { connect } from 'react-redux';
import { database } from '../firebase/firebase';
import styles from './GameRoom.module.css';

import {
    startLeaveRoom, startGetReady, startNotReady, startGetStart,
    updateGameStates, setFirstToEval, startAttack, resetCanEval,
    setNextToEval, setTFChanged, setChatOrder, setEvalDone, startVote, setVoted, calVoteRes,
    newGame, calFinalRes, calRecRes, evalEnd, setChatDone, startReplay } from '../redux/action';
import InfoBoard from './InfoBoard';
import RoleModal from './RoleModal';
import EvalModal from './EvalModal';
import VoteModal from './VoteModal';
import VoteResModal from './VoteResModal';
import RecModal from './RecModal';
import ResModal from './ResModal';

import game_start from '../assets/musics/game_start.wav';
import loading from '../assets/loading.svg';
import spinner from '../assets/spinner.svg';
import chip from '../assets/chip.svg';
import hat from '../assets/hat.svg';
import check from '../assets/checking.svg';
import chat from '../assets/chat.svg';
import info from '../assets/info.png';

class GameRoom extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isReady: false,
      showModal: false, // alocate the role
      showEval: false, // evalutaion modal
      loading: false,
      isFetching: true,
      roundStarting: false,
      nextRoundStartNum: null,
      chatStarting: false,
      chatDone: false,
      showInfo: false,
      voteStarting: false,
      showVote: false,
      resStarting: false,
      showRes: false,
      newRoundStarting: false,
      finalVoteStarting: false,
      showRecgonize: false,
      finalResSstarting: false,
      showFinalRes: false
    }

    this.startAudio = new Audio(game_start);
    const docRef = database.collection('rooms').doc(this.props.match.params.roomid);
    docRef.get().then((doc) => {
      console.log('first time load data', doc.id, doc.data())
      this.props.updateGameStates(doc.data());
      setTimeout(this.setState({ isFetching: false }), 1500);
    })
  }

  componentDidMount() {
    console.log('game room mount', this.props.match.params.roomid);
    const docRef = database.collection('rooms').doc(this.props.match.params.roomid);
    this.unsubscribe = docRef.onSnapshot((doc) => {
      console.log('listen for game state change', doc.id, doc.data())
      if (Object.values(doc.data().gameStates).indexOf("未准备") === -1) {
        docRef.update({
          canStart: true
        })
      }
      this.props.updateGameStates(doc.data());
    })
  }

  componentWillUnmount() {
    // clear the curr room and pwd state
    window.onbeforeunload = () => {
      return "Leaving this page will reset the wizard";
    }
    this.props.startLeaveRoom();
    this.unsubscribe();
  }

  componentDidUpdate(prevProps) {
    if (this.props.game.started && !prevProps.game.started) {
      // const startAudio = new Audio(game_start);
      this.startAudio.play();
      this.setState({ loading: true })
      setTimeout(() => {
        this.setState({ showModal: true, loading: false})
      }, 1500)
    }

    if (prevProps.game.gameStates && this.props.game.gameStates[this.props.room.playerIndex] === "鉴宝中" && prevProps.game.gameStates[this.props.room.playerIndex] === "未鉴宝") {
      setTimeout(() => {
        this.setState({ showEval: true })
      }, 1000)
    }

    if (prevProps.game.gameStates && this.props.game.gameStates[this.props.room.playerIndex] === "未发言" && !prevProps.game.gameStates[this.props.room.playerIndex] === "未发言") {
      this.setState({ chatStarting: true });
      this.startAudio.play();
      setTimeout(() => {
        this.setState({ chatStarting: false });
      }, 1500)
    }


    if (prevProps.game.gameStates && prevProps.room.roles.length > 0 &&
        Object.values(this.props.game.gameStates).filter(el => el === "已投票").length === this.props.room.roles.length &&
        (this.props.curRound > 0 && !prevProps.game.voted[this.props.curRound-1])) {
          this.props.setVoted();
    }

    if (!prevProps.game.voted[this.props.curRound-1] && this.props.game.voted[this.props.curRound-1]) {
      this.setState({
        resStarting: true
      })
      setTimeout(() => {
        this.setState({
          resStarting: false,
          showRes: true
        })
      })
    }

    if (!prevProps.game.evalEnd && this.props.game.evalEnd) {
      this.setState({ showRecgonize: true })
    }

    if (prevProps.game.gameStates && this.props.room.roles > 0 &&
        Object.values(this.props.game.gameStates).filter(el => el === "已指认").length === this.props.room.roles.length &&
        !this.props.game.recEnd) {
      console.log('cal Final Res!', Object.values(this.props.game.gameStates).filter(el => el === "已指认").length === this.props.room.roles.length);
      console.log('cal Final Res!', Object.values(this.props.game.gameStates).filter(el => el === "已指认").length, this.props.room.roles.length);

      this.props.calFinalRes();
      this.setState({ finalResSstarting: true })
    }

    if (this.props.game.finalRes && !prevProps.game.finalRes) {
      this.setState ({
        finalResSstarting: false,
        showFinalRes: true
      })
    }
  }

  handleReady = () => {
    if (!this.state.isReady) {
      this.props.startGetReady();
      this.setState({
        isReady: true,
      })
    } else {
      this.props.startNotReady();
      this.setState({
        isReady: false
      });
    }
  }

  handleStart = () => {
    this.props.startGetStart();
  }

  handleCloseModal = () => {
    this.setState({ showModal: false, roundStarting: true });
    this.startAudio.play();

    setTimeout(() => {
      this.setState({ roundStarting: false });
      this.props.setFirstToEval(1);
    }, 1500)
  }

  handleAttack = (index) => {
    let actualIndex = index < this.props.room.playerIndex ? index : index+1;
    if (this.props.room.roles[this.props.room.playerIndex] === "药不然") {
      if (this.props.room.roles[actualIndex] === "方震") {
        let involvedIndex = this.props.room.roles.findIndex(el => el === "许愿");
        this.props.startAttack([actualIndex, involvedIndex], 2);
      } else {
        this.props.startAttack([actualIndex], 1);
      }
    }
  }

  handleNext = (index, tfChanged) => {
    console.log('close evaluation');
    this.setState({ showEval: false })
    if (this.props.game.canEval[this.props.room.playerIndex] !== 1) {
      this.props.resetCanEval()
    }
    if (tfChanged) {
      this.props.setTFChanged()
    }

    if (index !== -1) {
      let actualIndex = index < this.props.room.playerIndex ? index : index+1;
      console.log('set next to evaluate!')
      this.props.setNextToEval(actualIndex);
    } else {
      // all players have evaluated
      this.props.setEvalDone();
      this.props.setChatOrder(this.props.room.playerIndex);
    }

  }

  handleChatDone = () => {
    if (this.props.game.curChatIndex && this.props.game.curChatIndex === this.props.room.roles.length-1) {
      // last one to complete chat
      this.setState({ voteStarting: true })
      this.startAudio.play();

      setTimeout(() => {
        this.setState({ voteStarting: false, showVote: true });
        this.props.startVote();
      }, 1500)

    } else {
      this.setState({
        chatDone: true
      })
      this.props.setChatDone()
    }
  }

  handleShowInfo = () => {
    this.setState((prevState) => {
      return {showInfo: !prevState.showInfo}
    })
  }

  handleCloseInfo = () => {
    this.setState((prevState) => {
      return {showInfo: !prevState.showInfo}
    })
  }

  handleCloseVote = (counter) => {
    this.setState({ showVote: false });
    this.props.calVoteRes(counter);
  }

  handleCloseRes = () => {
    if (this.props.room.curRound === 3) {
      // time to end the game
      this.setState({ showRes: false, finalVoteStarting: true});
      setTimeout(() => {
        this.setState({ finalVoteStarting: false});
        this.props.evalEnd();
      })

    } else {
      this.setState({ showRes: false, roundStarting: true });
      this.props.startGetStart();

      setTimeout(() => {
        this.setState({ roundStarting: false });
        this.props.setFirstToEval(this.props.room.curRound+1);
      })
    }
  }

  handleCloseRec = (recIndex) => {
    console.log('call handleCloseRec')
    let recRes = false;
    let curRole = this.props.room.roles[this.props.room.playerIndex];
    if (curRole === "药不然") {
      recRes = this.props.room.roles[recIndex] === "方震";
    } else if (curRole === "老朝奉") {
      recRes = this.props.room.roles[recIndex] === "许愿"
    } else {
      recRes = this.props.room.roles[recIndex] === "老朝奉";
    }

    this.props.calRecRes(recRes, curRole);
  }

  handleCloseFinalRes = () => {
    this.setState({
      showFinalRes: false
    })
    this.props.newGame()
  }

  createItems = () => {
    const playerNum = Object.keys(this.props.game.players).length;
    let host = Object.values(this.props.game.players).findIndex(el => el !== "");
    let items = [];

    for (let i = 0; i < Math.floor(playerNum/2); i++) {
      const secondIndex = i + Math.floor(playerNum/2);
      let stateButtonStyle = {
        '已准备': styles.ButtonGreen,
        '未准备': styles.Button,
        '未鉴宝': styles.Button,
        '鉴宝中': styles.ButtonGreen,
        '已鉴宝': styles.ButtonGrey,
        "未发言": styles.Button,
        '发言中': styles.ButtonGreen,
        '已发言': styles.ButtonGrey,
        "投票中": styles.ButtonGreen,
        "已投票": styles.ButtonGrey,
        "已指认": styles.Button,
        "等待中": styles.ButtonGreen
      }

      items.push(
        <div className={styles.Row} key={`playerRow-${i}`}>
          <div className={styles.Player}>
            {
              host === i && !this.props.game.started &&
              <img className={styles.HostLeft} src={hat}></img>
            }
            <div className={styles.SelfieLeft}>
              <img src={this.props.game.photos[i]} alt=""></img>
              { this.props.game.gameStates[i] === "鉴宝中" && <img className={styles.Eval} src={check}></img>}
              { this.props.game.gameStates[i] === "发言中" && <img className={styles.Eval} src={chat}></img>}
            </div>
            <div className={styles.GameInfoLeft}>
              <div className={stateButtonStyle[this.props.game.gameStates[i]]}>
                {this.props.game.gameStates[i]}
              </div>
              <div className={styles.NameTagLeft}>
                <div className={styles.TagInfoLeft}>
                  <p className={styles.Name}>{this.props.game.names[i]}</p>
                  <div className={styles.Chips}>
                  {
                    Array(this.props.game.chips[i]).fill(1).map((el, index) => {
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
              host === secondIndex &&
              <img className={styles.HostRight} src={hat}></img>
            }
            <div className={styles.SelfieRight}>
              <img src={this.props.game.photos[secondIndex]} alt=""></img>
              { this.props.game.gameStates[secondIndex] === "鉴宝中" && <img className={styles.Eval} src={check}></img>}
              { this.props.game.gameStates[secondIndex] === "发言中" && <img className={styles.Eval} src={chat}></img>}
            </div>
            <div className={styles.GameInfoRight}>
              <div className={stateButtonStyle[this.props.game.gameStates[secondIndex]]}>
                {this.props.game.gameStates[secondIndex]}
              </div>
              <div className={styles.NameTagRight}>
                <div className={styles.Num}>{secondIndex+1}</div>
                <div className={styles.TagInfoRight}>
                  <p className={styles.Name}>{this.props.game.names[secondIndex]}</p>
                  <div className={styles.Chips}>
                  {
                    Array(this.props.game.chips[secondIndex]).fill(1).map((el, index) => {
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
    // console.log(Object.values(this.props.game.players).findIndex(el => el !== ""), this.props.room.playerIndex)
    return items;
  }

  render() {

    return (
      this.state.isFetching ? <img className={styles.Loading} src={spinner}/> :
        <div className={styles.GameRoomContainer}>
          {
            this.props.room.curRound > 0 &&
            <img className={styles.InfoButton} src={info} onClick={this.handleShowInfo}></img>
          }
          {
            this.props.room.curRound > 0 &&
            <InfoBoard
              curRound={this.props.room.curRound}
              evalOrder={this.props.game.evalOrder}
              photos={this.props.game.photos}
              voted={this.props.game.voted}
              votedZodiac={this.props.game.votedZodiac}
              zodiacRes={this.props.game.zodiacRes}
              chipRes={this.props.game.chipRes}
              chipTotalRes={this.props.game.chipTotalRes}
              showInfo={this.state.showInfo}
              handleCloseInfo={this.handleCloseInfo}
            />
          }
          {this.createItems()}
          <div className={this.props.game.started ? `${styles.ButtonArea} ${styles.Hidden}` : styles.ButtonArea}>
            <div className={this.state.isReady ? styles.ButtonNoReady : styles.ButtonReady} onClick={this.handleReady}>准备</div>
            {

              Object.values(this.props.game.players).findIndex(el => el !== "") === this.props.room.playerIndex &&
              <button className={styles.StartButton}
                disabled={!this.props.game.canStart}
                onClick={this.handleStart}
              >
                开始
              </button>
            }
          </div>
          {
            Object.values(this.props.game.gameStates).filter(el => el === "等待中").length === this.props.room.roles.length &&
            Object.values(this.props.game.players).findIndex(el => el !== "") === this.props.room.playerIndex &&
            <div className={styles.ButtonArea}>
              <button className={styles.StartButton}
                  onClick={this.props.startReplay}
                >
                  开始新一局
                </button>
            </div>
          }
          {
            this.props.game.gameStates[this.props.room.playerIndex] === "发言中" &&
            <div className={styles.ButtonArea}>
              <button
                className={this.state.chatDone ? styles.ButtonNoReady : styles.ButtonReday}
                onClick={this.handleChatDone}>结束发言</button>
            </div>
          }
          {
            (this.state.loading || this.state.roundStarting || this.state.chatStarting) &&
            <img className={styles.Loading} src={loading}/>
          }
          {
            this.state.loading &&
            <div className={styles.LoadingText}>分发身份牌</div>
          }
          {
            this.state.roundStarting &&
            <div className={styles.LoadingText}>开始第 {this.props.room.curRound + 1} 轮</div>
          }
          {
            this.state.chatStarting &&
            <div className={styles.LoadingText}>开始发言</div>
          }
          {
            this.state.voteStarting &&
            <div className={styles.LoadingText}>开始兽首投票</div>
          }
          {
            this.state.resStarting &&
            <div className={styles.LoadingText}>计算兽首投票</div>
          }
          {
            this.state.finalVoteStarting &&
            <div className={styles.LoadingText}>开始指认</div>
          }
          {
            this.state.finalResSstarting &&
            <div className={styles.LoadingText}>正在计算得分</div>
          }



          <RoleModal
            showModal={this.state.showModal}
            closeModal={this.handleCloseModal}
            role={this.props.room.roles[this.props.room.playerIndex]}
            roles={this.props.room.roles}
          />

          {
            this.props.room.curRound > 0 &&
            <EvalModal
              showEval={this.state.showEval}
              curRound={this.props.room.curRound}
              playerIndex = {this.props.room.playerIndex}
              role={this.props.room.roles[this.props.room.playerIndex]}
              zodiacGroup={this.props.room.zodiac[this.props.room.curRound]}
              canEval={this.props.game.canEval[this.props.room.playerIndex]}
              photos={this.props.game.photos}
              handleAttack={this.handleAttack}
              handleNext={this.handleNext}
              tfChanged={this.props.game.tfChanged}
              gameStates={this.props.game.gameStates}
              loseEvalHuang={this.props.game.loseEvalHuang}
              loseEvalMuhu={this.props.game.loseEvalMuhu}
              roles={this.props.room.roles}
           />
          }

          {
            this.props.room.curRound > 0 &&
            <VoteModal
                showVote={this.state.showVote}
                closeVote={this.handleCloseVote}
                curRound={this.props.room.curRound}
                chips={this.props.game.chips[this.props.room.playerIndex]}
            />
          }

          {
            this.props.room.curRound > 0 &&
            <VoteResModal
              showRes={this.state.showRes}
              // showRes={true}
              closeRes={this.handleCloseRes}
              zodiacRes={this.props.game.zodiacRes[this.props.room.curRound-1]}
              // zodiacRes={this.props.game.zodiacRes[0]}
              // votedZodiac={this.props.game.votedZodiac[0]}
              // curRound={1}
              votedZodiac={this.props.game.votedZodiac[this.props.room.curRound-1]}
              curRound={this.props.room.curRound}
            />
          }
          <RecModal
            showRec={this.state.showRecgonize}
            // showRec={true}
            closeRec={this.handleCloseRec}
            roles={this.props.room.roles}
            playerIndex={this.props.room.playerIndex}
            photos={this.props.game.photos}
          />
          {
            this.props.game.finalRes &&
            <ResModal
              showRes={this.state.showFinalRes}
              closeFinalRes={this.handleCloseFinalRes}
              finalRes={this.props.game.finalRes}
              zodiacRes={this.props.game.zodiacRes}
              votedZodiac={this.props.game.votedZodiac}
              recFangzhen={this.props.game.recFangzhen}
              recXuyuan={this.props.game.recXuyuan}
              recLaochaofeng={this.props.game.recLaochaofeng}
              roles={this.props.room.roles}
              photos={this.props.game.photos}
            />
          }

      }



        </div>


    )
  }
}

const mapStateToProps = (state, props) => {
  return {
    room: state.rooms,
    user: state.users.user,
    game: state.game
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    startLeaveRoom: () => dispatch(startLeaveRoom()),
    startGetReady: () => dispatch(startGetReady()),
    startNotReady: () => dispatch(startNotReady()),
    startGetStart: () => dispatch(startGetStart()),
    updateGameStates: (data) => dispatch(updateGameStates(data)),
    setFirstToEval: (nextRound) => dispatch(setFirstToEval(nextRound)),
    startAttack: (indice, num) => dispatch(startAttack(indice, num)),
    resetCanEval: () => dispatch(resetCanEval()),
    setNextToEval: (index) => dispatch(setNextToEval(index)),
    setTFChanged: () => dispatch(setTFChanged()),
    setChatOrder: (index) => dispatch(setChatOrder(index)),
    startVote: () => dispatch(startVote()),
    setVoted: () => dispatch(setVoted()),
    calVoteRes: (counter) => dispatch(calVoteRes(counter)),
    newGame: () => dispatch(newGame()),
    calFinalRes: () => dispatch(calFinalRes()),
    calRecRes: (recRes, curRole) => dispatch(calRecRes(recRes, curRole)),
    evalEnd: () => dispatch(evalEnd()),
    setChatDone: () => dispatch(setChatDone()),
    startReplay: () => dispatch(startReplay()),
    setEvalDone: () => dispatch(setEvalDone())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GameRoom);
