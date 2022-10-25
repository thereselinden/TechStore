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

/* Called when index.html is loaded */
function initSite() {
  loadProducts();
  renderNumberOfCartItems();
  renderHeaderLoginIcon();
}

/* Called when cart.html is loaded */
function initCartSite() {
  renderNumberOfCartItems();
  addCartItemsToWebpage();
  renderHeaderLoginIcon();
}

/* Called when login.html is loaded */
function initLoginSite() {
  const createUsername = document.querySelector('#createUsername');
  const createPassword = document.querySelector('#createPassword');
  const createBtn = document.querySelector('.create-btn');

  const logInUsername = document.querySelector('#loginUsername');
  const logInPassword = document.querySelector('#loginPassword');
  const logInBtn = document.querySelector('.login-btn');

  renderHeaderLoginIcon();
  renderNumberOfCartItems();
  toggleLoginCreateForm();

  createBtn.addEventListener('click', event => {
    event.preventDefault();
    if (createUsername.value === '' || createPassword.value === '') {
      showErrorMsg('Informationen får inte vara tom', 'create');
    } else if (doesUserExist(createUsername.value)) {
      showErrorMsg('Användare finns redan', 'create');
      createUsername.value = '';
      createPassword.value = '';
    } else {
      createUser(createUsername.value, createPassword.value);
      window.location = 'user.html';
    }
  });

  logInBtn.addEventListener('click', event => {
    event.preventDefault();
    if (logInUsername.value === '' || logInPassword.value === '') {
      showErrorMsg('Informationen får inte vara tom', 'login');
    } else {
      if (signInUser(logInUsername.value, logInPassword.value)) {
        window.location = 'user.html';
      } else {
        showErrorMsg('Inloggning misslyckades', 'login');
        logInUsername.value = '';
        logInPassword.value = '';
      }
    }
  });
}

/* Called when user.html is loaded */
function initUserSite() {
  document.querySelector('.signout-btn').addEventListener('click', function () {
    signOutUser();
    window.location = 'index.html';
  });

  renderHeaderLoginIcon();
  renderNumberOfCartItems();
  renderUserInfo();
  renderUserOrders();
}

/** Uses the loaded products data to create a visible product list on the website */
function addProductsToWebpage() {
  listOfProducts.forEach(product => {
    createProductElements(product);
  });
}

/* Create single product elements  */
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
  productImage.alt = product.title;
  productImage.classList.add('product-image');

  const productPrice = document.createElement('p');
  productPrice.classList.add('product-price');
  productPrice.innerHTML = `${product.price} kr`;

  const addToCartBtn = document.createElement('button');
  addToCartBtn.classList.add('btn');
  addToCartBtn.classList.add('add-btn');
  addToCartBtn.id = product.title.replace(/\s+/g, ''); //remove whitespace to match id when button clicked

  //Checks if product already in cart if so disable add button
  if (
    getShoppingCartFromLS().some(
      productcart =>
        productcart.title.replace(/\s+/g, '') ===
        product.title.replace(/\s+/g, '')
    )
  ) {
    disableBtn(addToCartBtn, 'Produkt tillagd');
  } else {
    addToCartBtn.innerHTML =
      '<i class="fa-solid fa-cart-arrow-down"></i> Lägg till i kundvagnen';
  }

  addToCartBtn.addEventListener('click', () => {
    addToCart(addToCartBtn.id);
    disableBtn(addToCartBtn, 'Produkt tillagd');
  });

  productWrapper.append(productCard);

  productCard.append(
    productTitle,
    productDescription,
    productImage,
    productPrice,
    addToCartBtn
  );

  productContainer.appendChild(productWrapper);
}

/* Renders shoppingcart page elements */
function addCartItemsToWebpage() {
  const cartContainer = document.getElementById('cartContainer');
  cartContainer.innerHTML = '';

  const cartSummary = document.getElementById('cartSummary');
  const cart = getShoppingCartFromLS();

  cart.forEach(product => {
    createCartItems(product);
  });

  if (cart.length > 0) {
    cartSummary.innerHTML = '';
    cartSummary.appendChild(renderTotalPrice());
    cartSummary.appendChild(renderPurchaseButton());
  } else cartSummary.innerHTML = 'Din kundvagn är tom!';
}

