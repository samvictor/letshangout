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

import { createPost, createUser } from '../graphql/mutations';
import {  listPosts, listUsers, listCalendarEntrys } from '../graphql/queries';
import { onCreatePost } from '../graphql/subscriptions';
import API, { graphqlOperation } from '@aws-amplify/api';
import PubSub from '@aws-amplify/pubsub';


import awsconfig from '../aws-exports';
import '../App.css';

// Configure Amplify
API.configure(awsconfig);
PubSub.configure(awsconfig);
Amplify.configure(awsconfig);



export default function User() {
  // in this case, logged_in_user is the currently logged in user
  const [logged_in_user, set_logged_in_user] = useState(null);
  const [posts, set_posts] = useState([]);
  const [user, set_user] = useState({});
  const {username} = useParams();
  
  useEffect(() => {
    // effect for tracking signin
    async function check_for_user() {
      const user = await Auth.currentSession()
      .then(data => {console.log('user', data.idToken.payload); return data.idToken.payload})
      .catch(err => console.log(err));
      
      // if no user, redirect to signin
      
      user.name = user['cognito:username'];
      
      set_logged_in_user(user);
    }
    check_for_user();
  }, []);
  
  useEffect(() => {
    if (logged_in_user ===  null) return;
    // now we are guarenteed to have a logged_in_user
    
    async function getData() {
      const postData = await API.graphql(graphqlOperation(listPosts, {filter: {owner: {eq: username}}}));
      set_posts(postData.data.listPosts.items);
      console.log('data', postData.data.listPosts.items);
      
      const user_data = await API.graphql(graphqlOperation(listUsers, {filter: {owner: {eq: username}}}));
      console.log('user data', user_data);
      if (user_data.data.listUsers.items.length > 0)
        set_user(user_data.data.listUsers.items[0]);
    }
    getData();
    
    
    
  }, [logged_in_user, username]);
  
  
  return (
    <div>
      <h2>{username}</h2>
      <div>{user.name}</div>
      <div>{user.description}</div>
      <div>calendar</div>
      <div>edit calendar</div>
      <Link to="/createpost"><button>create post</button></Link>
      <div>
        {posts.length > 0 ? 
          posts.map((post) => <div className="post_container" key={post.id}>
            <sub>{post.id}</sub>
            <h3 key={post.id}>{post.title}</h3>  
            <p>{post.content}</p>
            <sub>{post.owner}</sub>
            <p><sub>{JSON.stringify(post.author)}</sub></p>
            <p>{post.hidden}</p>
            <p>{post.createdAt}</p>
            <p>{post.posted}</p>
          </div>) :
          <p>Add some posts!</p> 
        }
      </div>
    </div>  
  );
}