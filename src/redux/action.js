import { database, auth, provider } from '../firebase/firebase';


/*
********* user actions ***********
*/

// 1. login and add current user
export const userLogin = (userEmail, photoURL, totalGame, winGame) => {
  return {
    type: 'USER_LOGIN',
    userEmail,
    photoURL,
    totalGame,
    winGame
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
          dispatch(userLogin(doc.id, doc.data().photo, doc.data().totalGame, doc.data().winGame))
        } else {
          console.log('new user registered');
          docRef.set({
            email: result.user.email,
            photo: result.user.photoURL,
            totalGame: 0,
            winGame: 0
          }).then(() => {
            dispatch(userLogin(result.user.email, result.user.photoURL, 0, 0))
          }).catch(error => console.log('error adding new user to firebase: ', error));
        }
      })
  })};
}



/*
********* room actions ***********
*/

// 1. load active room
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

      console.log('loaded active rooms pairs:', activeRooms);
      dispatch(loadRoom(activeRooms));

    }).catch((error) => {console.log("error getting rooms data: ", error)})
  }
}

//2. create new room
export const createRoom = (roomid, pwd, roles, players, chips, photos) => ({
  type: 'CREATE_ROOM',
  roomid,
  pwd,
  roles,
  players,
  chips,
  photos,
  curNum: 1
})

export const startCreateRoom = ({newId, newPwd, roles, roomType} = {}) => {
  return (dispatch, getState) => {
    let curUser = getState().users.user;
    let curUserPhotoURL = getState().users.photo;
    console.log('photo url from action:', curUserPhotoURL);

    let players = new Array(roles.length).fill("");
    let photos = new Array(roles.length).fill("");
    let chips = new Array(roles.length).fill(6);

    players[0] = curUser;
    photos[0] = curUserPhotoURL;

    console.log(
      {
        isStarted: false,
        players,
        pwd: newPwd,
        roles,
        roomType,
        chips,
        photos
      })

    database.collection('rooms').doc(newId).set({
      isStarted: false,
      players,
      pwd: newPwd,
      roles,
      roomType,
      chips,
      photos,
      curNum: 1
    }).then(() => {
      dispatch(createRoom(newId, newPwd, roles, players, chips, photos))
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

    if (remainingPlayers) {
      // if there is still someone in the room
      dispatch(leaveRoom());
    } else {
      // delete the room
      database.collection('rooms').doc(curRoom).delete().then(() => {
        dispatch(leaveRoom());
      })
    }
  }
}
