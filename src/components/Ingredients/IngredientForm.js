import React, { useState } from 'react';
import Card from '../UI/Card';
import './IngredientForm.css';

const IngredientForm = React.memo(props => {

  const [state, setState] = useState({
    title: '',
    amount: ''
  });

  const onChangeTitle = event => {
    const value = event.target.value;
    setState(state => ({
      ...state,
      title: value
    }));
  };

  const onChangeAmount = event => {
    const value = event.target.value;
    setState(state => ({
      ...state,
      amount: value
    }));
  };

  const submitHandler = event => {
    event.preventDefault();
    // ...
  };

  return (
    <section className="ingredient-form">
      <pre>{JSON.stringify(state)}</pre>
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input
              type="text"
              name="title"
              id="title"
              value={state.title}
              onChange={onChangeTitle}
            />
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              name="amount"
              id="amount"
              value={state.amount}
              onChange={onChangeAmount}
            />
          </div>
          <div className="ingredient-form__actions">
            <button type="submit">Add Ingredient</button>
          </div>
        </form>
      </Card>
    </section>
  );
});

export default IngredientForm;
