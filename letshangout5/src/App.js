import React, { useEffect, useReducer, useState } from 'react';
import { withAuthenticator } from 'aws-amplify-react'; // or 'aws-amplify-react-native';
import Amplify, { Auth } from 'aws-amplify';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useHistory,
} from "react-router-dom";

import { createPost, createUser } from './graphql/mutations';
import {  listPosts, listUsers, listCalendarEntrys } from './graphql/queries';
import { onCreatePost } from './graphql/subscriptions';
import API, { graphqlOperation } from '@aws-amplify/api';
import PubSub from '@aws-amplify/pubsub';

import User from './screens/User';
import Home from './screens/Home';
import CreatePost from './screens/CreatePost';
import EditCalendar from './screens/EditCalendar';


import awsconfig from './aws-exports';
import './App.css';

// Configure Amplify
API.configure(awsconfig);
PubSub.configure(awsconfig);
Amplify.configure(awsconfig);

// Action Types
const QUERY = 'QUERY';
const SUBSCRIPTION = 'SUBSCRIPTION';

const initialState = {
  posts: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case QUERY:
      return {...state, posts: action.posts};
    case SUBSCRIPTION:
      return {...state, posts:[...state.posts, action.post]};
    default:
      return state;
  }
};




function App() {
  const [logged_in_user, set_logged_in_user] = useState(null);
  
  useEffect(() => {
    // effect for tracking signin
    async function check_for_user() {
      const user = await Auth.currentSession()
      .then(data => {console.log('user', data.idToken.payload); return data.idToken.payload})
      .catch(err => console.log(err));
      
      // if no user, redirect to signin
      
      user.name = user['cognito:username'];
      set_logged_in_user(user);
      
      // after login, check if there is a user entry for this user in the db
      // if not, create one. in the future, this should be done with lambda trigger
      API.graphql(graphqlOperation(listUsers, {filter: {owner: {eq: user.name}}}))
        .then(data => {
          // if length is greater than 1, merge. 
          // if length is 1, do nothing, 
          // if length is 0, make a new entry
          if (data.data.listUsers.items.length > 0)
            return;
            
          API.graphql(graphqlOperation(createUser, {input: {
            name: user.name,
            description: 'I\'m here, let\'s hang out!',
          }}))
          .then(new_user => console.log('new user', new_user));
          
        });
    }
    check_for_user();
  }, []);
  
  let user_link = null;
  let edit_cal_link = null;
  if (logged_in_user) {
    user_link = <Link to={"/user/"+logged_in_user.name}><button>{logged_in_user.name}</button></Link>;
    edit_cal_link = <Link to="/editcalendar"><button>My Calendar</button></Link>;
  }
    
  return (
    <Router>
      <div>
        <nav>
          <Link to="/"><button>Home</button></Link>
          {edit_cal_link}
          {user_link}
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/user/:username">
            <User />
          </Route>
          <Route path="/createpost">
            <CreatePost />
          </Route>
          <Route path="/editcalendar">
            <EditCalendar/>
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
        
        <div>version 0.1</div>
      </div>
    </Router>
  );
}




export default withAuthenticator(App, {// Render a sign out button once logged in
                includeGreetings: true });