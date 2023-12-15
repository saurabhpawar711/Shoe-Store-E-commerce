function toggleMenu() {
    const navMenu = document.querySelector('ul');
    navMenu.classList.toggle('show');
}

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
        const response = await axios.post('http://localhost:3000/cart/add', productDetail, { headers: { Authorization: token } });
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

        const response = await axios.delete(`http://localhost:3000/wishlist/delete/${productId}`, { headers: { Authorization: token } });

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

const showWishlist = (product) => {
    const productCard = document.createElement('div');
    productCard.classList.add('product-card');

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
    addToCartBtn.addEventListener('click', () => addToCart(product));

    const cancelBtn = document.createElement('a');
    cancelBtn.href = '#';
    cancelBtn.classList.add('btn', 'btn-cancel');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.addEventListener('click', () => removeFromWishlist(product, productCard));

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
        const response = await axios.get('http://localhost:3000/wishlist/get', { headers: { Authorization: token } });

        response.data.wishlist.forEach(product => {
            showWishlist(product.product);
        })
    }
    catch (err) {
        console.log(err);
        showEmptyWishlist();
    }
})