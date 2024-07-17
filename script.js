document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tab");
  const productContainer = document.getElementById("product-container");
  let categories = [];

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        "https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json"
      );
      const data = await response.json();
      console.log("Fetched data:", data); // Log the entire fetched data to inspect its structure

      // Verify if the expected property exists
      if (data.categories) {
        categories = data.categories;
        renderProducts("Men"); // Render default category (Men) after fetching products
      } else {
        console.error(
          "Categories property is not available in the fetched data"
        );
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const renderProducts = (categoryName) => {
    const category = categories.find(
      (cat) => cat.category_name === categoryName
    );
    if (
      !category ||
      !Array.isArray(category.category_products) ||
      category.category_products.length === 0
    ) {
      console.error("Products data is not available");
      return;
    }

    const products = category.category_products;
    productContainer.innerHTML = "";

    products.forEach((product) => {
      const discount = Math.round(
        ((product.compare_at_price - product.price) /
          product.compare_at_price) *
          100
      );

      const productCard = document.createElement("div");
      productCard.className = "product-card";

      // Conditionally render the product badge
      const badgeHtml = product.badge_text
        ? `<div class="product-badge">${product.badge_text}</div>`
        : "";

      productCard.innerHTML = `
                ${badgeHtml}
                <img src="${product.image}" alt="${product.title}" class="product-image">
                <div class="product-info">
                    <div class="product-title">${product.title}</div>
                    <div class="product-vendor"><li>${product.vendor}</li></div>
                </div>
                <div class="product-price-info">
                    <div class="product-price">Rs ${product.price}</div>
                    <div class="product-compare">${product.compare_at_price}.00</div>
                    <div class="product-discount">${discount}% Off</div>
                </div>
                <button class="add-to-cart">Add to cart</button>
            `;

      productContainer.appendChild(productCard);
    });
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", (e) => {
      tabs.forEach((tab) => tab.classList.remove("active"));
      e.target.classList.add("active");
      const categoryName = e.target.getAttribute("data-category");
      renderProducts(categoryName);
    });
  });

  fetchProducts();
});
