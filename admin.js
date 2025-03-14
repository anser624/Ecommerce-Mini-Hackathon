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
  
  
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists() && userDoc.data().role === "admin") {
        
        document.getElementById("add-product-form").style.display = "block";
        fetchProducts();
      } else {
        
        alert("You are not an admin. Redirecting to login page...");
        if (!window.location.pathname.includes("loginpage.html")) {
          window.location.href = "loginpage.html";
        }
      }
    } else {
      
      alert("Please login first. Redirecting to login page...");
      if (!window.location.pathname.includes("loginpage.html")) {
        window.location.href = "loginpage.html";
      }
    }
  });
  
  
  document.getElementById("logout").addEventListener("click", async () => {
    await signOut(auth);
    alert("Logged out successfully");
    window.location.href = "loginpage.html";
  });
  
  
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
        fetchProducts(); 
      } catch (error) {
        console.error("Error adding product:", error);
        alert("Failed to add product.");
      }
    });
  }
  
  
  const productsList = document.getElementById("products-list");
  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, "products"));
    productsList.innerHTML = ""; 
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
        fetchProducts(); 
      } catch (error) {
        console.error("Error updating product:", error);
        alert("Failed to update product.");
      }
    }
  };
  
  
  window.deleteProduct = async (productId) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteDoc(doc(db, "products", productId));
        alert("Product deleted successfully!");
        fetchProducts(); 
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product.");
      }
    }
  };