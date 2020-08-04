import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { roomReducer, userReducer, gameReducer } from './reducer';


// Store creation
export default () => {
  const store = createStore(
    // call the function with argument of object - key value pairs
    // key is the root state name and the value is the reducer that manages that state
    combineReducers({
      rooms: roomReducer,
      users: userReducer,
      game: gameReducer
    }),
    applyMiddleware(thunk)
  );

  return store;
};
