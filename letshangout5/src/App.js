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
      <div className="App">
        <button onClick={createSamplePosts}>Add post</button>
      </div>
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


function User() {
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


// map number to text. eq. 1 -> Sun, 2 -> Mon
const day_to_text = [ null,
  {short: 'Sun', long: 'Sunday'},
  {short: 'Mon', long: 'Monday'},
  {short: 'Tue', long: 'Tuesday'},
  {short: 'Wed', long: 'Wednesday'},
  {short: 'Thu', long: 'Thursday'},
  {short: 'Fri', long: 'Friday'},
  {short: 'Sat', long: 'Saturday'},
];
function EditCalendar() {
  let history = useHistory();
  
  
  const [creating_freetime, set_creating_freetime] = useState({
                                                      creating: false, 
                                                      days_of_the_week: [],
                                                    });
  
  const [logged_in_user, set_logged_in_user] = useState(null);
  const [logged_in_user_calendar, set_logged_in_user_calendar] = useState(null);
  const [calendar_entries, set_calendar_entries] = useState([]);
  const [user, set_user] = useState({});
  
  useEffect(() => {
    // effect for tracking signin
    async function check_for_user() {
      const user = await Auth.currentSession()
      .then(data => {console.log('user', data.idToken.payload); return data.idToken.payload})
      .catch(err => console.log(err));
      
      // if no user, redirect to signin
      
      set_logged_in_user(user);
    }
    check_for_user();
  }, []);
  
  useEffect(() => {
    // effect for loading data
    if (logged_in_user ===  null) return;
    // now we are guarenteed to have a logged_in_user
    
    async function getData() {
      const calendar_entries = await API.graphql(graphqlOperation(listCalendarEntrys, {filter: {owner: {eq: logged_in_user.name}}}));
      set_calendar_entries(calendar_entries.data.listCalendarEntrys.items);
      console.log('data', calendar_entries.data.listCalendarEntrys.items);
      
      const user_data = await API.graphql(graphqlOperation(listUsers, {filter: {owner: {eq: logged_in_user.name}}}));
      console.log('user data', user_data);
      if (user_data.data.listUsers.items.length > 0)
        set_user(user_data.data.listUsers.items[0]);
    }
    getData();
    
  }, [logged_in_user]);
  
  const create_post_confirm = async () => {
    const post = null;
    console.log('new post', await API.graphql(graphqlOperation(createPost, { input: post })));
    // message -> posted
    history.push('/');
  };
  
  const new_freetime_clicked = () => {
    set_creating_freetime({...creating_freetime, creating: true});
  };
  
  
  const [new_picker_days, set_new_picker_days] = useState([]);
  const [new_picker_times, set_new_picker_times] = useState({
                                    start: {hour: 12, minute: 0, am: true}, 
                                    end: {hour: 12, minute: 0, am: true}
                                  });
  
  if (!logged_in_user) {
    // no one logged in
    return <div>Please login first</div>;
  }
  
  // now there is guaranteed to be a user logged in
  
  let create_freetime = <div>
    New Free Time
    <button onClick={new_freetime_clicked}>+</button>
  </div>;
  
  
  const new_picker_day_clicked = (day_int) => {
    if (new_picker_days.includes(day_int)) {
      const temp_days_list = [...new_picker_days];
      for( let i = temp_days_list.length - 1; i >= 0; i--){ 
        if ( temp_days_list[i] === day_int) { 
          temp_days_list.splice(i, 1); 
        }
        set_new_picker_days(temp_days_list);
      }
    }
    else
      set_new_picker_days([...new_picker_days, day_int]);
  };
  
  if (creating_freetime.creating) {
    const day_picker = [];
    
    for (let i = 1; i < 8; i++) {
      day_picker.push(<div key={'newdaypicker'+i}  className='picker_day'
          onClick={new_picker_day_clicked.bind(this, i)}>
        {(new_picker_days.includes(i))  ?
          <input type='checkbox' checked/> :
          <input type='checkbox'/>}
        {day_to_text[i].short}
      </div>);
    }
    
    console.log('picked days', new_picker_days);
    const handleChange = (event) => {
      const temp_new_picker_times = {...new_picker_times};
      
      // formating for hours or minutes
      let time_string = event.target.value.replace(/[^0-9]/g, "");
      time_string = time_string.slice(-2);
      
      let time_int = parseInt(time_string);  
      if (time_int > 12)
        // if more than 12, remove first number. 36 -> 6
        time_int = time_int % 10;
      if (time_int < 1)
        time_int = 1;
        
      temp_new_picker_times.start.hour = time_int;  
      
      set_new_picker_times(temp_new_picker_times);
    };
    
    create_freetime = <div>
      days of the week this applies to:
      <div>{day_picker}</div>
      Times:
      <br/>
      <div style={{display:"inline-block", border: "solid 1px black"}}>
        start
        <input value={new_picker_times.start.hour} onChange={handleChange} /> 
        : 
        <input value={('0'+new_picker_times.start.minute).slice(-2)}/>
      </div>
      <div style={{ display:"inline-block", border: "solid 1px black"}}>
        end
      </div>  
    </div>;
  }  
    
  return (
    <div>
      <h2>Edit Calendar</h2>
      <h4>When are you free?</h4>      
      <div>list of free times</div>
      {create_freetime}
      <h4>Calendar</h4>
      <div>calendar as it now stands, sun - sat</div>
      <br/>
      <button>Confirm</button>
    </div>  
  );
}

export default withAuthenticator(App, {// Render a sign out button once logged in
                includeGreetings: true });