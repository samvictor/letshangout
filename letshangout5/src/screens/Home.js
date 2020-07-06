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

export default function Home() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [logged_in_user, set_logged_in_user] = useState(null);
  //let logged_in_user = null;
  
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
      const postData = await API.graphql(graphqlOperation(listPosts));
      dispatch({ type: QUERY, posts: postData.data.listPosts.items });
      console.log('data', postData.data.listPosts.items)
    }
    getData();
    
    const subscription = API.graphql(graphqlOperation(onCreatePost, 
                         {owner: logged_in_user.name})).subscribe({
      next: (eventData) => {
        const post = eventData.value.data.onCreatePost;
        dispatch({ type: SUBSCRIPTION, post });
      }
    });  
    
    

    return () => subscription.unsubscribe();
  }, [logged_in_user]);

  return (
    <div>
      <h2>Home</h2>
      <Link to="/createpost"><button>create post</button></Link>
      <div>
        {state.posts.length > 0 ? 
          state.posts.map((post) => <div className="post_container" key={post.id}>
            <sub>{post.id}</sub>
            <h3 key={post.id}>{post.title}</h3>  
            <p>{post.content}</p>
            <Link to={'/user/'+post.owner}><sub>{post.owner}</sub></Link>
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
