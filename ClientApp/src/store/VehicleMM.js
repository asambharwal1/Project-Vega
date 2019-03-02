const requestModeType = 'REQUEST_DATA';
const recievedModeType = 'RECIEVED_DATA';
const editMode = 'EDIT_REGISTERATION_MODE';
const photoMode = 'PHOTOS_MODE';
const initialState = { vehicle: {}, makes: [], features: [], isLoading : false, photos:[]};

export const actionCreators = {
  requestMakes: begin => async (dispatch, getState) => {
    dispatch({type: requestModeType});

    if(getState().makes.makes.length!==0 && getState().makes.features.length!==0 && (begin === null || begin === undefined)) {
      return;
    }

    if(getState().makes.vehicle){
      if(getState().makes.makes.length!==0 && getState().makes.features.length!==0 && (getState().makes.vehicle.id === begin)){
        return;
      } 
    }

    const url = 'api/makes';
    const response = await fetch(url);
    var makes = await response.json();
    
    const urlf = 'api/features';
    const responsef = await fetch(urlf);
    var features = await responsef.json();
    
    if (begin !== null || getState().makes.vehicle.id !== begin) {
      const urlv = 'api/vehicles/'+begin;
      const responsev = await fetch(urlv);
      var vehicle = await responsev.json();
      dispatch({type : recievedModeType, makes, features, vehicle});
    } else {
      dispatch({type : recievedModeType, makes, features});
    }
  },

  requestFilterVehicles: filter => async (dispatch, getState) => {
      const url = 'api/vehicles/'+filter;
      const response = await fetch(url);
      const vehicle = await response.json();
      dispatch({type: editMode, vehicle})
  },

  requestVehiclePhotos: vehicleId => async (dispatch, getState) => {
    const url = 'api/vehicles/'+vehicleId+'/photos';
    const response = await fetch(url);
    const photos = await response.json();
    dispatch({type: photoMode, photos});
  }
};

export const reducer = (state, action) => {
  state = state || initialState;

  if (action.type === requestModeType) {
    return { ...state, 
        isLoading: true };
  }

  if (action.type === recievedModeType) {
    return { ...state,
        makes: action.makes,
        features: action.features,
        vehicle: action.vehicle,
        isLoading: false };
  }

  if (action.type === editMode) {
    return { ...state, 
        vehicle: action.vehicle};
  }

  if (action.type === photoMode){
    return { ...state,
        photos: action.photos};
  }

  return state;
};