/* Create single cart elements */
function createCartItems(product) {
  const cartContainer = document.querySelector('#cartContainer');

  const productWrapper = document.createElement('article');
  productWrapper.classList.add('cart-wrapper');

  const productTitle = document.createElement('h2');
  productTitle.classList.add('product-title');
  productTitle.innerHTML = product.title;

  const productImage = document.createElement('img');
  productImage.src = `/assets/${product.image}`;
  productImage.alt = product.title;
  productImage.classList.add('product-image');

  const productPrice = document.createElement('p');
  productPrice.classList.add('product-price');
  productPrice.innerHTML = `${product.price} kr`;

  const deleteFromCartBtn = document.createElement('button');
  deleteFromCartBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i> Ta bort';
  deleteFromCartBtn.classList.add('btn');
  deleteFromCartBtn.classList.add('remove-btn');
  deleteFromCartBtn.id = product.title.replace(/\s+/g, ''); //remove whitespace to match id when button clicked
  deleteFromCartBtn.addEventListener('click', () => {
    deleteFromCart(deleteFromCartBtn.id);
  });

  productWrapper.append(
    productImage,
    productTitle,
    productPrice,
    deleteFromCartBtn
  );

  cartContainer.appendChild(productWrapper);
}

/* Disable buttons */
function disableBtn(button, message) {
  button.setAttribute('disabled', true);
  button.classList.add('disabled-btn');
  button.innerHTML = message;
}

/* Add product to cart if not already added */
function addToCart(productId) {
  let shoppingCart = getShoppingCartFromLS();

  if (
    !shoppingCart.some(
      product => product.title.replace(/\s+/g, '') === productId
    )
  ) {
    let productObj = listOfProducts.find(
      product => product.title.replace(/\s+/g, '') == productId
    );

    shoppingCart.push(productObj);
  }

  saveShoppingCartLS(shoppingCart);
  renderNumberOfCartItems();
}

/* Render numbers of cart elements in header */
function renderNumberOfCartItems() {
  const numberOfItemsInCart = document.querySelector('#numberOfItemsInCart');
  const productsInShoppingCart = getShoppingCartFromLS();

  numberOfItemsInCart.innerHTML = productsInShoppingCart.length;
}

/* Change header icon based on signed in or not */
function renderHeaderLoginIcon() {
  const loggedInUser = getLoggedInUser();
  const isLoggedInIcon = document.getElementById('user-icon');

  if (loggedInUser) {
    isLoggedInIcon.innerHTML =
      '<a href="/user.html"><i class="fa-solid fa-user"></i></a>';
  } else {
    isLoggedInIcon.innerHTML =
      '<a href="/login.html"><i class="fa-solid fa-arrow-right-to-bracket"></i></a>';
  }
}

/* Save cart to LocalStorage */
function saveShoppingCartLS(shoppingCart) {
  localStorage.setItem('cart', JSON.stringify(shoppingCart));
}

/* Save orders to LocalStorage */
function saveOrdersLS(orders) {
  localStorage.setItem('orders', JSON.stringify(orders));
}

/* Save users to LocalStorage */
function saveUsersLS(users) {
  localStorage.setItem('users', JSON.stringify(users));
}

/* Save loggedIn user in LocalStorage */
function setLoggedInUser(user) {
  localStorage.setItem('loggedInUser', JSON.stringify(user));
}

/* Get cart from LocalStorage */
function getShoppingCartFromLS() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

/* Get orders from LocalStorage */
function getOrdersFromLS() {
  return JSON.parse(localStorage.getItem('orders')) || [];
}

/* Get users from LocalStorage */
function getUsersFromLS() {
  return JSON.parse(localStorage.getItem('users')) || [];
}

/* Get loggedIn user from LocalStorage */
function getLoggedInUser() {
  return JSON.parse(localStorage.getItem('loggedInUser')) || '';
}

/* Remove product from shoppingcart and update LS accordingly */
function deleteFromCart(id) {
  let cartItems = getShoppingCartFromLS();
  const index = cartItems.findIndex(
    element => element.title.replace(/\s+/g, '') === id
  );

  cartItems.splice(index, 1);

  saveShoppingCartLS(cartItems);
  renderNumberOfCartItems();
  addCartItemsToWebpage();
}

/* Calcuclates total price of shoppingcart */
function sumTotalPrice() {
  const initialValue = 0;
  return getShoppingCartFromLS().reduce(
    (previousValue, currentValue) => previousValue + currentValue.price,
    initialValue
  );
}

/* Render total price of shoppingcart */
function renderTotalPrice() {
  const totalPrice = document.createElement('span');
  totalPrice.innerHTML = `Totalt pris: ${sumTotalPrice()} kr`;
  return totalPrice;
}

/* Creates and render submit purchase button on cart.html */
function renderPurchaseButton() {
  const purchaseBtn = document.createElement('button');
  purchaseBtn.innerHTML = '<i class="fa-solid fa-check"></i> Slutför ditt köp';
  purchaseBtn.classList.add('btn');
  purchaseBtn.classList.add('add-btn');

  purchaseBtn.addEventListener('click', () => {
    openModal();
    createOrder();
    clearCart();
  });
  return purchaseBtn;
}

/* Show pop up */
function openModal() {
  const modal = document.getElementById('modal');
  modal.style.display = 'flex';
}

