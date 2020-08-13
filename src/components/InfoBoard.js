import React, { Component } from 'react';
import Modal from 'react-modal';

import styles from './InfoBoard.module.css';
import unknown from '../assets/unknown.svg';
import chip from '../assets/chip.svg';

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

class InfoBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalRound: this.props.curRound,
      current: this.props.curRound-1,
      isNext: true
    }
  }

  render() {
    let chipRes = this.props.chipRes;

    const zodiacImg = {
      1: [rat, cow, tiger, rabbit],
      2: [dragon, snake, horse, goat],
      3: [monkey, chicken, dog, pig]
    }

    console.log('props to info board: ', this.props)

    return (
      <Modal
        isOpen={this.props.showInfo}
        className={styles.Container}
        onRequestClose={this.props.handleCloseInfo}
        overlayClassName={styles.Overlay}
        contentLabel="Info"
      >
        {
          new Array(this.props.curRound).fill(1).map((el, index) => {
            return (
              <div key={index} id={'info-'+index} className={styles.InfoGroup}>
                <h1>第 {index+1} 轮公共信息</h1>
                <div className={styles.InfoCard}>
                  <h1>第 {index+1} 轮鉴宝顺序</h1>
                  <div className={styles.Order}>
                    {
                      this.props.evalOrder[index].map((el, index) => {
                        return (
                          <div key={index} className={styles.PlayerPhoto}>
                            <img src={this.props.photos[el]} alt="" className={styles.Img}></img>
                            <div className={styles.PlayerIndex}>{el+1}</div>
                          </div>
                        )
                      })
                    }
                  </div>
                </div>

                {
                  chipRes[index] &&
                  <div className={styles.InfoCard}>
                    <h1>第 {index+1} 轮投票情况</h1>
                    <table>
                      <thead>
                        <tr>
                          <th>&nbsp;</th>
                          {
                            zodiacImg[index+1].map((el, i) => {
                              return (
                                <th key={'table-zodiac-'+i}><img src={el}/></th>
                              )
                            })
                          }
                        </tr>
                      </thead>
                      <tbody>
                      {
                        Object.keys(chipRes[index]).map((el) => {
                          return (
                            <tr key={'chip-res-'+el}>
                                <td><img src={this.props.photos[el]} alt=""/><span>{parseInt(el)+1}</span></td>
                                {
                                  chipRes[index][el].map((num, i) => {
                                    return (
                                      <td key={'chip-row-'+i}>
                                      {
                                        <div className={styles.Chips}>
                                        {
                                          num ?
                                          Array(num).fill(1).map((x, y) => {
                                            return (
                                              <img key={'chip-num-'+y} className={styles.Chip} src={chip}></img>
                                            )
                                          }) :
                                          "-"
                                        }
                                        </div>
                                      }
                                      </td>
                                    )
                                  })
                                }
                            </tr>
                          )
                        })
                      }
                      {
                        this.props.chipTotalRes[index] &&
                        <tr>
                          <td>&nbsp;</td>
                          {
                            this.props.chipTotalRes[index].map((total, ind) => {
                              return (
                                <td  key={'chip-total-'+ind}>{total}</td>
                              )
                            })
                          }
                        </tr>
                      }
                      </tbody>
                    </table>
                  </div>
                }

                  <div className={styles.InfoCard}>
                    <h1>第 {index+1} 轮入选兽首</h1>
                    {
                      this.props.voted[index] ?
                      <div className={styles.Order}>
                        <div className={styles.EvalImgChecked}><img src={zodiacImg[index+1][this.props.votedZodiac[index][0]]}/></div>
                        <div className={this.props.zodiacRes[index][1] ? styles.EvalTrue : styles.EvalFalse }>
                          <img src={zodiacImg[index+1][this.props.votedZodiac[index][1]]}/>
                          <div className={this.props.zodiacRes[index][1] ? styles.True : styles.False}>{
                            this.props.zodiacRes[index][1] ? "真" : "假"
                          }</div>
                        </div>
                      </div> :
                      <div className={styles.Order}>
                        <div className={styles.EvalImg}><img src={unknown}/></div>
                        <div className={styles.EvalImg}><img src={unknown}/></div>
                      </div>
                    }
                  </div>



              </div>

            )})}
      </Modal>

    )
  }


}

export default InfoBoard;
