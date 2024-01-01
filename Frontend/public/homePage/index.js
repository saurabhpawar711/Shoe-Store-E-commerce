const API_URL = 'https://lfwz6gudb7.execute-api.ap-south-1.amazonaws.com/Dev'

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

toastr.options = {
    closeButton: true,
    timeOut: 1000,
    progressBar: true,
};

document.addEventListener('DOMContentLoaded', loader)
function loader() {
    const loader = document.getElementById('loader');
    const content = document.getElementById('content');

    setTimeout(function () {
        loader.style.display = 'none';
        content.style.display = 'block';
    }, 1000);
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
        if (err.response.data.error === 'Authentication required') {
            openModal('signupModal')
        }
        toastr.info(err.response.data.error);
    }
}

const addToCart = async (product) => {
    try {
        const token = localStorage.getItem('token');
        const productId = product._id;
        const productDetail = {
            productId
        }
        const response = await axios.post(`${API_URL}/cart/add`, productDetail, { headers: { Authorization: token } });
        if (response.data.success) {
            toastr.success(response.data.message);
        }
    }
    catch (err) {
        console.log(err);
        if (err.response.data.error === 'Authentication required') {
            openModal('signupModal')
        }
    }
}

const showProductDetails = (product) => {
    const productId = product._id;
    window.location.href = `../productPage/product.html?productid=${productId}`;
}

const showProduct = (product) => {
    const products = document.querySelector('.products');

    const productCard = document.createElement('div');
    productCard.classList.add('product-card');
    productCard.addEventListener('click', () => {
        showProductDetails(product)
    });

    const image = document.createElement('img');
    image.src = product.imageURL;
    image.alt = 'shoePhoto'

    const productTitle = document.createElement('h4');
    productTitle.textContent = product.name;

    const subDiv = document.createElement('div');
    subDiv.classList.add('product-details');

    const price = document.createElement('span');
    price.textContent = `${product.price} $`;

    const buttonsDiv = document.createElement('div');
    buttonsDiv.classList.add('buttons');

    const wishlistBtn = document.createElement('button');
    wishlistBtn.innerHTML = '<i class="fa-regular fa-heart"></i>';
    wishlistBtn.classList.add('wishlistBtn');
    wishlistBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        addToWishlist(product)
    });

    const addToCartBtn = document.createElement('button');
    addToCartBtn.textContent = '+';
    addToCartBtn.classList.add('addToCartBtn');
    addToCartBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        addToCart(product)
    });

    buttonsDiv.append(wishlistBtn);
    buttonsDiv.append(addToCartBtn);

    subDiv.appendChild(price);
    subDiv.appendChild(buttonsDiv);

    productCard.appendChild(image);
    productCard.appendChild(productTitle);
    productCard.appendChild(subDiv);

    products.appendChild(productCard);
}


const goToPage = async (page) => {

    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.get('page')) {
        queryParams.set('page', page);
        history.replaceState(null, null, "?" + queryParams.toString());
    }

    const products = document.querySelector('.products');
    products.innerHTML = "";

    const paginationDiv = document.querySelector('.pagination');
    paginationDiv.innerHTML = "";

    const searchInput = document.getElementById('search').value;
    const searchresInput = document.getElementById('search-res').value;

    let searchFor = searchInput ? searchInput : searchresInput;

    const searchFromUrl = new URL(window.location.href);
    const search = searchFromUrl.searchParams.get('search');
    if (search) {
        searchFor = search;
    }

    const response = await axios.get(`${API_URL}/products?page=${page}&search=${searchFor}`)
    response.data.productsDetails.forEach(product => {
        showProduct(product);
    });

    pagination(response.data.pageData);
}

