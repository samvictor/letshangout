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

import { createPost } from './graphql/mutations';
import {  listPosts } from './graphql/queries';
import { onCreatePost } from './graphql/subscriptions';
import API, { graphqlOperation } from '@aws-amplify/api';
import PubSub from '@aws-amplify/pubsub';


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



async function createSamplePosts() {
  const post = { title: "Use AWS AppSync" , content: "Realtime and Offline", posted: (new Date()).toISOString() };
  console.log(await API.graphql(graphqlOperation(createPost, { input: post })));
}

function Home() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [current_user, set_current_user] = useState(null);
  //let current_user = null;
  
  useEffect(() => {
    // effect for tracking signin
    async function check_for_user() {
      const user = await Auth.currentSession()
      .then(data => {console.log('user', data.idToken.payload); return data.idToken.payload})
      .catch(err => console.log(err));
      
      // if no user, redirect to signin
      
      set_current_user(user);
    }
    check_for_user();
  }, []);
  
  useEffect(() => {
    if (current_user ===  null) return;
    // now we are guarenteed to have a current_user
    
    async function getData() {
      const postData = await API.graphql(graphqlOperation(listPosts));
      dispatch({ type: QUERY, posts: postData.data.listPosts.items });
      console.log('data', postData.data.listPosts.items)
    }
    getData();
    
    const subscription = API.graphql(graphqlOperation(onCreatePost, 
                         {owner: current_user['cognito:username']})).subscribe({
      next: (eventData) => {
        const post = eventData.value.data.onCreatePost;
        dispatch({ type: SUBSCRIPTION, post });
      }
    });  
    
    

    return () => subscription.unsubscribe();
  }, [current_user]);

  return (
    <div>
      <h2>Home</h2>
      <Link to="/createpost"><button>create post</button></Link>
      <div className="App">
        <button onClick={createSamplePosts}>Add post</button>
      </div>
      <div>
        {state.posts.length > 0 ? 
          state.posts.map((post) => <div className="post_container">
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

function App() {
  const [current_user, set_current_user] = useState(null);
  
  useEffect(() => {
    // effect for tracking signin
    async function check_for_user() {
      const user = await Auth.currentSession()
      .then(data => {console.log('user', data.idToken.payload); return data.idToken.payload})
      .catch(err => console.log(err));
      
      // if no user, redirect to signin
      
      set_current_user(user);
    }
    check_for_user();
  }, []);
  
  let user_link = null;
  if (current_user)
    user_link = <Link to={"/user/"+current_user['cognito:username']}><button>{current_user['cognito:username']}</button></Link>;
    
  return (
    <Router>
      <div>
        <nav>
          <Link to="/"><button>Home</button></Link>
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
          <Route path="/">
            <Home />
          </Route>
        </Switch>
        
        <div>version 0.1</div>
      </div>
    </Router>
  );
}


function User() {
  const [current_user, set_current_user] = useState(null);
  const [posts, set_posts] = useState([]);
  const {username} = useParams();
  
  useEffect(() => {
    // effect for tracking signin
    async function check_for_user() {
      const user = await Auth.currentSession()
      .then(data => {console.log('user', data.idToken.payload); return data.idToken.payload})
      .catch(err => console.log(err));
      
      // if no user, redirect to signin
      
      set_current_user(user);
    }
    check_for_user();
  }, []);
  
  useEffect(() => {
    if (current_user ===  null) return;
    // now we are guarenteed to have a current_user
    
    async function getData() {
      const postData = await API.graphql(graphqlOperation(listPosts, {filter: {owner: {eq: username}}}));
      set_posts(postData.data.listPosts.items);
      console.log('data', postData.data.listPosts.items)
    }
    getData();
    
  }, [current_user, username]);
  
  
  return (
    <div>
      <h2>{username}</h2>
      <div>description</div>
      <div>calendar</div>
      <div>edit calendar</div>
      <Link to="/createpost"><button>create post</button></Link>
      <div>
        {posts.length > 0 ? 
          posts.map((post) => <div className="post_container">
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




function CreatePost() {
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

export default withAuthenticator(App, {// Render a sign out button once logged in
                includeGreetings: true });