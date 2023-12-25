

toastr.options = {
    closeButton: true,
    timeOut: 1000,
    progressBar: true,
};

const filterOrders = async () => {
    const token = localStorage.getItem('token');
    const selectElements = document.getElementById('statusFilter');
    const status = selectElements.value;
    const container = document.querySelector('.orders');
    container.innerHTML = "";
    try {
        const response = await axios.get(`http://localhost:3000/order/get?status=${status}`, { headers: { Authorization: token } });
        response.data.orderData.forEach(order => {
            showOrder(order);
        })
    }
    catch (err) {
        if (err.response.data.error === 'No order list') {
            const emptyContainer = document.querySelector('.no-orders-message');
            emptyContainer.innerHTML = "";
            const message = document.createElement('p');
            message.textContent = `No orders with the ${status} status.`
            emptyContainer.style.display = 'block';
            emptyContainer.appendChild(message);
        }
    }
}

const cancelOrder = async (order, orderHeader, orderDiv) => {
    const token = localStorage.getItem('token');
    console.log(order);
    const id = {
        orderId: order._id
    }
    try {
        const response = await axios.patch('http://localhost:3000/order/cancel', id, { headers: { Authorization: token } });
        const updatedStatusOrder = response.data.orderData;
        const statusP = orderHeader.querySelector('.status');
        statusP.textContent = `Status: ${updatedStatusOrder.status}`;
        const cancelOrderBtn = orderDiv.querySelector('.cancel-order-btn');
        orderDiv.removeChild(cancelOrderBtn);
    }
    catch (err) {
        console.log(err);
    }
}

const confirmCancel = (order, orderHeader, orderDiv) => {
    const isConfirmed = window.confirm('Are you sure you want to cancel this order?');

    if (isConfirmed) {
        cancelOrder(order, orderHeader, orderDiv);
    } else {
        console.log('Order cancellation canceled by the user.');
    }
}

const showOrder = (order) => {
    const container = document.querySelector('.orders');

    const orderDiv = document.createElement('div');
    orderDiv.classList.add('order');

    const orderHeader = document.createElement('div');
    orderHeader.classList.add('order-header');

    const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });

    const statusP = document.createElement('p');
    statusP.textContent = `Status: ${order.status}`;
    statusP.classList.add('status');

    const dateSpan = document.createElement('span');
    dateSpan.textContent = `${formattedDate}`;
    orderHeader.appendChild(dateSpan);
    orderHeader.appendChild(statusP);
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

        productInfo.appendChild(h3);
        productInfo.appendChild(quantityP);
        productInfo.appendChild(priceP);

        productDiv.appendChild(img);
        productDiv.appendChild(productInfo);

        orderDetails.appendChild(productDiv);
    });

    orderDiv.appendChild(orderDetails);

    const orderTotal = document.createElement('div');
    orderTotal.classList.add('order-total');
    const totalH3 = document.createElement('h3');
    totalH3.textContent = `Total: $${order.totalAmount}`;

    if (order.status !== 'Cancelled' && order.status !== 'Delivered') {
        const cancelOrderBtn = document.createElement('button');
        cancelOrderBtn.classList.add('cancel-order-btn');
        cancelOrderBtn.textContent = 'Cancel Order';
        cancelOrderBtn.addEventListener('click', () => confirmCancel(order, orderHeader, orderDiv));
        orderDiv.appendChild(cancelOrderBtn);
    }

    orderTotal.appendChild(totalH3);

    orderDiv.appendChild(orderTotal);

    container.appendChild(orderDiv);
}

window.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');

    try {
        const currentUrl = new URL(window.location.href);
        const success = currentUrl.searchParams.get('success');
        const status = {
            status: 'Processing'
        };
        if (success) {
            await axios.patch('http://localhost:3000/payment/confirm-payment', status, { headers: { Authorization: token } });
        }
        const response = await axios.get('http://localhost:3000/order/get', { headers: { Authorization: token } });

        response.data.orderData.forEach(order => {
            showOrder(order);
        })
    }
    catch (err) {
        if (err.response.data.error === 'No order list') {
            const emptyContainer = document.querySelector('.empty-container');
            emptyContainer.style.display = 'block';
        }
    }
})

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