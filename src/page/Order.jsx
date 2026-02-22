import React, { useState, useEffect } from "react";
import "../asserts/style/home.css";
import "../asserts/style/order.css";
import Navbar from "../comp/Navbar";
import Footer from "../comp/Footer";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, remove } from "firebase/database";

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

export default function Order() {
  const [orders, setorders] = useState([]);

  const handleDeleteOrder = async (orderId) => {
    try {
      const orderRef = ref(database, `orders/${orderId}`);
      await remove(orderRef);
      console.log(`Order ${orderId} deleted successfully`);
      alert(`Order ${orderId} deleted successfully`);

    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Error deleting order:", error);

    }
  };

  useEffect(() => {
    const orderRef = ref(database, "orders");
    onValue(orderRef, (data) => {
      if (data.exists()) {
        const orderItemsArray = Object.values(data.val()); 
        setorders(orderItemsArray);
      } else {
        console.log("No menu items found");
      }
    });
  }, []);
  return (
    <div>
      <Navbar/>
      <section className="home collection n">
        <div className="orderstart">
          <h1>Orders</h1>
        </div>
        <ul className="menu order">
          {orders.map((order, index) => (
            <li key={index} className="food2">
              <h3>{order.Table}{index}</h3>
              <h3>{order.customerName}</h3>
              <ul className="list">
                {(Array.isArray(order.menuItems)
                  ? order.menuItems
                  : order.menuItems
                  ? Object.values(order.menuItems)
                  : []
                ).map((item, index) => (
                  <li key={item.dish_Id ?? index}>
                    <p>
                      {item.dish_Name} {item.quantity}
                    </p>
                  </li>
                ))}
              </ul>
              <p>Total: ${order.totalCost}</p>
              <button onClick={() => handleDeleteOrder(order.orderid)}>Done</button>
            </li>
          ))}
        </ul>
      </section>
      <Footer/>
    </div>

  );
}
