// Description: JavaScript code for the shopping cart application.

document.getElementById("viewitem").addEventListener("click", () => {
  document.getElementById("products-container").classList.remove("d-none");
});
document.getElementById('cartitem').addEventListener("click",()=>{
  window.location.href = "cart.html";
})



// // Function to display the cart items
// function displayCart() {
//   let cartContainer = document.getElementById("row-1");
//   // Use the "row-1" container to display cart items
//   cartContainer.innerHTML = ""; // Clear the container before rendering cart items
//   if (cart.length === 0) {
//     window.location.href = "index.html";
//     alert("Your cart is empty.")
//     return;
//   } 
//   cart.forEach((item,index) => { 
//     cartContainer.innerHTML += `
//     <h1 id="heading" class="fw-bolder m-3 text-decoration-underline">Cart-Item</h1>
//       <div class="card col-5 d-flex justify-content-center align-items-center py-3 bg-info  bg-white" id="cart-item-${index}">
//         <img src="${item.image}" class="card-img-top object-fit-contain img-cart"  style="height: 100px; width: 100px;" alt="${item.title}" />
//         <h5 class="card-title">${item.title}</h5>
//         <p class="card-text">Category: ${item.category}</p>
//         <div class=" fs-6 card-body">
//         <p class="card-text">Price: $${item.price}</p>
//         <button onclick="removeCartItem(${index})" class="btn btn-danger btn-sm">Remove</button>
//         </div>
//         </div>`;
//   });
// }
// // Function to remove an item from the cart
// function removeCartItem(index) {
//   const removedItem = cart.splice(index, 1)[0];
//   alert(`${removedItem.title} has been removed from your cart.`);
//   displayCart(); // Re-render the cart items
// }

// // Add a click event listener for the "Cart Item" link
// document.querySelectorAll("a.nav-item").forEach((link) => {
//   if (link.textContent.includes("Cart Item")) {
//     link.addEventListener("click", (e) => {
//       e.preventDefault();
//       displayCart(); // Show cart items when the user clicks "Cart Item"
//     });
//   }
// });
