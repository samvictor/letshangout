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
            //const code = getCodeFromUserInput();
            console.log('get code from user');
            // If MFA is enabled, sign-in should be confirmed with the confirmation code
            //const loggedUser = await Auth.confirmSignIn(
            ///    user,   // Return object from Auth.signIn()
            //    code,   // Confirmation code
            //    mfaType // MFA Type e.g. SMS_MFA, SOFTWARE_TOKEN_MFA
            //);
        } else if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
            const {requiredAttributes} = user.challengeParam; // the array of required attributes, e.g ['email', 'phone_number']
            // You need to get the new password and required attributes from the UI inputs
            // and then trigger the following function with a button click
            // For example, the email and phone_number are required attributes

            console.log('new password');
            //const {username, email, phone_number} = getInfoFromUserInput();
            //const loggedUser = await Auth.completeNewPassword(
            //     user,              // the Cognito User Object
            //     newPassword,       // the new password
            //     // OPTIONAL, the required attributes
            //     {
            //         email,
            //         phone_number,
            //     }
            // );
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
// For advanced usage
// You can pass an object which has the username, password and validationData which is sent to a PreAuthentication Lambda trigger
// Auth.signIn({
//     username, // Required, the username
//     password, // Optional, the password
//     validationData, // Optional, a random key-value pair map which can contain any key and will be passed to your PreAuthentication Lambda trigger as-is. It can be used to implement additional validations around authentication
// }).then(user => console.log(user))
// .catch(err => console.log(err));

let data_fetched = false;
let todo_list = [];

function App() {
  // using updater to avoid race conditions involved with using state
  // with the subscriptions in useEffect, it uses only the initial value of states
  const [todo_list_updater, set_todo_list_updater] = useState(0);
  let [test, set_test] = useState('first');
  const [todo_list_state, set_todo_list_state] = useState([]);

  let local_todo = [];
  let test_local = 'first';

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
          todo_list = from_server.data.listTodos.items;
          //set_todo_list_updater(todo_list_updater + 1);
          local_todo = from_server.data.listTodos.items;
          set_todo_list_state(from_server.data.listTodos.items);
          set_test('fetch')
          test_local = 'fetch';
          console.log('doing fetch')

        });
    }
  }, []);

  useEffect(() => {
    console.log('todo list updated', todo_list);
    console.log('test from todo effect', test);
  }, [todo_list])

  useEffect(() => {
    // set up subscriptions for any changes in data
    // only runs once, and return only runs on unmount

    const todo_create_sub = API.graphql(graphqlOperation(subscriptions.onCreateTodo))
      .subscribe({
        next: (todoData) => {
          let test_state_fn = test => test + ' ';
          let test_state = test_state_fn();
          console.log(local_todo, 'local todo');
          const new_todo = todoData.value.data.onCreateTodo;
          console.log(test_state, 'test');
          console.log(test_local, 'test local')
          console.log(todo_list, 'old todo list');
          console.log(todo_list.concat(new_todo), 'should be new list')
          todo_list = todo_list.concat(new_todo);
          //set_todo_list_updater(todo_list_updater => todo_list_updater + 1);
          set_todo_list_state(todo_list_state => todo_list_state.concat(new_todo));
          console.log(new_todo, 'create');
          let return_me = (val) => val;
          console.log(return_me(todo_list_state), 'todo list state');
        }
      });

    const todo_update_sub = API.graphql(graphqlOperation(subscriptions.onUpdateTodo))
      .subscribe({
        next: (todoData) => {
          console.log(todoData, 'update');
        }
      });

    const todo_delete_sub = API.graphql(graphqlOperation(subscriptions.onDeleteTodo))
      .subscribe({
        next: (todoData) => {
          console.log(todoData, 'delete');
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

    const newTodo = await API.graphql(graphqlOperation(mutations.createTodo, todoDetails));
    alert(JSON.stringify(newTodo));
  };

  const listQuery = async () => {
    console.log('listing todos');
    const allTodos = await API.graphql(graphqlOperation(queries.listTodos));
    alert(JSON.stringify(allTodos));
  };

  const todo_xml = [];
  todo_list_state.forEach((todo_from_state) => {
    todo_xml.push(
      <div>
        <h4>{todo_from_state.name}</h4>
        <t>{todo_from_state.description}</t>
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
