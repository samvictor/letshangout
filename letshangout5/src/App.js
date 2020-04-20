import React, { useEffect, useReducer, useState } from 'react';
import { withAuthenticator } from 'aws-amplify-react'; // or 'aws-amplify-react-native';
import Amplify, { Auth } from 'aws-amplify';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from "react-router-dom";

import { createTodo } from './graphql/mutations';
import { listTodos } from './graphql/queries';
import { onCreateTodo } from './graphql/subscriptions';
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
  todos: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case QUERY:
      return {...state, todos: action.todos};
    case SUBSCRIPTION:
      return {...state, todos:[...state.todos, action.todo]};
    default:
      return state;
  }
};



async function createNewTodo() {
  const todo = { name: "Use AWS AppSync" , description: "Realtime and Offline" };
  console.log(await API.graphql(graphqlOperation(createTodo, { input: todo })));
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
      const todoData = await API.graphql(graphqlOperation(listTodos));
      dispatch({ type: QUERY, todos: todoData.data.listTodos.items });
    }
    getData();
    
    const subscription = API.graphql(graphqlOperation(onCreateTodo, {owner: current_user['cognito:username']})).subscribe({
      next: (eventData) => {
        const todo = eventData.value.data.onCreateTodo;
        dispatch({ type: SUBSCRIPTION, todo });
      }
    });  
    
    

    return () => subscription.unsubscribe();
  }, [current_user]);

  return (
    <div>
      <h2>Home</h2>
      <div>create post</div>
      <div className="App">
        <button onClick={createNewTodo}>Add Todo</button>
      </div>
      <div>
        {state.todos.length > 0 ? 
          state.todos.map((todo) => <p key={todo.id}>{todo.name} : {todo.description}</p>) :
          <p>Add some todos!</p> 
        }
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div>
        <nav>
          <Link to="/"><button>Home</button></Link>
          <Link to="/user/sam"><button>User</button></Link>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/user/:username">
            <User />
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
  const {username} = useParams();
  return (
    <div>
      <h2>{username}</h2>
      <div>description</div>
      <div>calendar</div>
      <div>edit calendar</div>
      <div>new post</div>
      <div>posts</div>
    </div>  
  );
}


export default withAuthenticator(App, {// Render a sign out button once logged in
                includeGreetings: true });