import React from 'react';
import Modal from 'react-modal';

import styles from './VoteResModal.module.css';

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

// Modal.setAppElement('#gameRoom');

const VoteResModal = (props) => {
    const zodiacImg = {
      1: [rat, cow, tiger, rabbit],
      2: [dragon, snake, horse, goat],
      3: [monkey, chicken, dog, pig]
    }

    console.log('props in vote res modal:', props)

    return (
      <Modal
        isOpen={props.showRes}
        className={styles.Modal}
        onRequestClose={props.handleCloseRes}
        overlayClassName={styles.Overlay}
        contentLabel="Res"
      >
          <h1 className={styles.Title}>投票结果</h1>
          <div className={styles.ResGroup}>

            <div className={ styles.Unknown }>
              <img src={zodiacImg[props.curRound][props.votedZodiac[0]]} alt=""></img>
            </div>

            <div className={ props.zodiacRes[1] ? styles.EvalTrue : styles.EvalFalse }>
              <img src={zodiacImg[props.curRound][props.votedZodiac[1]]} alt=""></img>
              <div className={props.zodiacRes[1] ? styles.True : styles.False}>{props.zodiacRes[1] ? "真" : "假"}</div>
            </div>

          </div>


      </Modal>

    )
  }


export default VoteResModal;
