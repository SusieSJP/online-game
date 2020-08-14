// room reducer
// const roomInitState = {
//   room: null,
//   players: [], // email identifiers
//   names:[],
//   pwd: null,
//   roles: [],
//   roomPwdPairs: {},
//   availableRooms: {},
//   chips: [],
//   photos: [],
//   curNum: 0,
//   isFull: false,
//   gameStates: {},
//   host: null,
//   canStart: false,
//   started: false,
//   curRound: 0
// }

const roomInitState = {
  room: null,
  playerIndex: null,
  pwd: null,
  roles: [],
  roomPwdPairs: {},
  availableRooms: {},
  // curRound: 0,
  zodiac: {},
  redirectTo: null,
}

export const roomReducer = (state = roomInitState, action) => {
  switch (action.type) {
    case 'LOAD_ROOMS':
      return {
        ...state,
        roomPwdPairs: action.rooms
      }
    case 'LOAD_AVAILABLE_ROOMS':
      return {
        ...state,
        availableRooms: action.rooms
      }
    case 'REDIRECT':
      return {
        ...state,
        redirectTo: action.redirectTo
      }
    case 'CREATE_ROOM':
      return {
        ...state,
        room: action.roomid,
        playerIndex: 0,
        pwd: action.pwd,
        roles: action.roles,
        zodiac: action.zodiac
      }
    case 'REPLAY':
      console.log('replay to update the rooms state:', action.roles, action.zodiac)
      return {
        ...state,
        roles: action.roles,
        zodiac: action.zodiac
      }
    case 'LEAVE_ROOM':
      return {
        ...state,
        room: null,
        playerIndex: null,
        pwd: null,
        roles: [],
      }
    case 'ENTER_ROOM':
      return {
        ...state,
        room: action.room,
        pwd: action.pwd,
        playerIndex: action.playerIndex,
        roles: action.roles,
        zodiac: action.zodiac
      }
    case 'GET_READY':
      return {
        ...state,
        gameStates: action.gameStates,
        canStart: action.canStart
      }
    case 'NOT_READY':
      return {
        ...state,
        gameStates: action.gameStates,
        canStart: action.canStart
      }
    case 'GET_START':
      return {
        ...state,
        started: true,
        // curRound: 1
      }
    // case 'SET_NEXT_ROUND':
    //   return {
    //     ...state,
    //     curRound: action.nextRound
    //   }
    default:
      return state;
  }
}


// ************ game reducer
const gameInitState = {
  curRound: 0,
  score: 0,
  evalEnd: false,
  recEnd: false,
  recLaochaofeng: [],
  recXuyuan: null,
  recFangzhen: null,
  finalRes: null,
  doneViewModal: {},

  voted: {
    0: false,
    1: false,
    2: false,
  },
  evalOrder: {
    0: [],
    1: [],
    2: []
  },
  votedZodiac: {
    0: [],
    1: [],
    2: []
  },
  zodiacRes: {
    0: [],
    1: [],
    2: []
  },
  // chipRes: {
  //   0: {
  //     0: [0,0,0,0],
  //     1: [0,0,0,0],
  //     2: [0,0,0,0],
  //     3: [0,0,0,0],
  //     4: [0,0,0,0],
  //     5: [0,0,0,0],
  //   },
  //   1: {
  //     0: [0,0,0,0],
  //     1: [0,0,0,0],
  //     2: [0,0,0,0],
  //     3: [0,0,0,0],
  //     4: [0,0,0,0],
  //     5: [0,0,0,0],
  //   },
  //   2: {
  //     0: [0,0,0,0],
  //     1: [0,0,0,0],
  //     2: [0,0,0,0],
  //     3: [0,0,0,0],
  //     4: [0,0,0,0],
  //     5: [0,0,0,0],
  //   }
  // },
  chipTotalRes: {
    0: [],
    1: [],
    2: []
  },
}

export const gameReducer = (state = gameInitState, action) => {
  switch (action.type) {
    case 'UPDATE_GAME_STATES':
      return {
        ...state,
        curRound: action.curRound,
        gameStates: action.gameStates,
        players: action.players,
        photos: action.photos,
        canStart: action.canStart,
        chips: action.chips,
        started: action.started,
        names: action.names,
        canEval: action.canEval,
        tfChanged: action.tfChanged,
        loseEvalHuang: action.loseEvalHuang,
        loseEvalMuhu: action.loseEvalMuhu,
        evalOrder: action.evalOrder ? action.evalOrder : gameInitState.evalOrder,
        chatOrder: action.chatOrder ? action.chatOrder : [],
        curChatIndex: action.curChatIndex,
        voted: action.voted ? action.voted : gameInitState.voted,
        zodiacRes: action.zodiacRes ? action.zodiacRes : gameInitState.zodiacRes,
        votedZodiac: action.votedZodiac ? action.votedZodiac : gameInitState.votedZodiac,
        chipTotalRes: action.chipTotalRes ? action.chipTotalRes : gameInitState.chipTotalRes,
        evalEnd: action.evalEnd,
        score: action.score ? action.score : gameInitState.score,
        recFangzhen: action.recFangzhen,
        recLaochaofeng: action.recLaochaofeng ? action.recLaochaofeng : gameInitState.recLaochaofeng,
        recXuyuan: action.recXuyuan,
        recEnd: action.recEnd,
        doneViewModal: action.doneViewModal ? action.doneViewModal : gameInitState.doneViewModal,
        chipRes: action.chipRes,
        finalRes: action.finalRes,
        protectedZodiac: action.protectedZodiac
      }
    default:
      return state
  }
}



// ************ user reducer
const userInitState = {
  user: null, // user would be identified using email
  name: "玩家",
  photo: null,
  totalGame: 0,
  winGame: 0,
}

export const userReducer = (state = userInitState, action) => {
  switch (action.type) {
    case 'USER_LOGIN':
      return {
        ...state,
        user: action.userEmail,
        photo: action.photoURL,
        totalGame: action.totalGame,
        winGame: action.winGame,
        name: action.name
      }
    case 'SET_DEFAULT_PHOTO':
      return {
        ...state,
        defaultPhoto: action.url
      }
    default:
      return state
  }
}
