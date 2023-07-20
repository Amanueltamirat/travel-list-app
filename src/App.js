// import logo from './logo.svg';
import { useState } from "react";
import "./App.css";
// import PackingList from "./PackingList";
// import Form from "./Form";
import Logo from "./Logo";
// const initialItems = [
//   { id: 1, description: "Passports", quantity: 2, packed: true },
//   { id: 2, description: "Socks", quantity: 12, packed: false },
//   { id: 2, description: "camera", quantity: 2, packed: false },
// ];
function App() {
  const [items, setItems] = useState([]);
  function handleItemsState(item) {
    setItems((items) => [...items, item]);
  }
  function handleDeleteItem(id) {
    setItems((items) => items.filter((item) => id !== item.id));
  }
  function handleToggle(id) {
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  }
  function handleClear() {
    const confirmed = window.confirm(
      "Are sure? do you want to delete all items? "
    );
    if (confirmed) setItems([]);
  }
  return (
    <div className="app">
      <Logo />
      <Form onAddItems={handleItemsState} />
      <PackingList
        items={items}
        onDeleteItem={handleDeleteItem}
        onHandleToggle={handleToggle}
        onHandleClrar={handleClear}
      />
      <Status items={items} />
    </div>
  );
}

export default App;
function Form({ onAddItems }) {
  const [description, setDescription] = useState("TEST");
  const [quantity, setQuantity] = useState(1);

  function hundleSubmit(e) {
    e.preventDefault();
    const newItem = {
      description,
      quantity,
      packed: false,
      id: Date.now(),
    };

    onAddItems(newItem);

    setDescription("");
    setQuantity(1);
  }

  return (
    <form className="add-form" onSubmit={hundleSubmit}>
      <h3>What do you need for your trip</h3>
      <select value={quantity} onChange={(e) => setQuantity(+e.target.value)}>
        {Array.from({ length: 20 }, (k, i) => i + 1).map((num) => (
          <option value={num} key={num}>
            {num}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Item..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button>ADD</button>
    </form>
  );
}

function PackingList({ items, onDeleteItem, onHandleToggle, onHandleClrar }) {
  const [sortedBy, setSotrtedBy] = useState("input");
  let sortedItem;
  if (sortedBy === "input") sortedItem = items;
  if (sortedBy === "description")
    sortedItem = items
      .slice()
      .sort((a, b) => a.description.localeCompare(b.description));
  if (sortedBy === "packed")
    sortedItem = items
      .slice()
      .sort((a, b) => Number(a.packed) - Number(b.packed));

  return (
    <div className="list">
      <ul>
        {sortedItem.map((item) => (
          <Item
            item={item}
            onDeleteItem={onDeleteItem}
            onHandleToggle={onHandleToggle}
          />
        ))}
      </ul>
      <div className="actions">
        <select value={sortedBy} onChange={(e) => setSotrtedBy(e.target.value)}>
          <option value="input">Sort by input</option>
          <option value="description">Sort by description</option>
          <option value="packed">Sort by packed</option>
        </select>
        <button onClick={onHandleClrar}>Clear list</button>
      </div>
    </div>
  );
}
export function Item({ item, onDeleteItem, onHandleToggle }) {
  return (
    <li>
      <input type="checkbox" onClick={() => onHandleToggle(item.id)} />
      <span style={item.packed ? { textDecoration: "line-through" } : {}}>
        {item.quantity} {item.description}
      </span>
      <button className="item-btn" onClick={() => onDeleteItem(item.id)}>
        x
      </button>
    </li>
  );
}
function Status({ items }) {
  if (!items.length)
    return (
      <p className="stats">
        <em>Add Some Items</em>
      </p>
    );

  const numItems = items.length;
  const numPacked = items.filter((item) => item.packed).length;
  const perecent = (numPacked / numItems) * 100;
  return (
    <footer className={`stats ${perecent === 100 ? "packed" : ""}`}>
      <em>
        {perecent === 100
          ? `you got everything, you're ready to go!`
          : `you have ${numItems} items on your list, and you already packed
        ${numPacked}(${Math.floor(perecent)}%)`}
      </em>
    </footer>
  );
}
