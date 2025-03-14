import {
    auth,
    db,
    onAuthStateChanged,
    signOut,
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    getDoc,
  } from "./firebase.js";
  
  // Check if user is admin
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists() && userDoc.data().role === "admin") {
        // Admin hai, product form aur list show karein
        document.getElementById("add-product-form").style.display = "block";
        fetchProducts();
      } else {
        // Admin nahi hai, redirect karein
        alert("You are not an admin. Redirecting to login page...");
        if (!window.location.pathname.includes("loginpage.html")) {
          window.location.href = "loginpage.html";
        }
      }
    } else {
      // User logged in nahi hai, redirect karein
      alert("Please login first. Redirecting to login page...");
      if (!window.location.pathname.includes("loginpage.html")) {
        window.location.href = "loginpage.html";
      }
    }
  });
  
  // Logout Button
  document.getElementById("logout").addEventListener("click", async () => {
    await signOut(auth);
    alert("Logged out successfully");
    window.location.href = "loginpage.html";
  });
  
  // Add Product Form
  const productForm = document.getElementById("product-form");
  if (productForm) {
    productForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("product-name").value;
      const price = document.getElementById("product-price").value;
      const imageUrl = document.getElementById("product-image").value;
  
      try {
        await addDoc(collection(db, "products"), {
          name: name,
          price: price,
          imageUrl: imageUrl,
        });
        alert("Product added successfully!");
        productForm.reset();
        fetchProducts(); // Refresh product list
      } catch (error) {
        console.error("Error adding product:", error);
        alert("Failed to add product.");
      }
    });
  }
  
  // Fetch and Display Products
  const productsList = document.getElementById("products-list");
  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, "products"));
    productsList.innerHTML = ""; // Clear the list before rendering
    querySnapshot.forEach((doc) => {
      const product = doc.data();
      productsList.innerHTML += `
        <div class="product">
          <img src="${product.imageUrl}" alt="${product.name}">
          <h3>${product.name}</h3>
          <p>${product.price}</p>
          <button onclick="editProduct('${doc.id}')">Edit</button>
          <button onclick="deleteProduct('${doc.id}')">Delete</button>
        </div>
      `;
    });
  };
  
  // Edit Product
  window.editProduct = async (productId) => {
    const newName = prompt("Enter new product name:");
    const newPrice = prompt("Enter new product price:");
    const newImageUrl = prompt("Enter new product image URL:");
  
    if (newName && newPrice && newImageUrl) {
      try {
        await updateDoc(doc(db, "products", productId), {
          name: newName,
          price: newPrice,
          imageUrl: newImageUrl,
        });
        alert("Product updated successfully!");
        fetchProducts(); // Refresh product list
      } catch (error) {
        console.error("Error updating product:", error);
        alert("Failed to update product.");
      }
    }
  };
  
  // Delete Product
  window.deleteProduct = async (productId) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteDoc(doc(db, "products", productId));
        alert("Product deleted successfully!");
        fetchProducts(); // Refresh product list
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product.");
      }
    }
  };