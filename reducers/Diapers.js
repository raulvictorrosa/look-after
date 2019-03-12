import moment from "moment";
import {
  ADD_DIAPER,
  BUY_DIAPER,
  DELETE_DIAPER,
  EDIT_DIAPER,
  FETCH_DIAPERS
} from "../actions/Constants";

function diapers(state = [], action) {
  switch (action.type) {
    case FETCH_DIAPERS:
      return [...action.diapers];

    case EDIT_DIAPER:
      return state.map(s => {
        if (s.id === action.diaper._id) {
          s.value = action.diaper;
        }

        return s;
      });

    case ADD_DIAPER:
      return [
        {
          value: {
            _id: action.diaper.id,
            ...action.diaper
          }
        },
        ...state
      ];

    case BUY_DIAPER:
      return state.map(s => {
        if (s.id === action.id) {
          if (s.value.availableQty > 0) {
            s.value.availableQty -= 1;
            s.value.purchasedQty += 1;
            s.value.purchasedTimes.push(
              `${moment().format("YYYY-MM-DD HH:mm:ss")}`
            );
            console.log(s.value);
          }
        }

        return s;
      });

    case DELETE_DIAPER:
      return state.filter(diaper => diaper.id !== action.id);

    default:
      return state;
  }
}

export default diapers;
