import { database, auth, provider, storage } from '../firebase/firebase';
import { zodiacGenerator, rolesGenerator, chipResGenerator } from '../utilities';


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
        console.log('default photo url:', url)
        dispatch(setDefaultPhoto(url))
    })
  }
}

export const startLogin = () => {
  return (dispatch, getState) => {
    auth.signInWithPopup(provider).then((result) => {
      console.log('user login: ', result.user);
      const docRef = database.collection('users').doc(result.user.email);
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
export const createRoom = (roomid, pwd) => ({
  type: 'CREATE_ROOM',
  roomid,
  pwd
})

export const redirectTo = (redirectTo) => ({
  type: 'REDIRECT',
  redirectTo
})

export const resetRedirectTo = () => ({
  type: 'RESET_REDIRECT',
  redirectTo: null
})

export const startCreateRoom = ({newId, newPwd, roles, roomType} = {}) => {
  return (dispatch, getState) => {
    let curUser = getState().users.user;
    let curName = getState().users.name;
    let curUserPhotoURL = getState().users.photo;

    let dummyArr = new Array(roomType).fill(1);
    const chipRes = chipResGenerator(roomType);

    let players = Object.fromEntries(dummyArr.map((el, index) => [index, ""]));
    let names = Object.fromEntries(dummyArr.map((el, index) => [index, "玩家"]));
    let photos = Object.fromEntries(dummyArr.map((el, index) => [index, ""]));
    let chips = Object.fromEntries(dummyArr.map((el, index) => [index, 0]));
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

    console.log('data to CREATE new room:',
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
        zodiac,
        chipRes
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
      zodiac, // object of mapping round to true false
      canEval,
      tfChanged: false,
      loseEvalHuang,
      loseEvalMuhu,
      curRound: 0,
      chipRes
    }).then(() => {
      console.log('finish add new room')
      dispatch(redirectTo(newId))
      dispatch(createRoom(newId, newPwd))
    })
  }
}

// export const replay = (roles, zodiac) => ({
//   type: 'REPLAY',
//   roles,
//   zodiac
// })


export const startReplay = () => {
  return (dispatch, getState) => {
    let playerNum = getState().game.roles.length;
    let newRoles = rolesGenerator(playerNum);
    let roomid = getState().rooms.room;
    let names = getState().game.names;
    let players = getState().game.players;
    let photos = getState().game.photos;
    let pwd = getState().rooms.pwd;

    let dummyArr = new Array(playerNum).fill(1);

    let chips = Object.fromEntries(dummyArr.map((el, index) => [index, 0]));
    let gameStates = Object.fromEntries(dummyArr.map((el, index) => [index, "未准备"]));
    // can eval = 1, randomly cannot = 2, attacked = 3
    let canEval = Object.fromEntries(dummyArr.map((el, index) => [index, 1]));
    // random cannot eval for huang and muhu
    let loseEvalHuang = Math.floor(Math.random()*3) + 1;
    let loseEvalMuhu = Math.floor(Math.random()*3) + 1;

    const zodiac = zodiacGenerator();
    const chipRes = chipResGenerator(playerNum);

    console.log('data to create new game - replay:',
      {
        newRoles,
        chips,
        canEval,
        loseEvalHuang,
        loseEvalMuhu,
        gameStates,
        zodiac,
        chipRes
      })

    database.collection('rooms').doc(roomid).set({
      roles: newRoles,
      chips,
      chipRes,
      gameStates,
      started: false,
      canStart: false,
      zodiac, // object of mapping round to true false
      canEval,
      tfChanged: false,
      protectedZodiac: null,
      loseEvalHuang,
      loseEvalMuhu,
      curRound: 0,
      pwd,
      players,
      names,
      photos
    }).then(() => {
      console.log('finish start new game')
      // dispatch(replay(newRoles, zodiac))
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
  console.log('start leave!')
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
      let playerIndex;
      return transaction.get(docRef).then(doc => {
        // roles = doc.data().roles;
        // zodiac = doc.data().zodiac;
        playerIndex = Object.values(doc.data().players).findIndex(el => el === "");
        // tfChanged = doc.data().tfChanged;
        // loseEvalHuang = doc.data().loseEvalHuang;
        // loseEvalMuhu = doc.data().loseEvalMuhu;

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
          // roles,
          // zodiac,
          // tfChanged,
          // loseEvalHuang,
          // loseEvalMuhu
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
    const roles = getState().game.roles;
    const docRef = database.collection('rooms').doc(roomid);
    let newChips = {...getState().game.chips};
    Object.keys(newChips).forEach((key) => {
      newChips[key] += 2
    })


    docRef.update({
      started: true,
      gameStates: Object.fromEntries(roles.map((el, index) => [index, "未鉴宝"])),
      chips: newChips
    }).then(() => { dispatch(getStart())})
  }
}

export const setViewDone = () => {
  return (dispatch, getState) => {
    const roomid = getState().rooms.room;
    const docRef = database.collection('rooms').doc(roomid);
    const playerNum = getState().rooms.playerIndex;

    docRef.update({
      ['doneViewModal.' + playerNum]: 1,
    })
  }
}

export const resetViewDone  = () => {
  console.log('reset view done being called')
  return (dispatch, getState) => {
    const roomid = getState().rooms.room;
    const docRef = database.collection('rooms').doc(roomid);
    const roles = getState().game.roles;

    docRef.update({
      doneViewModal: Object.fromEntries(roles.map((el, index) => [index, 0])),
    })
  }
}

// 4. set the first person to evaluate
// export const setNextRound = (nextRound) => {
//   return {
//     type: 'SET_NEXT_ROUND',
//     nextRound
//   }
// }

export const setFirstToEval = (nextRound) => {
  console.log('set firsst to eval,', nextRound)
  return (dispatch, getState) => {
    const roomid = getState().rooms.room;
    console.log('set first to eval action:', roomid)
    const docRef = database.collection('rooms').doc(roomid);
    const players = getState().game.players;

    let index;
    const playerNum = getState().game.roles.length;
    if (nextRound === 1) {
      index = Math.floor(Math.random() * playerNum);
      while (players[index] === "") {
        index = Math.floor(Math.random() * playerNum);
      }
      console.log('first to eval at round 1: ', index)
    } else {
      index = getState().game.evalOrder[nextRound-2][playerNum - 1];
      console.log('first to eval at round 2 or 3: ', index)
    }


    docRef.update({
      ['gameStates.' + index]: "鉴宝中",
      ['evalOrder.'+ (nextRound-1)]: [index],
      tfChanged: false,
      protectedZodiac: null,
      curRound: nextRound
    });
  }
}

export const setNextToEval = (index) => {
  return (dispatch, getState) => {
    const roomid = getState().rooms.room;
    const playerIndex = getState().rooms.playerIndex;
    const docRef = database.collection('rooms').doc(roomid);
    const curRoundIndex = getState().game.curRound - 1;
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


        newEvalOrder.push(index);

        docRef.update({
          ['gameStates.' + index]: "鉴宝中",
          ['gameStates.' + playerIndex]: "已鉴宝",
          ['evalOrder.' + curRoundIndex]: newEvalOrder
        }).catch((error) => { console.log('push evalorder failed:', error)})
  }
}

export const setEvalRes = (evalRes) => {
  return (dispatch, getState) => {
    const roomid = getState().rooms.room;
    const docRef = database.collection('rooms').doc(roomid);
    const playerIndex = getState().room.playerIndex;
    const curRoundIndex = getState().game.curRound -1;

    docRef.update({
      ['evalResLog.' + curRoundIndex + '.' + playerIndex]: evalRes,
    })
  }
}


export const setEvalDone = () => {
  return (dispatch, getState) => {
    const roomid = getState().rooms.room;
    const docRef = database.collection('rooms').doc(roomid);
    const roles = getState().game.roles;

    docRef.update({
      gameStates: Object.fromEntries(roles.map((el, index) => [index, "未发言"])),
      })
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

export const setProtect = (zodiacIndex) => {
  console.log('set zoidac to be protected', zodiacIndex)
  return (dispatch, getState) => {
    const roomid = getState().rooms.room;
    const docRef = database.collection('rooms').doc(roomid);
    docRef.update({
      protectedZodiac: zodiacIndex
    })
  }
}


export const setChatOrder = () => {
  return (dispatch, getState) => {
    const roomid = getState().rooms.room;
    const docRef = database.collection('rooms').doc(roomid);
    const playerNum = getState().game.roles.length;
    const curRoundIndex = getState().game.curRound - 1;
    const index = getState().game.evalOrder[curRoundIndex][playerNum-1];
    console.log('index to split the evalorder to form chat order: ', index)

    let order = [...Array(playerNum).keys()].reverse();
    const cutPos = playerNum - index;
    let newOrder = order.slice(cutPos).concat(order.slice(0, cutPos));
    console.log('new chat order:', newOrder)

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
    const playerNum = getState().game.roles.length;
    const curRoundIndex = getState().game.curRound - 1;

    let newGameStates = {};
    // every player has done chat
    for (let i=0; i<playerNum; i++) {
      newGameStates[i] = "投票中"
    }

    docRef.update({
      gameStates: newGameStates,
      chatOrder: [],
      curChatIndex: null,
      // ['chipRes.'+ curRoundIndex]: newChipRes
    }).catch(error => console.log('error start voting, ', error))

  }
}

export const calVoteRes = (counter) => {
  return (dispatch, getState) => {
    const roomid = getState().rooms.room;
    const docRef = database.collection('rooms').doc(roomid);
    const curRoundIndex = getState().game.curRound - 1;
    const playerIndex = getState().rooms.playerIndex;
    const chips = getState().game.chips[playerIndex];
    let chipUsed = counter.reduce((acc,curr) => acc+curr);

    docRef.update({
      ['gameStates.'+ playerIndex]: "已投票",
      ['chipRes.' + curRoundIndex + '.' + playerIndex]: counter,
      ['chips.' + playerIndex]: chips-chipUsed
    })
    .catch(error => console.log('error calculating votes, ', error))
  }
}

export const setVoted = () => {
  return (dispatch, getState) => {
    const roomid = getState().rooms.room;
    const docRef = database.collection('rooms').doc(roomid);
    const curRoundIndex = getState().game.curRound - 1;
    const chipRes = getState().game.chipRes;
    const playerNum = getState().game.roles.length;
    const zodiac = getState().game.zodiac;

    console.log('setVoted!');
    console.log({
      chipRes,
      zodiac
    })

    if (curRoundIndex >= 0 && chipRes) {
      let resArrArr = [[0,0],[1,0],[2,0],[3,0]];
      for (let i=0; i<playerNum; i++) {
        for (let j=0; j<4; j++) {
          resArrArr[j][1] += chipRes[curRoundIndex][i][j];
      }}

      console.log('res ArrArr: ', resArrArr);
      let chipTotalRes = [resArrArr[0][1], resArrArr[1][1], resArrArr[2][1], resArrArr[3][1]];

      resArrArr.sort((a, b) => b[1] - a[1]);
      // if only one animal is voted, the second one is the one next to it
      let firstZodiac = resArrArr[0][0];
      let secZodiac = resArrArr[1][0];
      if (resArrArr[1][1] === 0) {
        secZodiac = (firstZodiac+1) % 4;
      }
      // let votedZodiac = [resArrArr[0][0], resArrArr[1][0]];
      let votedZodiac = [firstZodiac, secZodiac]
      console.log('voted zodiac: ', votedZodiac)
      let zodiacRes = [zodiac[curRoundIndex+1][votedZodiac[0]], zodiac[curRoundIndex+1][votedZodiac[1]]];


      docRef.update({
        ['zodiacRes.'+ curRoundIndex]: zodiacRes,
        ['votedZodiac.' + curRoundIndex]: votedZodiac,
        ['chipTotalRes.' + curRoundIndex]: chipTotalRes,
        ['voted.' + curRoundIndex]: true
      })
      .catch(error => console.log('error calculating votes, ', error))
    }

  }
}

export const evalEnd = () => {
  return (dispatch, getState) => {
    const roomid = getState().rooms.room;
    const docRef = database.collection('rooms').doc(roomid);
    let zodiacRes = {...getState().game.zodiacRes};
    let zodiacScore = getState().game.score;
    Object.keys(zodiacRes).forEach(key => {
      zodiacScore += zodiacRes[key].filter(el => el === true).length;
    });

    docRef.update({
      evalEnd: true,
      score: zodiacScore
    })
  }
}

export const calRecRes = (recRes, recIndex, curRole) => {
  return (dispatch, getState) => {
    const roomid = getState().rooms.room;
    const docRef = database.collection('rooms').doc(roomid);
    const playerIndex = getState().rooms.playerIndex;

    if (curRole === "老朝奉") {
      docRef.update({
        ['gameStates.'+playerIndex]: "已指认",
        recXuyuan: recRes
      })
    } else if (curRole === "药不然") {
        docRef.update({
          ['gameStates.'+playerIndex]: "已指认",
          recFangzhen: recRes
        })
    } else {
      docRef.update({
        ['gameStates.'+playerIndex]: "已指认",
        ['recLaochaofeng.' + curRole]: recIndex
      })
    }
    }
  }

export const calFinalRes = () => {
  return (dispatch, getState) => {
    const roomid = getState().rooms.room;
    const docRef = database.collection('rooms').doc(roomid);

    let recFangzhen = getState().game.recFangzhen;
    let recXuyuan = getState().game.recXuyuan;
    let recLaochaofeng = getState().game.recLaochaofeng;
    let score = getState().game.score;
    let recLaochaofengRes;

    console.log('rec results and prev eval res: ', recFangzhen, recXuyuan, recLaochaofeng, score);

    if (!recFangzhen) { score += 1};
    if (!recXuyuan) { score += 2};

    const playerNum = Object.keys(getState().game.players).length;
    const roles = getState().game.roles;

    let recLaochaofengFreq = new Array(playerNum).fill(0).map((el, index) => {
      return [index, 0]
    });

    console.log(recLaochaofengFreq);
    Object.keys(recLaochaofeng).forEach((key, index) => {
      let voteIndex = recLaochaofeng[key];
      console.log(voteIndex);
      recLaochaofengFreq[voteIndex][1] += 1
    })

    recLaochaofengFreq.sort((a, b) => b[1] - a[1]);
    console.log('rec laochaofeng arr after sort: ',recLaochaofengFreq);

    let firstVote = recLaochaofengFreq[0][1];
    let secondVote = recLaochaofengFreq[1][1];
    if (firstVote === secondVote) {
      if (roles[recLaochaofeng["许愿"]] === "老朝奉") {
        score += 1;
        recLaochaofengRes = true;
      } else {
        recLaochaofengRes = false;
      }
    } else if (roles[recLaochaofengFreq[0][0]] === "老朝奉") {
      score += 1;
      recLaochaofengRes = true;
    } else {
      recLaochaofengRes = false;
    }
    // if (Object.values(recLaochaofeng).reduce((acc, curr) => acc+curr, 0) > 2) { score += 1};

    console.log('cal final res:', {
      recFangzhen,
      recXuyuan,
      recLaochaofeng,
      score,
      recLaochaofengRes
    })

    docRef.update({
      score,
      finalRes: score >= 6 ? "好人阵营获胜" : "坏人阵营获胜",
      recEnd: true,
      recLaochaofengRes
    })}
}



export const newGame = () => {
  return (dispatch, getState) => {
    const roomid = getState().rooms.room;
    const docRef = database.collection('rooms').doc(roomid);
    const playerIndex = getState().rooms.playerIndex;

    docRef.update({
      ['gameStates.'+ playerIndex]: "等待中"
    })
  }
}


export const updateGameStates = (data) => {
  console.log('update the game state in redux', data);
  return {
    type: 'UPDATE_GAME_STATES',
    ...data
  }
}

