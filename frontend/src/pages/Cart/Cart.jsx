import React, { useContext } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const {
    food_list,
    cartItems,
    removeFromCart,
    getTotalCartAmount,
    url,
    cartCustomizations,
  } = useContext(StoreContext);

  const navigate = useNavigate();

  const hasItems = food_list?.some((item) => cartItems?.[item._id] > 0);

  return (
    <div className="cart">
      <h2 className="cart-title">
        Your <span>Cart</span>
      </h2>

      <div className="cart-items">
        <div className="cart-items-title">
          <p>Image</p>
          <p>Name</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <hr />

        {!hasItems ? (
          <div className="cart-empty">
            <p>Your cart is empty. Add some delicious food! 🍛</p>
          </div>
        ) : (
          food_list.map((item) => {
            if (cartItems?.[item._id] > 0) {
              const custom = cartCustomizations?.[item._id];
              const extraCost =
                custom?.addons?.reduce((sum, a) => sum + (a.price || 0), 0) || 0;
              const unitPrice = item.price + extraCost;

              return (
                <div key={item._id}>
                  <div className="cart-items-title cart-items-item">
                    <img src={url + "/images/" + item.image} alt={item.name} />
                    <div>
                      <p>{item.name}</p>
                      {custom && (
                        <>
                          <p>Spice: {custom.spice || "Medium"}</p>
                          <p>
                            Add-ons:{" "}
                            {custom.addons?.length > 0
                              ? custom.addons
                                  .map((a) => `${a.name} (+₹${a.price})`)
                                  .join(", ")
                              : "None"}
                          </p>
                        </>
                      )}
                    </div>

                    <p>₹{unitPrice}</p>
                    <p>{cartItems[item._id]}</p>
                    <p>₹{unitPrice * cartItems[item._id]}</p>
                    <p
                      onClick={() => removeFromCart(item._id)}
                      className="cross"
                    >
                      ×
                    </p>
                  </div>
                  <hr />
                </div>
              );
            }
            return null;
          })
        )}
      </div>

      <div className="cart-bottom">
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
              <b>
                ₹{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}
              </b>
            </div>
          </div>
          <button onClick={() => navigate("/order")}>
            Proceed to Checkout →
          </button>
        </div>

        <div className="cart-promocode">
          <p className="cart-promocode-label">Have a promo code?</p>
          <p className="cart-promocode-sub">
            Enter your code below to get a discount
          </p>
          <div className="cart-promocode-input">
            <input type="text" placeholder="Enter promo code" />
            <button>Apply</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
