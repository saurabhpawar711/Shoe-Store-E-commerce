function toggleMenu() {
    const navMenu = document.querySelector('ul');
    navMenu.classList.toggle('show');
}

const showOrder = (order) => {
    const container = document.createElement('div');
    container.classList.add('container');

    const orderDiv = document.createElement('div');
    orderDiv.classList.add('order');

    const orderHeader = document.createElement('div');
    orderHeader.classList.add('order-header');

    const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });

    const dateSpan = document.createElement('span');
    dateSpan.textContent = `Date: ${formattedDate}`;
    orderHeader.appendChild(dateSpan);
    orderDiv.appendChild(orderHeader);

    const orderDetails = document.createElement('div');
    orderDetails.classList.add('order-details');

    order.products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');

        const img = document.createElement('img');
        img.src = product.productId.imageURL;
        img.alt = 'Product Image';

        const productInfo = document.createElement('div');
        productInfo.classList.add('product-info');

        const h3 = document.createElement('h3');
        h3.textContent = product.productId.name;

        const quantityP = document.createElement('p');
        quantityP.textContent = `Quantity: ${product.quantity}`;

        const priceP = document.createElement('p');
        priceP.textContent = `Price: $${product.productId.price}`;

        const statusP = document.createElement('p');
        statusP.textContent = `Status: ${order.status}`;

        productInfo.appendChild(h3);
        productInfo.appendChild(quantityP);
        productInfo.appendChild(priceP);
        productInfo.appendChild(statusP);

        productDiv.appendChild(img);
        productDiv.appendChild(productInfo);

        orderDetails.appendChild(productDiv);
    });

    orderDiv.appendChild(orderDetails);

    const orderTotal = document.createElement('div');
    orderTotal.classList.add('order-total');
    const totalH3 = document.createElement('h3');
    totalH3.textContent = `Total: $${order.totalAmount}`;
    orderTotal.appendChild(totalH3);

    orderDiv.appendChild(orderTotal);

    container.appendChild(orderDiv);

    document.body.appendChild(container);
}

window.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');

    try {
        const response = await axios.get('http://localhost:3000/order/get', { headers: { Authorization: token } });

        response.data.orderData.forEach(order => {
            showOrder(order);
        })
    }
    catch (err) {
        console.log(err);
    }
})

const searchButton = document.getElementById('searchBtn');
const searchInput = document.getElementById('search');

searchButton.addEventListener('click', async () => {
    const searchFor = searchInput.value;
    window.location.href = `/homePage/index.html?page=${1}&search=${searchFor}`
})

if (token) {
    const logoutBtn = document.getElementById('logout');
    logoutBtn.addEventListener('click', () => {
        localStorage.clear();
        window.location.href = '../homePage/index.html';
    })
}