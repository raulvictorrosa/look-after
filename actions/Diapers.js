import axios from "axios";
import {
  ADD_DIAPER,
  BUY_DIAPER,
  DELETE_DIAPER,
  EDIT_DIAPER,
  FETCH_DIAPERS,
  FETCH_DIAPER_BY_ID
} from "./Constants";
const BASE_URL = "http://localhost:3000/api";

export const getDiapers = () => dispatch =>
  axios
    .get(`${BASE_URL}/diapers`)
    .then(res => res.data)
    .then(diapers =>
      dispatch({
        type: FETCH_DIAPERS,
        diapers
      })
    );

export const getDiaperByID = id => dispatch =>
  axios
    .get(`${BASE_URL}/diaper/${id}`)
    .then(res => res.data)
    .then(diapers =>
      dispatch({
        type: FETCH_DIAPER_BY_ID,
        diaper
      })
    );

export const editDiaper = diaper => async dispatch =>
  await axios
    .post(`${BASE_URL}/diaper/add/${diaper._id}`, diaper)
    .then(res => res.data)
    .then(data =>
      dispatch({
        type: EDIT_DIAPER,
        diaper: {
          ...diaper
        }
      })
    );

export const addDiaper = diaper => async dispatch =>
  await axios
    .post(`${BASE_URL}/diaper/add`, diaper)
    .then(res => res.data)
    .then(data =>
      dispatch({
        type: ADD_DIAPER,
        diaper: {
          ...diaper,
          ...data
        }
      })
    );

export const deleteDiaper = id => async dispatch =>
  await axios
    .post(`${BASE_URL}/diaper/delete`, { id })
    .then(res => res.data)
    .then(data =>
      dispatch({
        type: DELETE_DIAPER,
        id
      })
    );

export const buyDiaper = id => async dispatch =>
  await axios
    .post(`${BASE_URL}/diaper/buy/${id}`)
    .then(res => res.data)
    .then(data => {
      console.log(data);
      dispatch({
        type: BUY_DIAPER,
        id
      });
    });
