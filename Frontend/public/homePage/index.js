
function toggleMenu() {
    const navMenu = document.querySelector('ul');
    navMenu.classList.toggle('show');
}

if (!localStorage.getItem('token')) {
    const signUpBtn = document.querySelector('.signUp');

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
    var modals = document.getElementsByClassName('modal');
    for (var i = 0; i < modals.length; i++) {
        var modal = modals[i];
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
};

toastr.options = {
    closeButton: true,
    timeOut: 2000,
    progressBar: true,
    onclick: null,
};

document.addEventListener('DOMContentLoaded', loader)
function loader() {
    const loader = document.getElementById('loader');
    const content = document.getElementById('content');

    setTimeout(function () {
        loader.style.display = 'none';
        content.style.display = 'block';
    }, 500);
};


const user = document.querySelector('.user');

user.addEventListener('click', () => {
    const token = localStorage.getItem('token');
    if (token) {
        signUpBtn.style.display = 'none';
        loginBtn.style.display = 'none';
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
            await axios.post('http://localhost:3000/auth/otp', number);
        }
        else {
            throw new Error('Enter valid mobile number');
        }
    }
    catch (err) {
        console.log(err);
    }
}

const login = async () => {
    try {
        const otp = document.getElementById('otp').value;
        const loginDetails = {
            number: numberInput.value,
            otp: otp
        }

        console.log(loginDetails);

        const response = await axios.post('http://localhost:3000/auth/login', loginDetails);
        if (response.data.success) {
            closeModal('signupModal');
            toastr.success('You have successfully logged in!');

            localStorage.setItem('token', response.data.token)
        }
    }
    catch (err) {
        console.log(err.response.data.error);
        toastr.error(err.response.data.error);
    }
}

const addToCart = async (product) => {
    const token = localStorage.getItem('token');
    const productId = product._id;
    const productDetail = {
        productId
    }
    const response = await axios.post('http://localhost:3000/cart/add', productDetail, { headers: { Authorization: token } });
    toastr.success(response.data.message);
}

const showProduct = (product) => {
    const products = document.querySelector('.products');

    const productCard = document.createElement('div');
    productCard.classList.add('product-card');
    productCard.height = 300;

    const image = document.createElement('img');
    image.src = product.imageURL;
    image.alt = 'shoePhoto'

    const productTitle = document.createElement('h4');
    productTitle.textContent = product.name;

    const subDiv = document.createElement('div');

    const price = document.createElement('span');
    price.textContent = `${product.price} $`;

    const addToCartBtn = document.createElement('button');
    addToCartBtn.textContent = '+';
    addToCartBtn.addEventListener('click', () => addToCart(product));

    subDiv.appendChild(price);
    subDiv.appendChild(addToCartBtn);

    productCard.appendChild(image);
    productCard.appendChild(productTitle);
    productCard.appendChild(subDiv);

    products.appendChild(productCard);
}


const goToPage = async (page) => {

    const products = document.querySelector('.products');
    products.innerHTML = "";

    const paginationDiv = document.querySelector('.pagination');
    paginationDiv.innerHTML = "";

    const searchInput = document.getElementById('search');
    const searchFor = searchInput.value;

    const response = await axios.get(`http://localhost:3000/products?page=${page}&search=${searchFor}`)
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

localStorage.setItem('page', 1);
window.addEventListener('DOMContentLoaded', async () => {
    const page = localStorage.getItem('page');

    const searchInput = document.getElementById('search');
    const searchFor = searchInput.value;
    
    const response = await axios.get(`http://localhost:3000/products?page=${page}&search=${searchFor}`)
    response.data.productsDetails.forEach(product => {
        showProduct(product);
    });
    pagination(response.data.pageData);

})

const searchButton = document.getElementById('searchBtn');
const searchInput = document.getElementById('search');

searchButton.addEventListener('click', async () => {
    const searchFor = searchInput.value;

    localStorage.setItem('page', 1);
    const page = localStorage.getItem('page');

    const products = document.querySelector('.products');
    products.innerHTML = "";
    const paginationDiv = document.querySelector('.pagination');
    paginationDiv.innerHTML = "";

    const response = await axios.get(`http://localhost:3000/products?page=${page}&search=${searchFor}`)

    response.data.productsDetails.forEach(product => {
        showProduct(product);
    });
    pagination(response.data.pageData);
})
