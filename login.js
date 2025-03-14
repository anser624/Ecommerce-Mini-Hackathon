import {
  auth,
  db,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  doc,
  getDocs,
  collection,
} from "./firebase.js";

// Redirect to login page if not authenticated
onAuthStateChanged(auth, (user) => {
  if (!user && !window.location.pathname.includes("loginpage.html")) {
    window.location.href = "loginpage.html";
  } else if (user && window.location.pathname.includes("loginpage.html")) {
    window.location.href = "index.html";
  }
});

// User login
const loginBtn = document.getElementById("login");
if (loginBtn) {
  loginBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "index.html";
      alert("Logged in successfully");
    } catch (error) {
      alert("Please enter correct email and password");
    }
  });
}

// Admin login
const adminBtn = document.getElementById("admin");
if (adminBtn) {
  adminBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists() && userDoc.data().role === "admin") {
        window.location.href = "admin.html";
      } else {
        alert("You are not an admin.");
        await signOut(auth);
      }
    } catch (error) {
      alert("Please enter correct email and password");
    }
  });
}

// Logout
const logoutBtn = document.getElementById("logout");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    alert("Logged out successfully");
    window.location.href = "loginpage.html";
  });
}

// User signup
const signupBtn = document.getElementById("signup");
if (signupBtn) {
  signupBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("User created successfully!");
      window.location.href = "index.html";
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        alert("Email is already in use. Please use a different email.");
      } else if (error.code === "auth/weak-password") {
        alert("Password should be at least 6 characters.");
      } else {
        alert("Something went wrong. Please try again.");
      }
    }
  });
}

//////////////////////////////////////////////////////////////
///////////products js///////////////////////////////////////


// 🛒 Cart aur Products ka Global Array
let cart = [];
let products = [];

// ✅ localStorage se cart load karo
const getCartFromLocalStorage = () => {
  const storedCart = localStorage.getItem("cart");
  cart = storedCart ? JSON.parse(storedCart) : [];
};

// ✅ Cart ko localStorage mein save karo
const saveCartToLocalStorage = () => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

// 📦 Firebase se products fetch karo
const fetchProducts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    products = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    displayProducts();
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

// 📊 Products ko display karo (index.html mein)
const displayProducts = () => {
  const productsContainer = document.getElementById("products-container");
  productsContainer.innerHTML = "";
  products.forEach((product) => {
    productsContainer.innerHTML += `
      <div class="product">
         <img src="${product.imageUrl}" alt="${product.name}">
         <h3 class="card-title">${product.name}</h3>
         <h4 class="card-text">${product.price} RS</h4>
         <button onclick="cartitem('${product.id}')" class="btnall hover-under">Add to Cart</button>
         <button onclick="addToFavorites('${product.id}')" class="btnall hover-under">❤️</button>
       </div>
    `;
  });
};

// 🛍️ Cart mein item add karo
window.cartitem = (docid) => {
  const item = products.find((product) => product.id === docid);
  if (item) {
    cart.push(item);
    alert(`${item.name} has been added to your cart.`);
    saveCartToLocalStorage(); // ✅ localStorage mein save karo
  } else {
    alert("Item not found!");
  }
};

// 🛒 Cart ko cart.html page par display karo
const displayCart = () => {
  getCartFromLocalStorage(); // ✅ localStorage se cart wapas lao

  const cartContainer = document.getElementById("cart-container");
  if (!cartContainer) return; // Agar cart page nahi hai to return karo

  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  cart.forEach((item, index) => {
    cartContainer.innerHTML += `
      <div class="card col-2 d-flex flex-wrap justify-content-center align-items-center py-1 bg-info bg-white mb-3">
        <img src="${item.imageUrl}" style="height: 100px; width: 100px; object-fit-contain" alt="${item.name}" />
        <h5>${item.name}</h5>
        <p>Price: ${item.price} :RS</p>
        <button onclick="removeCartItem(${index})" class="btn btn-danger btn-sm">Remove</button>
      </div>`;
  });
};

// 🗑️ Cart se item remove karo
window.removeCartItem = (index) => {
  cart.splice(index, 1);
  saveCartToLocalStorage(); // ✅ Update karo localStorage
  displayCart(); // ✅ Dubara show karo cart
};

// 🟢 Page load hone par setup karo
window.addEventListener("DOMContentLoaded", () => {
  fetchProducts();
  if (window.location.pathname.includes("cart.html")) {
    displayCart();
  }
});

// 🔗 Navbar "Cart Item" link se cart.html par redirect karo
document.querySelectorAll("a.nav-item").forEach((link) => {
  if (link.textContent.includes("Cart Item")) {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "cart.html"; // ✅ Redirect to cart page
    });
  }
});









// // Cart , Products Global Array
// let cart = [];
// let products = [];

// // Firebase  products fetch  function
// const fetchProducts = async () => {
//   try {
//     const querySnapshot = await getDocs(collection(db, "products"));
//     products = querySnapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     }));
//     displayProducts(); // Products show karna
//   } catch (error) {
//     console.error("Error fetching products:", error);
//   }
// };

// // Products display karna
// const displayProducts = () => {
//   const productsContainer = document.getElementById("products-container");
//   productsContainer.innerHTML = "";
//   products.forEach((product) => {
//     productsContainer.innerHTML += `
//       <div class="product">
//         <img src="${product.imageUrl}" alt="${product.name}">
//         <h3 class="card-title">${product.name}</h3>
//         <h4 class="card-text">${product.price} RS</h4>
//         <button onclick="cartitem('${product.id}')" class="btnall hover-under">Add to Cart</button>
//         <button onclick="addToFavorites('${product.id}')" class="btnall hover-under">❤️</button>
//       </div>
//     `;
//   });
// };
// fetchProducts();

// //Cart mein item add karna
// window.cartitem = (docid) => {
//   const item = products.find((product) => product.id === docid);
//   if (item) {
//     cart.push(item);
//     alert(`${item.name} has been added to your cart.`);
//     console.log("Cart Updated: ", cart);
//     displayCart();
//   } else {
//     alert("Item not found!");
//   }
// };

// // Cart ko display karna
// const displayCart = () => {
//   const cartContainer = document.getElementById("cart-container");
//   cartContainer.innerHTML = "";

//   if (cart.length === 0) {
//     alert("Your cart is empty.");
//     window.location.href = "index.html";
//     return;
//   }

//   cart.forEach((item, index) => {
//     cartContainer.innerHTML += `
//       <div class="card col-5 d-flex justify-content-center align-items-center py-3 bg-info bg-white" id="cart-item-${index}">
//         <img src="${item.imageUrl}" class="card-img-top object-fit-contain img-cart" style="height: 100px; width: 100px;" alt="${item.name}" />
//         <h5 class="card-title">${item.name}</h5>
//         <p class="card-text">Price: ${item.price} RS</p>
//         <button onclick="removeCartItem(${index})" class="btn btn-danger btn-sm">Remove</button>
//       </div>`;
//   });
//   console.log("cart page is working");
// };

// //Cart se item remove karna
// window.removeCartItem = (index) => {
//   const removedItem = cart.splice(index, 1)[0];
//   alert(`${removedItem.name} has been removed from your cart.`);
//   displayCart();
// };



// // Add a click event listener for the "Cart Item" link
// document.querySelectorAll("a.nav-item").forEach((link) => {
//   if (link.textContent.includes("Cart Item")) {
//     link.addEventListener("click", (e) => {
//       window.location.href="cart.html";
//       // e.preventDefault();
//       displayCart(); // Show cart items when the user clicks "Cart Item"
//     });
//   }
// });

