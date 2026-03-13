document.addEventListener("DOMContentLoaded", function () {
  /*HEADER*/
  /*calling code and updates count - header in every html - link in html*/
  fetch("header.html")
    .then((response) => response.text())
    .then((data) => {
      const header = document.getElementById("header");
      if (header) header.innerHTML = data;
      updateCartCount();
    });

  /*FOOTER*/
  /*calling code - footer in every html - link in html*/
  fetch("footer.html")
    .then((response) => response.text())
    .then((data) => {
      const footer = document.getElementById("footer");
      if (footer) footer.innerHTML = data;
    });

  /*CART COUNT*/
  /*cart - localstorage with quantity*/
  function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart")) || []; // AI helped with ||, if localstorage is empty - code not crash.
    let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    const cartCount = document.getElementById("cart-count");
    if (!cartCount) return;

    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? "flex" : "none";
  }

  /*PRODUCT IMAGE SWITCH*/
  /*clicing on small images in product page*/
  const ProductImg = document.getElementById("Product-image");
  const SmallImg = document.getElementsByClassName("small-img");

  if (ProductImg && SmallImg.length > 0) {
    for (let i = 0; i < SmallImg.length; i++) {
      SmallImg[i].onclick = function () {
        ProductImg.src = this.src;
      };
    }
  }

  /*ADD TO CART*/
  /* add to cart - purchase logic - saves to localstorage*/
  const addBtn = document.getElementById("add-to-cart");

  if (addBtn) {
    addBtn.addEventListener("click", function (e) {
      e.preventDefault();

      const quantity = parseInt(
        document.querySelector("input[type='number']").value,
      );

      const product = {
        id: "Woodchair",
        name: "Wood Chair by Ellaire",
        price: 500.0,
        image: "images/woodchairx.png",
        quantity: quantity,
      };

      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      let existingProduct = cart.find((item) => item.id === product.id);

      if (existingProduct) {
        existingProduct.quantity += product.quantity;
      } else {
        cart.push(product);
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCount();
      alert("Product added to cart!");
    });
  }

  /*CART PAGE*/
  /*cart items - price, image from html. Some help of AI (google gemini) for logic for fallback values || [] */
  function loadCart() {
    const cartItemsContainer = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");

    if (!cartItemsContainer) return;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let total = 0;

    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = "<p>Your Cart is Empty.</p>";
      cartTotal.innerHTML = "";
      return;
    }
    /* Lines 102 - 118, help of YT video: https://www.youtube.com/watch?v=yQimoqo0-7g&list=PLjwm_8O3suyM_2Lo9aAIw3HqjOPor8j9g*/
    cart.forEach((item, index) => {
      total += item.price * item.quantity;

      cartItemsContainer.innerHTML += `
      <div style= "display:flex; gap:20px; align-items:center; margin-bottom:20px;">
      <img src="${item.image}" style="width:350px; height:400px; object-fit:cover; border-radius:10px;">

        <div class="cart-item">
          <h4>${item.name}</h4>
          <p>Price: $${item.price}</p>
          <p>Quantity: ${item.quantity}</p>
          <p>Subtotal: $${item.price * item.quantity}</p>
          <button onclick="removeFromCart(${index})">Remove</button>
        </div>
        <hr>
      `;
    });

    cartTotal.innerHTML = `Total: $${total}`;
  }
  /*regret and clear cart with splice*/
  window.removeFromCart = function (index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
    updateCartCount();
  };

  loadCart();
});
