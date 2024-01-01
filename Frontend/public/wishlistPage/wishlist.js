const API_URL = 'https://lfwz6gudb7.execute-api.ap-south-1.amazonaws.com/Dev'
toastr.options = {
    closeButton: true,
    timeOut: 1000,
    progressBar: true,
};

const showEmptyWishlist = () => {
    const emptyContainer = document.querySelector('.wishlist-container');
    emptyContainer.style.display = 'block';
}

const addToCart = async (product) => {
    try {
        const token = localStorage.getItem('token');
        const productId = product._id;
        const productDetail = {
            productId
        }
        const response = await axios.post(`${API_URL}/cart/add`, productDetail, { headers: { Authorization: token } });
        toastr.success(response.data.message);
    }
    catch (err) {
        toastr.error(err.response.data.error);
    }
}

const removeFromWishlist = async (product, productCardDiv) => {
    try {
        const token = localStorage.getItem('token');
        const productId = product._id;

        const response = await axios.delete(`${API_URL}/wishlist/delete/${productId}`, { headers: { Authorization: token } });

        const container = document.querySelector('.container');
        container.removeChild(productCardDiv);

        if (response.data.wishlist.length === 0) {
            showEmptyWishlist();
        }

    }
    catch (err) {
        console.log(err);
    }
}

const showProductDetails = (product) => {
    const productId = product._id;
    window.location.href = `../productPage/product.html?productid=${productId}`;
}

const showWishlist = (product) => {
    const productCard = document.createElement('div');
    productCard.classList.add('product-card');
    productCard.addEventListener('click', () => {
        showProductDetails(product)
    });

    const image = document.createElement('img');
    image.src = product.imageURL;
    image.alt = 'Product Image';

    const productDetails = document.createElement('div');
    productDetails.classList.add('product-details');

    const productName = document.createElement('h4');
    productName.textContent = product.name;

    const brand = document.createElement('p');
    brand.innerHTML = `<strong>Brand:</strong> ${product.brand}`;

    const gender = document.createElement('p');
    gender.innerHTML = `<strong>Gender:</strong> ${product.gender}`;

    const category = document.createElement('p');
    category.innerHTML = `<strong>Category:</strong> ${product.category}`;

    const price = document.createElement('p');
    price.classList.add('price');
    price.textContent = `$${product.price}`;

    const buttonsDiv = document.createElement('div');
    buttonsDiv.classList.add('buttons');

    const addToCartBtn = document.createElement('a');
    addToCartBtn.classList.add('btn');
    addToCartBtn.textContent = 'Add to Cart';
    addToCartBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        addToCart(product)
    });

    const cancelBtn = document.createElement('a');
    cancelBtn.href = '#';
    cancelBtn.classList.add('btn', 'btn-cancel');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        removeFromWishlist(product, productCard)
    });

    buttonsDiv.appendChild(addToCartBtn);
    buttonsDiv.appendChild(cancelBtn);

    productDetails.appendChild(productName);
    productDetails.appendChild(brand);
    productDetails.appendChild(gender);
    productDetails.appendChild(category);
    productDetails.appendChild(price);
    productDetails.appendChild(buttonsDiv);


    productCard.appendChild(image);
    productCard.appendChild(productDetails);

    document.querySelector('.container').appendChild(productCard);
}

window.addEventListener('DOMContentLoaded', async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/wishlist/get`, { headers: { Authorization: token } });

        response.data.wishlist.forEach(product => {
            showWishlist(product.product);
        })
    }
    catch (err) {
        console.log(err);
        showEmptyWishlist();
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