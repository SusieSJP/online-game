import React, { Component } from 'react';
import styles from './EvalModal.module.css';

import Modal from 'react-modal';
import rat from '../assets/rat.svg';
import cow from '../assets/cow.svg';
import tiger from '../assets/tiger.svg';
import rabbit from '../assets/rabbit1.svg';
import dragon from '../assets/dragon.svg';
import snake from '../assets/snake.svg';
import horse from '../assets/horse.svg';
import goat from '../assets/goat.svg';
import monkey from '../assets/monkey.svg';
import chicken from '../assets/chicken.svg';
import dog from '../assets/dog.svg';
import pig from '../assets/pig.svg';

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root');

class EvalModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isChecked: [false, false, false, false], // for zodiac
      isSelected: new Array(this.props.roles.length-1).fill(false), // for players to take action
      isProtected: [false, false, false, false], // for zodiac
      isNext: new Array(this.props.roles.length-1).fill(false),
      showResult: ["","","",""],
      playerRes: null,
      evalConfirmed: false,
      protectConfirmed: false,
      protectZodiac: null,
      errorMsg: "",
      errMsg: "",
      actionIndex: null,
      nextIndex: -1,
      actionConfirmed: false,
      nextConfirmed: false,
      tfChanged: false
    }
  }

  // evaluate the zodiac - true or false
  handleCheck = (index) => {
    if (this.props.role === "许愿") {
      if (!this.state.isChecked[index] && this.state.isChecked.filter((el) => el === true).length === 2) {
        this.setState({
          errorMsg: "您已选择查验2个兽首，请先取消对应兽首，再做更改"
        })
      } else {
        this.setState(prevState => {
          let newChecked = prevState.isChecked.slice();
          newChecked[index] = !prevState.isChecked[index];
          return {
            isChecked: newChecked,
            errorMsg: ""
          }
        })
      }
    } else {
      this.setState(() => {
        let newChecked = [false, false, false, false];
        newChecked[index] = true
        return {
          isChecked: newChecked,
          errorMsg: ""
        }
      })
    }
  }

  handleSelect = (index) => {
    console.log("handle select to action", index)
    this.setState(() => {
      let newSelected = new Array(this.props.roles.length-1).fill(false);
      newSelected[index] = true
      return {
        isSelected: newSelected,
        errorMsg: "",
        actionIndex: index
      }
    })
  }

  handleEvalResult = () => {
    // 1. check how many zodiac player checked
    let checkedNum = this.state.isChecked.filter(el => el === true).length;
    let errMsg = "";

    if ((this.props.role === "许愿" && checkedNum !== 2) || (this.props.role !== "许愿" && checkedNum !== 1)) {
      this.setState({
        errorMsg: "请您查验对应数量的兽首，调整后再次点击确认"
      })
    } else {
      let newRes = this.state.isChecked.map((el, index) => {
        if (!el) {
          return ""
        } else if (this.props.role !== "药不然" && this.props.role !== "老朝奉" && this.props.protectedZodiac === index) {
          errMsg = "兽首已被隐藏，无法查验";
          return ""
        } else if (this.props.role === "药不然" || this.props.role === "老朝奉" || !this.props.tfChanged) {
          return this.props.zodiacGroup[index]
        } else {
          return !this.props.zodiacGroup[index]
        }
      });
      console.log('zodiac eval result:',newRes)
      this.setState({
        showResult: newRes,
        errorMsg: errMsg,
        evalConfirmed: true
      })
    }
  }

  handleSelectNext = (index) => {
    console.log("handle select next", index)
    this.setState(() => {
      let newIsNext = new Array(this.props.roles.length-1).fill(false);
      newIsNext[index] = true
      return {
        isNext: newIsNext,
        errorMsg: "",
        nextIndex: index
      }
    })
  }

  handleProtect = (index) => {
    console.log('handle protect', index)
    this.setState(() => {
      let newIsProtected = new Array(this.props.roles.length-1).fill(false);
      newIsProtected[index] = true
      return {
        isProtected: newIsProtected,
        protectZodiac: index
      }
    })
  }

  handleProtectConfirm = () => {
    this.setState({
      protectConfirmed: true
    })
    this.props.handleProtect(this.state.protectZodiac)
  }

  handleAttack = (index) => {
    let res = true;
    let actualIndex = index < this.props.playerIndex ? index : index+1;
    let actionRole = this.props.roles[actualIndex];
    console.log('role to attack: ', actionRole)
    if (["药不然","老朝奉","郑国渠"].indexOf(actionRole) > -1) {
      res = false
    }
    this.setState({
      actionConfirmed: true,
      playerRes: res
    });
    this.props.handleAttack(index);
  }

  handleNext = () => {
    if (Object.values(this.props.gameStates).indexOf("未鉴宝") >= 0 && this.state.nextIndex === -1) {
      this.setState({
        errMsg: "请选择下一位玩家进行鉴宝"
      })
    } else {
      // reset the state when close the modal
      const nextIndex = this.state.nextIndex;
      const tfChanged = this.state.tfChanged;
      this.setState(
        {
          isChecked: [false, false, false, false], // for zodiac
          isSelected: new Array(this.props.roles.length-1).fill(false), // for players to take action
          isNext: new Array(this.props.roles.length-1).fill(false),
          isProtected: new Array(this.props.roles.length-1).fill(false),
          showResult: ["","","",""],
          playerRes: null,
          evalConfirmed: false,
          protectConfirmed: false,
          errorMsg: "",
          errMsg: "",
          actionIndex: null,
          nextIndex: -1,
          actionConfirmed: false,
          nextConfirmed: false,
          tfChanged: false
        }
      )
      this.props.handleNext(nextIndex, tfChanged);
    }

  }

  handleSwitchChange = (event) => {
    console.log('change switch',event.target.checked)
    this.setState({
      tfChanged: event.target.checked
    })
  }

  buildImgSet = () => {
    const evalNum = this.props.role === "许愿" ? 2 : this.props.role === "方震" ? 0 : 1;
    const action = this.props.role === "方震" ? "查验" : this.props.role === "药不然" ? "偷袭" : "";
    let canEval = this.props.canEval;

    if (this.props.role === "黄烟烟" && canEval === 1 && this.props.loseEvalHuang === this.props.curRound) {
      canEval = 2
    };
    if (this.props.role === "木户加奈" && canEval === 1 && this.props.loseEvalMuhu === this.props.curRound) {
      canEval = 2
    };

    let otherPlayers = Object.values(this.props.photos).slice();
    otherPlayers.splice(this.props.playerIndex, 1);

    const zodiacImg = {
      1: [rat, cow, tiger, rabbit],
      2: [dragon, snake, horse, goat],
      3: [monkey, chicken, dog, pig]
    }

    // console.log(zodiacImg, this.props.curRound)

    return (
      <div className={styles.ImgContainer}>
        {
          evalNum > 0 &&
          <div className={(canEval !== 1 || this.state.evalConfirmed) ? styles.GroupCardDisabled : styles.GroupCard} key={"card-1"}>
            <h1>请选择{evalNum}个兽首进行查验</h1>
            <div className={styles.ImgSet} key={"cardDiv-1"}>
            {
              zodiacImg[this.props.curRound].map((zodiac, index) => {
                let ImgBgStyles;
                if (!this.state.isChecked[index]) {
                  ImgBgStyles = styles.EvalImg;
                } else if (this.state.evalConfirmed) {
                  if (this.state.showResult[index]) {
                    ImgBgStyles = styles.EvalTrue;
                  } else {
                    ImgBgStyles = styles.EvalFalse;
                  }
                } else {
                  ImgBgStyles = styles.EvalImgChecked
                }

                return (
                  <div key={index} className={ ImgBgStyles } onClick={() => this.handleCheck(index)}>
                    <img src={zodiac}></img>
                    {
                      this.state.evalConfirmed && this.state.showResult[index] !== "" &&
                      <div className={this.state.showResult[index] ? styles.True : styles.False}>{this.state.showResult[index] ? "真" : "假"}</div>
                    }
                  </div>
                )
              })
            }
            </div>
            {
              this.state.errorMsg &&
              <div className={styles.ErrorMsg}>{this.state.errorMsg}</div>
            }
            <button className={styles.Button} onClick={this.handleEvalResult} disabled={this.state.evalConfirmed}>确认</button>
            {
              canEval !== 1 &&
              <div className={styles.DisabledMsg}>{canEval === 2 ? "您本轮技能失效，不能查验" : "您被药不然偷袭了，不能查验"}</div>
            }
          </div>
        }

        {
          action !== "" &&
          <div className={(this.state.actionConfirmed || (this.props.role === "方震" && canEval === 3)) ? styles.GroupCardDisabled : styles.GroupCard} key={"card-2"}>
            <h1>请选择1位玩家进行{action}</h1>
            <div className={styles.ImgSet} key={"cardDiv-2"}>
            {
              otherPlayers.map((el, index) => {
                let actualIndex = index < this.props.playerIndex ? index : index+1;
                return (
                  <div key={index} className={this.state.isSelected[index] ? styles.EvalImgSelected : styles.EvalNextImg} onClick={() => this.handleSelect(index)}>
                    <img src={el}></img>
                    <div
                      className={this.props.roles[actualIndex] === "老朝奉" && this.props.role === "药不然" ? styles.PlayerIndexDisabled : styles.PlayerIndex}>
                      {actualIndex + 1}
                    </div>
                    {
                      this.props.role === "方震" && this.state.actionConfirmed &&
                      this.state.actionIndex === index &&
                      <div className={this.state.playerRes ? styles.True : styles.False}>{this.state.playerRes ? "好人" : "坏人"}</div>
                    }
                  </div>
                )

              })
            }
            </div>
            <button className={styles.Button} onClick={() => this.handleAttack(this.state.actionIndex)} disabled={this.state.actionConfirmed}>确认</button>
            {
              this.props.role === "方震" && canEval === 3 &&
              <div className={styles.DisabledMsg}>{canEval === 2 ? "您本轮技能失效，不能查验" : "您被药不然偷袭了，不能查验"}</div>
            }
          </div>
        }

        {
          this.props.role === "郑国渠" &&
          <div className={(this.state.protectConfirmed || canEval === 3) ? styles.GroupCardDisabled : styles.GroupCard} key={"card-4"}>
            <h1>请选择1个兽首进行隐藏</h1>
            <div className={styles.ImgSet} key={"cardDiv-4"}>
            {
              zodiacImg[this.props.curRound].map((zodiac, index) => {
                let ImgBgStyles = this.state.isProtected[index] ? styles.EvalImgChecked : styles.EvalImg;

                return (
                  <div key={index} className={ ImgBgStyles } onClick={() => this.handleProtect(index)}>
                    <img src={zodiac}></img>
                  </div>
                )
              })
            }
            </div>
            <button className={styles.Button} onClick={this.handleProtectConfirm} disabled={this.state.protectConfirmed}>确认</button>
            {
              canEval === 3 &&
              <div className={styles.DisabledMsg}>"您被药不然偷袭了，不能查验"</div>
            }
          </div>
        }

        {
          this.props.role === "老朝奉" && Object.values(this.props.gameStates).indexOf("未鉴宝") >= 0 &&
          <div className={styles.GroupCard}>
            <h1>请选择是否发动技能</h1>
            <div className={styles.ImgSet}>
              <span className={styles.Option}>不发动</span>
              <input className={`${styles.tgl} ${styles.tgllight}`} id="switch" onChange={this.handleSwitchChange} type="checkbox"/>
              <label htmlFor="switch" className={styles.tglbtn}></label>
              <span className={styles.Option}>发动</span>
            </div>
          </div>
        }

        {
          Object.values(this.props.gameStates).indexOf("未鉴宝") >= 0 &&
          <div className={styles.GroupCard} key={"card-3"}>
            <h1>请选择下一位玩家进行鉴宝</h1>
            <div className={styles.ImgSet} key={"cardDiv-3"}>
            {
              otherPlayers.map((el, index) => {
                let actualIndex = index < this.props.playerIndex ? index : index+1;
                console.log("nextPlayer-",index)
                return (
                  <div
                    key={index}
                    className={this.props.gameStates[actualIndex] === "已鉴宝" ? styles.EvalImgDisabled : this.state.isNext[index] ? styles.EvalImgSelected : styles.EvalNextImg}
                    onClick={() => this.handleSelectNext(index)}
                    >
                      <img src={el}></img>
                      <div className={this.props.gameStates[actualIndex] === "已鉴宝" ? styles.PlayerIndexDisabled : styles.PlayerIndex}>{actualIndex + 1}</div>
                  </div>
                )
              })
            }
            {
              this.state.errMsg &&
              <div className={styles.ErrorMsg}>{this.state.errMsg}</div>
            }
            </div>
          </div>
        }

      </div>

    )
  }

  render() {
    console.log('props received in EvalModal:', this.props, this.state)
    return (
        <Modal
          isOpen={this.props.showEval}
          className={styles.Modal}
          overlayClassName={styles.Overlay}
          contentLabel="Eval"
        >
          <div className={styles.Title}>您的身份是：{this.props.role}</div>
          { this.buildImgSet() }
          <button className={styles.Button} onClick={this.handleNext} disabled={this.state.nextConfirmed}>确认并结束</button>
        </Modal>
    );
  }

}

export default EvalModal;
