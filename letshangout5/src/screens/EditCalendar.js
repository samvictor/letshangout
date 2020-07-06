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
export default function EditCalendar() {
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