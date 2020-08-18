import React from 'react';
import Modal from 'react-modal';

import styles from './ResModal.module.css';

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


const ResModal = (props) => {
    const zodiacImg = {
      1: [rat, cow, tiger, rabbit],
      2: [dragon, snake, horse, goat],
      3: [monkey, chicken, dog, pig]
    }

    console.log("res modal props: ",props)

    return (
      <Modal
        isOpen={props.showRes}
        className={styles.Modal}
        onRequestClose={props.closeFinalRes}
        overlayClassName={styles.Overlay}
        contentLabel="FinalRes"
      >
          <h1 className={styles.Title}>{props.finalRes}</h1>
          <div className={styles.InfoCard}>
            <h1>分数详情</h1>
            <div className={styles.ImgGroup}>
            {
              Object.keys(props.votedZodiac).map((key) => {
                let plusRes = props.zodiacRes[key].filter(el => el===true).length;

                return (
                  <div className={styles.ZodiacRes} key={key}>
                    <div className={styles.ResGroup}>
                      <div className={ props.zodiacRes[key][0] ? styles.EvalTrue : styles.EvalFalse }>
                        <img src={zodiacImg[parseInt(key)+1][props.votedZodiac[key][0]]} alt=""></img>
                        <div className={props.zodiacRes[key][0] ? styles.True : styles.False}>{props.zodiacRes[key][0] ? "真" : "假"}</div>
                      </div>
                      <div className={ props.zodiacRes[key][1] ? styles.EvalTrue : styles.EvalFalse }>
                        <img src={zodiacImg[parseInt(key)+1][props.votedZodiac[key][1]]} alt=""></img>
                        <div className={props.zodiacRes[key][1] ? styles.True : styles.False}>{props.zodiacRes[key][1] ? "真" : "假"}</div>
                      </div>
                    </div>
                    <div className={plusRes > 0 ? styles.PlusRes : styles.TransRes}>+ {plusRes}</div>

                  </div>
                )
              })
            }
            </div>

           <div className={styles.ImgGroup}>
              <div>老朝奉指认许愿 {props.recXuyuan ? "成功" : "失败"}</div>
              { !props.recXuyuan  && <div className={styles.PlusRes}>+2</div> }
           </div>
           <div className={styles.ImgGroup}>
              <div>药不然指认方震 {props.recFangzhen ? "成功" : "失败"}</div>
              { !props.recFangzhen  && <div className={styles.PlusRes}>+1</div> }
           </div>
           <div className={styles.ImgGroup}>
              <div>好人阵营指认老朝奉 {props.recLaochaofengRes ? "成功" : "失败"}</div>
              { props.recLaochaofengRes  && <div className={styles.PlusRes}>+1</div> }
           </div>
           <div className={styles.ImgGroup}>
            {
              props.roles.map((el, index) => {
                return (
                  <div className={styles.Roles} key={index}>
                    <img src={props.photos[index]}></img>
                    <div className={styles.RoleName}><span>{index+1}</span>号: {el}</div>
                  </div>
                )
              })
            }
           </div>

          </div>
      </Modal>
    )
  }


export default ResModal;
