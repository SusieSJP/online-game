import React, { Component } from 'react';
import styles from './RoomSelect.module.css';

class RoomSelect extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.RoomSelectContainer}>
        <div className={styles.Card}>
          <div className={styles.Title}>
            <h3>普通6人局</h3>
            <div className={styles.Button} onClick={() => this.props.handleSelect('普通6人')}>建房</div>
          </div>
          <div className={styles.VSbackground}>
            <div className={styles.Group}>
              <h3>好人阵营：4人 </h3>
              <p><span className={styles.Rolename}>许愿</span><span className={styles.Rolename}>木户加奈</span></p>
              <p><span className={styles.Rolename}>方震</span><span className={styles.Rolename}>黄烟烟</span></p>
            </div>
            <div className={styles.Group}>
              <h3>坏人阵营：2人 </h3>
              <span className={styles.Rolename}>老朝奉</span>
              <span className={styles.Rolename}>药不然</span>
            </div>
          </div>
        </div>
        <div className={styles.Card}>
          <div className={styles.Title}>
            <h3>普通8人局</h3>
            <div className={styles.Button} onClick={() => this.props.handleSelect('普通8人')}>建房</div>
          </div>
          <div className={styles.VSbackground}>
            <div className={styles.Group}>
              <h3>好人阵营：5人 </h3>
              <p><span className={styles.Rolename}>许愿</span><span className={styles.Rolename}>黄烟烟</span><span className={styles.Rolename}>方震</span></p>
              <p><span className={styles.Rolename}>木户加奈</span><span className={styles.Rolename}>姬云浮</span></p>
            </div>
            <div className={styles.Group}>
              <h3>坏人阵营：3人 </h3>
              <span className={styles.Rolename}>老朝奉</span>
              <p><span className={styles.Rolename}>药不然</span><span className={styles.Rolename}>郑国渠</span></p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default RoomSelect;
