import React, { useState, useEffect, useReducer } from 'react';
import { When } from '../if';
import Modal from '../modal';
import Form from './todo-form';
import useForm from './use-form';
import useQueue from './use-queue';
import io from 'socket.io-client';
import Q from '@nmq/q/client';
import './todo.scss';

const queue = new Q('todoCrud');
Q.publish('todoCrud', 'save', null);
Q.publish('todoCrud', 'delete', null);

const todoAPI = 'https://api-js401.herokuapp.com/api/v1/todo';

const ToDo = props => {
  // constructor(props) {
  //   super(props);
  //   state = {
  //     todoList: [],
  //     item: {},
  //     showDetails: false,
  //     details: {}
  //   };
  // }

  let [todoList, setTodoList] = useState([]);
  let [item, handleInputChange] = useForm();
  let [showDetails, setShowDetails] = useState(false);
  let [details, setDetails] = useState({});
  let [queuePublish, queueSubscribe] = useQueue(Q, queue);

  const callAPI = (url, method = 'get', body, handler, errorHandler) => {
    return fetch(url, {
      method: method,
      mode: 'cors',
      cache: 'no-cache',
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined
    })
      .then(response => response.json())
      .then(data => (typeof handler === 'function' ? handler(data) : null))
      .catch(e =>
        typeof errorHandler === 'function' ? errorHandler(e) : console.error(e)
      );
  };

  const addItemFromItem = (_item, local) => {
    const _updateState = newItem => {
      if (local) {
        onPublishSave(newItem);
      }
      return setTodoList([...todoList, newItem]);
    };

    if (local) {
      callAPI(todoAPI, 'POST', _item, _updateState);
    } else {
      _updateState(_item);
    }
  };

  const addItem = (e, local) => {
    e.preventDefault();
    e.target.reset();
    addItemFromItem(item, local);
  };

  const deleteItem = (id, local) => {
    const _updateState = results =>
      setTodoList(todoList.filter(_item => _item._id !== id));

    if (local) {
      onPublishDelete(id);
      callAPI(`${todoAPI}/${id}`, 'DELETE', undefined, _updateState);
    } else {
      _updateState();
    }
  };

  const onPublishSave = _item => {
    queuePublish('todoCrud', 'save', _item);
  };

  const onPublishDelete = _id => {
    queuePublish('todoCrud', 'delete', _id);
  };

  const onSubscribeSave = _item => {
    console.log('got message for save', _item);
    if (_item !== null) {
      getTodoItems();
    }
  };

  const onSubscribeDelete = _id => {
    console.log('got message for delete', _id);
    if (_id !== null) {
      getTodoItems();
    }
  };

  useEffect(() => {
    queueSubscribe('save', onSubscribeSave);
    queueSubscribe('delete', onSubscribeDelete);
  }, []);

  const saveItem = updatedItem => {
    const _updateState = newItem =>
      setTodoList(
        todoList.map(_item => (_item._id === newItem._id ? newItem : _item))
      );

    callAPI(`${todoAPI}/${updatedItem.id}`, 'PUT', updatedItem, _updateState);
  };

  const toggleComplete = id => {
    let _item = todoList.filter(i => i._id === id)[0] || {};
    if (_item._id) {
      _item.complete = !_item.complete;
      saveItem(_item);
    }
  };

  const toggleDetails = id => {
    let _showDetails = !showDetails;
    let details = todoList.filter(_item => _item._id === id)[0] || {};
    setDetails(details);
    setShowDetails(_showDetails);
  };

  const getTodoItems = () => {
    const _updateState = data => setTodoList(data.results);
    callAPI(todoAPI, 'GET', null, _updateState);
  };

  // const componentDidMount = () => {
  //   getTodoItems();
  // };

  useEffect(() => {
    getTodoItems();
  }, []);

  return (
    <>
      <header>
        <h2>
          There are
          {todoList.filter(_item => !_item.complete).length}
          Items To Complete
        </h2>
      </header>

      <section className="todo">
        <Form
          handleInputChange={handleInputChange}
          addItem={e => addItem(e, true)}
        />

        <div>
          <ul>
            {todoList.map(_item => (
              <li
                className={`complete-${_item.complete.toString()}`}
                key={_item._id}
              >
                <span onClick={() => toggleComplete(_item._id)}>
                  {_item.text}
                </span>
                <button onClick={() => toggleDetails(_item._id)}>
                  Details
                </button>
                <button onClick={() => deleteItem(_item._id, true)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <When condition={showDetails}>
        <Modal title="To Do Item" close={toggleDetails}>
          <div className="todo-details">
            <header>
              <span>Assigned To: {details.assignee}</span>
              <span>Due: {details.due}</span>
            </header>
            <div className="item">{details.text}</div>
          </div>
        </Modal>
      </When>
    </>
  );
};

export default ToDo;

// import React from "react";
// import { When } from "../if";
// import Modal from "../modal";

// import "./todo.scss";

// const todoAPI = 'https://api-js401.herokuapp.com/api/v1/todo';

// class ToDo extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       todoList: [],
//       item: {},
//       showDetails: false,
//       details: {}
//     };
//   }

//   handleInputChange = e => {
//     this.setState({ item: {...this.state.item, [e.target.name]: e.target.value} });
//   };

//   callAPI = (url, method='get', body, handler, errorHandler) => {

//     return fetch(url, {
//       method: method,
//       mode: 'cors',
//       cache: 'no-cache',
//       headers: { 'Content-Type': 'application/json' },
//       body: body ? JSON.stringify(body) : undefined,
//     })
//     .then(response => response.json())
//     .then(data => typeof handler === "function" ? handler(data) : null )
//     .catch( (e) => typeof errorHandler === "function" ? errorHandler(e) : console.error(e)  );
//   };

//   addItem = (e) => {

//     e.preventDefault();
//     e.target.reset();

//     const _updateState = newItem =>
//       this.setState({
//         todoList: [...this.state.todoList, newItem]
//       });

//     this.callAPI( todoAPI, 'POST', this.state.item, _updateState );

//   };

//   deleteItem = id => {

//     const _updateState = (results) =>
//       this.setState({
//         todoList: this.state.todoList.filter(item => item._id !== id)
//       });

//     this.callAPI( `${todoAPI}/${id}`, 'DELETE', undefined, _updateState );

//   };

//   saveItem = updatedItem => {

//     const _updateState = (newItem) =>
//       this.setState({
//         todoList: this.state.todoList.map(item =>
//           item._id === newItem._id ? newItem : item
//         )
//       });

//     this.callAPI( `${todoAPI}/${updatedItem.id}`, 'PUT', updatedItem, _updateState );

//   };

//   toggleComplete = id => {
//     let item = this.state.todoList.filter(i => i._id === id)[0] || {};
//     if (item._id) {
//       item.complete = !item.complete;
//       this.saveItem(item);
//     }
//   };

//   toggleDetails = id => {
//     let showDetails = ! this.state.showDetails;
//     let details = this.state.todoList.filter( item => item._id === id )[0] || {}
//     this.setState({details, showDetails});
//   }

//   getTodoItems = () => {
//     const _updateState = data => this.setState({ todoList: data.results });
//     this.callAPI( todoAPI, 'GET', undefined, _updateState );
//   };

//   componentDidMount = () => {
//     this.getTodoItems();
//   }

//   render() {

//     return (
//       <>
//         <header>
//           <h2>
//             There are
//             {this.state.todoList.filter( item => !item.complete ).length}
//             Items To Complete
//           </h2>
//         </header>

//         <section className="todo">

//           <div>
//             <h3>Add Item</h3>
//             <form onSubmit={this.addItem}>
//               <label>
//                 <span>To Do Item</span>
//                 <input
//                   name="text"
//                   placeholder="Add To Do List Item"
//                   onChange={this.handleInputChange}
//                 />
//               </label>
//               <label>
//                 <span>Difficulty Rating</span>
//                 <input type="range" min="1" max="5" name="difficulty" defaultValue="3" onChange={this.handleInputChange} />
//               </label>
//               <label>
//                 <span>Assigned To</span>
//                 <input type="text" name="assignee" placeholder="Assigned To" onChange={this.handleInputChange} />
//               </label>
//               <label>
//                 <span>Due</span>
//                 <input type="date" name="due" onChange={this.handleInputChange} />
//               </label>
//               <button>Add Item</button>
//             </form>
//           </div>

//           <div>
//             <ul>
//               { this.state.todoList.map(item => (
//                 <li
//                   className={`complete-${item.complete.toString()}`}
//                   key={item._id}
//                 >
//               <span onClick={() => this.toggleComplete(item._id)}>
//                 {item.text}
//               </span>
//                   <button onClick={() => this.toggleDetails(item._id)}>
//                     Details
//                   </button>
//                   <button onClick={() => this.deleteItem(item._id)}>
//                     Delete
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </section>

//         <When condition={this.state.showDetails}>
//           <Modal title="To Do Item" close={this.toggleDetails}>
//             <div className="todo-details">
//               <header>
//                 <span>Assigned To: {this.state.details.assignee}</span>
//                 <span>Due: {this.state.details.due}</span>
//               </header>
//               <div className="item">
//                 {this.state.details.text}
//               </div>
//             </div>
//           </Modal>
//         </When>
//       </>
//     );
//   }
// }

// export default ToDo;
