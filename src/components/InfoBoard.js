import React, { Component } from 'react';
import { CSSTransition } from 'react-transition-group';
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

  handlePrev = () => {
    let index = this.state.current < 1 ? this.state.totalRound - 1 : this.state.current - 1;
    this.setState({
      current: index,
      isNext: false
    })
  }

  handleNext = () => {
    let index = this.state.currentdex === this.state.totalRound - 1 ? 0 : this.state.current + 1;
    this.setState({
      current: index,
      isNext: true
    })
  }

  handleGoto = (index) => {
    let next = this.state.current < index;
    this.setState({
      current: index,
      isNext: next
    })
  }

  render() {
    let index = this.state.current;
    let isNext = this.state.isNext;
    let chipRes = this.props.chipRes ? this.props.chipRes : {
      0: {
        0: [0,0,0,0],
        1: [0,0,0,0],
        2: [0,0,0,0],
        3: [0,0,0,0],
        4: [0,0,0,0],
        5: [0,0,0,0],
      },
      1: {
        0: [0,0,0,0],
        1: [0,0,0,0],
        2: [0,0,0,0],
        3: [0,0,0,0],
        4: [0,0,0,0],
        5: [0,0,0,0],
      },
      2: {
        0: [0,0,0,0],
        1: [0,0,0,0],
        2: [0,0,0,0],
        3: [0,0,0,0],
        4: [0,0,0,0],
        5: [0,0,0,0],
      }
    }

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
        requestClose={this.props.handleCloseInfo}
        overlayClassName={styles.Overlay}
        contentLabel="Info"
        closeTimeoutMS={500}
      >
        {
          Array.from(this.props.curRound).map((index) => {
            return (
              <div key={'infogroup-'+index} id={'info-'+index} className={styles.InfoGroup}>
                <h1>第 {this.props.curRound} 轮公共信息</h1>
                <div className={styles.InfoCard}>
                  <h1>本轮鉴宝顺序</h1>
                  <div className={styles.Order}>
                    {
                      this.props.evalOrder.map((el, index) => {
                        return (
                          <div key={'img-'+index} className={styles.PlayerPhoto}>
                            <img src={this.props.photos[el-1]} alt="" className={styles.Img}></img>
                            <div className={styles.PlayerIndex}>{el}</div>
                          </div>
                        )
                      })
                    }
                  </div>
                </div>

                <div className={styles.InfoCard}>
                    <h1>本轮投票情况</h1>
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
                                <td><img src={this.props.photos[el]} alt=""/></td>
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
                                          0
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
                      <tr>
                        {
                          this.props.chipTotalRes &&
                          this.props.chipTotalRes[index].map((total, ind) => {
                            return (
                              <td  key={'chip-total-'+ind}>{total}</td>
                            )
                          })
                        }
                      </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className={styles.InfoCard}>
                    <h1>本轮入选兽首</h1>
                    {
                      this.props.voted[index] ?
                      <div className={styles.Order}>
                        <div className={styles.EvalImgChecked}><img src={this.props.votedZodiac[index][0]}/></div>
                        <div className={this.props.zodiacRes[index][1] ? styles.EvalTrue : styles.EvalFalse }>
                          <img src={this.props.votedZodiac[index][1]}/>
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
