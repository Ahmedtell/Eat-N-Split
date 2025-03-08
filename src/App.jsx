import PropTypes from "prop-types"; // Import PropTypes
import "./index.css";
import { useState } from "react";
import person1 from "./assets/Person-1.png";
import person2 from "./assets/Person-2.png";
import person3 from "./assets/Person-3.png";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: person1,
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: person2,
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: person3,
    balance: 0,
  },
];

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setshowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  // Function to toggle the Add friend form
  function handleShowAddFriend() {
    setshowAddFriend((showAddFriend) => !showAddFriend);
  }

  // Function to add a new friend
  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setshowAddFriend(true);
  }

  // Study this later
  function handleSelection(friend) {
    setSelectedFriend((prev) => (prev?.id === friend.id ? null : friend));
    // To close FormAddFriend when select any choice
    setshowAddFriend(true);
  }

  function handleSplitBill(value) {
    console.log(value);

    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );

    // to hide the split bill form after split a bill
    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={friends}
          handleSelection={handleSelection}
          selectedFriend={selectedFriend}
        />
        {!showAddFriend && <FormAddFriend handleAddFriend={handleAddFriend} />}
        <Button
          onClick={handleShowAddFriend}
          style={
            showAddFriend
              ? { backgroundColor: "#00c72b" }
              : { backgroundColor: "red" }
          }
        >
          {showAddFriend ? "Add friend" : "Close"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function FriendList({ friends, handleSelection, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          handleSelection={handleSelection}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, handleSelection, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}€
        </p>
      )}

      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owe you {friend.balance}€
        </p>
      )}

      {friend.balance === 0 && <p>You and {friend.name} are even</p>}
      <Button
        onClick={() => {
          handleSelection(friend);
        }}
        style={
          isSelected
            ? { backgroundColor: "#ff922b" }
            : { backgroundColor: "#ffa94d" }
        }
      >
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function Button({ children, onClick, style }) {
  return (
    <button onClick={onClick} style={style} className="button">
      {children}
    </button>
  );
}

function FormAddFriend({ handleAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return; // to prevent empty values from being added

    const id = crypto.randomUUID(); // Generate a random ID
    // Create a new friend object
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };

    handleAddFriend(newFriend); // Call the handleAddFriend function

    // Reset the form input fields
    setName("");
    setImage("");
  }
  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>🧑‍🤝‍🧑 Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>🌅 Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const paidByFriend = bill ? bill - paidByUser : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();

    // to prevent submit if there is no bill or no paidUser
    if (!bill || !paidByUser) return;

    onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h3>Split a bill with {selectedFriend.name}</h3>

      <label>💰 Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>🧍‍♂️Your expense</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
      />
      <label>🧑‍🤝‍🧑 {selectedFriend.name}&#39;s expense</label>
      <input className="disabled" type="text" value={paidByFriend} disabled />

      <label>🤑 Who is paying the bill</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button>Split bill</Button>
    </form>
  );
}

Friend.propTypes = {
  friend: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    balance: PropTypes.number.isRequired,
  }).isRequired,
  handleSelection: PropTypes.func.isRequired,
  selectedFriend: PropTypes.object,
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  style: PropTypes.object,
};

FormAddFriend.propTypes = {
  handleAddFriend: PropTypes.func.isRequired,
};

FriendList.propTypes = {
  friends: PropTypes.array.isRequired,
  handleSelection: PropTypes.func.isRequired,
  selectedFriend: PropTypes.object,
};

FormSplitBill.propTypes = {
  selectedFriend: PropTypes.object,
  onSplitBill: PropTypes.func,
};
