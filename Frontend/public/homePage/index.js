
function toggleMenu() {
    const navMenu = document.querySelector('ul');
    navMenu.classList.toggle('show');
}

const signUpBtn = document.querySelector('.signUp');
const loginBtn = document.querySelector('.login');

signUpBtn.addEventListener('click', () => {
    openModal('signupModal')
});

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
    timeOut: 3000,
    progressBar: true,
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


