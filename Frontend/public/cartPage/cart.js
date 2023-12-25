
toastr.options = {
    closeButton: true,
    timeOut: 1000,
    progressBar: true,
};

const removeFromScreen = (cartItemDiv) => {
    const cartDiv = document.querySelector('.cart');
    cartDiv.removeChild(cartItemDiv);
}


const removeFromCart = async (item, cartItemDiv) => {
    try {
        const productId = item.product._id;
        const token = localStorage.getItem('token');
        const response = await axios.delete(`http://localhost:3000/cart/delete/${productId}`, { headers: { Authorization: token } });
        removeFromScreen(cartItemDiv);
        if (response.data.cartDetails.length === 0) {
            showEmptyCart();
        }
        else {
            updateTotal(response.data.cartDetails);
        }
    }
    catch (err) {
        console.log(err);
    }
}

const changeQty = async (newQty, productId) => {
    const token = localStorage.getItem('token');
    if (newQty !== '10+') {
        const qty = {
            newQty: newQty,
            productId: productId
        }
        try {
            const response = await axios.patch('http://localhost:3000/cart/qty', qty, { headers: { Authorization: token } });
            updateTotal(response.data.cartDetails);
        }
        catch (err) {
            console.log(err);
        }
    }
}

const showCart = (item) => {

    const cartDiv = document.querySelector('.cart');
    const cartItemDiv = document.createElement('div');
    cartItemDiv.classList.add('cart-item');

    const imageUrl = document.createElement('img');
    imageUrl.src = item.product.imageURL;
    imageUrl.alt = 'Product'

    const itemDetailsDiv = document.createElement('div');
    itemDetailsDiv.classList.add('item-details');

    const productName = document.createElement('h3');
    productName.textContent = item.product.name;

    const productDesc = document.createElement('p');
    productDesc.textContent = `${item.product.gender} ${item.product.category}`;

    const price = document.createElement('span');
    price.textContent = `$${item.product.price}`;
    price.classList.add('price');

    const quantityDiv = document.createElement('div');
    quantityDiv.classList.add('quantity');

    const quantityLabel = document.createElement('label');
    quantityLabel.textContent = 'Qty: '

    const searchInput = document.createElement('input');
    searchInput.type = 'number';
    searchInput.value = item.quantity;
    searchInput.min = 1;
    searchInput.max = 999;
    searchInput.classList.add('search-input');
    searchInput.style.display = 'none';
    searchInput.addEventListener('input', function () {
        const currentValue = parseInt(this.value, 10);
        if (currentValue < this.min) {
            this.value = "";
        } else if (currentValue > this.max) {
            this.value = "";
        }
    });

    const updateBtn = document.createElement('button');
    updateBtn.classList.add('update-btn');
    updateBtn.textContent = 'Update';
    updateBtn.style.display = 'none';
    updateBtn.addEventListener('click', () => {
        const newQty = searchInput.value;
        changeQty(newQty, item.product._id);
    })

    const select = document.createElement('select');
    select.id = 'quantity';
    select.name = 'quantity';
    select.style.maxWidth = '100px';
    select.onchange = () => {
        const selectedValue = select.value;
        if (selectedValue === '10+') {
            searchInput.style.display = 'inline-block';
            updateBtn.style.display = 'inline-block';
            select.style.display = 'none';
        }
        changeQty(selectedValue, item.product._id);
    };

    for (let i = 1; i <= 9; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.text = i;
        select.appendChild(option);

        if (i === item.quantity) {
            option.selected = true;
        }
    }

    const option = document.createElement('option');
    option.value = '10+';
    option.text = '10+';
    select.appendChild(option);

    if (item.quantity > 10) {
        searchInput.style.display = 'inline-block';
        updateBtn.style.display = 'inline-block';
        select.style.display = 'none';
    }

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('remove-btn');
    deleteBtn.textContent = 'Remove';
    deleteBtn.addEventListener('click', () => removeFromCart(item, cartItemDiv));

    quantityDiv.appendChild(quantityLabel);
    quantityDiv.appendChild(select);
    quantityDiv.appendChild(searchInput);
    quantityDiv.appendChild(updateBtn);

    itemDetailsDiv.appendChild(productName);
    itemDetailsDiv.appendChild(productDesc);
    itemDetailsDiv.appendChild(price);
    itemDetailsDiv.appendChild(quantityDiv);

    cartItemDiv.appendChild(imageUrl);
    cartItemDiv.appendChild(itemDetailsDiv);
    cartItemDiv.appendChild(deleteBtn);

    cartDiv.appendChild(cartItemDiv);
}

const checkout = async (items, total) => {
    try {
        const token = localStorage.getItem('token');
        let productDetails = [];
        items.forEach(item => {
            productDetails.push({
                productId: item.product._id,
                quantity: item.quantity
            });
        })

        const productsToOrder = {
            productDetails: productDetails,
            total: total
        }

        await axios.post('http://localhost:3000/order/checkout/add', productsToOrder, { headers: { Authorization: token } });
        window.location.href = '../checkoutPage/checkout.html';
    }
    catch (err) {
        console.log(err);
    }
}

const updateTotal = (cartItems) => {

    let total = cartItems.reduce((acc, curr) => {
        return acc + (curr.product.price * curr.quantity);
    }, 0)

    const totalDiv = document.querySelector('.total');
    totalDiv.innerHTML = "";

    const totalHeading = document.createElement('h3');
    totalHeading.textContent = `Total: $${total}`
    totalHeading.style.color = 'white'

    const checkoutBtn = document.createElement('button');
    checkoutBtn.textContent = 'Checkout';
    checkoutBtn.classList.add('checkout-btn');
    checkoutBtn.addEventListener('click', () => checkout(cartItems, total));

    totalDiv.appendChild(totalHeading);
    totalDiv.appendChild(checkoutBtn);
}

const showEmptyCart = () => {
    const main = document.querySelector('.main');
    main.style.display = 'none';
    const emptyCart = document.querySelector('.empty-cart-container');
    emptyCart.style.display = 'block';
}

window.addEventListener('DOMContentLoaded', async () => {
    try {
        const token = localStorage.getItem('token');

        const response = await axios.get('http://localhost:3000/cart/get', { headers: { Authorization: token } });

        response.data.cartDetails.forEach(item => {
            showCart(item);
        });
        updateTotal(response.data.cartDetails);
    }
    catch (err) {
        console.log(err);
        showEmptyCart();
    }
});

const searchButton = document.getElementById('searchBtn');
const searchInput = document.getElementById('search');

searchButton.addEventListener('click', async () => {
    const searchFor = searchInput.value;
    window.location.href = `/homePage/index.html?search=${searchFor}`
})

if (token) {
    const logoutBtn = document.getElementById('logout');
    logoutBtn.addEventListener('click', () => {
        localStorage.clear();
        window.location.href = '../homePage/index.html';
    })
}