import React, { useState, useEffect } from "react";
import Footer from "../comp/Footer";
import Navbar from "../comp/Navbar";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, push, remove } from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { useAuth } from "../Authentication/Authpro";
import "../asserts/style/admin.css";

const firebaseConfig = {
  apiKey: "AIzaSyBnnUtNzcnw0UYR8ikFJptHkuzZFkvp4k4",
  authDomain: "online-food-order-80833.firebaseapp.com",
  databaseURL: "https://online-food-order-80833-default-rtdb.firebaseio.com",
  projectId: "online-food-order-80833",
  storageBucket: "online-food-order-80833.appspot.com",
  messagingSenderId: "980243962311",
  appId: "1:980243962311:web:6c80cf64470477b1bc21e2",
  measurementId: "G-FF4PLG3S2T",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const storage = getStorage(app);

export default function Admin() {
  const [dish_Name, setDish_Name] = useState("");
  const [dish_Price, setDish_Price] = useState("");
  const [menu, setmenu] = useState([]);
  const [image, setImage] = useState(null);
  const { username } = useAuth();

  const generateUniqueId = () => {
    return `dish_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  };

  const handleSubmitMenu = async (event) => {
    event.preventDefault();
    if (!dish_Name || !dish_Price || !image) {
      alert("Please fill out all fields and upload an image.");
      return;
    }

    const dish_Id = generateUniqueId();

    try {
      const storageReference = storageRef(storage, `images/${image.name}`);
      await uploadBytes(storageReference, image);
      const imageUrl = await getDownloadURL(storageReference);

      const menuRef = ref(database, "menu");
      await push(menuRef, {
        dish_Name,
        dish_Price,
        dish_Id,
        imageUrl,
      });

      alert("Menu submitted successfully");
      setDish_Name("");
      setDish_Price("");
      setImage(null);
    } catch (error) {
      console.error(error);
      alert("Error submitting menu. Please try again.");
    }
  };

  const handleRemoveMenuItem = async (firebaseKey) => {
    try {
      const menuRef = ref(database, `menu/${firebaseKey}`);
      await remove(menuRef);
      console.log(`Menu item ${firebaseKey} deleted successfully`);
      alert(`Menu item deleted successfully`);
    } catch (error) {
      console.error("Error deleting menu:", error);
      alert("Error deleting menu:", error);
    }
  };

  useEffect(() => {
    const menuRef = ref(database, "menu");
    onValue(menuRef, (data) => {
      if (data.exists()) {
        const menuItemsArray = Object.entries(data.val()).map(
          ([key, value]) => ({
            key,...value,
          })
        );
        setmenu(menuItemsArray);
      } else {
        setmenu([]);
        console.log("No menu items found");
      }
    });
  }, []);

  return (
    <section>
      <section className="start">
        <Navbar />
        <div className="top">
          <div className="greet">
            <h2>Hello {username}, Welcome back</h2>
          </div>
          <form className="add" onSubmit={handleSubmitMenu}>
            <label>
              <h4>Enter Dish_Name</h4>
              <input
                type="text"
                placeholder="Dish_Name"
                value={dish_Name}
                onChange={(e) => setDish_Name(e.target.value)}
                required
              />
            </label>
            <label>
              <h4>Enter Dish_Price</h4>
              <input
                type="number"
                placeholder="Dish_Price"
                value={dish_Price}
                onChange={(e) => setDish_Price(e.target.value)}
                required
              />
            </label>
            <label>
              <h4>Upload Image</h4>
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                required
              />
            </label>
            <button className="dish" type="submit">
              Add dish
            </button>
          </form>
        </div>

        <section className="home collection">
          <h2>Menu</h2>
          <ul className="menu">
            {menu.map((menuItem, index) => (
              <li key={menuItem.key} className="food">
                <img
                  className="menuimg"
                  src={menuItem.imageUrl}
                  alt={menuItem.dish_Name}
                />
                <h3>{menuItem.dish_Name}</h3>
                <p>Price: ${menuItem.dish_Price}</p>
                <button onClick={() => handleRemoveMenuItem(menuItem.key)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </section>
      </section>
      <Footer />
    </section>
  );
}