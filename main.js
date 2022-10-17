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
  renderNumberOfCartItems();
  // This would also be a good place to initialize other parts of the UI
}

function initCartSite() {
  renderNumberOfCartItems();
  addCartItemsToWebpage();
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

function addCartItemsToWebpage() {
  const cartContainer = document.getElementById('cartContainer');
  cartContainer.innerHTML = '';

  cartContainer.innerHTML = `
  <div class="cart-title-wrapper">
    <i class="fa-solid fa-cart-shopping icon"></i>
    <h1>Kundvagn</h1>
  </div>`;
  // Check your console to see that the products are stored in the listOfProducts varible.
  const cart = getShoppingCartFromLS();

  cart.forEach(product => {
    console.log(product);
    createCartItems(product);
  });

  cartContainer.appendChild(renderTotalPrice());
  cartContainer.appendChild(renderPurchaseButton());
}

function createProductElements(product) {
  const productContainer = document.querySelector('#productContainer');

  const productWrapper = document.createElement('article');
  productWrapper.classList.add('product-wrapper');

  const productCard = document.createElement('div');
  productCard.classList.add('product-card');

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
  addToCartBtn.innerHTML =
    '<i class="fa-solid fa-cart-arrow-down"></i> Lägg till i kundvagnen';
  addToCartBtn.classList.add('product-btn');
  addToCartBtn.classList.add('add-btn');
  addToCartBtn.id = product.title.replace(/\s+/g, ''); //remove whitespace to match id when button clicked
  addToCartBtn.addEventListener('click', () => {
    addToCart(addToCartBtn.id);
  });

  productWrapper.append(
    productCard
    // productTitle,
    // productDescription,
    // productImage,
    // productPrice,
    // addToCartBtn
  );

  productCard.append(
    productTitle,
    productDescription,
    productImage,
    productPrice,
    addToCartBtn
  );

  productContainer.appendChild(productWrapper);
}

function addToCart(productId) {
  //HÄMTA FRÅN LOCALSTORAGE
  let shoppingCart = getShoppingCartFromLS() || []; //sättas i LocalStorage

  if (
    shoppingCart.some(
      product => product.title.replace(/\s+/g, '') === productId
    )
  ) {
    alert('Produkten redan tillagd');
    //ändras när vi har kommit längre. T ex rendera ut + och 1 på varukorgssidan för att minska eller öka antalet produkter
    // Om produkten redan finns - öka antalet ananrs lägg till.
  } else {
    let productObj = listOfProducts.find(
      product => product.title.replace(/\s+/g, '') == productId
    );

    shoppingCart.push(productObj);
  }

  saveLS(shoppingCart);
  renderNumberOfCartItems();
  // Spara till localStorage
}

function renderNumberOfCartItems() {
  const numberOfItemsInCart = document.querySelector('#numberOfItemsInCart');
  const productsInShoppingCart = getShoppingCartFromLS() || [];

  console.log(productsInShoppingCart);
  numberOfItemsInCart.innerHTML = productsInShoppingCart.length;
}

function saveLS(shoppingCart) {
  localStorage.setItem('cart', JSON.stringify(shoppingCart));
}

function getShoppingCartFromLS() {
  return JSON.parse(localStorage.getItem('cart'));
}

function createCartItems(product) {
  const cartContainer = document.querySelector('#cartContainer');

  const productWrapper = document.createElement('article');
  productWrapper.classList.add('product-wrapper');

  const productCard = document.createElement('div');
  productCard.classList.add('product-card');

  const productTitle = document.createElement('h2');
  productTitle.classList.add('product-title');
  productTitle.innerHTML = product.title;

  const productImage = document.createElement('img');
  productImage.src = `/assets/${product.image}`;
  productImage.classList.add('product-image');

  const productPrice = document.createElement('p');
  productPrice.classList.add('product-price');
  productPrice.innerHTML = `${product.price} kr`;

  const deleteFromCartBtn = document.createElement('button');
  deleteFromCartBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i> Ta bort';
  deleteFromCartBtn.classList.add('product-btn');
  deleteFromCartBtn.classList.add('remove-btn');
  deleteFromCartBtn.id = product.title.replace(/\s+/g, ''); //remove whitespace to match id when button clicked
  deleteFromCartBtn.addEventListener('click', () => {
    deleteFromCart(deleteFromCartBtn.id);
  });

  productWrapper.append(productCard);

  productCard.append(
    productImage,
    productTitle,
    productPrice,
    deleteFromCartBtn
  );

  cartContainer.appendChild(productWrapper);
}

function deleteFromCart(id) {
  let cartItems = getShoppingCartFromLS();
  const index = cartItems.findIndex(
    element => element.title.replace(/\s+/g, '') === id
  );

  cartItems.splice(index, 1);

  saveLS(cartItems);
  renderNumberOfCartItems();
  addCartItemsToWebpage();
}

function sumTotalPrice() {
  const initialValue = 0;
  return getShoppingCartFromLS().reduce(
    (previousValue, currentValue) => previousValue + currentValue.price,
    initialValue
  );
}

function renderTotalPrice() {
  const totalPrice = document.createElement('span');
  totalPrice.innerHTML = `Totalt pris: ${sumTotalPrice()} kr`;
  return totalPrice;
}

function renderPurchaseButton() {
  const purchaseBtn = document.createElement('button');
  purchaseBtn.innerHTML = '<i class="fa-solid fa-check"></i> Slutför ditt köp';
  purchaseBtn.classList.add('product-btn');
  purchaseBtn.classList.add('add-btn');

  purchaseBtn.addEventListener('click', () => {
    alert('Ditt köp är slutfört');
  });
  return purchaseBtn;
}
