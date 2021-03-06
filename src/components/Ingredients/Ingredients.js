import React, { useCallback, useEffect, useMemo, useReducer } from 'react';
import { FIREBASE_DB_URL } from '../../config/secrets';
import useHttp from '../../hooks/http';
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

function Ingredients() {

  const {
    loading,
    error: httpError,
    data,
    extra,
    identifier,
    sendRequest,
    clear
  } = useHttp();

  const [ingredients, ingredientsDispatch] = useReducer(ingredientReducer, []);

  // reruns when ingregients change:
  useEffect(() => {
    console.log('Ingridients', 'useEffect', 'Rendering Ingredients', ingredients);
  }, [ingredients]);

  useEffect(() => {
    if (!(!loading && !httpError)) {
      return;
    }
    if (identifier === 'REMOVE_INGREDIENT') {
      // de facto, extra is the id that is being deleted
      ingredientsDispatch({
        type: 'REMOVE',
        id: extra
      });
    }
    else if (identifier === 'ADD_INGREDIENT') {
      ingredientsDispatch({
        type: 'ADD',
        ingredient: {
          id: data.name, // generated by Firebase
          ...extra
        }
      });
    }
  }, [data, extra, identifier, loading, httpError]);

  // useCallback() to prevent re-definition of same function in every rendering cycle:
  const handleAddIngredient = useCallback((ingredient) => {
    sendRequest(
      FIREBASE_DB_INGREDIENTS_URL,
      'POST',
      JSON.stringify(ingredient),
      ingredient,
      'ADD_INGREDIENT'
    );
  }, [sendRequest]);

  const handleRemoveIngredient = useCallback(id => {
    sendRequest(
      `${FIREBASE_DB_URL}/ingredients/${id}.jsonz`,
      'DELETE',
      null,
      id, // extra
      'REMOVE_INGREDIENT'
    );
  }, [sendRequest]);

  const handleIngredientsLoaded = useCallback(ingredients => {
    ingredientsDispatch({
      type: 'SET',
      ingredients: ingredients
    });
  }, []);

  const clearError = useCallback(() => {
    clear()
  }, [clear]);

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
        httpError &&
        <ErrorModal
          onClose={clearError}
        >
          {httpError}
        </ErrorModal>
      }

      <IngredientForm
        onAddIngredient={handleAddIngredient}
        loading={loading}
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
