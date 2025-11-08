import React, { useState, useEffect } from "react";
import Footer from "../comp/Footer";
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
const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const formatCurrency = (value) =>
  currencyFormatter.format(Number(value) || 0);
const FALLBACK_IMAGE = "/lo.jpg";

export default function Admin() {
  const [dish_Name, setDish_Name] = useState("");
  const [dish_Price, setDish_Price] = useState("");
  const [menu, setmenu] = useState([]);
  const [orders, setOrders] = useState([]);
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
      event.target.reset();
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
      alert(`Menu item deleted successfully`);
    } catch (error) {
      console.error("Error deleting menu:", error);
      alert("Error deleting menu:");
    }
  };

  useEffect(() => {
    const menuRef = ref(database, "menu");
    const unsubscribe = onValue(menuRef, (data) => {
      if (data.exists()) {
        const menuItemsArray = Object.entries(data.val()).map(([key, value]) => ({
          key,
          ...value,
        }));
        setmenu(menuItemsArray);
      } else {
        setmenu([]);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const ordersRef = ref(database, "orders");
    const unsubscribe = onValue(ordersRef, (data) => {
      if (data.exists()) {
        const ordersArray = Object.entries(data.val()).map(([key, value]) => ({
          key,
          ...value,
        }));
        setOrders(ordersArray);
      } else {
        setOrders([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const totalMenuItems = menu.length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce(
    (sum, order) => sum + Number(order.totalCost || 0),
    0
  );
  const activeTables = (() => {
    const tableSet = new Set();
    orders.forEach((order) => {
      const tableValue = order.Table || order.table;
      if (tableValue) {
        tableSet.add(String(tableValue));
      }
    });
    return tableSet.size;
  })();

  const heroMetrics = [
    { label: "Menu Items", value: totalMenuItems },
    { label: "Orders", value: totalOrders },
    { label: "Active Tables", value: activeTables },
    { label: "Revenue", value: formatCurrency(totalRevenue) },
  ];

  const sortedMenu = [...menu].sort((a, b) => {
    const nameA = (a.dish_Name || "").toLowerCase();
    const nameB = (b.dish_Name || "").toLowerCase();
    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
  });

  const orderedOrders = [...orders].reverse();

  const getStatusDescriptor = (status) => {
    const normalized = String(status || "pending").toLowerCase();
    const labelMap = {
      paid: "Paid",
      success: "Paid",
      succeeded: "Paid",
      pending: "Pending",
      processing: "Processing",
      failed: "Failed",
      cancelled: "Cancelled",
      canceled: "Cancelled",
      refunded: "Refunded",
    };
    const sanitized = normalized.replace(/[^a-z0-9]+/g, "-") || "pending";
    const label =
      labelMap[normalized] ||
      `${normalized.charAt(0).toUpperCase()}${normalized.slice(1)}`;
    return {
      label,
      className: `admin-status admin-status-${sanitized}`,
    };
  };

  return (
    <section className="admin-shell">
      <header className="admin-header">
        <div className="admin-brand">
          <div className="admin-brand-icon">D</div>
          <div className="admin-brand-copy">
            <span>Delightio</span>
            <strong>Admin Console</strong>
          </div>
        </div>
        <nav className="admin-nav">
          <a href="#dashboard">Dashboard</a>
          <a href="#orders">Order</a>
        </nav>
        <div className="admin-user">
          <span className="admin-user-avatar">
            {(username && username.charAt(0).toUpperCase()) || "A"}
          </span>
          <span>{username || "Admin"}</span>
        </div>
      </header>
      <main className="admin-main">
        <section id="dashboard" className="admin-dashboard">
          <div className="admin-hero">
            <div className="admin-hero-text">
              <p>Welcome back</p>
              <h2>{username || "Admin"}</h2>
              <span>Curate dishes and keep your menu fresh.</span>
            </div>
            <div className="admin-hero-metrics">
              {heroMetrics.map((metric) => (
                <div key={metric.label} className="admin-metric">
                  <span>{metric.label}</span>
                  <strong>{metric.value}</strong>
                </div>
              ))}
            </div>
          </div>
          <div className="admin-panels">
            <form className="admin-form" onSubmit={handleSubmitMenu}>
              <h3>Add new dish</h3>
              <label>
                Dish Name
                <input
                  type="text"
                  placeholder="Eg. Paneer Tikka"
                  value={dish_Name}
                  onChange={(e) => setDish_Name(e.target.value)}
                  required
                />
              </label>
              <label>
                Price
                <input
                  type="number"
                  placeholder="Eg. 299"
                  min="0"
                  step="0.01"
                  value={dish_Price}
                  onChange={(e) => setDish_Price(e.target.value)}
                  required
                />
              </label>
              <label className="admin-upload">
                Dish Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files?.[0] || null)}
                  required
                />
              </label>
              <button type="submit">Save dish</button>
            </form>
            <div className="admin-menu">
              <div className="admin-section-header">
                <div>
                  <h3>Menu catalogue</h3>
                  <p>Review and manage live dishes.</p>
                </div>
                <span className="admin-pill">{menu.length}</span>
              </div>
              <ul className="admin-menu-grid">
                {sortedMenu.length === 0 ? (
                  <li className="admin-empty">
                    No dishes yet. Start by adding your first item.
                  </li>
                ) : (
                  sortedMenu.map((menuItem) => (
                    <li key={menuItem.key} className="admin-menu-card">
                      <img
                        src={menuItem.imageUrl || FALLBACK_IMAGE}
                        alt={menuItem.dish_Name}
                        onError={(event) => {
                          event.currentTarget.src = FALLBACK_IMAGE;
                        }}
                      />
                      <div className="admin-menu-content">
                        <div className="admin-menu-headline">
                          <h4>{menuItem.dish_Name}</h4>
                          <span>{formatCurrency(menuItem.dish_Price)}</span>
                        </div>
                        <p>{menuItem.dish_Id}</p>
                        <button
                          type="button"
                          onClick={() => handleRemoveMenuItem(menuItem.key)}
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </section>
        <section id="orders" className="admin-orders">
          <div className="admin-section-header">
            <div>
              <h3>Orders overview</h3>
              <p>Track live orders and payment status.</p>
            </div>
            <span className="admin-pill">{orders.length}</span>
          </div>
          <div className="admin-orders-list">
            {orderedOrders.length === 0 ? (
              <div className="admin-empty">No orders recorded yet.</div>
            ) : (
              orderedOrders.map((order) => {
                const status = getStatusDescriptor(order.paymentStatus);
                const tableLabel = order.Table || order.table || "N/A";
                const itemCount = Array.isArray(order.menuItems)
                  ? order.menuItems.reduce(
                      (total, item) => total + Number(item.quantity || 0),
                      0
                    )
                  : 0;
                const displayItems = Array.isArray(order.menuItems)
                  ? order.menuItems.slice(0, 3)
                  : [];
                return (
                  <article key={order.key} className="admin-order-card">
                    <div className="admin-order-header">
                      <div className="admin-order-title">
                        <span className="admin-order-name">
                          {order.customerName || "Guest"}
                        </span>
                        <span className="admin-order-table">
                          Table {tableLabel}
                        </span>
                      </div>
                      <span className={status.className}>{status.label}</span>
                    </div>
                    <div className="admin-order-meta">
                      <span>{itemCount} items</span>
                      <span>{formatCurrency(order.totalCost)}</span>
                      <span>{order.stripeSessionId || "Manual"}</span>
                    </div>
                    {displayItems.length > 0 ? (
                      <ul className="admin-order-items">
                        {displayItems.map((item, index) => (
                          <li
                            key={`${order.key}-${item.dish_Id || index}`}
                          >
                            <span>{item.dish_Name}</span>
                            <span>x{item.quantity || 1}</span>
                          </li>
                        ))}
                        {Array.isArray(order.menuItems) &&
                        order.menuItems.length > displayItems.length ? (
                          <li className="admin-more">
                            +{order.menuItems.length - displayItems.length} more
                          </li>
                        ) : null}
                      </ul>
                    ) : null}
                  </article>
                );
              })
            )}
          </div>
        </section>
      </main>
      <Footer />
    </section>
  );
}
