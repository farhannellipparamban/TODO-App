import React, { useEffect, useRef, useState } from 'react';
import './Todo.css';
import { FiEdit } from 'react-icons/fi';
import { IoMdDoneAll } from 'react-icons/io';
import { MdDelete } from 'react-icons/md';
import localforage from 'localforage'; 

const Todo = () => {
  const [todo, setTodo] = useState('');
  const [todos, setTodos] = useState([]);
  const [editId, setEditID] = useState(0);

  const handlerSubmit = (e) => {
    e.preventDefault();
  };

  const addTodo = async () => {
    if (todo !== '') {
      const newTodo = { list: todo, id: Date.now(), status: false };
      await localforage.setItem(newTodo.id.toString(), newTodo); 
      setTodos([...todos, newTodo]);
      setTodo('');
    }
    if (editId) {
      const editTodo = todos.find((todo) => todo.id === editId);
      const updateTodo = todos.map((to) =>
        to.id === editTodo.id
          ? { id: to.id, list: todo }
          : { id: to.id, list: to.list }
      );
      setTodos(updateTodo);
      setEditID(0);
      setTodo('');
    }
  };

  const inputRef = useRef('null');

  useEffect(() => {
    inputRef.current.focus();
  });

  const onDelete = async (id) => {
    await localforage.removeItem(id.toString()); 
    setTodos(todos.filter((to) => to.id !== id));
  };

  const onComplete = async (id) => {
    const todoToUpdate = todos.find((list) => list.id === id);
    todoToUpdate.status = !todoToUpdate.status;
    await localforage.setItem(id.toString(), todoToUpdate); 
    setTodos([...todos]);
  };

  const onEdit = (id) => {
    const editTodo = todos.find((to) => to.id === id);
    setTodo(editTodo.list);
    setEditID(editTodo.id);
  };

  useEffect(() => {
    const loadTodos = async () => {
      const keys = await localforage.keys();
      const todoItems = await Promise.all(keys.map((key) => localforage.getItem(key)));
      setTodos(todoItems);
    };
    loadTodos();
  }, []);

  return (
    <div className="container">
      <h2>TODO APP</h2>
      <form className="form-group" onSubmit={handlerSubmit}>
        <input
          type="text"
          value={todo}
          ref={inputRef}
          placeholder="Enter your todo"
          required
          className="form-control"
          onChange={(event) => setTodo(event.target.value)}
        />
        <button onClick={addTodo}>{editId ? 'EDIT' : 'ADD'}</button>
      </form>
      <div>
        <ul className="list">
          {todos.map((to) => (
            <li className="list-items" key={to.id}>
              <div className="list-item-list" id={to.status ? 'list-item' : ''}>
                {to.list}
              </div>

              <span>
                <IoMdDoneAll
                  className="list-item-icons"
                  id="complete"
                  title="Complete"
                  onClick={() => onComplete(to.id)}
                />
                <FiEdit
                  className="list-item-icons"
                  id="edit"
                  title="Edit"
                  onClick={() => onEdit(to.id)}
                />
                <MdDelete
                  className="list-item-icons"
                  id="delete"
                  title="Delete"
                  onClick={() => onDelete(to.id)}
                />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Todo;
