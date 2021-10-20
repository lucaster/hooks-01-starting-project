import React, { useEffect, useRef, useState } from 'react';
import { FIREBASE_DB_URL } from '../../config/secrets';
import Card from '../UI/Card';
import './Search.css';

const FIREBASE_DB_INGREDIENTS_URL = `${FIREBASE_DB_URL}/ingredients.json`;
const FILTER_THROTTLE_MS = 500;

const Search = React.memo(props => {

  const { onIngredientsLoaded } = props;
  const [filter, setFilter] = useState('');
  const inputFilterRef = useRef();

  // rerun when filter changes:
  useEffect(() => {
    console.debug('Search', 'useEffect', 'fetch');
    const timer = setTimeout(() => {
      if (filter === inputFilterRef.current.value) {
        // hasn't changed in the last 500ms
        const query = filter ? `?orderBy="title"&equalTo="${filter}"` : '';
        fetch(FIREBASE_DB_INGREDIENTS_URL + query)
          .then(response => response.json())
          .then(responseJson => {
            const loadedIngredients = Object.keys(responseJson)
              .map(key => {
                const obj = responseJson[key];
                return {
                  id: key,
                  title: obj.title,
                  amount: obj.amount
                };
              });
            return loadedIngredients;
          })
          .then(ingredients => {
            // onIngredientsLoaded will change because the parent component
            // is re-rendered and resets ingredientsLoadedHandler,
            // thus causing loop:
            onIngredientsLoaded(ingredients);
          });
      }
    }, FILTER_THROTTLE_MS);
    // will run before the next re-run:
    const destructor = () => {
      clearTimeout(timer);
    };
    return destructor;
  }, [filter, onIngredientsLoaded, inputFilterRef]);

  const onChangeFilter = event => {
    setFilter(event.target.value)
  }

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
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
