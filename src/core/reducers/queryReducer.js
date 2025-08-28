export const queryReducer = (state, action) => {
  switch (action.type) {
    case "REQUEST_START":
      return { ...state, isLoading: true, error: null };
    case "REQUEST_SUCCESS":
      return {
        ...state,
        isLoading: false,
        data: action.payload.data,
        error: null,
      };
    case "REQUEST_ERROR":
      return { ...state, isLoading: false, error: action.payload.error };
    case "UPDATE_DATA":
      return {
        ...state,
        isLoading: false,
        data: action.payload.data,
        error: null,
      };
    default:
      return state;
  }
};
