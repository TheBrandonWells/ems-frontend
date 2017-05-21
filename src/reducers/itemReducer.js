const initialState = {
  items: [],
  displayedItems: [],
  fetching: false,
  fetched: false,
  error: null,
  showCal: false,
};

export default function reducer(state = initialState, action){
  switch (action.type) {
    case "FETCH_STORIES":{
      return {
              fetching: true
             }
    }

    case "FETCH_STORIES_FULFILLED":{
      return {
              fetching: false,
              fetched: true,
              items: action.payload,
              displayedItems: action.payload
              }
    }

     case "FETCH_STORIES_REJECTED":{
       return {
                fetching: false,
                error: action.payload
              }
     }

     case "STORY_DELETED":{
       //filter out the deleted item based on id
       return { fetching: false, items: state.items.filter(items =>
           items.id !== action.id
        )}
     }

     case "STORY_UPDATED":{
       //map our current items and if id is the same as one edited use payload instead of previous item
       const updatedItems = state.items.map(item => {
        if(item.id === action.id){
          return action.payload
        }
        return item
      })
      return {
              fetching: false,
              fetched: true,
              items: updatedItems
              }
     }

     case "STORY_ADDED":{
      return {
              fetching: false,
              fetched: true,
              items: state.items.concat(action.payload)
              }
     }

  }
  return state;
}
