import { database, auth, provider } from '../firebase/firebase';


/*
********* user actions ***********
*/

// 1. login and add current user
export const userLogin = (userEmail, photoURL, totalGame, winGame, name) => {
  return {
    type: 'USER_LOGIN',
    userEmail,
    photoURL,
    totalGame,
    winGame,
    name
  }
}

export const startLogin = () => {
  return (dispatch) => {
    auth.signInWithPopup(provider).then((result) => {
      console.log('user login: ', result.user);

      let docRef = database.collection('users').doc(result.user.email);
      docRef.get().then(doc => {
        if (doc.exists) {
          console.log('returnning user!');
          dispatch(userLogin(doc.id, doc.data().photo, doc.data().totalGame, doc.data().winGame, doc.data().name))
        } else {
          console.log('new user registered');
          docRef.set({
            email: result.user.email,
            name: "玩家",
            photo: result.user.photoURL,
            totalGame: 0,
            winGame: 0
          }).then(() => {
            dispatch(userLogin(result.user.email, result.user.photoURL, 0, 0, "玩家"))
          }).catch(error => console.log('error adding new user to firebase: ', error));
        }
      })
  })};
}



/*
********* room actions ***********
*/

// 1. load all rooms
export const loadRoom = (rooms) => ({
  type: 'LOAD_ROOMS',
  rooms
})

export const startLoadRoom = () => {
  return (dispatch) => {
    let roomsRef = database.collection('rooms');
    roomsRef.get().then((querySnapshot) => {
      let activeRooms = {};
      querySnapshot.forEach((doc) => {
        activeRooms[doc.id] = doc.data().pwd
      });

      console.log('loaded all rooms pairs:', activeRooms);
      dispatch(loadRoom(activeRooms));

    }).catch((error) => {console.log("error getting rooms data: ", error)})
  }
}

// 1. load all available rooms
export const loadAvailableRoom = (rooms) => ({
  type: 'LOAD_AVAILABLE_ROOMS',
  rooms
})

export const startLoadAvailableRoom = () => {
  console.log('start loading available rooms')
  return (dispatch) => {
    let roomsRef = database.collection('rooms');
    roomsRef.get().then((querySnapshot) => {
      let activeRooms = {};
      querySnapshot.forEach((doc) => {
        console.log(doc.id, doc.data())
        if (!doc.data().isFull) {
          console.log('active one!')
          activeRooms[doc.id] = doc.data().pwd
        }
      });

      console.log('loaded active rooms pairs:', activeRooms);
      dispatch(loadAvailableRoom(activeRooms));

    }).catch((error) => {console.log("error getting rooms data: ", error)})
  }
}

//2. create new room
export const createRoom = (roomid, pwd, roles, players, chips, photos, names, gameStates) => ({
  type: 'CREATE_ROOM',
  roomid,
  pwd,
  roles,
  players,
  chips,
  photos,
  names,
  gameStates,
  host: 0
})

export const startCreateRoom = ({newId, newPwd, roles, roomType} = {}) => {
  return (dispatch, getState) => {
    let curUser = getState().users.user;
    let curName = getState().users.name;
    let curUserPhotoURL = getState().users.photo;
    console.log('photo url from action:', curUserPhotoURL);

    let players = new Array(roles.length).fill("");
    let names = new Array(roles.length).fill("玩家");
    let photos = new Array(roles.length).fill("");
    let chips = new Array(roles.length).fill(6);
    let gameStates = Object.fromEntries(players.map((el, index) => [index, "未准备"]));

    players[0] = curUser;
    names[0] = curName;
    photos[0] = curUserPhotoURL;

    console.log(
      {
        players,
        names,
        pwd: newPwd,
        roles,
        roomType,
        chips,
        photos,
        newId,
        gameStates
      })

    database.collection('rooms').doc(newId).set({
      isFull: false,
      players,
      names,
      pwd: newPwd,
      roles,
      roomType,
      chips,
      photos,
      curNum: 1,
      host: 0,
      gameStates,
      started: false,
      curRound: 0
    }).then(() => {
      console.log('finish add new room')
      dispatch(createRoom(newId, newPwd, roles, players, chips, photos, names, gameStates))
    })
  }
}

// 3. leave Room => the last one leave room should also clear room
export const leaveRoom = () => {
  return {
    type: 'LEAVE_ROOM',
    room: null,
    players: [],
    pwd: null,
    roles: [],
    roomPwdPairs: {},
    chips: [],
    photos: [],
    curNum: 0
  }
}

