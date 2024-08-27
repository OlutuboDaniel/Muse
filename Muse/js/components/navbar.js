function loadNavBar() {
    document.querySelector('.nav-container').innerHTML = `
        <nav class="nav-bar mp-0 flex-row items-center">
            <a class="main-logo" href="">Muse</a>
            <div class="search-div">
                <input type="search" class="search-input" placeholder="cow">
                <img src="static/images/search-icon.png" class="search-btn" alt="search-btn">
            </div>
            <button onclick="toggleAccountBox()" class="account-btn">
                <img src="static/images/account-placeholder.png" alt="account-plc" class="account-img">
            </button>
        </nav>
        <div class="account-box">
        <img src="static/images/account-placeholder.png" alt="User Picture" class="user-img">
        <form class="login-form" onsubmit="validateForm(event)">
            <h1 class="text-white login-text">Login</h1>
            <input type="email" class="login-input" id="email" placeholder="Email">
            <p class="error-text" id="email-error">Please enter a valid email address</p>

            <input type="password" class="login-input" id="password" placeholder="Password">
            <p class="error-text" id="password-error">Password must be at least 6 characters long</p>

            <button type="submit" class="login-btn">Login</button>
        </form>
        <a href="#" class="signup-link">Don't have an account? Sign up</a>
    </div>
    `;
}
document.addEventListener('DOMContentLoaded', loadNavBar);

