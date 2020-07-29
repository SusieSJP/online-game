// room reducer
const roomInitState = {
  room: null,
  players: [],
  pwd: null,
  roles: [],
  roomPwdPairs: {},
  chips: [],
  photos: [],
  curNum: 0
}

export const roomReducer = (state = roomInitState, action) => {
  switch (action.type) {
    case 'LOAD_ROOMS':
      return {
        ...state,
        roomPwdPairs: action.rooms
      }
    case 'CREATE_ROOM':
      return {
        ...state,
        room: action.roomid,
        players: action.players,
        pwd: action.pwd,
        roles: action.roles,
        chips: action.chips,
        photos: action.photos,
        curNum: action.curNum
      }
    case 'LEAVE_ROOM':
      return {
        ...state,
        room: action.room,
        players: action.players,
        pwd: action.pwd,
        roles: action.roles,
        chips: action.chips,
        photos: action.photos,
        curNum: action.curNum,
        roomPwdPairs: action.roomPwdPairs
      }
    default:
      return state;
  }
}





// ************ user reducer
const userInitState = {
  user: null, // user would be identified using email
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
        winGame: action.winGame
      }
    default:
      return state
  }
}