export const startLeaveRoom = () => {
  return (dispatch, getState) => {
    let remainingPlayers = getState().rooms.curNum - 1;
    let curRoom = getState().rooms.room;
    let curUser = getState().users.user;
    let curUserIndex = getState().rooms.players.indexOf(curUser);
    let userPhoto = getState().users.photo;
    let curHost = getState().rooms.host;

    let newPlayers = getState().rooms.players.map((email) => {
      if (email === curUser) {
        return ""
      } else { return email}
    });

    // still have other players -> change the host
    let newHost = curHost;
    if (curHost === curUserIndex) {
      newHost = newPlayers.findIndex((element) => element !== "")
    }

    let newPhotos = getState().rooms.photos.map((photo) => {
      if (photo === userPhoto) {
        return ""
      } else { return photo}
    })
    // decrease the number of players in the room + remove players
    database.collection('rooms').doc(curRoom).update({
      ['gameStates.' + curUserIndex]: "未准备",
      curNum: remainingPlayers,
      photos: newPhotos,
      players: newPlayers,
      host: newHost,
      isFull: false,
      canStart: false,
      started: false
    }).then(() => {
      dispatch(leaveRoom());
    })
  }
}

// 4. enter room
export const enterRoom = (data) => {
  return {
    type: 'ENTER_ROOM',
    ...data
  }
}

export const startEnterRoom = (roomid, pwd) => {
  return (dispatch, getState) => {
    let docRef = database.collection('rooms').doc(roomid);
    docRef.get().then((doc) => {
      // valid room/pwd pairs -> add player to players
      let curUser = getState().users.user;
      let userPhoto = getState().users.photo;

      let newPlayers = doc.data().players.slice();
      let newPhotos = doc.data().photos.slice();

      for (let i = 0; i < doc.data().players.length; i++) {
        if (doc.data().players[i] === "") {
          newPlayers[i] = curUser;
          newPhotos[i] = userPhoto;
          break;
        }
      }

      let newCurNum = doc.data().curNum + 1;
      let isFullNow = newCurNum === doc.data().players.length ? true : false;

      let localRoom = {
        room: doc.id,
        ...doc.data(),
        players: newPlayers,
        curNum: newCurNum,
        photos: newPhotos,
        isFull: isFullNow,
        curRound: 0
      }
      console.log(localRoom)

      // update the database
      docRef.update({
        players: newPlayers,
        curNum: newCurNum,
        photos: newPhotos,
        isFull: isFullNow
      }).then(() => { dispatch(enterRoom(localRoom))}).catch((error) => {
        console.log('error updating the player when entering the room: ', error)
      })
    }).catch((error) => {console.log('error finding the room to enter: ', error)})
  }
}



// ******** game

//1. get ready
export const getReady = (newStates, canStart) => {
  return {
    type: 'GET_READY',
    gameStates: newStates,
    canStart
  }
}

export const startGetReady = () => {
  return (dispatch, getState) => {
    const roomid = getState().rooms.room;
    const docRef = database.collection('rooms').doc(roomid);
    const curUser = getState().users.user;
    const userIndex =  getState().rooms.players.indexOf(curUser);

    docRef.update({
      ['gameStates.' + userIndex]: "已准备"
    })
    // .then(() => {
    //   dispatch(getReady(newStates, canStart))
    // })
  }
}

//2. get unready
export const notReady = (newStates) => {
  return {
    type: 'NOT_READY',
    gameStates: newStates,
    canStart: false
  }
}

export const startNotReady = () => {

  return (dispatch, getState) => {
    const roomid = getState().rooms.room;
    const docRef = database.collection('rooms').doc(roomid);

    const curUser = getState().users.user;
    let newStates = {...getState().rooms.gameStates};
    const userIndex =  getState().rooms.players.indexOf(curUser);

    newStates[userIndex] = "未准备";


    docRef.update({
      ['gameStates.' + userIndex]: "未准备",
      canStart: false
    }).then(() => {
      dispatch(getReady(newStates))
    })
  }
}

// 3. getStart
export const getStart = () => {
  return {
    type: 'GET_START',
    started: true
  }
}

export const startGetStart = () => {
  return (dispatch, getState) => {
    const roomid = getState().rooms.room;
    const docRef = database.collection('rooms').doc(roomid);

    docRef.update({
      started: true
    }).then(() => { dispatch(getStart())})
  }
}

// 4. confirmStart
export const confirmStart = () => {

}

export const startConfirmStart = () => {
  return (dispatch, getState) => {
    const roomid = getState().rooms.room;
    const docRef = database.collection('rooms').doc(roomid);

    const curUser = getState().users.user;
    const userIndex =  getState().rooms.players.indexOf(curUser);

    docRef.update({
      ['gameStates.' + userIndex]: "未鉴宝"
    })


  }
}

// 4. startRound
export const startNewRound = (roundNo, lastNo) => {

  if (roundNo === 1) {

  }
}






export const updateGameStates = (data) => {
  return {
    type: 'UPDATE_GAME_STATES',
    data
  }
}

export const listenGameStates = (roomid) => {
  console.log('listen game states',roomid)
  return (dispatch, getState) => {
    const docRef = database.collection('rooms').doc(roomid);
    docRef.onSnapshot((doc) => {
      if (Object.values(doc.data().gameStates).indexOf("未准备") === -1) {
        docRef.update({
          canStart: true
        }).then(() => dispatch(updateGameStates({canStart: true})))
      } else if (doc.data().remainingPlayers === 0) {
        docRef.delete();
      } else {
        dispatch(updateGameStates({gameStates: doc.data().gameStates}))
      }
      }
    )
  }

}
