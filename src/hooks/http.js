import { useCallback, useReducer } from 'react';

// logic we want to reuse (customized) across components which also influences the state of those components

const initialState = {
  loading: false,
  error: null,
  data: null,
  extra: null,
  identifier: null
};

const httpReducer = (httpState, action) => {
  switch (action.type) {
    case 'SEND':
      return {
        loading: true,
        error: null,
        data: null,
        extra: null,
        identifier: action.identifier
      };
    case 'RESPONSE':
      return {
        ...httpState,
        loading: false,
        data: action.responseData,
        extra: action.extra
      };
    case 'ERROR':
      return {
        loading: false,
        error: action.errorMessage
      };
    case 'CLEAR':
      return initialState;
    default:
      throw new Error('httpReducer - Unknown action type' + JSON.stringify(action));
  }
};

// spoiler: sono come le service factory di AngularJS

// hook will rerun whenever the component that is using the hook is rerendered:
// therefore the reducer is re-set-up, [httpState] is re-estracted and returned from the reducer and returned
const useHttp = () => {

  const [httpState, httpDispatch] = useReducer(httpReducer, initialState);

  const clear = useCallback(() => {
    httpDispatch({
      type: 'CLEAR'
    });
  }, []);

  const handleError = useCallback(err => {
    console.error(err);
    httpDispatch({
      type: 'ERROR',
      errorMessage: err.message
    });
    return Promise.reject(err);
  }, []);

  const sendRequest = useCallback((url, method, body, extra, identifier) => {
    httpDispatch({
      type: 'SEND',
      identifier: identifier
    });
    fetch(url, {
      method: method,
      body: body,
      headers: {
        'Concent-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then((responseJson) => {
        httpDispatch({
          type: 'RESPONSE',
          responseData: responseJson,
          extra: extra
        });
      })
      .catch(handleError);
  }, [handleError]);

  return {
    loading: httpState.loading,
    data: httpState.data,
    error: httpState.error,
    extra: httpState.extra,
    identifier: httpState.identifier,
    sendRequest,
    clear
  };
};

export default useHttp;