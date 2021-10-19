import React, { useState } from 'react';
import Card from '../UI/Card';
import './IngredientForm.css';

const IngredientForm = React.memo(props => {

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');

  const onChangeTitle = event => setTitle(event.target.value);
  const onChangeAmount = event => setAmount(event.target.value);

  const submitHandler = event => {
    event.preventDefault();
    const newIngredient = {
      title: title,
      amount: amount
    };
    props.onAddIngredient(newIngredient);
  };

  return (
    <section className="ingredient-form">
      <pre>{JSON.stringify({title, amount})}</pre>
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input
              type="text"
              name="title"
              id="title"
              value={title}
              onChange={onChangeTitle}
            />
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              name="amount"
              id="amount"
              value={amount}
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
