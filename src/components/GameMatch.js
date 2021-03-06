import React, { Component } from 'react';
import { connect } from 'react-redux';
import { startLoadAvailableRoom, startEnterRoom, startLoadRoom } from '../redux/action';
import { withRouter } from 'react-router';

import InputModal from './Modal';
import styles from './GameMatch.module.css';



class GameMatch extends Component {
  state = {
    showModal: false,
    errorMsg: ""
  }

  componentDidMount() {
    console.log('game match mount!')
  }

  handleClick = (event) => {
    console.log('game match props:', this.props);

    let request = event.target.innerText;
    switch (request) {
      case '创建房间':
        console.log('user click to create room');
        this.props.startLoadRoom();
        // redirect to room select
        this.props.history.push('/room-select');
        break;
      case '搜索房间':
        // pop up window
        this.props.startLoadAvailableRoom();
        this.setState({
          showModal: true
        })
        break;
      default:
        console.log("Sorry, we cannot understand your request, Please click either 'Create Room' or 'Search Room'.")
    }
  }

  handleCloseModal = () => {
    this.setState({ showModal: false, errorMsg: "" })
  }

  handleSearchRoom = (room, pwd) => {
    console.log('search room:', room, pwd);
    // room doesn't exist or pwd doesn't match or room is full
    // invalid room id or pwd, stay open the modal
    if (!(room in this.props.availableRooms) || this.props.availableRooms[room] != pwd) {
      console.log('cannot enter room!', !(room in this.props.availableRooms), this.props.availableRooms[room] != pwd)
      this.setState({
        errorMsg: "抱歉，房间已满或信息有误，请重新输入 :("
      })
    } else {
      // enter the room and close the modal
      this.handleCloseModal();
      this.props.startEnterRoom(room, pwd).then(() => this.props.history.push('/room/' + room));
    }
  }

  render() {
    return (
      <div className={styles.GameMatchContainer}>
        <div className={styles.Card} onClick={this.handleClick}>创建房间</div>
        <div className={styles.Card} onClick={this.handleClick}>搜索房间</div>
        <InputModal
          showModal={this.state.showModal}
          closeModal={this.handleCloseModal}
          searchRoom={this.handleSearchRoom}
          errorMsg={this.state.errorMsg}/>
      </div>

    )
  }
}


const mapStateToProps = (state, props) => {
  return {
    availableRooms: state.rooms.availableRooms
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    startLoadAvailableRoom: () => dispatch(startLoadAvailableRoom()),
    startEnterRoom: (roomid, pwd) => dispatch(startEnterRoom(roomid, pwd)),
    startLoadRoom: () => dispatch(startLoadRoom())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(GameMatch));
