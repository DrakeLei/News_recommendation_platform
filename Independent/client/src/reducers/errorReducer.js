import { GET_ERRORS } from "../action/types";

const initialState = {};

//reducer means that when store receive an action,
// it change the state and return a new state
export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ERRORS:
      return action.payload;
    default:
      return state;
  }
}
