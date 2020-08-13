import React, { Component } from 'react';
import Modal from 'react-modal';

import styles from './RecModal.module.css';

Modal.setAppElement('#gameRoom');

class RecModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isSelected:[false, false, false, false, false],
      recIndex: 0
    }
  }

  handleSelect = (index, actualIndex) => {
    this.setState(() => {
      let newSelected = [false, false, false, false, false];
      newSelected[index] = true
      return {
        isSelected: newSelected,
        recIndex: actualIndex
      }
    })
  }

  render() {
    let recRole = "老朝奉";
    switch (this.props.roles[this.props.playerIndex]) {
      case '药不然':
        recRole = "方震";
        break;
      case '老朝奉':
        recRole = "许愿";
        break;
      default:
        break;
    }

    let otherPlayers = Object.values(this.props.photos).slice();
    otherPlayers.splice(this.props.playerIndex, 1);

    return (
      <Modal
        isOpen={this.props.showRec}
        className={styles.Modal}
        onRequestClose={this.props.closeRec}
        overlayClassName={styles.Overlay}
        contentLabel="Res"
      >
          <h1 className={styles.Title}>请指认 {recRole}</h1>
          <div className={styles.ResGroup}>
            {
              otherPlayers.map((el, index) => {
                let actualIndex = index < this.props.playerIndex ? index : index+1;
                return (
                  <div key={index} className={this.state.isSelected[index] ? styles.EvalImgSelected : styles.EvalNextImg} onClick={() => this.handleSelect(index, actualIndex)}>
                    <img src={el}></img>
                    <div className={styles.PlayerIndex}>{actualIndex + 1}</div>
                  </div>
                )
              })
            }
          </div>
          <button className={styles.Button} onClick={() => this.props.closeRec(this.state.recIndex)}>确认并结束</button>


      </Modal>

    )

  }
}


export default RecModal;
