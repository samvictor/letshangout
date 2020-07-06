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

export default function CreatePost() {
  let history = useHistory();
  
  const [new_post_title, set_new_post_title] = useState('');
  const [new_post_content, set_new_post_content] = useState('');
  
  const new_post_title_changed = (event) => {
    set_new_post_title(event.target.value);
  };
  const new_post_content_changed = (event) => {
    set_new_post_content(event.target.value);
  };
  const create_post_confirm = async () => {
    if (new_post_title.length < 1) {
      alert('No Title');
      return;
    }
    if (new_post_content.length < 1) {
      alert('No content');
      return;
    }
    
    
    const post = { 
      title: new_post_title , 
      content: new_post_content, 
      posted: (new Date()).toISOString(), 
    };
    console.log('new post', await API.graphql(graphqlOperation(createPost, { input: post })));
    // message -> posted
    history.push('/');
  };

  return (
    <div>
      <h2>Create Post</h2>
      <h4>Title</h4>
      <input placeholder="Title" value={new_post_title} onChange={new_post_title_changed}/>
      <h4>Content</h4>
      <textarea placeholder="Content" value={new_post_content} onChange={new_post_content_changed}/>
      <br/>
      <button onClick={create_post_confirm}>Post</button>
    </div>  
  );
}
