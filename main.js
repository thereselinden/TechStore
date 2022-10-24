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
  renderHeaderLoginIcon();

  // This would also be a good place to initialize other parts of the UI
}

function initCartSite() {
  renderNumberOfCartItems();
  addCartItemsToWebpage();
  renderHeaderLoginIcon();
}

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
      alert('Informationen får inte vara tom');
    } else if (doesUserExist(createUsername.value)) {
      alert('Användare finns redan');
      createUsername.value = '';
      createPassword.value = '';
    } else {
      createUser(createUsername.value, createPassword.value);
      window.location = 'user.html';
      //renderHeaderLoginIcon();
    }
  });

  logInBtn.addEventListener('click', event => {
    event.preventDefault();
    if (logInUsername.value === '' || logInPassword.value === '') {
      alert('Informationen får inte vara tom');
    }

    if (signInUser(logInUsername.value, logInPassword.value)) {
      window.location = 'user.html';
      //renderHeaderLoginIcon();
    } else {
      alert('Inloggning misslyckades');

      signInFail(logInUsername.value, logInPassword.value);
      // anropa signInFail() som visar felmeddeande baseratr på fel
    }
  });
}

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
  console.log(listOfProducts);

  listOfProducts.forEach(product => {
    createProductElements(product);
  });

  // Add your code here, remember to brake your code in to smaller function blocks
  // to reduce complexity and increase readability. Each function should have
  // an explainetory comment like the one for this function, see row 22.
}

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
  addToCartBtn.innerHTML =
    '<i class="fa-solid fa-cart-arrow-down"></i> Lägg till i kundvagnen';
  addToCartBtn.classList.add('btn');
  addToCartBtn.classList.add('add-btn');
  addToCartBtn.id = product.title.replace(/\s+/g, ''); //remove whitespace to match id when button clicked
  addToCartBtn.addEventListener('click', () => {
    addToCart(addToCartBtn.id);
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

function addToCart(productId) {
  let shoppingCart = getShoppingCartFromLS();

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

  saveShoppingCartLS(shoppingCart);
  renderNumberOfCartItems();
}

function renderNumberOfCartItems() {
  const numberOfItemsInCart = document.querySelector('#numberOfItemsInCart');
  const productsInShoppingCart = getShoppingCartFromLS();

  console.log(productsInShoppingCart);
  numberOfItemsInCart.innerHTML = productsInShoppingCart.length;
}

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

function saveShoppingCartLS(shoppingCart) {
  localStorage.setItem('cart', JSON.stringify(shoppingCart));
}

function saveOrdersLS(orders) {
  localStorage.setItem('orders', JSON.stringify(orders));
}

function saveUsersLS(users) {
  localStorage.setItem('users', JSON.stringify(users));
}

function setLoggedInUser(user) {
  localStorage.setItem('loggedInUser', JSON.stringify(user));
}

function getShoppingCartFromLS() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

function getOrdersFromLS() {
  return JSON.parse(localStorage.getItem('orders')) || [];
}

function getUsersFromLS() {
  return JSON.parse(localStorage.getItem('users')) || [];
}

function getLoggedInUser() {
  return JSON.parse(localStorage.getItem('loggedInUser')) || '';
}

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
  purchaseBtn.classList.add('btn');
  purchaseBtn.classList.add('add-btn');

  purchaseBtn.addEventListener('click', () => {
    openModal();
    createOrder();
    clearCart();
  });
  return purchaseBtn;
}

function openModal() {
  const modal = document.getElementById('modal');
  modal.style.display = 'flex';
}

function closeModal() {
  const modal = document.getElementById('modal');
  modal.style.display = 'none';
  window.location = 'index.html';
}

function clearCart() {
  localStorage.removeItem('cart');
}

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
  console.log('ORDERS', order);
  saveOrdersLS(orders);

  // Skapa order array, om den inte finns, med cart + order id + username + datum
  // Om den finns pusha till befintlig order array
  // Klona cart-key till orders-key i LS
}

function doesUserExist(username) {
  const users = getUsersFromLS();

  if (users.some(user => user.username === username)) {
    return true;
    //visa något form av felmeddelande?
    // Tömma input fält vid fel
  } else {
    return false;
  }
}

function createUser(username, password) {
  // Hämta users key från LS
  const users = getUsersFromLS();

  // if (users.some(user => user.username === username)) {
  //   alert('Användaren finns redan');
  //   //visa något form av felmeddelande?
  //   // Tömma input fält vid fel
  // } else {

  users.push({ username: username, password: password });
  saveUsersLS(users);
  setLoggedInUser(username);
  //}
}

function signInUser(username, password) {
  const users = getUsersFromLS();

  if (
    users.find(user => user.username === username && user.password === password)
  ) {
    setLoggedInUser(username);
    return true;
  } else return false;
}

function signInFail() {
  const users = getUsersFromLS();

  if (
    users.find(user => user.username !== username || user.password !== password)
  ) {
    alert('felaktiga inloggningsuppgifter');
  }
}

function toggleLoginCreateForm() {
  const createAccountLink = document.getElementById('createAccountLink');
  const loginAccountLink = document.getElementById('loginAccountLink');

  createAccountLink.addEventListener('click', () => {
    const loginForm = document.getElementById('loginUserForm');
    const createForm = document.getElementById('createUserForm');

    loginForm.style.display = 'none';
    createForm.style.display = 'flex';
  });

  loginAccountLink.addEventListener('click', () => {
    const createForm = document.getElementById('createUserForm');
    const loginForm = document.getElementById('loginUserForm');

    createForm.style.display = 'none';
    loginForm.style.display = 'flex';
  });
}

function getUserOrders() {
  const orders = getOrdersFromLS();
  const user = getLoggedInUser();
  // console.log('ORDERS', orders);
  // console.log('USER', user);

  return orders.filter(order => order.username === user);
}
//getUserOrders();

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

    //   orderText = `
    //   <p>Order id: ${order.orderId}</p>
    //   <time>Datum: ${newDate}</time>
    //   <ul>`;

    //   order.cart.forEach(item => {
    //     orderText += `<li>${item.title} ${item.price} kr</li>`;
    //     totalPrice += item.price * 1; // item.qty
    //   });

    //   orderText += `</ul>`;
    //   orderText += `<p>Totalsumma: ${totalPrice} kr</p>`;
    //   console.log('totalprice: ', totalPrice);
    //   orderInformation.innerHTML += orderText;
  });
}

function renderUserInfo() {
  const user = getLoggedInUser();
  const userGreeting = document.getElementById('user-greeting');
  if (user) {
    userGreeting.innerHTML = `Hej, ${user}!`;
  } else {
    userGreeting.innerHTML = `Du är inte inloggad`;
  }
}

function signOutUser() {
  localStorage.removeItem('loggedInUser');
}
