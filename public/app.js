"use strict";
// Get elements from the DOM
const form = document.querySelector('.form');
const input = document.querySelector('.input');
const list = document.querySelector('.list');
const removeSelected = document.querySelector('#remove-selected');
const markAllComplete = document.querySelector('#mark-all-complete');
// DOM render-function
function addToDom(todo) {
    const li = document.createElement('li');
    li.id = String(todo.id);
    li.className = 'todo-item';
    const textSpan = document.createElement('span');
    textSpan.innerText = todo.todo;
    textSpan.className = todo.completed ? 'todo-title-completed' : 'todo-title';
    textSpan.addEventListener('click', (e) => {
        const target = e.target;
        const id = Number(target.parentElement.id);
        todos.markCompleted(id);
    });
    const span = document.createElement('span');
    span.innerHTML = '&times;';
    span.className = 'delete-btn';
    span.addEventListener('click', (e) => {
        const target = e.target;
        const id = Number(target.parentElement.id);
        todos.deleteTodo(id);
    });
    if (todo.completed) {
        const preSpan = document.createElement('span');
        preSpan.innerHTML = '&check;';
        preSpan.className = 'checkmark';
        preSpan.addEventListener('click', (e) => {
            const target = e.target;
            const id = Number(target.parentElement.id);
            todos.markCompleted(id);
        });
        li.appendChild(preSpan);
        li.appendChild(textSpan);
        li.appendChild(span);
    }
    else {
        li.appendChild(textSpan);
        li.appendChild(span);
    }
    list.appendChild(li);
}
// Make the Remove completed button disabled if there are no completed todos
function handleRemoveBtn() {
    let completedTodos = false;
    todos.todos.forEach((todo) => {
        if (todo.completed) {
            completedTodos = true;
        }
    });
    if (completedTodos) {
        removeSelected.disabled = false;
    }
    else {
        removeSelected.disabled = true;
    }
}
function handleMarkAllBtn() {
    if (todos.todos.length < 1) {
        markAllComplete.disabled = true;
    }
    else {
        markAllComplete.disabled = false;
    }
}
// A list of the todos and methods that get from and set local storage
class TodosList {
    constructor() {
        this._todos = [];
    }
    get todos() {
        return this._todos;
    }
    getFromStorage() {
        this._todos = JSON.parse(localStorage.getItem('todos'));
    }
    setStorage() {
        localStorage.setItem('todos', JSON.stringify(this._todos));
    }
    addTodo(todo) {
        this.getFromStorage();
        this._todos = [...this._todos, { ...todo }];
        this.setStorage();
        this.renderTodos();
    }
    markCompleted(id) {
        this._todos.forEach((todo) => {
            if (todo.id === id) {
                todo.completed = !todo.completed;
            }
        });
        this.setStorage();
        this.renderTodos();
    }
    markAllCompleted() {
        this._todos.forEach((todo) => {
            todo.completed = true;
        });
        this.setStorage();
        this.renderTodos();
    }
    deleteTodo(id) {
        this._todos = this._todos.filter((todo) => todo.id !== id);
        this.setStorage();
        this.renderTodos();
    }
    removeSelected() {
        this._todos = this._todos.filter((todo) => !todo.completed);
        this.setStorage();
        this.renderTodos();
    }
    renderTodos() {
        list.innerHTML = '';
        this._todos.forEach((todo) => addToDom(todo));
    }
}
const todos = new TodosList();
// Todo constructor
class Todo {
    constructor(todo, id, completed) {
        this.todo = todo;
        this.id = id;
        this.completed = completed;
    }
}
// Handle the submission and creation of new Todo
const handleSubmit = (e) => {
    e.preventDefault();
    const inputValue = input.value;
    if (inputValue !== '') {
        const id = new Date().getTime();
        const todo = new Todo(inputValue, id, false);
        input.value = '';
        todos.addTodo(todo);
        handleMarkAllBtn();
    }
};
// Event listeners
form.addEventListener('submit', handleSubmit);
list.addEventListener('click', handleRemoveBtn);
list.addEventListener('click', handleMarkAllBtn);
removeSelected.addEventListener('click', () => {
    todos.removeSelected();
    handleRemoveBtn();
    handleMarkAllBtn();
});
markAllComplete.addEventListener('click', () => {
    todos.markAllCompleted();
    handleRemoveBtn();
});
// Render the content from local storage on page load
window.onload = () => {
    todos.getFromStorage();
    todos.renderTodos();
    handleRemoveBtn();
    handleMarkAllBtn();
};
//# sourceMappingURL=app.js.map