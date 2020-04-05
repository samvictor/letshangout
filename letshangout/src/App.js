import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import Amplify, { Analytics, Storage, API, graphqlOperation, Auth} from 'aws-amplify';
import awsconfig from './aws-exports';
// eslint-disable-next-line
import { withAuthenticator } from 'aws-amplify-react';
import '@aws-amplify/ui/dist/style.css';
import * as queries from './graphql/queries';
import * as mutations from './graphql/mutations';
import * as subscriptions from './graphql/subscriptions';

Amplify.configure(awsconfig);


async function public_signin() {
    try {
        const user = await Auth.signIn('public', 'public123');
        if (user.challengeName === 'SMS_MFA' ||
            user.challengeName === 'SOFTWARE_TOKEN_MFA') {
            // You need to get the code from the UI inputs
            // and then trigger the following function with a button click
            console.log('get code from user');
        } else if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
            const {requiredAttributes} = user.challengeParam; // the array of required attributes, e.g ['email', 'phone_number']
            // You need to get the new password and required attributes from the UI inputs
            // and then trigger the following function with a button click
            // For example, the email and phone_number are required attributes

            console.log('new password');
        } else if (user.challengeName === 'MFA_SETUP') {
            // This happens when the MFA method is TOTP
            // The user needs to setup the TOTP before using it
            // More info please check the Enabling MFA part
            Auth.setupTOTP(user);
        } else {
            // The user directly signs in
            console.log('user signed in', user);
            if (user.pool.userPoolId === 'us-east-1_R9dYOGAfj')
              console.log('this is the public user');

        }
    } catch (err) {
        if (err.code === 'UserNotConfirmedException') {
            // The error happens if the user didn't finish the confirmation step when signing up
            // In this case you need to resend the code and confirm the user
            // About how to resend the code and confirm the user, please check the signUp part
        } else if (err.code === 'PasswordResetRequiredException') {
            // The error happens when the password is reset in the Cognito console
            // In this case you need to call forgotPassword to reset the password
            // Please check the Forgot Password part.
        } else if (err.code === 'NotAuthorizedException') {
            // The error happens when the incorrect password is provided
        } else if (err.code === 'UserNotFoundException') {
            // The error happens when the supplied username/email does not exist in the Cognito user pool
        } else {
            console.log(err);
        }
    }
}


const update_todo = (todo_id) => {
  console.log('updating', todo_id);
  API.graphql(graphqlOperation(mutations.updateTodo, {input: {
    id: todo_id,
    //name: 'update' + ++counter,
    description: 'update number ' + counter++,
  }}));
};

const delete_todo = (todo_id) => {
  console.log('deleting', todo_id);
  API.graphql(graphqlOperation(mutations.deleteTodo, {input: {
    id: todo_id
  }}));
};


let data_fetched = false;
let counter = 0;


function App() {
  const [todo_list_state, set_todo_list_state] = useState([]);

  useEffect(() => {
    public_signin();
  }, []);

  useEffect(() => {
    // fetch data from server
    if (!data_fetched) {
      data_fetched = true;
      API.graphql(graphqlOperation(queries.listTodos))
        .then((from_server) => {
          console.log('from server', from_server)
          set_todo_list_state(from_server.data.listTodos.items);
        });
    }
  }, []);

  useEffect(() => {
    // set up subscriptions for any changes in data
    // only runs once, and return only runs on unmount

    const todo_create_sub = API.graphql(graphqlOperation(subscriptions.onCreateTodo))
      .subscribe({
        next: (todoData) => {
          const new_todo = todoData.value.data.onCreateTodo;
          // this is probably taking the current value of state and modifying it
          // we need to pass a function to avoid race condition
          set_todo_list_state(todo_list_state => todo_list_state.concat(new_todo));
          console.log(new_todo, 'create');

        }
      });

    const todo_update_sub = API.graphql(graphqlOperation(subscriptions.onUpdateTodo))
      .subscribe({
        next: (todoData) => {
          const updated_todo = todoData.value.data.onUpdateTodo;
          console.log(updated_todo, 'update');
          
          set_todo_list_state(todo_list_state => {
            // search list for id and update when id matches updated todo id
            const clone_todo_list = [...todo_list_state]; // clone
            clone_todo_list.forEach((todo={}, i) => {
              if (todo.id === updated_todo.id)
                clone_todo_list[i] = updated_todo;
            });
            
            return clone_todo_list;
          });
        }
      });

    const todo_delete_sub = API.graphql(graphqlOperation(subscriptions.onDeleteTodo))
      .subscribe({
        next: (todoData) => {
          const deleted_todo = todoData.value.data.onDeleteTodo;
          console.log(deleted_todo, 'delete');
          
          set_todo_list_state(todo_list_state => {
            // search list for id and remove
            const clone_todo_list = [...todo_list_state]; // clone
            clone_todo_list.forEach((todo={}, i) => {
              if (todo.id === deleted_todo.id)
                clone_todo_list.splice(i, 1);
            });
            
            return clone_todo_list;
          });
        }
      });

    return () => {
      todo_create_sub.unsubscribe();
      todo_update_sub.unsubscribe();
      todo_delete_sub.unsubscribe();
    };
  },
  []);

  const todoMutation = async () => {
    const todoDetails = {
      input: {
        name: 'Party tonight!',
        description: 'Amplify CLI rocks!'
      },
    };

    //const newTodo = await API.graphql(graphqlOperation(mutations.createTodo, todoDetails));
    API.graphql(graphqlOperation(mutations.createTodo, todoDetails));
    //alert(JSON.stringify(newTodo));
  };

  const listQuery = async () => {
    console.log('listing todos');
    const allTodos = await API.graphql(graphqlOperation(queries.listTodos));
    alert(JSON.stringify(allTodos));
  };

  const todo_xml = [];
  todo_list_state.forEach((todo_from_state={}) => {
    if (todo_from_state.id)
      todo_xml.push(
        <div>
          <h4>{todo_from_state.name}</h4>
          <div>{todo_from_state.description}</div>
          <sub>{todo_from_state.id}</sub>
          <button onClick={update_todo.bind(this, todo_from_state.id)}>update</button>
          <button onClick={delete_todo.bind(this, todo_from_state.id)}>delete</button>
        </div>
      );
  });


  let loading_xml = <h4>Loading...</h4>;

  if (data_fetched)
    loading_xml = null;

  return (
    <div className="App">
      <button onClick={listQuery}>GraphQL Query</button>
      <button onClick={todoMutation}>GraphQL Mutation</button>
      {todo_xml}
      {loading_xml}
    </div>
  );
}

//export default withAuthenticator(App, true);

export default App;
