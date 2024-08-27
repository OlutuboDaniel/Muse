function toggleSideNav() {
    const menudiv = document.querySelector('.menu-div');
    const sideNav = document.querySelector('.side-nav');
    menudiv.classList.toggle('active');
    sideNav.classList.toggle('active');
}

function clearErrors() {
    const errorElements = document.querySelectorAll('.error-text');
    errorElements.forEach(errorElement => {
        errorElement.classList.remove('show');
    });
}

function resetForm() {
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
    clearErrors();
}

function toggleAccountBox() {
    const accountBox = document.querySelector('.account-box');
    accountBox.classList.toggle('active');
    if (!accountBox.classList.contains('active')) {
        resetForm();
        
    }
}

document.addEventListener('click', function(event) {
    const accountBox = document.querySelector('.account-box');
    const accountBtn = document.querySelector('.account-btn');

    if (!accountBox.contains(event.target) && !accountBtn.contains(event.target)) {
        accountBox.classList.remove('active');
    }
});


function validateForm(event) {
    event.preventDefault();  

    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

  
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');

    let valid = true;

    
    if (!validateEmail(email)) {
        emailError.classList.add('show'); 
        valid = false;
    } else {
        emailError.classList.remove('show');
    }

   
    if (password.length < 6) {
        passwordError.classList.add('show');
        valid = false;
    } else {
        passwordError.classList.remove('show');
    }

    if (valid) {
        console.log("Form submitted");
    }
}

function validateEmail(email) {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(String(email).toLowerCase());
}