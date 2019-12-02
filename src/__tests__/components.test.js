import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
// import renderer from "react-test-renderer";
import App from '../app.js';
import TodoForm from '../components/todo/todo-form.js';

Enzyme.configure({ adapter: new Adapter() });

describe('Our components are functioning', () => {
  it('Form renders', () => {
    let deck = mount(<TodoForm />);
    let h3 = deck.find('h3');
    expect(h3.exists()).toBeTruthy();
  });

  it('Our components are functioning', () => {
    let deck = mount(<TodoForm />);
    let input = deck.find('input');
    expect(input.exists()).toBeTruthy();
  });

  it('Our components are functioning', () => {
    let deck = mount(<TodoForm />);
    let span = deck.find('span');
    expect(span.exists()).toBeTruthy();
  });
});
