import React, { useState } from "react";
export default function
FoodCustomization({food, onClose, onAddToCart}){
  const[addons, setAddons] = useState([]);
  const[spice,setSpice] = useState("Medium");

  const options=[
    {name: "Extra Cheese", price: 30},
    {name: "Extra Paneer", price: 40},
    {name: "Olives", price: 20}
  ];
  const extra = addons.reduce((sum,a)=> sum+ a.price, 0);
  const total = food.price + extra;

  return(
    <div
  className="customization-modal">
    <button onClick={onClose}>x</button>
    <h2>{food.name}</h2>
    <h4>Add-ons</h4>
    {options.map(a =>(
      <label key={a.name}>
        <input type="checkbox"
        onChange={e=> setAddons(old => e.target.checked
          ?[...old, a]
          : old.filter(x => x.name !== a.name)
        )
      }/>
      {a.name} (+{a.price})
      </label>
    ))}
    
    <h4>Spice Level</h4>
    <select value={spice}
    onChange={e =>
      setSpice(e.target.value)}>
        {["Mild", "Medium", "Hot", "Extra Hot"].map(s =>
          <option key={s}>{s}</
          option>
        )}
      </select>

      <h3>Total: {total}</h3>
      <button onClick={() =>{
        onAddToCart(food, {addons, spice, total});
        onClose();
      }}>
        Add to Cart
      </button>
  </div>
  );
}
