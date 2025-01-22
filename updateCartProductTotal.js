import { getCartProductFromLS } from "./getCartProducts.js";

export const updateCartProductTotal = () => {
  let productSubTotal = document.querySelector(".productSubTotal");
  let productTax = document.querySelector(".productTax");
  let productFinalTotal = document.querySelector(".productFinalTotal");

  let localCartProducts = getCartProductFromLS();
  let initialValue = 0;
  let totalProductPrice = localCartProducts.reduce((accum, curElem) => {
    let productPrice = parseInt(curElem.price) || 0;
    return accum + productPrice;
  }, initialValue);

  let tax=parseInt(totalProductPrice*0.13);

  productSubTotal.textContent = `रु.${totalProductPrice}`;
  productTax.textContent = `रु.${tax}`;
  productFinalTotal.textContent = `रु.${totalProductPrice +  tax }`;
  
};


