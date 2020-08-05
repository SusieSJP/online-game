import React from 'react';
import styles from './RoleModal.module.css';

import Modal from 'react-modal';
import huangyanyan from '../assets/huangyanyan.svg';
import laochaofeng from '../assets/laochaofeng.svg';
import fangzhen from '../assets/fangzhen.svg';
import yaoburan from '../assets/yaoburan.svg';
import muhujianai from '../assets/muhujianai.svg';
import xuyuan from '../assets/xuyuan.svg';


// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root');

const RoleModal = (props) => {
  let roleImg;
  switch (props.role) {
    case '药不然':
      roleImg = yaoburan;
      break;
    case '黄烟烟':
      roleImg = huangyanyan;
      break;
    case '许愿':
      roleImg = xuyuan;
      break;
    case '老朝奉':
      roleImg = laochaofeng;
      break;
    case '方震':
      roleImg = fangzhen;
      break;
    case '木户加奈':
      roleImg = muhujianai;
      break;
    default:
      roleImg = "";
  }
  return (
    <div>
      <Modal
        isOpen={props.showModal}
        onRequestClose={props.closeModal}
        className={styles.Modal}
        overlayClassName={styles.Overlay}
        contentLabel="Search Room"
      >
        <img src={roleImg} />
        <div className={styles.Role}>{props.role}</div>
        {
          props.role === "药不然" &&
          <div className={styles.Notes}>您的队友老朝奉为 {props.roles.findIndex("老朝奉")} 号</div>
        }
        {
          props.role === "老朝奉" &&
          <div className={styles.Notes}>您的队友药不然为 {props.roles.findIndex("药不然")} 号</div>
        }
        <button className={styles.Button} onClick={props.closeModal}>确认</button>
      </Modal>
    </div>
  );
}

export default RoleModal;
