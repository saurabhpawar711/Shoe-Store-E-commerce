const API_URL = 'https://lfwz6gudb7.execute-api.ap-south-1.amazonaws.com/Dev'
toastr.options = {
    closeButton: true,
    timeOut: 1000,
    progressBar: true,
};

if (!token) {
    const signUpBtn = document.getElementById('signUp');

    signUpBtn.addEventListener('click', () => {
        openModal('signupModal')
    });
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = "flex";
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = "none";
}

window.onclick = function (event) {
    const modals = document.getElementsByClassName('modal');
    for (let i = 0; i < modals.length; i++) {
        let modal = modals[i];
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
};

const checkAuthenticationForCart = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get(`${API_URL}/auth/check-authentication`, { headers: { Authorization: token } });
        if (response.data.success) {
            window.location.href = '../cartPage/cart.html';
        }
    }
    catch (err) {
        if (err.response.data.error === 'Authentication required') {
            openModal('signupModal');
        }
    }
}

const checkAuthenticationForOrder = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get(`${API_URL}/auth/check-authentication`, { headers: { Authorization: token } });
        if (response.data.success) {
            window.location.href = '../ordersPage/order.html';
        }
    }
    catch (err) {
        if (err.response.data.error === 'Authentication required') {
            openModal('signupModal');
        }
    }
}

const checkAuthenticationForWishlist = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get(`${API_URL}/auth/check-authentication`, { headers: { Authorization: token } });
        if (response.data.success) {
            window.location.href = '../wishlistPage/wishlist.html';
        }
    }
    catch (err) {
        if (err.response.data.error === 'Authentication required') {
            openModal('signupModal')
        }
    }
}

const user = document.querySelector('.user');

user.addEventListener('click', () => {
    const token = localStorage.getItem('token');
    const signUpBtn = document.getElementById('signUp');
    if (token) {
        signUpBtn.style.display = 'none';
    }
})

function isValidMobileNumber(number) {
    const mobileNumberPattern = /^[6-9]\d{9}$/;
    return mobileNumberPattern.test(number);
}

const numberInput = document.getElementById("number");
const toggleInputs = async () => {
    try {
        const otpInput = document.querySelector(".otp");
        const continueButton = document.querySelector(".continueBtn");
        const loginButton = document.querySelector(".loginBtn");

        if (isValidMobileNumber(numberInput.value)) {

            otpInput.style.display = "block";
            continueButton.style.display = 'none';
            loginButton.style.display = 'block';

            const number = {
                number: numberInput.value
            }
            await axios.post(`${API_URL}/auth/otp`, number);
        }
        else {
            throw new Error('Enter valid mobile number');
        }
    }
    catch (err) {
        toastr.error(err.message);
    }
}

const login = async () => {
    try {
        const otp = document.getElementById('otp').value;
        const loginDetails = {
            number: numberInput.value,
            otp: otp
        }

        const response = await axios.post(`${API_URL}/auth/login`, loginDetails);
        if (response.data.success) {
            closeModal('signupModal');
            toastr.success('You have successfully logged in!');
            localStorage.setItem('token', response.data.token)
        }
    }
    catch (err) {
        console.log(err);
        toastr.error(err.response.data.error);
    }
}

const addToCart = async (product) => {
    const token = localStorage.getItem('token');
    const productId = product._id;
    const productDetail = {
        productId
    }
    const response = await axios.post(`${API_URL}/cart/add`, productDetail, { headers: { Authorization: token } });
    toastr.success(response.data.message);
}

const addToWishlist = async (product) => {
    try {
        const token = localStorage.getItem('token');
        const productId = product._id;
        const productDetail = {
            productId
        }
        const response = await axios.post(`${API_URL}/wishlist/add`, productDetail, { headers: { Authorization: token } });
        toastr.success(response.data.message);
    }
    catch (err) {
        console.log(err);
        toastr.info(err.response.data.error);
    }
}

const showProduct = (product) => {
    const productContainer = document.querySelector('.container');

    const image = document.createElement('img');
    image.classList.add('product-img');
    image.src = product.imageURL;
    image.alt = 'Product Image'

    const productDetailsDiv = document.createElement('div');
    productDetailsDiv.classList.add('product-details');

    const title = document.createElement('h2');
    title.textContent = product.name;

    const brand = document.createElement('p');
    brand.innerHTML = `<strong>Brand:</strong> ${product.brand}`;

    const gender = document.createElement('p');
    gender.innerHTML = `<strong>Gender:</strong> ${product.gender}`;

    const category = document.createElement('p');
    category.innerHTML = `<strong>Category:</strong> ${product.category}`;

    const itemsLeft = document.createElement('p');
    itemsLeft.innerHTML = `<strong>Items left:</strong> ${product.items_left}`;

    const price = document.createElement('p');
    price.classList.add('price');
    price.textContent = `$${product.price}`;

    const addToCartBtn = document.createElement('a');
    addToCartBtn.classList.add('btn');
    addToCartBtn.textContent = 'Add to Cart';
    addToCartBtn.addEventListener('click', () => addToCart(product));

    const addToWishlistBtn = document.createElement('a');
    addToWishlistBtn.classList.add('btn');
    addToWishlistBtn.textContent = 'Add to Wishlist';
    addToWishlistBtn.addEventListener('click', () => addToWishlist(product));

    productDetailsDiv.appendChild(title);
    productDetailsDiv.appendChild(brand);
    productDetailsDiv.appendChild(category);
    productDetailsDiv.appendChild(gender);
    productDetailsDiv.appendChild(itemsLeft);
    productDetailsDiv.appendChild(price);
    productDetailsDiv.appendChild(addToCartBtn);
    productDetailsDiv.appendChild(addToWishlistBtn);

    productContainer.appendChild(image);
    productContainer.appendChild(productDetailsDiv);
}

window.addEventListener('DOMContentLoaded', async () => {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('productid');

        const response = await axios.get(`${API_URL}/products/product?id=${productId}`)

        showProduct(response.data.productDetails);
    }
    catch (err) {
        console.log(err);
    }
})

const searchForItem = async (e) => {
    e.preventDefault();

    const searchInput = document.getElementById('search').value;
    const searchresInput = document.getElementById('search-res').value;

    const searchFor = searchInput ? searchInput : searchresInput;
    window.location.href = `../homePage/index.html?page=1&search=${searchFor}`
}

if (token) {
    const logoutBtn = document.getElementById('logout');
    logoutBtn.addEventListener('click', () => {
        localStorage.clear();
        window.location.href = '../homePage/index.html';
    })
}