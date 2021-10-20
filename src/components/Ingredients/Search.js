import React, { useEffect, useState } from 'react';
import { FIREBASE_DB_URL } from '../../config/secrets';
import Card from '../UI/Card';
import './Search.css';

const FIREBASE_DB_INGREDIENTS_URL = `${FIREBASE_DB_URL}/ingredients.json`;

const Search = React.memo(props => {

  const { onIngredientsLoaded } = props;
  const [filter, setFilter] = useState('');

  // rerun when filter changes:
  useEffect(() => {
    console.debug('Search', 'useEffect', 'fetch');
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
  }, [filter, onIngredientsLoaded]);

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
            value={filter}
            onChange={onChangeFilter}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
