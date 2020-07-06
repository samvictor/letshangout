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
import {  listPosts, listUsers, listCalendarEntrys, getPost } from '../graphql/queries';
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
  const [post, set_post] = useState({});
  const {post_id} = useParams();
  
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
      // make sure you're not sending null as post_id
      const post_data = await API.graphql(graphqlOperation(getPost, {id: post_id}));
      
      //if (post_data.data.listPosts.items.length > 0)
        set_post(post_data.data.getPost);
      console.log('data', post_data.data.getPost);
    }
    getData();
    
    
    
  }, [logged_in_user, post_id]);
  
  
  return (
    <div>
      <sub>{post.id}</sub>
      <h3 key={post.id}>{post.title}</h3>  
      <p>{post.content}</p>
      <Link to={'/user/'+post.owner}><sub>{post.owner}</sub></Link>
      <p><sub>{JSON.stringify(post.author)}</sub></p>
      <p>{post.hidden}</p>
      <p>{post.createdAt}</p>
      <p>{post.posted}</p>
    </div>  
  );
}