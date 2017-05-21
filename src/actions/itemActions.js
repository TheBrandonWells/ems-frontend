import moment from 'moment';
import axios from 'axios';
import { API_URL,
         STORY_DELETED,
         STORY_DELETE_REJECTED,
         STORY_UPDATED,
         STORY_UPDATE_REJECTED,
         STORY_ADDED,
         STORY_ADD_REJECTED,
         FETCH_STORIES_FULFILLED,
         FETCH_STORIES_REJECTED
        } from '../constants/constants';

// Get all Initial Items
export function fetchItems(){
  return function(dispatch){
    axios.get(API_URL)
    .then((response) =>{
      const b = response.data;
      // change key names for chart consumption
      Object.keys(b).forEach(function (key) {
          b[key].title = b[key].eventName;
          b[key].duration = moment.duration(moment(b[key].end).diff(moment(b[key].start))).humanize();
      });
      dispatch({type: FETCH_STORIES_FULFILLED, payload: b});
    })
    .catch((err) => {
      console.log(err)
      dispatch({type: FETCH_STORIES_REJECTED, payload: err})
    })
  }
}

// Delete a particular Item passing the ID
export function deleteItem(id){
  return function(dispatch){
    axios.delete(API_URL + '/' + id)
    .then((response) =>{
      console.log(response)
      dispatch({type: STORY_DELETED, id: id});
    })
    .catch((err) => {
      console.log(err)
      dispatch({type: STORY_DELETE_REJECTED, payload: err})
    })
  }
}

//Update a current Item passing the new: ID, Title, and Url.
export function updateItem(id, eventName, roomName, start, end){
  const dataObject = {
        id,
        eventName,
        roomName,
        start,
        end,
        duration: moment.duration(moment(end).diff(moment(start))).humanize()
  };
  return function(dispatch){
    axios.put(API_URL + id, dataObject)
    .then((response) =>{
      dispatch({type: STORY_UPDATED, id: id, payload: response.data});
    })
    .catch((err) => {
      console.log(err)
      dispatch({type: STORY_UPDATE_REJECTED, payload: err})
    })
  }
}


//Add a new Item passing: Title and Url
export function addItem(eventName, roomName, start, end){
  const dataObject = {
    eventName,
    roomName,
    start,
    end,
    duration: moment.duration(moment(end).diff(moment(start))).humanize()
  };

  return function(dispatch){
    axios.post(API_URL, dataObject)
    .then((response) =>{
      dispatch({type: STORY_ADDED, payload: response.data});
    })
    .catch((err) => {
      console.log(err)
      dispatch({type: STORY_ADD_REJECTED, payload: err})
    })
  }
}
