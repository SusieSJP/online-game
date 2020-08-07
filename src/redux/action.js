import { database, auth, provider, storage } from '../firebase/firebase';
import { zodiacGenerator } from '../utilities';


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

export const setDefaultPhoto = (url) => {
  return {
    type: 'SET_DEFAULT_PHOTO',
    url
  }
}

export const startSetDefaultPhoto = () => {
  console.log('set default photo action')
  return (dispatch) => {
    storage.ref('defaultPhotos/photo1.svg')
      .getDownloadURL().then(url => {
        dispatch(setDefaultPhoto(url))
    })

  }
}

export const startLogin = () => {
  return (dispatch, getState) => {
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
            photo: result.user.photoURL ? result.user.photoURL : getState().users.defaultPhoto,
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
        if (Object.values(doc.data().players).every(el => el === "")) {
          roomsRef.doc(doc.id).delete();
        } else {
          activeRooms[doc.id] = doc.data().pwd
        }
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
        if (Object.values(doc.data().players).every(el => el === "")) {
          roomsRef.doc(doc.id).delete();
        } else if (Object.values(doc.data().players).indexOf("") >= 0) {
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
export const createRoom = (roomid, pwd, roles, zodiac) => ({
  type: 'CREATE_ROOM',
  roomid,
  pwd,
  roles,
  zodiac
})

export const redirectTo = (redirectTo) => ({
  type: 'REDIRECT',
  redirectTo
})

export const startCreateRoom = ({newId, newPwd, roles, roomType} = {}) => {
  return (dispatch, getState) => {
    let curUser = getState().users.user;
    let curName = getState().users.name;
    let curUserPhotoURL = getState().users.photo;

    let dummyArr = new Array(roomType).fill(1);

    let players = Object.fromEntries(dummyArr.map((el, index) => [index, ""]));
    let names = Object.fromEntries(dummyArr.map((el, index) => [index, "玩家"]));
    let photos = Object.fromEntries(dummyArr.map((el, index) => [index, ""]));
    let chips = Object.fromEntries(dummyArr.map((el, index) => [index, 2]));
    let gameStates = Object.fromEntries(dummyArr.map((el, index) => [index, "未准备"]));
    // can eval = 1, randomly cannot = 2, attacked = 3
    let canEval = Object.fromEntries(dummyArr.map((el, index) => [index, 1]));
    // random cannot eval for huang and muhu
    let loseEvalHuang = Math.floor(Math.random()*3) + 1;
    let loseEvalMuhu = Math.floor(Math.random()*3) + 1;

    const zodiac = zodiacGenerator();

    players[0] = curUser;
    names[0] = curName;
    photos[0] = curUserPhotoURL;

    console.log('data to create new room:',
      {
        players,
        names,
        pwd: newPwd,
        roles,
        roomType,
        chips,
        photos,
        newId,
        gameStates,
        zodiac
      })

    database.collection('rooms').doc(newId).set({
      players,
      names,
      pwd: newPwd,
      roles,
      chips,
      photos,
      gameStates,
      started: false,
      canStart: false,
      zodiac,
      canEval,
      tfChanged: false,
      loseEvalHuang,
      loseEvalMuhu
    }).then(() => {
      console.log('finish add new room')
      dispatch(redirectTo(newId))
      dispatch(createRoom(newId, newPwd, roles, zodiac))
    })
  }
}

// 3. leave Room => the last one leave room should also clear room
export const leaveRoom = () => {
  return {
    type: 'LEAVE_ROOM'
  }
}

export const startLeaveRoom = () => {
  return (dispatch, getState) => {
    let curRoom = getState().rooms.room;
    let playerIndex = getState().rooms.playerIndex;

    // decrease the number of players in the room + remove players
    database.collection('rooms').doc(curRoom).update({
      ['gameStates.' + playerIndex]: "未准备",
      ['players.' + playerIndex]: "",
      ['photos.' + playerIndex]: "",
      ['names.' + playerIndex]: "玩家",
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
    const curUser = getState().users.user;
    const userPhoto = getState().users.photo;
    const userName = getState().users.name;

    return database.runTransaction((transaction) => {
      let playerIndex, roles, zodiac, tfChanged, loseEvalHuang, loseEvalMuhu;
      return transaction.get(docRef).then(doc => {
        roles = doc.data().roles;
        zodiac = doc.data().zodiac;
        playerIndex = Object.values(doc.data().players).findIndex(el => el === "");
        tfChanged = doc.data().tfChanged;
        loseEvalHuang = doc.data().loseEvalHuang;
        loseEvalMuhu = doc.data().loseEvalMuhu;

        transaction.update(docRef, {
          ['players.' + playerIndex]: curUser,
          ['photos.' + playerIndex]: userPhoto,
          ['names.'+ playerIndex]: userName
        });
      }).then(() => {
        console.log('user enter the room successfully with playerIndex:', playerIndex);
        dispatch(enterRoom({
          room: roomid,
          pwd: pwd,
          playerIndex: playerIndex,
          roles,
          zodiac,
          tfChanged,
          loseEvalHuang,
          loseEvalMuhu
        }))
      }).catch(error => console.log('error finding the room to enter: ', error))
    })
  }
}



// ******** game

//1. get ready
export const startGetReady = () => {
  return (dispatch, getState) => {
    const roomid = getState().rooms.room;
    const docRef = database.collection('rooms').doc(roomid);
    const userIndex =  getState().rooms.playerIndex;

    docRef.update({
      ['gameStates.' + userIndex]: "已准备"
    })
  }
}

//2. get unready
export const startNotReady = () => {
  return (dispatch, getState) => {
    const roomid = getState().rooms.room;
    const docRef = database.collection('rooms').doc(roomid);
    const userIndex =  getState().rooms.playerIndex;

    docRef.update({
      ['gameStates.' + userIndex]: "未准备",
      canStart: false
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
    const roles = getState().rooms.roles;
    const docRef = database.collection('rooms').doc(roomid);

    docRef.update({
      started: true,
      gameStates: Object.fromEntries(roles.map((el, index) => [index, "未鉴宝"]))
    }).then(() => { dispatch(getStart())})
  }
}

// 4. set the first person to evaluate
export const setFirstToEval = (nextRound) => {
  return (dispatch, getState) => {
    const roomid = getState().rooms.room;
    const docRef = database.collection('rooms').doc(roomid);

    let index;
    const playerNum = getState().rooms.roles.length;
    if (nextRound === 1) {
      // index = Math.floor(Math.random()*playerNum);
    } else {
      index = getState().game.evalOrder[playerNum - 1];
    }


    docRef.update({
      ['gameStates.' + 0]: "鉴宝中",
      ['evalOrder.'+ (nextRound-1)]: [1],
      tfChanged: false
    })
  }
}

export const setNextToEval = (index) => {
  return (dispatch, getState) => {
    const roomid = getState().rooms.room;
    const playerIndex = getState().rooms.playerIndex;
    const docRef = database.collection('rooms').doc(roomid);
    const curRoundIndex = getState().rooms.curRound - 1;
    const newEvalOrder = getState().game.evalOrder[curRoundIndex].slice();

    // docRef.get().then(doc => {
    //     let newEvalOrder = doc.data().evalOrder.slice();
    //     newEvalOrder.push(index+1);

    //     docRef.update({
    //       ['gameStates.' + index]: "鉴宝中",
    //       ['gameStates.' + playerIndex]: "已鉴宝",
    //       evalOrder: newEvalOrder
    //     })

    //   }).catch((error) => { console.log('push evalorder failed:', error)})


        newEvalOrder.push(index+1);

        docRef.update({
          ['gameStates.' + index]: "鉴宝中",
          ['gameStates.' + playerIndex]: "已鉴宝",
          ['evalOrder.' + curRoundIndex]: newEvalOrder
        }).catch((error) => { console.log('push evalorder failed:', error)})
  }
}


// 5. startAttack
export const startAttack = (indice, num) => {
  return (dispatch, getState) => {
    const roomid = getState().rooms.room;
    const docRef = database.collection('rooms').doc(roomid);

    if (num === 1) {
      docRef.update({
        ['canEval.' + indice[0]]: 3
      })
    } else {
      docRef.update({
        ['canEval.' + indice[0]]: 3,
        ['canEval.' + indice[1]]: 3,
      })
    }
  }
}

export const resetCanEval = () => {
  return (dispatch, getState) => {
    const roomid = getState().rooms.room;
    const docRef = database.collection('rooms').doc(roomid);
    const playerIndex = getState().rooms.playerIndex;

    docRef.update({
      ['canEval.' + playerIndex]: 1,
    })
  }
}

export const setTFChanged = () => {
  console.log('set TF changed at action')
  return (dispatch, getState) => {
    const roomid = getState().rooms.room;
    const docRef = database.collection('rooms').doc(roomid);
    docRef.update({
      tfChanged: true
    })
  }
}


export const setChatOrder = (index) => {
  return (dispatch, getState) => {
    const roomid = getState().rooms.room;
    const docRef = database.collection('rooms').doc(roomid);
    const playerNum = getState().rooms.roles.length;

    let order = [...Array(playerNum).keys()].revserse();
    const cutPos = playerNum - index;
    let newOrder = order.slice(cutPos).concat(order.slice(0, cutPos));

    docRef.update({
      chatOrder: newOrder,
      ['gameStates.' + newOrder[0]]: "发言中",
      curChatIndex: 0
    })
  }
}

export const setChatDone = () => {
  return (dispatch, getState) => {
    const roomid = getState().rooms.room;
    const docRef = database.collection('rooms').doc(roomid);
    const curChatIndex = getState().game.curChatIndex;
    const order = getState().game.chatOrder;

    docRef.update({
      ['gameStates.' + order[curChatIndex+1]]: "发言中",
      ['gameStates.' + order[curChatIndex]]: "已发言",
      curChatIndex: curChatIndex+1
    }).catch(error => console.log('error set chat done, ', error))
  }
}

export const startVote = () => {
  return (dispatch, getState) => {
    const roomid = getState().rooms.room;
    const docRef = database.collection('rooms').doc(roomid);
    const playerNum = getState().rooms.roles.length;

    let newGameStates = {};
    // every player has done chat
    for (let i=0; i<playerNum; i++) {
      newGameStates[i] = "投票中"
    }
    docRef.update({
      gameStates: newGameStates,
      chatOrder: [],
      curChatIndex: null
    }).catch(error => console.log('error start voting, ', error))

  }
}

export const calVoteRes = (counter) => {
  return (dispatch, getState) => {
    const roomid = getState().rooms.room;
    const docRef = database.collection('rooms').doc(roomid);
    const curRoundIndex = getState().rooms.curRound - 1;
    const playerIndex = getState().rooms.playerIndex;
    const playerNum = getState().rooms.roles.length;

    // return database.runTransaction(transaction => {
    //   return transaction.get(docRef).then(doc => {
    //     let newChipCount0 = doc.data().chipRes[curRoundIndex][0] + counter[0];
    //     let newChipCount1 = doc.data().chipRes[curRoundIndex][1] + counter[1];
    //     let newChipCount2 = doc.data().chipRes[curRoundIndex][2] + counter[2];
    //     let newChipCount3 = doc.data().chipRes[curRoundIndex][3] + counter[3];

    //     let isAllVoted = Object.values(doc.data().gameStates).filter(el => el === "已投票").length === playerNum - 1;

    //     transaction.update({
    //       ['gameStates.'+ playerIndex]: "已投票",
    //       ['chipRes.' + curRoundIndex + '.0']: newChipCount0,
    //       ['chipRes.' + curRoundIndex + '.1']: newChipCount1,
    //       ['chipRes.' + curRoundIndex + '.2']: newChipCount2,
    //       ['chipRes.' + curRoundIndex + '.3']: newChipCount3,
    //       voted: isAllVoted
    //     })
    //   })
    // })
    // .catch(error => console.log('error calculating votes, ', error))
    docRef.update({
      ['gameStates.'+ playerIndex]: "已投票",
      ['chipRes.' + curRoundIndex + '.' + playerIndex]: counter.slice(),
    })
    .catch(error => console.log('error calculating votes, ', error))
  }
}

export const setVoted = () => {
  return (dispatch, getState) => {
    const roomid = getState().rooms.room;
    const docRef = database.collection('rooms').doc(roomid);
    const curRoundIndex = getState().rooms.curRound - 1;
    const chipRes = getState().game.chipRes;
    const playerNum = getState().rooms.roles.length;
    const zodiac = getState().rooms.zodiac;

    let resArrArr = [[0,0],[1,0],[2,0],[3,0]];
    for (let i=0; i<playerNum; i++) {
      for (let j=0; j<4; j++) {
        resArrArr[j][1] += chipRes[curRoundIndex][i][j];
    }}
    let chipTotalRes = [resArrArr[0][1], resArrArr[1][1], resArrArr[2][1], resArrArr[3][1]];

    resArrArr.sort((a, b) => b[1] - a[1]);
    let votedZodiac = [resArrArr[0][0], resArrArr[1][0]];
    let zodiacRes = [zodiac[curRoundIndex][votedZodiac[0]], zodiac[curRoundIndex][votedZodiac[1]]];


    docRef.update({
      ['zodiacRes.'+ curRoundIndex]: zodiacRes,
      ['votedZodiac.' + curRoundIndex]: votedZodiac,
      ['chipTotalRes.' + curRoundIndex]: chipTotalRes,
      ['voted.' + curRoundIndex]: true
    })
    .catch(error => console.log('error calculating votes, ', error))
  }
}

export const updateGameStates = (data) => {
  console.log('update the game state in redux', data);
  return {
    type: 'UPDATE_GAME_STATES',
    ...data
  }
}