/* Close pop up */
function closeModal() {
  const modal = document.getElementById('modal');
  modal.style.display = 'none';
  window.location = 'index.html';
}

/* Clear shoppingcart and removes cart key in LS */
function clearCart() {
  localStorage.removeItem('cart');
}

/* Create and save order  */
function createOrder() {
  const cart = getShoppingCartFromLS();
  let orders = getOrdersFromLS();
  const order = {
    cart: cart,
    username: getLoggedInUser() || -1,
    date: new Date(),
    orderId: orders.length + 1,
  };

  orders.push(order);
  saveOrdersLS(orders);
}

/* Check if users exist  */
function doesUserExist(username) {
  const users = getUsersFromLS();

  if (users.some(user => user.username === username)) {
    return true;
  } else {
    return false;
  }
}

/* Create and login user */
function createUser(username, password) {
  const users = getUsersFromLS();

  users.push({ username: username, password: password });
  saveUsersLS(users);
  setLoggedInUser(username);
}

/* Sign in if user input values are correct */
function signInUser(username, password) {
  const users = getUsersFromLS();

  if (
    users.find(user => user.username === username && user.password === password)
  ) {
    setLoggedInUser(username);
    return true;
  } else return false;
}

/* Display error message on login.html  */
function showErrorMsg(message, target) {
  const errorMsgLogin = document.getElementById('errorMsgLogin');
  const errorMsgCreate = document.getElementById('errorMsgCreate');

  if (target === 'create') {
    errorMsgCreate.innerHTML = message;
    errorMsgCreate.style.display = 'block';
  } else {
    errorMsgLogin.innerHTML = message;
    errorMsgLogin.style.display = 'block';
  }
}

/* Toggle login/create form on login.html, clear errormsg on toggle */
function toggleLoginCreateForm() {
  const createAccountLink = document.getElementById('createAccountLink');
  const loginAccountLink = document.getElementById('loginAccountLink');

  let errorMsgLogin = document.getElementById('errorMsgLogin');
  let errorMsgCreate = document.getElementById('errorMsgCreate');

  createAccountLink.addEventListener('click', () => {
    const loginForm = document.getElementById('loginUserForm');
    const createForm = document.getElementById('createUserForm');

    loginForm.style.display = 'none';
    createForm.style.display = 'flex';
    errorMsgLogin.innerHTML = '';
  });

  loginAccountLink.addEventListener('click', () => {
    const createForm = document.getElementById('createUserForm');
    const loginForm = document.getElementById('loginUserForm');

    createForm.style.display = 'none';
    loginForm.style.display = 'flex';
    errorMsgCreate.innerHTML = '';
  });
}

/* Filter orders based on user */
function getUserOrders() {
  const orders = getOrdersFromLS();
  const user = getLoggedInUser();

  return orders.filter(order => order.username === user);
}

/* Create elements and render user orders  */
function renderUserOrders() {
  const userOrders = getUserOrders();
  const orderInformation = document.getElementById('orderInformation');

  userOrders.forEach(order => {
    const orderDate = new Date(order.date);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const newDate = orderDate.toLocaleDateString('sv-SE', options);

    let totalPrice = 0;

    const orderWrapper = document.createElement('article');
    orderWrapper.classList.add('order');

    const orderId = document.createElement('p');
    orderId.classList.add('order-id');
    orderId.innerHTML = `<span>OrderId:</span> ${order.orderId}`;

    const orderPurchaseDate = document.createElement('time');
    orderPurchaseDate.classList.add('order-time');
    orderPurchaseDate.innerHTML = `<span>Datum:</span> ${newDate}`;

    const productListWrapper = document.createElement('ul');
    productListWrapper.classList.add('order-product-list-wrapper');

    orderWrapper.append(orderId, orderPurchaseDate, productListWrapper);

    order.cart.forEach(item => {
      const listProducts = document.createElement('li');
      listProducts.classList.add('order-product-list');
      listProducts.innerHTML = item.title;
      productListWrapper.append(listProducts);

      totalPrice += item.price;
    });

    const sumTotal = document.createElement('p');
    sumTotal.classList.add('order-total-price');
    sumTotal.innerHTML = `<span>Totalsumma:</span> ${totalPrice} kr`;

    orderWrapper.append(sumTotal);
    orderInformation.append(orderWrapper);
  });
}

/* Render userinfo based on logged in or not */
function renderUserInfo() {
  const user = getLoggedInUser();
  const userGreeting = document.getElementById('user-greeting');
  if (user) {
    userGreeting.innerHTML = `Hej, ${user}!`;
  } else {
    userGreeting.innerHTML = `Du är inte inloggad`;
  }
}

/* Sign out user */
function signOutUser() {
  localStorage.removeItem('loggedInUser');
  localStorage.removeItem('cart');
}
