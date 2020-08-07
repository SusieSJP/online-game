import React, {Component} from 'react';
import styles from './VoteModal.module.css';

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
import plus from '../assets/plus.svg';
import minus from '../assets/minus.svg';
import chip from '../assets/chip.svg';


// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root');

class VoteModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      counter: [0,0,0,0],
      remainingChips: this.props.chips
    }
  }

  handleMinus = (index) => {
    this.setState((prevState) => {
      if (prevState.counter[index] > 0) {
        let newCounter = prevState.counter.slice();
        newCounter[index] = prevState.counter[index] - 1;
        return {
          counter: newCounter,
          remainingChips: prevState.remainingChips + 1
        }
      }
    })
  }

  handlePlus = (index) => {
    this.setState((prevState) => {
      if (prevState.remainingChips) {
        let newCounter = prevState.counter.slice();
        newCounter[index] = prevState.counter[index] + 1;
        return {
          counter: newCounter,
          remainingChips: prevState.remainingChips - 1
        }
      }
    })
  }

  render() {
    const zodiacImg = {
      1: [rat, cow, tiger, rabbit],
      2: [dragon, snake, horse, goat],
      3: [monkey, chicken, dog, pig]
    };

    return (
        <Modal
          isOpen={this.props.showVote}
          onRequestClose={this.props.closeVote}
          className={styles.Modal}
          overlayClassName={styles.Overlay}
          contentLabel="Vote"
        >
          <div className={styles.ImgCounter}>
          {
            zodiacImg[this.props.curRound].map((el, index) => {
              return (
                <div className={styles.CounterGroup} key={index}>
                  <img src={el} alt=""></img>
                  <div className={styles.Counter}>
                    <img src={minus} onClick={() => this.handleMinus(index)} />
                    <div>{this.state.counter[index]}</div>
                    <img src={plus} onClick={() => this.handlePlus(index)} />
                  </div>
                </div>
              )
            })
          }
          </div>
          <div className={styles.Chips}>
            剩余元宝:
            {
              Array(this.state.remainingChips).fill(1).map((el, index) => {
                return (
                  <img key={index} className={styles.Chip} src={chip}></img>
                )
              })
            }
          </div>
          <button className={styles.Button} onClick={() => this.props.closeVote(this.state.counter)}>确认并结束</button>
        </Modal>
    )
  }
}

export default VoteModal;
