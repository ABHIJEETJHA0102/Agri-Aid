const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");
const signInForm = document.querySelector('.sign-in-form');
const signUpForm = document.querySelector('.sign-up-form');

sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});

signInForm.addEventListener('submit', login);

// async function login(event) {
//   event.preventDefault(); // Prevent form from submitting normally

//   const username = document.getElementById('username').value;
//   const password = document.getElementById('password').value;
//   const passwordError = document.getElementById('password-error');

//   try {
//       const response = await fetch(`/getByUsername/${username}`);

//       if (response.ok) {
//           const users = await response.json();
//           if (users.length > 0 && users[0].password === password) {
//                   var userData = {
//                       username: username,
//                   };
//                   sessionStorage.setItem('userData', JSON.stringify(userData));
//                   window.open("/home", "_blank");
//                   // Redirect to success page if login is successful
//           } else {
//               passwordError.textContent = "Incorrect username or password"; // Set error message
//               passwordError.style.color = "red"; // Set error message color to red
//           }
//       } else {
//           passwordError.textContent = "An error occurred. Please try again."; // Set error message
//           passwordError.style.color = "red"; // Set error message color to red
//       }
//   } catch (error) {
//       console.error('Error:', error);
//       passwordError.textContent = "An error occurred. Please try again."; // Set error message
//       passwordError.style.color = "red"; // Set error message color to red
//   }
// };

async function login(event) {
  event.preventDefault(); // Prevent form from submitting normally

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    console.log(data);
    if (data.message=="Login successful") {
      // Redirect to success page if login is successful
      window.open("/home2", "_blank");
    } else {
      // Display error message if login fails
      const passwordError = document.getElementById('password-error');
      passwordError.textContent = data.message;
      passwordError.style.color = "red";
    }
  } catch (error) {
    console.error('Error:', error);
    const passwordError = document.getElementById('password-error');
    passwordError.textContent = "An error occurred. Please try again.";
    passwordError.style.color = "red";
  }
};
signUpForm.addEventListener('submit', signUp);

async function signUp(event) {
  event.preventDefault(); // Prevent form from submitting normally

  // Serialize form data into JSON object
  const formData = {
    // name: document.getElementById('name').value,
    username: document.getElementById('username-2').value,
    password: document.getElementById('password-2').value,
    email: document.getElementById('email').value
  };

  // Send form data as JSON via AJAX
  fetch('/signUp/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  })
  .then(response => {
    // Handle response
    console.log('Form submitted successfully');
    alert("Account Created.")
    window.open("/home2", "_blank");
  })
  .catch(error => {
    // Handle error
    console.error('Error submitting form:', error);
  });
};