
const showProductInOrderSummary = (product) => {
    const orderTableBody = document.querySelector('.order-table tbody');

    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${product.productId.name}</td>
        <td>$${product.productId.price}</td>
        <td>${product.quantity}</td>
        <td>$${(product.productId.price * product.quantity)}</td>
    `;

    orderTableBody.appendChild(row);
}

const showTotal = (total) => {
    const orderTableFooter = document.querySelector('.order-table tfoot');

    const totalRow = document.createElement('tr');
    totalRow.innerHTML = `
        <th colspan="3">Total</th>
        <td>$${total}</td>
    `;

    orderTableFooter.appendChild(totalRow);
}

window.addEventListener('DOMContentLoaded', async () => {
    try {
        const token = localStorage.getItem('token');

        const response = await axios.get('http://localhost:3000/order/checkout/get', { headers: { Authorization: token } });
        
        response.data.products.forEach(product => {
            showProductInOrderSummary(product);
        })
        showTotal(response.data.totalAmount);
    }
    catch (err) {
        console.log(err);
    }
})

const makePaymentThroughGateway = async () => {

    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const token = localStorage.getItem('token');

    const stripePublicKey = 'pk_test_51OOFQESGR8M6xrnFZlqQu9bWWv2nLlNEMNYTOepSWXrB4WjyRkEytE3R7ztpCbvaUhhbmFTYbUqpSMNM0zm1pviH00dX98bVuZ';

    var stripe = Stripe(stripePublicKey);

    const customerDetails = {
        name,
        address
    }

    try {
        const response = await axios.post('http://localhost:3000/payment/create-checkout-session', customerDetails,
            { headers: { Authorization: token } }
        )

        const id = response.data.id;

        stripe.redirectToCheckout({
            sessionId: id
        })

    }
    catch (err) {
        console.log(err);
    }
}

const makePaymentCOD = async () => {

    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const token = localStorage.getItem('token');

    try {
        const customerDetails = {
            name,
            address
        }
        const response = await axios.post('http://localhost:3000/payment/cod', customerDetails,
            { headers: { Authorization: token } }
        )
        
        window.location.href = '../ordersPage/order.html'
    }
    catch (err) {
        console.log(err);
    }
}

const placeOrderButton = document.getElementById('orderPlaced');
placeOrderButton.addEventListener('click', () => {
    const paymentMethods = document.querySelectorAll('input[name="payment"]');
    console.log(paymentMethods);

    let methodForPayment;
    paymentMethods.forEach(method => {
        if (method.checked) {
            methodForPayment = method.value;
        }
    });

    if (methodForPayment === 'gateway') {
        makePaymentThroughGateway();
    }
    else {
        makePaymentCOD();
    }
})