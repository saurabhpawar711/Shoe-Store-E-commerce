

function toggleMenu() {
    const navMenu = document.querySelector('ul');
    navMenu.classList.toggle('show');
}

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
    quantityLabel.textContent = 'Qty:'

    const inputForQty = document.createElement('input');
    inputForQty.id = 'quantity';
    inputForQty.name = 'quantity';
    inputForQty.type = 'number'
    inputForQty.value = item.quantity;
    inputForQty.min = 1;
    inputForQty.readOnly = true;

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('remove-btn');
    deleteBtn.textContent = 'Remove';
    deleteBtn.addEventListener('click', () => removeFromCart(item, cartItemDiv));

    quantityDiv.appendChild(quantityLabel);
    quantityDiv.appendChild(inputForQty);

    itemDetailsDiv.appendChild(productName);
    itemDetailsDiv.appendChild(productDesc);
    itemDetailsDiv.appendChild(price);
    itemDetailsDiv.appendChild(quantityDiv);

    cartItemDiv.appendChild(imageUrl);
    cartItemDiv.appendChild(itemDetailsDiv);
    cartItemDiv.appendChild(deleteBtn);

    cartDiv.appendChild(cartItemDiv);
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

