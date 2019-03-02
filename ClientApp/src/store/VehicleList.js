const filterVehicleMode = 'FILTERED_VEHICLE';
const recieveMakes = 'RECIEVE_MAKES';
const initialState = { vehicles: [], forecasts: [], makes: [], isLoading: false, totalItems : 0 };

export const actionCreators = {
  requestVehicleMakes: makes => async (dispatch, getState) => {
    const urlM = 'api/makes';
    const responseM = await fetch(urlM);
    const makes = await responseM.json();
    dispatch({type: recieveMakes, makes});
  },

  requestFilteredVehicles: filter => async (dispatch, getState) => {
      const url = 'api/vehicles/'+filter;
      const response = await fetch(url);
      const vehicles = await response.json();
      const filteredVehicles = vehicles.items;
      const totalItems = vehicles.totalItems;
      dispatch({type: filterVehicleMode, filteredVehicles, totalItems})
  }
};

export const reducer = (state, action) => {
  state = state || initialState;

  if (action.type === filterVehicleMode) {
    return {
      ...state,
      vehicles: action.filteredVehicles,
      totalItems: action.totalItems
    }
  }

  if (action.type === recieveMakes) {
    return {
      ...state,
      makes: action.makes
    };
  }

  return state;
};
