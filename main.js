const productContainer = document.querySelector('#productContainer');
console.log(productContainer);

var listOfProducts;

/** Get products from the json file and store it in a gobal variable */
function loadProducts() {
  fetch('./products.json')
    .then(function (response) {
      return response.json();
    })
    .then(function (products) {
      listOfProducts = products;
      addProductsToWebpage();
    });
}

function initSite() {
  loadProducts();
  // This would also be a good place to initialize other parts of the UI
}

/** Uses the loaded products data to create a visible product list on the website */
function addProductsToWebpage() {
  // Check your console to see that the products are stored in the listOfProducts varible.
  console.log(listOfProducts);

  listOfProducts.forEach(product => {
    createProductElements(product);
  });

  // Add your code here, remember to brake your code in to smaller function blocks
  // to reduce complexity and increase readability. Each function should have
  // an explainetory comment like the one for this function, see row 22.

  // TODO: Remove the console.log and these comments when you've read them.
}

function createProductElements(product) {
  const productWrapper = document.createElement('article');
  productWrapper.classList.add('product-wrapper');

  const productTitle = document.createElement('h2');
  productTitle.classList.add('product-title');
  productTitle.innerHTML = product.title;

  const productDescription = document.createElement('p');
  productDescription.classList.add('product-description');
  productDescription.innerHTML = product.description;

  const productImage = document.createElement('img');
  productImage.src = `/assets/${product.image}`;
  productImage.classList.add('product-image');

  const productPrice = document.createElement('p');
  productPrice.classList.add('product-price');
  productPrice.innerHTML = `${product.price} kr`;

  const addToCartBtn = document.createElement('button');
  addToCartBtn.innerHTML = 'Lägg till i kundvagnen';
  addToCartBtn.classList.add('add-to-cart-btn');
  addToCartBtn.id = product.title.replace(/\s+/g, ''); //remove whitespace to match id when button clicked

  productWrapper.append(
    productTitle,
    productDescription,
    productImage,
    productPrice,
    addToCartBtn
  );
  productContainer.appendChild(productWrapper);
}
