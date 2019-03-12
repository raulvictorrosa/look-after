import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import reducers from "../reducers";

const initialState = { diapers: [] };

const store = (initialState, options) =>
  createStore(
    reducers,
    initialState,
    composeWithDevTools(applyMiddleware(thunk))
  );

export default store;
