
toastr.options = {
    closeButton: true,
    timeOut: 1000,
    progressBar: true,
};

const addToCart = async (product) => {
    const token = localStorage.getItem('token');
    const productId = product._id;
    const productDetail = {
        productId
    }
    const response = await axios.post('http://localhost:3000/cart/add', productDetail, { headers: { Authorization: token } });
    toastr.success(response.data.message);
}

const addToWishlist = async (product) => {
    try {
        const token = localStorage.getItem('token');
        const productId = product._id;
        const productDetail = {
            productId
        }
        const response = await axios.post('http://localhost:3000/wishlist/add', productDetail, { headers: { Authorization: token } });
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

        const response = await axios.get(`http://localhost:3000/products/product?id=${productId}`)

        showProduct(response.data.productDetails);
    }
    catch (err) {
        console.log(err);
    }
})

const searchButton = document.getElementById('searchBtn');
const searchInput = document.getElementById('search');

searchButton.addEventListener('click', async () => {
    const searchFor = searchInput.value;
    window.location.href = `/homePage/index.html?search=${searchFor}`;
})

if (token) {
    const logoutBtn = document.getElementById('logout');
    logoutBtn.addEventListener('click', () => {
        localStorage.clear();
        window.location.href = '../homePage/index.html';
    })
}