import React, { useContext, useState } from "react";
import "./FoodItem.css";
import { assets } from "../../assets/frontend_assets/assets";
import { StoreContext } from "../../context/StoreContext";
import FoodCustomization from "../FoodCustomization/FoodCustomization";

const FoodItem = ({ id, name, price, description, image }) => {
  const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext);
  //popup  visible
  const [showCustomization, setShowCustomization] = useState(false);

  const food = { id, name, price, description, image };

  return (
    <>
      <div className="food-item">
        <div className="food-item-img-container">
          <img
            src={url + "/images/" + image}
            alt={name}
            className="food-item-image"
          />
          {!cartItems[id] ? (
            <img
              className="add"
              onClick={() => addToCart(id)}
              src={assets.add_icon_white}
              alt="Add to cart"
            />
          ) : (
            <div className="food-item-counter">
              <img
                onClick={() => removeFromCart(id)}
                src={assets.remove_icon_red}
                alt="Remove"
              />
              <p>{cartItems[id]}</p>
              <img
                onClick={() => addToCart(id)}
                src={assets.add_icon_green}
                alt="Add"
              />
            </div>
          )}
        </div>

        <div className="food-item-info">
          <div className="food-item-name-rating">
            <p>{name}</p>
            <img src={assets.rating_starts} alt="Rating" />
          </div>
          <p className="food-item-desc">{description}</p>
          <div className="food-item-bottom">
            <p className="food-item-price">₹{price}</p>
            <span className="food-item-tag">Free delivery</span>
          </div>
        </div>

        <button onClick={() => setShowCustomization(true)}>
          Customize
        </button>
      </div>

      {showCustomization && (
        <FoodCustomization
          food={food}//passes 
          onClose={() => setShowCustomization(false)}
          onAddToCart={(item, customization) => {
            addToCart(item.id, customization);
          }}//passes to store context
        />
      )}
    </>
  );
};

export default FoodItem;
