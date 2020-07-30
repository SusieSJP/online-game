// room reducer
const roomInitState = {
  room: null,
  players: [],
  pwd: null,
  roles: [],
  roomPwdPairs: {},
  availableRooms: {},
  chips: [],
  photos: [],
  curNum: 0,
  isFull: false
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
    case 'CREATE_ROOM':
      return {
        ...state,
        room: action.roomid,
        players: action.players,
        pwd: action.pwd,
        roles: action.roles,
        chips: action.chips,
        photos: action.photos,
        curNum: 1,
        isFull: false
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
        roomPwdPairs: action.roomPwdPairs,
        isFull: false
      }
    case 'ENTER_ROOM':
      return {
        ...state,
        players: action.players,
        photos: action.photos,
        curNum: action.curNum,
        isFull: action.isFull,
        room: action.room,
        pwd: action.pwd,
        chips: action.chips,
        roles: action.roles
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
