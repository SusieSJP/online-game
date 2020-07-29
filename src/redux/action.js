import { database, auth, provider } from '../firebase/firebase';


/*
********* user actions ***********
*/

// 1. login and add current user
export const userLogin = (userEmail, photoURL) => {
  let docRef = database.collection('users').doc(userEmail);
  docRef.get().then(doc => {
    if (doc.exists) {
      console.log('returnning user!');
    } else {
      console.log('new user registered');
      docRef.set({
        email: userEmail,
        photo: photoURL,
        totalGame: 0,
        winGame: 0
      }).catch(error => console.log('error adding new user to firebase: ', error));
    }
  });

  return {
    type: 'USER_LOGIN',
    userEmail
  }
}

export const startLogin = () => {
  return (dispatch) => {
    auth.signInWithPopup(provider).then((result) => {
      console.log('user login: ', result.user);
      dispatch(userLogin(result.user.email, result.user.photoURL));
    }).catch(error => console.log('error logging in with Google', error))
  }
}

// 2. get user Info
// export const startLoadUser = (userEmail) => {
//   return (dispatch, getState) => {
//     const
//   }
// }




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
export const createRoom = (roomid, pwd, roles, players) => ({
  type: 'CREATE_ROOM',
  roomid,
  pwd,
  roles,
  players
})

export const startCreateRoom = ({newId, newPwd, roles, roomType} = {}) => {
  return (dispatch, getState) => {
    let curUser = getState().users.user;
    let players = new Array(roles.length).fill("");
    players[0] = curUser;

    console.log({
      newId,
      newPwd,
      roles,
      roomType,
      players
    })

    database.collection('rooms').doc(newId).set({
      isStarted: false,
      players,
      pwd: newPwd,
      roles,
      roomType
    }).then(() => {
      dispatch(createRoom(newId, newPwd, roles, players))
    })
  }
}
