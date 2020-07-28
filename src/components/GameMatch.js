import React, { Component } from 'react';
import styles from './GameMatch.module.css';
import GameRoom from './GameRoom';
import RoomSelect from './RoomSelect';

import { database } from '../firebase/firebase';

class GameMatch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectRoomType: false, // state 1 for create room
      roomCreated: false, // state 2 for create room
      currRoom: null,
      roomPwdPairs: {},
    }
  }

  componentDidMount() {
    // 1. download the current active room/pwd data
    // 2. set the room pairs state with loaded data
    let activeRooms = {};
    let roomsRef = database.collection('rooms');
    roomsRef.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          activeRooms[doc.id] = doc.data().pwd
        });

        console.log('loaded active rooms pairs:', activeRooms);

        this.setState({
          roomPwdPairs: activeRooms
        })
      }
    ).catch((error) => {console.log("error getting rooms data: ", error)})
  }

  handleClick = (event) => {
    let request = event.target.innerText;
    switch (request) {
      case '创建房间':
        console.log('user click to create room');
        this.setState({
          selectRoomType: true
        });
        break;
      case '搜索房间':
        break;
      default:
        console.log("Sorry, we cannot understand your request, Please click either 'Create Room' or 'Search Room'.")
    }
  }

  handleSelect = (roomType) => {
    // 1. create a random and unused room id and pwd
    const newId = this.roomIdGenerator().toString();
    const newPwd = Math.floor(Math.random() * 90) + 10;
    console.log(newId, newPwd)

    // 2. allocate roles
    const roles = this.rolesGenerator(roomType);
    console.log("allocated roles:", roles);

    // 3. update the database and the states
    database.collection('rooms').doc(newId).set({
      isStarted: false,
      players: [this.props.user],
      pwd: newPwd,
      roles,
      roomType
    }).then(() => {
      this.setState({
          roomCreated: true,
          currRoom: newId
      });
    })

    // 2. redirect to the game room

  }

  roomIdGenerator() {
    let id = Math.floor(Math.random() * 900000) + 100000;
    while (id in Object.keys(this.state.roomPwdPairs)) {
      id = Math.floor(Math.random() * 900000) + 100000;
    }
    return id;
  }

  rolesGenerator(roomType) {
    let standard6 = ["黄烟烟", "药不然", "木户加奈", "老朝奉", "许愿", "方震"];
    let standard8 = ["黄烟烟", "药不然", "木户加奈", "老朝奉", "许愿", "方震", "郑国渠", "姬云浮"];
    let res;

    switch (roomType) {
      case '普通6人':
        res = standard6.slice();
        for (let i = 5; i > 0; i--) {
          const j = Math.floor(Math.random() * i);
          const temp = res[i];
          res[i] = res[j];
          res[j] = temp;
        };
        break;
      case '普通8人':
        res = standard8.slice();
        for (let i = 7; i > 0; i--) {
          const j = Math.floor(Math.random() * i);
          const temp = res[i];
          res[i] = res[j];
          res[j] = temp;
        };
        break;
      default:
        console.log('unknown room type for roles generator')
    }

    return res;
  }

  render() {
    return (
      <div className={styles.FakeContainer}>
        <div className={styles.GameMatchContainer}>
          <div className={styles.Card} onClick={this.handleClick}>创建房间</div>
          <div className={styles.Card} onClick={this.handleClick}>搜索房间</div>

        </div>
        {
          this.state.selectRoomType &&
          <RoomSelect
            handleSelect={this.handleSelect}
          />
        }
        {
          this.state.roomCreated && <GameRoom />
        }
      </div>

    )
  }
}

export default GameMatch;
