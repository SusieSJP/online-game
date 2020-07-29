// room reducer
const roomInitState = {
  room: null,
  players: [],
  pwd: null,
  roles: [],
  roomPwdPairs: {}
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
  totalGames: 0,
  winGames: 0,
}

export const userReducer = (state = userInitState, action) => {
  switch (action.type) {
    case 'USER_LOGIN':
      return {
        ...state,
        user: action.userEmail,
      }
    default:
      return state
  }
}
