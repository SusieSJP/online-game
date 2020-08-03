import React from 'react';
import styles from './Modal.module.css';

import Modal from 'react-modal';


// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root');

const InputModal = (props) => {
  let roomInput = React.createRef();
  let pwdInput = React.createRef();

  return (
    <div>
      <Modal
        isOpen={props.showModal}
        onRequestClose={props.closeModal}
        className={styles.Modal}
        overlayClassName={styles.Overlay}
        contentLabel="Search Room"
      >
        <form>
          <div className={styles.Row}>
            <label>房间号:</label>
            <input ref={ roomInput } type="text" className={styles.Input} />
          </div>
          <div className={styles.Row}>
            <label>房间密码:</label>
            <input ref={ pwdInput } className={styles.Input} type="text" />
          </div>
          <div className={styles.Row}>
            <p className={styles.Notes}>{props.errorMsg}</p>
          </div>

          <button type="button" className={styles.Button} onClick={() => props.searchRoom(roomInput.current.value, pwdInput.current.value)}>搜索</button>
        </form>


      </Modal>
    </div>
  );
}

export default InputModal;
