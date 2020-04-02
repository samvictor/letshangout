import React from 'react';
import logo from './logo.svg';
import './App.css';
import Amplify, { Analytics, Storage, API, graphqlOperation } from 'aws-amplify';
import awsconfig from './aws-exports';
// eslint-disable-next-line
import { withAuthenticator } from 'aws-amplify-react';
import '@aws-amplify/ui/dist/style.css';

Amplify.configure(awsconfig);


const listTodos = `query listTodos {
  listTodos{
    items{
      id
      name
      description
    }
  }
}`;

const addTodo = `mutation createTodo($name:String! $description: String!) {
  createTodo(input:{
    name:$name
    description:$description
  }){
    id
    name
    description
  }
}`;

function App() {

  const todoMutation = async () => {
    const todoDetails = {
      name: 'Party tonight!',
      description: 'Amplify CLI rocks!'
    };

    const newTodo = await API.graphql(graphqlOperation(addTodo, todoDetails));
    alert(JSON.stringify(newTodo));
  };

  const listQuery = async () => {
    console.log('listing todos');
    const allTodos = await API.graphql(graphqlOperation(listTodos));
    alert(JSON.stringify(allTodos));
  };

  return (
    <div className="App">
      <button onClick={listQuery}>GraphQL Query</button>
      <button onClick={todoMutation}>GraphQL Mutation</button>
    </div>
  );
}

export default withAuthenticator(App, true);

//export default App;
