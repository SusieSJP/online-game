import React, { Component } from 'react';
import styles from './EvalModal.module.css';

import Modal from 'react-modal';
import rat from '../assets/rat.svg';
import cow from '../assets/cow.svg';
import tiger from '../assets/tiger.svg';
import rabbit from '../assets/rabbit1.svg';


// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root');

class EvalModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isChecked: [false, false, false, false],
      isSelected: [false, false, false, false, false],
      showResult: ["","","",""],
      evalConfirmed: false,
      errorMsg: "",
      actionIndex: null,
      actionConfirmed: false
    }
  }

  handleCheck = (index) => {
    if ((this.props.role === "许愿") && (this.state.isChecked.filter((el) => el === true).length === 2)) {
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
  }

  handleSelect = (index) => {
    console.log("handle select to action", index)
  }

  handleEvalResult = () => {
    if (this.props.canEval === 2 || this.props.canEval === 3) {
      this.props.closeEval();
    } else {
      let res = [];
      for (let i=0; i<4; i++) {
        if (this.state.isChecked[i]) {
          res.push(this.props.zodiacGroup[i]);
        } else {
          res.push("")
        }
      }

      this.setState({ showResult: res})
    }

  }


  buildImgSet = () => {
    let imgSet;
    const evalNum = this.props.role === "许愿" ? 2 : this.props.role === "方震" ? 0 : 1;
    const action = this.props.role === "方震" ? "查验" : this.props.role === "药不然" ? "偷袭" : "";

    if (this.props.curRound === 1) {
      imgSet = (
        <div className={styles.ImgContainer}>
          <div className={evalNum === 0 ? styles.GroupCardDisabled : styles.GroupCard}>
            <h1>请选择{evalNum}个兽首进行查验</h1>
            <div className={styles.ImgSet} >
              <div className={this.state.isChecked[0] ? styles.EvalImgChecked : styles.EvalImg} onClick={() => this.handleCheck(0)}><img src={rat}></img></div>
              <div className={this.state.isChecked[1] ? styles.EvalImgChecked : styles.EvalImg} onClick={() => this.handleCheck(1)}><img src={cow}></img></div>
              <div className={this.state.isChecked[2] ? styles.EvalImgChecked : styles.EvalImg} onClick={() => this.handleCheck(2)}><img src={tiger}></img></div>
              <div className={this.state.isChecked[3] ? styles.EvalImgChecked : styles.EvalImg} onClick={() => this.handleCheck(3)}><img src={rabbit}></img></div>
            </div>
            <button className={styles.Button} onClick={this.handleEvalResult} disabled={this.state.evalConfirm}>确认</button>
          </div>

          <div className={!action === 0 ? styles.GroupCardDisabled : styles.GroupCard}>
            { action && <h1>请选择1位玩家进行{action}</h1> }
            <div className={styles.ImgSet} >
              <div className={this.state.isSelected[0] ? styles.EvalImgSelected : styles.EvalImg} onClick={() => this.handleSelect(0)}><img src={rat}></img></div>
              <div className={this.state.isSelected[1] ? styles.EvalImgSelected : styles.EvalImg} onClick={() => this.handleSelect(1)}><img src={cow}></img></div>
              <div className={this.state.isSelected[2] ? styles.EvalImgSelected : styles.EvalImg} onClick={() => this.handleSelect(2)}><img src={tiger}></img></div>
              <div className={this.state.isSelected[3] ? styles.EvalImgSelected : styles.EvalImg} onClick={() => this.handleSelect(3)}><img src={rabbit}></img></div>
              <div className={this.state.isSelected[4] ? styles.EvalImgSelected : styles.EvalImg} onClick={() => this.handleSelect(4)}><img src={rabbit}></img></div>
            </div>
            <button className={styles.Button} onClick={() => this.props.handleAttack(this.state.actionIndex)} disabled={this.state.actionConfirm}>确认</button>
          </div>

          <div className={styles.GroupCard}>
            <h1>请选择下一位玩家进行鉴宝</h1>
            <div className={styles.ImgSet} >
              <div className={this.state.isSelected[0] ? styles.EvalImgSelected : styles.EvalImg} onClick={() => this.handleSelect(0)}><img src={rat}></img></div>
              <div className={this.state.isSelected[1] ? styles.EvalImgSelected : styles.EvalImg} onClick={() => this.handleSelect(1)}><img src={cow}></img></div>
              <div className={this.state.isSelected[2] ? styles.EvalImgSelected : styles.EvalImg} onClick={() => this.handleSelect(2)}><img src={tiger}></img></div>
              <div className={this.state.isSelected[3] ? styles.EvalImgSelected : styles.EvalImg} onClick={() => this.handleSelect(3)}><img src={rabbit}></img></div>
              <div className={this.state.isSelected[4] ? styles.EvalImgSelected : styles.EvalImg} onClick={() => this.handleSelect(4)}><img src={rabbit}></img></div>
            </div>
            <button className={styles.Button} onClick={() => this.props.handleAttack(this.state.actionIndex)} disabled={this.state.actionConfirm}>确认</button>
          </div>
        </div>

      )
    }
    return imgSet;
  }

  buildResSet = () => {
    return (
      <div className={styles.ResSet}>
        <div className={this.showResult[0] ? styles.True : styles.False}></div>
      </div>
    )
  }


  render() {
    return (
      <div>
        <Modal
          isOpen={this.props.showEval}
          className={styles.Modal}
          overlayClassName={styles.Overlay}
          contentLabel="Eval"
        >
          <div className={styles.Title}>您的身份是：{this.props.role}</div>
          { this.buildImgSet() }

        </Modal>
      </div>
    );
  }

}

export default EvalModal;
