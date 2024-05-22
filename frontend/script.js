const API_URL = 'http://localhost:8080/';

const productList = document.getElementById('productList');
const profileContainer = document.getElementById('profileContainer');

function emptyProductList() {
    while (productList.firstChild) {
        productList.removeChild(productList.firstChild);
    }
}

function createProductCard(id = null, image = null, name = null, description = null) {
    const productCol = document.createElement('div');
    productCol.className = 'col';

    const productCard = document.createElement('div');
    productCard.className = 'card shadow-sm';


    let productImage = null;
    if (image !== null) {
        if (!image.startsWith('http')) {
            image = API_URL + 'images/' + image;
        }

        productImage = document.createElement('img');
        productImage.src = image;
        productImage.className = 'card-img-top';
    } else {
        productCard.className += ' placeholder-glow';
        productImage = document.createElement('div');
        productImage.className = 'placeholder col-12';
        productImage.style.height = '300px';
    }

    const productCardBody = document.createElement('div');
    productCardBody.className = 'card-body';

    const productName = document.createElement('h5');
    productName.className = 'card-title';
    productName.textContent = name;
    if (name === null) {
        productName.className += ' placeholder-glow';
        const productNamePlaceholder = document.createElement('span');
        productNamePlaceholder.className = 'placeholder col-12';
        productName.appendChild(productNamePlaceholder);
    }

    const productDescription = document.createElement('p');
    productDescription.className = 'card-text';
    productDescription.textContent = description;
    if (description === null) {
        productDescription.className += ' placeholder-glow';
        const productDescriptionPlaceholder = document.createElement('span');
        productDescriptionPlaceholder.className = 'placeholder col-12';
        productDescription.appendChild(productDescriptionPlaceholder);
    }

    const askButton = document.createElement('a');
    askButton.className = 'btn btn-primary col-12';
    askButton.href = '#';
    if (id === null) {
        askButton.className += ' placeholder disabled';
    } else {
        askButton.textContent = 'Ask';
    }


    productCardBody.appendChild(productName);
    productCardBody.appendChild(productDescription);
    productCardBody.appendChild(askButton);

    productCard.appendChild(productImage);
    productCard.appendChild(productCardBody);

    productCol.appendChild(productCard);

    productList.appendChild(productCol);
}

function renderLoggedInUser(firstname, lastname) {
    const avatar = document.createElement('div');
    avatar.id = 'profileContainer'
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
    avatar.textContent = firstname[0] + lastname[0];

    profileContainer.replaceWith(avatar);
}

function renderLoginButton() {
    const loginButton = document.createElement('a');
    loginButton.id = 'profileContainer';
    loginButton.className = 'btn btn-primary';
    loginButton.href = '#';
    loginButton.dataset.bsToggle = 'modal';
    loginButton.dataset.bsTarget = '#loginModal';
    loginButton.textContent = 'Login';

    profileContainer.replaceWith(loginButton);
}

function updateLoginStatus() {
    fetch(API_URL + 'user.php', {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                renderLoggedInUser(data.user.firstname, data.user.lastname);
            } else {
                renderLoginButton();
            }
        });
}

updateLoginStatus();

document.getElementById("logoutButton").addEventListener("click", () => {
    fetch(API_URL + 'logout.php', {
        method: 'POST',
    }).then(()=>{
        updateLoginStatus();
    })
});

for (let i = 0; i < 9; i++) {
    createProductCard(null, null, null, null);
}

function refreshProductList() {
    fetch(API_URL + 'products.php', {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => {
            emptyProductList();
            data.data.forEach(product => {
                createProductCard(product.id, product["image_url"], product.title, product.description);
            });
        });
}

refreshProductList();

function formDataToJson(formData) {
    const object = {};
    formData.forEach((value, key) => {
        // Check if the object already contains the key
        if (!Reflect.has(object, key)) {
            object[key] = value;
            return;
        }
        // If the key exists, convert it to an array or push to existing array
        if (!Array.isArray(object[key])) {
            object[key] = [object[key]];
        }
        object[key].push(value);
    });
    return JSON.stringify(object);
}

document.getElementById("registerForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const jsonData = formDataToJson(formData);

    const response = await fetch(API_URL + 'register.php', {
        method: 'POST', body: jsonData,
    });

    const data = await response.json();

    if (data.status === 'success') {
        bootstrap.Modal.getInstance(document.getElementById("loginModal")).hide();
        updateLoginStatus();
    } else {
        alert(data.message);
    }

})

document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const jsonData = formDataToJson(formData);

    const response = await fetch(API_URL + 'login.php', {
        method: 'POST', body: jsonData,
    });

    const data = await response.json();

    if (data.status === 'success') {
        bootstrap.Modal.getInstance(document.getElementById("loginModal")).hide();
        updateLoginStatus();
    } else {
        alert(data.message);
    }
});

document.getElementById("newProductForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const formData = new FormData(this);

    fetch(API_URL + 'newProduct.php', {
        method: 'POST',
        body: formData, // FormData will be sent as 'multipart/form-data'
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert("Product created successfully");
                bootstrap.Modal.getInstance(document.getElementById("newProductModal")).hide();
                refreshProductList();
            } else {
                alert(data.message);
            }
        })
        .catch(error => console.error('Error:', error));
});
