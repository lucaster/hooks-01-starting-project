import React, { useEffect, useRef, useState } from 'react';
import { FIREBASE_DB_URL } from '../../config/secrets';
import useHttp from '../../hooks/http';
import Card from '../UI/Card';
import ErrorModal from '../UI/ErrorModal';
import './Search.css';

const FIREBASE_DB_INGREDIENTS_URL = `${FIREBASE_DB_URL}/ingredients.json`;
const FILTER_THROTTLE_MS = 500;
const Search = React.memo(props => {

  const { onIngredientsLoaded } = props;
  const [filter, setFilter] = useState('');
  const inputFilterRef = useRef();
  const { loading, data, error : httpError, sendRequest, clear } = useHttp();

  // rerun when filter changes:
  useEffect(() => {
    console.debug('Search', 'useEffect', 'fetch');
    const timer = setTimeout(() => {
      if (filter === inputFilterRef.current.value) {
        // hasn't changed in the last 500ms
        const query = filter ? `?orderBy="title"&equalTo="${filter}"` : '';
        sendRequest(
          FIREBASE_DB_INGREDIENTS_URL + query,
          'GET'
        );
      }
    }, FILTER_THROTTLE_MS);
    // will run before the next re-run:
    const destructor = () => {
      clearTimeout(timer);
    };
    return destructor;
  }, [filter, onIngredientsLoaded, inputFilterRef, sendRequest]);

  useEffect(() => {
    if (!loading && !httpError && data) {
      const responseJson = data;
      const loadedIngredients = Object.keys(responseJson)
        .map(key => {
          const obj = responseJson[key];
          return {
            id: key,
            title: obj.title,
            amount: obj.amount
          };
        });
      onIngredientsLoaded(loadedIngredients);
    }
  }, [data, loading, httpError, onIngredientsLoaded]);

  const onChangeFilter = event => {
    setFilter(event.target.value)
  }

  return (
    <section className="search">
      {
        httpError &&
        <ErrorModal
          onClose={clear}
        >
          {httpError}
        </ErrorModal>
      }
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          {loading && <span>loading...</span>}
          <input
            type="text"
            ref={inputFilterRef}
            value={filter}
            onChange={onChangeFilter}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
