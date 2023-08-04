let todos = [];
const button = document.getElementById("button");
const inputValue = document.getElementById("input");
const list = document.getElementById("todo__list");

window.addEventListener("load", getItemsFromStorage);
list.addEventListener("click", onToDoItemClick);
button.addEventListener("click", onButtonClick);

function saveItemsToStorage(items) {
  localStorage.setItem("todos", JSON.stringify(items));
}

function getItemsFromStorage() {
  const todosData = localStorage.getItem("todos");
  if (!todosData) return;
  const parsed = JSON.parse(todosData);
  parsed.forEach((item, i) => {
    const li = createTodoItem(item.value, item.isDone, item.id);
    list.appendChild(li);
  });
  setTodos(parsed);
}

function createTodoItem(value, isDone, id) {
  const checkboxClass = isDone ? "checkbox checkbox--checked" : "checkbox";
  const liClass = isDone ? "list__item checked" : "list__item";
  const li = createNewElement("li", liClass, id, value);
  const btn = createNewElement("button", "item__remove-button", null, "✖");
  const checkbox = createNewElement("span", checkboxClass, null, "✓");
  li.appendChild(btn);
  li.appendChild(checkbox);
  return li;
}

function addToDo(value, id) {
  const item = { value, id, isDone: false };
  return [...todos, item];
}

function removeToDo(id) {
  const filtered = todos.filter((item) => item.id !== id);
  const updatedTodos = filtered.length
    ? [
        ...filtered.slice(0, id - 1),
        ...filtered.slice(id - 1).map((item) => ({ ...item, id: item.id - 1 })),
      ]
    : [];
  return updatedTodos;
}

function changeStatusOfItem(id) {
  return todos.map((item) =>
    item.id === id ? { ...item, isDone: !item.isDone } : item
  );
}

function setTodos(updatedTodos) {
  todos = updatedTodos;
}

function createNewElement(tagName, className, id, textContent) {
  const element = document.createElement(tagName);
  element.className = className;
  element.textContent = textContent;
  if (id) element.id = id;
  return element;
}

function reIndex(deletedIndex) {
  const items = [...list.children];
  items.forEach((e, i) => (e.id = i + 1));
}

function onToDoItemClick(e) {
  const li = e.target.parentNode;
  const id = +li.id;
  let updatedTodos;
  if (e.target.tagName === "BUTTON") {
    list.removeChild(e.target.parentNode);
    updatedTodos = removeToDo(id);
    reIndex(id);
  } else if (e.target.tagName === "SPAN") {
    e.target.classList.toggle("checkbox--checked");
    li.classList.toggle("checked");
    updatedTodos = changeStatusOfItem(id);
  } else return;
  setTodos(updatedTodos);
  saveItemsToStorage(todos);
}

function onButtonClick() {
  const value = inputValue.value.trim();
  if (!value) return;
  const li = createTodoItem(value, false, list.children.length + 1);
  list.appendChild(li);
  inputValue.value = "";
  const updatedTodos = addToDo(value, +li.id);
  setTodos(updatedTodos);
  saveItemsToStorage(todos);
}
