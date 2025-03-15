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


const admin = "admin123@gmail.com";
const adminkey = "admin123";


onAuthStateChanged(auth, (user) => {
  if (!user && !window.location.pathname.includes("loginpage.html")) {
    window.location.href = "loginpage.html";
  }
  else if (user && window.location.pathname.includes("loginpage.html")) {
    window.location.href = "index.html";
  }
});


const loginBtn = document.getElementById("login");
if (loginBtn) {
  loginBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    try {
      if (email === admin && password === adminkey) {
        window.location.href = "admin.html";
        return;
      };
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "index.html";
      alert("Logged in successfully");
    } catch (error) {
      alert("Please enter correct email and password");
    }
  });
}


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


const logoutBtn = document.getElementById("logout");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    alert("Logged out successfully");
    window.location.href = "loginpage.html";
  });
}


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






let cart = [];
let products = [];




const getCartFromLocalStorage = () => {
  const storedCart = localStorage.getItem("cart");
  cart = storedCart ? JSON.parse(storedCart) : [];
};


const saveCartToLocalStorage = () => {
  localStorage.setItem("cart", JSON.stringify(cart));
};


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
         <button onclick="addToWishlist('${product.id}')" class="btnall hover-under">❤️</button>
       </div>
    `;
  });
};


window.cartitem = (docid) => {
  const item = products.find((product) => product.id === docid);
  if (item) {
    cart.push(item);
    alert(`${item.name} has been added to your cart.`);
    saveCartToLocalStorage(); 
  } else {
    alert("Item not found!");
  }
};


const displayCart = () => {
  getCartFromLocalStorage(); 

  const cartContainer = document.getElementById("cart-container");
  if (!cartContainer) return; 

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


window.removeCartItem = (index) => {
  cart.splice(index, 1);
  saveCartToLocalStorage(); 
  displayCart(); 
};


window.addEventListener("DOMContentLoaded", () => {
  fetchProducts();
  if (window.location.pathname.includes("cart.html")) {
    displayCart();
  }
});


document.querySelectorAll("a.nav-item").forEach((link) => {
  if (link.textContent.includes("Cart Item")) {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "cart.html"; 
    });
  }
});



let wishlist = [];
const getWishlistFromLocalStorage = () => {
  const storedWishlist = localStorage.getItem("wishlist");
  wishlist = storedWishlist ? JSON.parse(storedWishlist) : [];
};


const saveWishlistToLocalStorage = () => {
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
};


window.addToWishlist = (docid) => {
  const item = products.find((product) => product.id === docid);
  if (item) {
    const alreadyInWishlist = wishlist.find((product) => product.id === docid);
    if (!alreadyInWishlist) {
      wishlist.push(item);
      alert(`${item.name} has been added to your wishlist.`);
      saveWishlistToLocalStorage(); 
    } else {
      alert("This item is already in your wishlist.");
    }
  } else {
    alert("Item not found!");
  }
};


const displayWishlist = () => {
  getWishlistFromLocalStorage(); 

  const wishlistContainer = document.getElementById("wishlist-container");
  if (!wishlistContainer) return;
  
  wishlistContainer.innerHTML = "";
  
  if (wishlist.length === 0) {
    alert("Your WishList Is Empty! Please Add Some Products To Your WishList"); 
    wishlistContainer.innerHTML = "<p>Your wishlist is empty.</p>";
    return;
  }

  wishlist.forEach((item, index) => {
    wishlistContainer.innerHTML += `
      <div class="card col-2 d-flex justify-content-center align-items-center m-3 py-2 bg-info bg-white mb-3">
        <img src="${item.imageUrl}" style="height: 100px; width: 100px;" alt="${item.name}" />
        <h5>${item.name}</h5>
        <p>Price: ${item.price} RS</p>
        <button onclick="removeFromWishlist(${index})" class="btn btn-danger btn-sm">Remove</button>
      </div>`;
  });
};


window.removeFromWishlist = (index) => {
  const removedItem = wishlist.splice(index, 1)[0];
  alert(`${removedItem.name} has been removed from your wishlist.`);
  saveWishlistToLocalStorage();
  displayWishlist();
};


window.addEventListener("DOMContentLoaded", () => {
  fetchProducts(); 
  if (window.location.pathname.includes("wishlist.html")) {
    displayWishlist(); 
  }
});


document.querySelectorAll("a.nav-item").forEach((link) => {
  if (link.textContent.includes("Wishlist")) {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "wishlist.html";
    });
  }
});

