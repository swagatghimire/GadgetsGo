import './style.css'
import products from "./api/products.json";
import { showProductContainer } from "./homeProductCards.js";

//function to call products
showProductContainer(products);
