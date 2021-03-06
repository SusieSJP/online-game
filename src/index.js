import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { saveData } from './redux/localStorage';

import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { Provider } from 'react-redux';
import configureStore from './redux/store';

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

store.subscribe(() => {
  // save data and auto expire in 6 hours
  saveData({
    rooms: store.getState().rooms,
    users: store.getState().users
  }, 36*6*100000)
})

// auth.onAuthStateChanged((user) => {
//   if (user) {
//     console.log('on auth changed - user: ', user.email);
//     store.dispatch(setUserInfo(user.email))
//   } else {
//     history.push("/")
//   }
// })


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
