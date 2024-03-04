var tweets = [];
var user = null;
function getProducts() {
  fetch("http://localhost:8080/ecommerce/webapi/amazon/products", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      Object.assign(products, data);
      console.log("Products:", data);
      displayProducts(data);
    });
}

function getMyProducts() {
  fetch(
    `http://localhost:8080/ecommerce/webapi/amazon/products/myProducts/${user.userId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then((res) => res.json())
    .then((data) => {
      Object.assign(products, data);
      console.log("My Products :", data);
      mapMyProductsToCard(data);
    });
}

function mapProductsToCard(products) {
  var productListString = "";

  for (let i = 0; i < products.length; i++) {
    productListString += `<div class="card mb-3">
    <div class="card-body">
        <img src="${products[i].imageUrl}" alt="Product Image" class="img-fluid mb-3">
        <h5 class="card-title">${products[i].name}</h5>
        <p class="card-text">${products[i].description}</p>
        <p class="card-text">Price: $${products[i].price}</p>
        <button type="button" class="btn btn-primary">Add to Cart</button>
    </div>
  </div>`;
  }

  document.getElementById("productList").innerHTML = productListString;
}

function mapMyProductsToCard(products) {
  var productListString = "";

  for (let i = 0; i < products.length; i++) {
    productListString += `<div class="card mb-3">
    <div class="card-body">
        <img src="${products[i].imageUrl}" alt="Product Image" class="rounded-circle me-2" style="width: 50px; height: 50px;">
        <div>
            <h5 class="card-title mb-0">${products[i].name}</h5>
            <p class="card-subtitle text-muted">${products[i].description}</p>
        </div>
        <p class="card-text mt-3">Price: $${products[i].price}</p>
        <div class="d-flex justify-content-between align-items-center mt-3">
            <div>
                <button type="button" class="btn btn-outline-primary btn-sm"><i class="bi bi-chat"></i> 10</button>
                <button type="button" class="btn btn-outline-danger btn-sm" onclick="addToCart(${products[i].productId})"><i class="bi bi-cart-plus"></i> Add to Cart</button>
            </div>
            <button type="button" class="btn btn-outline-danger btn-sm" onclick="deleteProduct(${products[i].productId})">Delete</button>
        </div>
    </div>
</div>
`;
  }

  document.getElementById("myProductsList").innerHTML = productListString;
}

function signUp() {
  const userData = {
    username: document.getElementById("signUpName").value,
    email: document.getElementById("signUpEmail").value,
    password: document.getElementById("signUpPassword").value,
  };

  // Clear input fields
  document.getElementById("signUpEmail").value = "";
  document.getElementById("signUpName").value = "";
  document.getElementById("signUpPassword").value = "";

  fetch("http://localhost:8080/ecommerce/webapi/amazon/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })
    .then((resp) => {
      if (resp.status === 200) {
        alert("User Registered Successfully!");
        return resp.json();
      } else if (resp.status === 204) {
        throw new Error("Email already exists");
      }
    })
    .then((data) => console.log(data))
    .catch((error) => {
      console.error("Error:", error);
      alert("Email already exists!");
    });
}

function signIn() {
  const userEmailInput = document.getElementById("signInEmail");
  const userPasswordInput = document.getElementById("signInPassword");
  const userData = {
    email: userEmailInput.value,
    password: userPasswordInput.value,
  };
  document.getElementById("signInEmail").value = "";
  userPasswordInput.value = "";

  fetch("http://localhost:8080/ecommerce/webapi/amazon/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })
    .then((resp) => {
      if (resp.status === 200) {
        // Successful login
        console.log("Success");
        alert("Logged In Successfully!");
        document.getElementById("feed-tab").disabled = false;
        document.getElementById("profile-tab").disabled = false;
        document.getElementById("my-tweets-tab").disabled = false;
        document.getElementById("sign-in-tab").hidden = true;
        document.getElementById("sign-up-tab").hidden = true;
        document.getElementById("logout-tab").hidden = false;
        getProducts(); // Update to fetch products instead of tweets
        const feedTabButton = document.getElementById("feed-tab");
        feedTabButton.click();
        return resp.json();
      } else if (resp.status === 204) {
        // No content
        throw new Error("Wrong email or password");
      }
    })
    .then((data) => {
      user = data;
      console.log(user);
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Email and password are incorrect!");
    });
}
function addProduct() {
  const productName = document.getElementById("productName").value;
  const productPrice = document.getElementById("productPrice").value;
  const productDescription = document.getElementById("productDescription").value;
  const productData = {
    productName: productName,
    productPrice: productPrice,
    productDescription: productDescription,
    categoryid: user.categoryId, // Assuming the user's category ID is stored in the user object
  };

  fetch("http://localhost:8080/ecommerce/webapi/amazon/products/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  })
    .then((resp) => {
      getProducts(); // Update to fetch products after adding a new one
      return resp.json();
    })
    .then((data) => console.log("Product Data:", data))
    .catch((error) => console.error("Error:", error));
}
function deleteProduct(productId) {
  console.log("Product ID", productId);
  fetch(
    `http://localhost:8080/ecommerce/webapi/amazon/products/delete/${productId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then((resp) => {
      getMyProducts(); // Update to fetch products after deleting one
      resp.json();
    })
    .then((data) => console.log("Delete Data:", data))
    .catch((error) => console.error("Error:", error));
}


function logout() {
  document.getElementById("feed-tab").disabled = true;
  document.getElementById("profile-tab").disabled = true;
  document.getElementById("my-tweets-tab").disabled = true;
  document.getElementById("sign-in-tab").hidden = false;
  document.getElementById("sign-up-tab").hidden = false;
  document.getElementById("logout-tab").hidden = true;

  const signInTabButton = document.getElementById("sign-in-tab");
  signInTabButton.click();
}


function onEdit() {
  document.getElementById("nameTextBox").value =
    document.getElementById("name-text").innerText;

  document.getElementById("emailTextBox").value =
    document.getElementById("email-text").innerText;

  document.getElementById("passTextBox").value =
    document.getElementById("pass-text").innerText;

  document.getElementById("bioTextBox").value =
    document.getElementById("bio-text").innerText;

  document.getElementById("AvatarTextBox").value =
    document.getElementById("profile-image").src;
  document.getElementById("edit-input").hidden = false;
  document.getElementById("input").hidden = true;
}

function onSave() {
  document.getElementById("name-text").innerText =
    document.getElementById("nameTextBox").value;

  document.getElementById("email-text").innerText =
    document.getElementById("emailTextBox").value;

  document.getElementById("pass-text").innerText =
    document.getElementById("passTextBox").value;

  document.getElementById("bio-text").innerText =
    document.getElementById("bioTextBox").value;

  document.getElementById("profile-image").src =
    document.getElementById("AvatarTextBox").value;
  document.getElementById("edit-input").hidden = true;
  document.getElementById("input").hidden = false;
}
