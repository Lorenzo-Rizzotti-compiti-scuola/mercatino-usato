const API_URL = document.URL.includes('altervista')
    ? `${new URL(document.URL).protocol}//${new URL(document.URL).hostname}/`
    : 'http://localhost:8080/';

const productList = document.getElementById('productList');

/**
 * Utility class for managing the product list and user interface.
 */
class UIManager {
    /**
     * Empties the product list.
     */
    static emptyProductList() {
        while (productList.firstChild) {
            productList.removeChild(productList.firstChild);
        }
    }

    /**
     * Creates and appends a product card to the product list.
     * @param {number|null} id - Product ID.
     * @param {string|null} image - Product image URL.
     * @param {string|null} name - Product name.
     * @param {string|null} description - Product description.
     */
    static createProductCard(id = null, image = null, name = null, description = null) {
        const productCol = document.createElement('div');
        productCol.className = 'col';

        const productCard = document.createElement('div');
        productCard.className = 'card shadow-sm';

        let productImage = null;
        if (image) {
            if (!image.startsWith('http')) {
                image = `${API_URL}images/${image}`;
            }
            productImage = document.createElement('img');
            productImage.src = image;
            productImage.className = 'card-img-top';
        } else {
            productCard.classList.add('placeholder-glow');
            productImage = document.createElement('div');
            productImage.className = 'placeholder col-12';
            productImage.style.height = '300px';
        }

        const productCardBody = document.createElement('div');
        productCardBody.className = 'card-body';

        const productName = document.createElement('h5');
        productName.className = 'card-title';
        productName.textContent = name;
        if (!name) {
            productName.classList.add('placeholder-glow');
            const productNamePlaceholder = document.createElement('span');
            productNamePlaceholder.className = 'placeholder col-12';
            productName.appendChild(productNamePlaceholder);
        }

        const productDescription = document.createElement('p');
        productDescription.className = 'card-text';
        productDescription.textContent = description;
        if (!description) {
            productDescription.classList.add('placeholder-glow');
            const productDescriptionPlaceholder = document.createElement('span');
            productDescriptionPlaceholder.className = 'placeholder col-12';
            productDescription.appendChild(productDescriptionPlaceholder);
        }

        const askButton = document.createElement('a');
        askButton.className = 'btn btn-primary col-12';
        askButton.href = '#';
        if (!id) {
            askButton.classList.add('placeholder', 'disabled');
        } else {
            askButton.textContent = 'Ask';
        }

        productCardBody.append(productName, productDescription, askButton);
        productCard.append(productImage, productCardBody);
        productCol.appendChild(productCard);
        productList.appendChild(productCol);
    }

    /**
     * Renders the logged-in user's avatar.
     * @param {string} firstname - User's first name.
     * @param {string} lastname - User's last name.
     */
    static renderLoggedInUser(firstname, lastname) {
        const avatar = document.createElement('div');
        avatar.id = 'profileContainer';
        avatar.className = 'bg-info rounded-circle user-select-none';
        avatar.dataset.bsToggle = 'dropdown';
        avatar.ariaExpanded = 'false';
        avatar.role = 'button';
        avatar.style.width = '35px';
        avatar.style.height = '35px';
        avatar.style.lineHeight = '33px';
        avatar.style.textAlign = 'center';
        avatar.style.color = 'white';
        avatar.style.fontSize = '20px';
        avatar.textContent = `${firstname[0]}${lastname[0]}`;

        document.getElementById('profileContainer').replaceWith(avatar);
    }

    /**
     * Renders the login button.
     */
    static renderLoginButton() {
        const loginButton = document.createElement('a');
        loginButton.id = 'profileContainer';
        loginButton.className = 'btn btn-primary';
        loginButton.href = '#';
        loginButton.dataset.bsToggle = 'modal';
        loginButton.dataset.bsTarget = '#loginModal';
        loginButton.textContent = 'Login';

        document.getElementById('profileContainer').replaceWith(loginButton);
    }

    /**
     * Converts form data to JSON format.
     * @param {FormData} formData - The form data to convert.
     * @returns {string} - The JSON string representation of the form data.
     */
    static formDataToJson(formData) {
        const object = {};
        formData.forEach((value, key) => {
            if (!Reflect.has(object, key)) {
                object[key] = value;
                return;
            }
            if (!Array.isArray(object[key])) {
                object[key] = [object[key]];
            }
            object[key].push(value);
        });
        return JSON.stringify(object);
    }
}

/**
 * Updates the login status by fetching user information.
 */
async function updateLoginStatus() {
    try {
        const response = await fetch(`${API_URL}user.php`);
        const data = await response.json();
        if (data.status === 'success') {
            UIManager.renderLoggedInUser(data.user.first_name, data.user.last_name);
        } else {
            UIManager.renderLoginButton();
        }
    } catch (error) {
        console.error('Error fetching login status:', error);
    }
}

/**
 * Refreshes the product list by fetching product data.
 */
async function refreshProductList() {
    try {
        const response = await fetch(`${API_URL}products.php`);
        const data = await response.json();
        UIManager.emptyProductList();
        data.data.forEach(product => {
            UIManager.createProductCard(product.id, product.image_url, product.title, product.description);
        });
    } catch (error) {
        console.error('Error fetching product list:', error);
    }
}

document.getElementById("logoutButton").addEventListener("click", async () => {
    try {
        await fetch(`${API_URL}logout.php`, { method: 'POST' });
        updateLoginStatus();
    } catch (error) {
        console.error('Error logging out:', error);
    }
});

document.getElementById("registerForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const jsonData = UIManager.formDataToJson(formData);

    try {
        const response = await fetch(`${API_URL}register.php`, {
            method: 'POST',
            body: jsonData,
        });
        const data = await response.json();

        if (data.status === 'success') {
            bootstrap.Modal.getInstance(document.getElementById("loginModal")).hide();
            updateLoginStatus();
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error registering user:', error);
    }
});

document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const jsonData = UIManager.formDataToJson(formData);

    try {
        const response = await fetch(`${API_URL}login.php`, {
            method: 'POST',
            body: jsonData,
        });
        const data = await response.json();

        if (data.status === 'success') {
            bootstrap.Modal.getInstance(document.getElementById("loginModal")).hide();
            updateLoginStatus();
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error logging in:', error);
    }
});

document.getElementById("newProductForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(this);

    try {
        const response = await fetch(`${API_URL}newProduct.php`, {
            method: 'POST',
            body: formData, // FormData will be sent as 'multipart/form-data'
        });
        const data = await response.json();

        if (data.status === 'success') {
            bootstrap.Modal.getInstance(document.getElementById("newProductModal")).hide();
            refreshProductList();
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error adding new product:', error);
    }
});

// Create placeholder product cards
for (let i = 0; i < 9; i++) {
    UIManager.createProductCard();
}

// Initial calls
updateLoginStatus();
refreshProductList();
