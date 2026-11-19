// frontend/src/pages/PlaceOrder/PlaceOrder.jsx
import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Field = ({ label, ...props }) => (
  <div className="input-row">
    <label>{label}</label>
    <input {...props} />
  </div>
);

const PlaceOrder = () => {
  const navigate = useNavigate();
  const {
    getTotalCartAmount,//from store context
    token,
    food_list,
    cartItems,
    cartCustomizations,//change
    url,
  } = useContext(StoreContext);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  // Guard: redirect away if not logged in or cart is empty
  useEffect(() => {
    if (!token) {
      toast.error("Please login to place an order.");
      navigate("/cart");
    } else if (getTotalCartAmount() === 0) {
      toast.error("Your cart is empty.");
      navigate("/cart");
    }
  }, [token]);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const placeOrder = async (event) => {
    event.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const orderItems = food_list
        .filter((item) => cartItems[item._id] > 0)
        .map((item) => {
          const custom = cartCustomizations?.[item._id];
          const extraCost =
            custom?.addons?.reduce((sum, a) => sum + (a.price || 0), 0) || 0;

          return {
            ...item,
            price: item.price + extraCost,
            quantity: cartItems[item._id],
            customizations: custom || null,//change due to customization
          };
        });

      if (orderItems.length === 0) {
        toast.error("Your cart is empty.");
        navigate("/cart");
        return;
      }

      const orderData = {
        address: data,
        items: orderItems,
        amount: getTotalCartAmount() + 2,
      };
//request send to backend
      const response = await axios.post(
        `${url}/api/order/place`,
        orderData,
        { headers: { token } }
      );

      if (response.data.success) {
        window.location.replace(response.data.session_url);
      } else {
        toast.error(
          response.data.message || "Could not place order. Please try again."
        );
      }
    } catch (err) {
      console.error("placeOrder error:", err);
      toast.error(
        err?.response?.data?.message ||
          "Network error. Could not place order."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="place-order" onSubmit={placeOrder}>
      <div className="place-order-left">
        <span className="section-tag">📦 Step 1 of 2</span>
        <p className="title">
          Delivery <span>Information</span>
        </p>

        <div className="multi-fields">
          <Field label="First Name" name="firstName" value={data.firstName} onChange={onChangeHandler} disabled={loading} type="text" placeholder="First name" required />
          <Field label="Last Name"  name="lastName"  value={data.lastName}  onChange={onChangeHandler} disabled={loading} type="text" placeholder="Last name"  required />
        </div>
        <Field label="Email Address" name="email"   value={data.email}   onChange={onChangeHandler} disabled={loading} type="email" placeholder="you@example.com"  required />
        <Field label="Street Address" name="street" value={data.street}  onChange={onChangeHandler} disabled={loading} type="text"  placeholder="123, Main Street" required />
        <div className="multi-fields">
          <Field label="City"  name="city"  value={data.city}  onChange={onChangeHandler} disabled={loading} type="text" placeholder="City"  required />
          <Field label="State" name="state" value={data.state} onChange={onChangeHandler} disabled={loading} type="text" placeholder="State" required />
        </div>
        <div className="multi-fields">
          <Field label="ZIP Code" name="zipcode" value={data.zipcode} onChange={onChangeHandler} disabled={loading} type="text" placeholder="ZIP" required />
          <Field label="Country"  name="country" value={data.country} onChange={onChangeHandler} disabled={loading} type="text" placeholder="Country" required />
        </div>
        <Field label="Phone Number" name="phone" value={data.phone} onChange={onChangeHandler} disabled={loading} type="tel" placeholder="+91 98765 43210" required />
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Order Summary</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount()}</p> 
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹{getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>₹{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b>
            </div>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Redirecting to payment…" : "Proceed to Payment →"}
          </button>
          <p className="order-note">🔒 Secured by Stripe</p>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
