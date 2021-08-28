import './App.css';
import endpoint from './endpoint';
import { useReducer, useCallback } from "react"

const initialState = { error: null, loading: false, result: null };

const fetchReducer = (state, action) => {
  console.log(action)
  if (action.type === 'LOADING') {
    return {
      result: null,
      error: null,
      loading: true
    }
  }
  if (action.type === 'RESPONSE_COMPLETED') {
    return {
      result: action.payload.result,
      error: null,
      loading: false
    }
  }
  if (action.type === 'ERROR') {
    return {
      result: null,
      error: action.payload.error,
      loading: false
    }
  }
  return state;
}

const useThunkReducer = (reducer, initialState) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const enhancedDispatch = useCallback((action) => {
    if (typeof action === "function") {
      action(dispatch);
    } else {
      dispatch(action);
    }
  }, [dispatch]);

  return [state, enhancedDispatch];
}

const fetchData = async (dispatch) => {
  try {
    dispatch({ type: "LOADING" });
    const response = await fetch(endpoint);
    if (response) {
      const data = await response.json();
      dispatch({ type: "RESPONSE_COMPLETED", payload: { result: data } });
    }

  } catch (error) {
    console.log("error")
    dispatch({ type: "ERROR", payload: { error } });
  }
}

function App() {
  const [state, enhancedDispatch] = useThunkReducer(fetchReducer, initialState);
  const { error, loading } = state;
  const result = state.result || []

  return (
    <div className="App">
      <button onClick={() => enhancedDispatch(fetchData)}>FetchDataa</button>
      <div className="Foods">
        {loading
          ? <p>Loading API...</p>
          : <div>
            <h3>{result.blend_name}</h3>
            <h4>{result.variety}</h4>
          </div>
        }
        {error && <h1>{error.message}</h1>}
      </div>
    </div>
  );
}

export default App;
