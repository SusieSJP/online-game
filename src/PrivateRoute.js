import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

export const PrivateRoute = ({
  isAuthenticated,
  roomAlreadySet,
  component: Component,
  ...rest
}) => {
  return (
    <Route {...rest} component={(props) => (
      isAuthenticated ?
      <Component {...props}/> :
      <Redirect to="/" />
    )}/>
  )
};

const mapStateToProps = (state) => ({
  isAuthenticated: !!state.users.user,
  roomAlreadySet: state.rooms.room
});

export default connect(mapStateToProps)(PrivateRoute);
