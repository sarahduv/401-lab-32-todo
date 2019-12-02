import React, { useState, useEffect, useReducer } from 'react';
import { When } from '../if';
import Modal from '../modal';

const Form = props => {
  return (
    <div>
      <h3>Add Item</h3>
      <form onSubmit={props.addItem}>
        <label>
          <span>To Do Item</span>
          <input
            name="text"
            placeholder="Add To Do List Item"
            onChange={props.handleInputChange}
          />
        </label>
        <label>
          <span>Difficulty Rating</span>
          <input
            type="range"
            min="1"
            max="5"
            name="difficulty"
            defaultValue="3"
            onChange={props.handleInputChange}
          />
        </label>
        <label>
          <span>Assigned To</span>
          <input
            type="text"
            name="assignee"
            placeholder="Assigned To"
            onChange={props.handleInputChange}
          />
        </label>
        <label>
          <span>Due</span>
          <input type="date" name="due" onChange={props.handleInputChange} />
        </label>
        <button>Add Item</button>
      </form>
    </div>
  );
};

export default Form;
