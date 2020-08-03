import React from 'react';
import styles from './InfoBoard.module.css';

const InfoBoard = (props) => {
  return (
    <div className={styles.Container}>
      <button className={styles.Button}>开始第 {props.roundNo} 轮</button>
    </div>
  )
}

export default InfoBoard;
