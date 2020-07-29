import React from 'react';
import styles from './Nav.module.css';
import { connect } from 'react-redux';

const Nav = (props) => {
  let containerStyle = [styles.NavContainer, ""];
  console.log('nav changes: ', props);
  if (props.roomid && props.pwd) {
    containerStyle[1] = styles.NarrowPadding;
  } else {
    containerStyle[1] = styles.WidePadding;
  }

  return (
    <header className={containerStyle.join(' ')}>
      <h1 className={styles.Title}>古董局中局</h1>
      <div className={styles.RoomInfo}>
      {
        props.roomid && <div className={styles.Subtitle}>房间号: <span>{props.roomid}</span></div>
      }
      {
        props.pwd && <div className={styles.Subtitle}>房间密码: <span>{props.pwd}</span></div>
      }
      </div>

    </header>
  )
}

const mapStateToProps = (state, props) => {
  return {
    roomid: state.rooms.room,
    pwd: state.rooms.pwd
  }
}

export default connect(mapStateToProps)(Nav);
