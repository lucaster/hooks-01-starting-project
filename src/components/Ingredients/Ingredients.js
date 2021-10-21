import React, { useCallback, useEffect, useMemo, useReducer } from 'react';
import { FIREBASE_DB_URL } from '../../config/secrets';
import ErrorModal from '../UI/ErrorModal';
import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const FIREBASE_DB_INGREDIENTS_URL = `${FIREBASE_DB_URL}/ingredients.json`;

const ingredientReducer = (currIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currIngredients, action.ingredient];
    case 'REMOVE':
      return currIngredients.filter(ing => ing.id !== action.id);
    default:
      throw new Error('ingredientReducer - Unknown action type' + JSON.stringify(action));
  }
};

const httpReducer = (httpState, action) => {
  switch (action.type) {
    case 'SEND':
      return {
        loading: true,
        error: null
      };
    case 'RESPONSE':
      return {
        ...httpState,
        loading: false
      };
    case 'ERROR':
      return {
        loading: false,
        error: action.errorMessage
      };
    case 'CLEAR': {
      return {
        ...httpState,
        error: null
      }
    }
    default:
      throw new Error('httpReducer - Unknown action type' + JSON.stringify(action));
  }
};

function Ingredients() {

  const [ingredients, ingredientsDispatch] = useReducer(ingredientReducer, []);
  const [httpState, httpDispatch] = useReducer(httpReducer, { loading: false, error: null });

  // reruns when ingregients change:
  useEffect(() => {
    console.log('Ingridients', 'useEffect', 'Rendering Ingredients', ingredients);
  }, [ingredients]);

  const handleError = err => {
    console.error(err);
    httpDispatch({
      type: 'ERROR',
      errorMessage: err.message
    });
    return Promise.reject(err);
  };

  // useCallback() to prevent re-definition of same function in every rendering cycle:
  const handleAddIngredient = useCallback((ingredient) => {
    httpDispatch({
      type: 'SEND'
    });
    fetch(FIREBASE_DB_INGREDIENTS_URL, {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        httpDispatch({
          type: 'RESPONSE'
        });
        return response;
      })
      .then(response => response.json())
      .then(responseJson => {
        // console.debug('Ingredients', 'addIngredientHandler', 'responseJson', responseJson);
        ingredientsDispatch({
          type: 'ADD',
          ingredient: {
            id: responseJson.name, // generated by Firebase
            ...ingredient
          }
        });
      })
      .catch(handleError);
  }, []);

  const handleRemoveIngredient = useCallback(id => {
    httpDispatch({
      type: 'SEND'
    });
    fetch(`${FIREBASE_DB_URL}/ingredients/${id}.jsonz`, {
      method: 'DELETE'
    })
      .then(() => {
        httpDispatch({
          type: 'RESPONSE'
        });
        ingredientsDispatch({
          type: 'REMOVE',
          id: id
        });
      })
      .catch(handleError);
  }, []);

  const handleIngredientsLoaded = useCallback(ingredients => {
    ingredientsDispatch({
      type: 'SET',
      ingredients: ingredients
    });
  }, []);

  const clearError = () => {
    httpDispatch({
      type: 'CLEAR'
    });
  }

  const ingredientList = useMemo(() => {
    return (
      <IngredientList
        ingredients={ingredients}
        onRemoveItem={handleRemoveIngredient}
      />
    );
  }, [ingredients, handleRemoveIngredient]);

  return (
    <div className="App">

      {
        httpState.error &&
        <ErrorModal
          onClose={clearError}
        >
          {httpState.error}
        </ErrorModal>
      }

      <IngredientForm
        onAddIngredient={handleAddIngredient}
        loading={httpState.loading}
      />

      <section>
        <Search
          onIngredientsLoaded={handleIngredientsLoaded}
        />
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