const pagination = (pageData) => {

    const currentPage = pageData.currentPage;
    const hasNextPage = pageData.hasNextPage;
    const nextPage = pageData.nextPage;
    const hasNextToNextPage = pageData.hasNextToNextPage;
    const nextToNextPage = pageData.nextToNextPage;
    const hasPreviousPage = pageData.hasPreviousPage;
    const previousPage = pageData.previousPage;
    const hasPreviousToPreviousPage = pageData.hasPreviousToPreviousPage;
    const previousToPreviousPage = pageData.previousToPreviousPage;

    localStorage.setItem('page', currentPage);
    const paginationDiv = document.querySelector('.pagination');

    if (currentPage > 1) {
        const prevLink = document.createElement('a');
        prevLink.innerHTML = `&laquo;`
        paginationDiv.appendChild(prevLink);
        prevLink.addEventListener('click', () => goToPage(previousPage));
    }

    if (currentPage > 3) {
        const firstPageLink = document.createElement('a');
        firstPageLink.textContent = '1';
        firstPageLink.addEventListener('click', () => goToPage(1));

        const space = document.createElement('p');
        space.textContent = '. . .';

        paginationDiv.appendChild(firstPageLink);
        paginationDiv.appendChild(space);
    }

    if (!hasPreviousPage && hasNextToNextPage) {
        const currentPageLink = document.createElement('a');
        currentPageLink.textContent = `${currentPage}`;
        currentPageLink.classList.add('active');

        const nextPageLink = document.createElement('a');
        nextPageLink.textContent = `${nextPage}`;
        nextPageLink.addEventListener('click', () => goToPage(nextPage));

        const nextToNextPageLink = document.createElement('a');
        nextToNextPageLink.textContent = `${nextToNextPage}`;
        nextToNextPageLink.addEventListener('click', () => goToPage(nextToNextPage));

        const nextLink = document.createElement('a');
        nextLink.innerHTML = `&raquo;`
        nextLink.addEventListener('click', () => goToPage(currentPage + 1));

        paginationDiv.appendChild(currentPageLink);
        paginationDiv.appendChild(nextPageLink);
        paginationDiv.appendChild(nextToNextPageLink);
        paginationDiv.appendChild(nextLink);

        return;
    }

    if (!hasNextPage && hasPreviousToPreviousPage) {
        const currentPageLink = document.createElement('a');
        currentPageLink.textContent = currentPage;
        currentPageLink.classList.add('active');

        const previousPageLink = document.createElement('a');
        previousPageLink.textContent = previousPage;
        previousPageLink.addEventListener('click', () => goToPage(previousPage));

        const previousToPreviousPageLink = document.createElement('a');
        previousToPreviousPageLink.textContent = previousToPreviousPage;
        previousToPreviousPageLink.addEventListener('click', () => goToPage(previousToPreviousPage));

        paginationDiv.appendChild(previousToPreviousPageLink);
        paginationDiv.appendChild(previousPageLink);
        paginationDiv.appendChild(currentPageLink);

        return;
    }

    if (hasPreviousPage) {
        const previousPageLink = document.createElement('a');
        previousPageLink.textContent = previousPage;
        paginationDiv.appendChild(previousPageLink);
        previousPageLink.addEventListener('click', () => goToPage(previousPage));
    }

    const currentPageLink = document.createElement('a');
    currentPageLink.textContent = `${currentPage}`;
    currentPageLink.classList.add('active');
    paginationDiv.appendChild(currentPageLink);

    if (hasNextPage) {
        const nextPageLink = document.createElement('a');
        nextPageLink.textContent = nextPage;
        paginationDiv.appendChild(nextPageLink);
        nextPageLink.addEventListener('click', () => goToPage(nextPage));
    }

    if (hasNextPage) {
        const nextLink = document.createElement('a');
        nextLink.innerHTML = `&raquo;`
        paginationDiv.appendChild(nextLink);
        nextLink.addEventListener('click', () => goToPage(currentPage + 1));
    }
}

if (!localStorage.getItem('page')) {
    localStorage.setItem('page', 1);
}

window.addEventListener('DOMContentLoaded', async () => {

    const currentUrl = new URLSearchParams(window.location.search);
    const search = currentUrl.get('search');
    const currentPage = currentUrl.get('page');

    let searchFor;
    let currPage;

    if (currentUrl.size !== 0) {
        searchFor = search;
        currPage = currentPage;
    }
    else {
        currPage = localStorage.getItem('page');
        searchFor = "";
    }

    const response = await axios.get(`${API_URL}/products?page=${currPage}&search=${searchFor}`);

    response.data.productsDetails.forEach(product => {
        showProduct(product);
    });
    pagination(response.data.pageData);

})


const searchForItem = async (e) => {

    e.preventDefault();

    const searchInput = document.getElementById('search').value;
    const searchresInput = document.getElementById('search-res').value;

    const searchFor = searchInput ? searchInput : searchresInput;

    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.size === 0) {
        queryParams.set('page', 1);
        queryParams.set('search', searchFor);
        history.pushState(null, null, "?" + queryParams.toString());
    }

    else if (queryParams.get('search')) {
        queryParams.set('search', searchFor);
        queryParams.set('page', 1);
        history.replaceState(null, null, "?" + queryParams.toString());
    }

    localStorage.setItem('page', 1);
    const page = localStorage.getItem('page');

    const response = await axios.get(`${API_URL}/products?page=${page}&search=${searchFor}`);

    const products = document.querySelector('.products');
    products.innerHTML = "";

    const paginationDiv = document.querySelector('.pagination');
    paginationDiv.innerHTML = "";

    response.data.productsDetails.forEach(product => {
        showProduct(product);
    });
    pagination(response.data.pageData);
}

if (token) {
    const logoutBtn = document.getElementById('logout');
    logoutBtn.addEventListener('click', () => {
        localStorage.clear();
        window.location.href = "index.html";
    })
}

