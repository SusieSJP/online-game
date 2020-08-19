import React, { Component } from 'react';
import Modal from 'react-modal';

import styles from './RecModal.module.css';


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

  handleClose = () => {
    const recIndex = this.state.recIndex;
    this.setState({
      isSelected:[false, false, false, false, false],
      recIndex: 0
    })
    this.props.closeRec(recIndex);
  }

  render() {
    console.log('props in rec modal: ', this.props, this.state)

    let recRole = "老朝奉";
    switch (this.props.roles[this.props.playerIndex]) {
      case '药不然':
        recRole = "方震";
        break;
      case '老朝奉':
        recRole = "许愿";
        break;
      case '郑国渠':
        recRole = "";
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
        overlayClassName={styles.Overlay}
        contentLabel="Res"
      >
          <h1 className={styles.Title}>请指认 {recRole}</h1>
          {
            this.props.roles[this.props.playerIndex] === "郑国渠" ?
            <div className={styles.ErrorMsg}>您是郑国渠，不需要指认</div> :
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
          }

          <button className={styles.Button} onClick={this.handleClose}>确认并结束</button>


      </Modal>

    )

  }
}


export default RecModal;
