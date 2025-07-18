let todoItemsContainer = document.getElementById("todoItemsContainer");
let addTodoButton = document.getElementById("addTodoButton");

function getTodoListFromLocalStorage() {
  let stringifiedTodoList = localStorage.getItem("todoList");
  let parsedTodoList = JSON.parse(stringifiedTodoList);
  return parsedTodoList === null ? [] : parsedTodoList;
}

function saveTodoListToLocalStorage() {
  localStorage.setItem("todoList", JSON.stringify(todoList));
}

let todoList = getTodoListFromLocalStorage();

// Ensure unique IDs even after deletions
let todosCount = todoList.length > 0
  ? Math.max(...todoList.map(todo => todo.uniqueNo))
  : 0;

function onAddTodo() {
  let userInputElement = document.getElementById("todoUserInput");
  let userInputValue = userInputElement.value.trim();

  if (userInputValue === "") {
    alert("Enter Valid Text");
    return;
  }

  todosCount += 1;

  let newTodo = {
    text: userInputValue,
    uniqueNo: todosCount,
    isChecked: false
  };

  todoList.push(newTodo);
  createAndAppendTodo(newTodo);
  saveTodoListToLocalStorage();
  userInputElement.value = "";
}

addTodoButton.onclick = onAddTodo;

function onTodoStatusChange(checkboxId, labelId, todoId) {
  let checkboxElement = document.getElementById(checkboxId);
  let labelElement = document.getElementById(labelId);
  labelElement.classList.toggle("checked");

  let todoObjectIndex = todoList.findIndex(function (eachTodo) {
    return "todo" + eachTodo.uniqueNo === todoId;
  });

  if (todoObjectIndex !== -1) {
    todoList[todoObjectIndex].isChecked = !todoList[todoObjectIndex].isChecked;
    saveTodoListToLocalStorage();
  }
}

function onDeleteTodo(todoId) {
  let todoElement = document.getElementById(todoId);
  if (todoElement) {
    todoItemsContainer.removeChild(todoElement);
  }

  let deleteElementIndex = todoList.findIndex(function (eachTodo) {
    return "todo" + eachTodo.uniqueNo === todoId;
  });

  if (deleteElementIndex !== -1) {
    todoList.splice(deleteElementIndex, 1);
    saveTodoListToLocalStorage();
  }
}

function createAndAppendTodo(todo) {
  let todoId = "todo" + todo.uniqueNo;
  let checkboxId = "checkbox" + todo.uniqueNo;
  let labelId = "label" + todo.uniqueNo;

  let todoElement = document.createElement("li");
  todoElement.classList.add("todo-item-container", "d-flex", "flex-row");
  todoElement.id = todoId;
  todoItemsContainer.appendChild(todoElement);

  let inputElement = document.createElement("input");
  inputElement.type = "checkbox";
  inputElement.id = checkboxId;
  inputElement.checked = todo.isChecked;
  inputElement.classList.add("checkbox-input");

  inputElement.onclick = function () {
    onTodoStatusChange(checkboxId, labelId, todoId);
  };

  todoElement.appendChild(inputElement);

  let labelContainer = document.createElement("div");
  labelContainer.classList.add("label-container", "d-flex", "flex-row");
  todoElement.appendChild(labelContainer);

  let labelElement = document.createElement("label");
  labelElement.setAttribute("for", checkboxId);
  labelElement.id = labelId;
  labelElement.classList.add("checkbox-label");
  labelElement.textContent = todo.text;
  if (todo.isChecked) {
    labelElement.classList.add("checked");
  }
  labelContainer.appendChild(labelElement);

  let deleteIconContainer = document.createElement("div");
  deleteIconContainer.classList.add("delete-icon-container");
  labelContainer.appendChild(deleteIconContainer);

  let deleteIcon = document.createElement("i");
  deleteIcon.classList.add("far", "fa-trash-alt", "delete-icon");

  deleteIcon.onclick = function () {
    onDeleteTodo(todoId);
  };

  deleteIconContainer.appendChild(deleteIcon);
}

// Initial rendering from local storage
for (let todo of todoList) {
  createAndAppendTodo(todo);
}
