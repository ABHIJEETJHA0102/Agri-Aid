// auth.js

// Define the authentication middleware function
const isAuthenticated = (req, res, next) => {
    // Check if the user is authenticated (you can implement your own logic here)
    if (req.isAuthenticated()) {
        return next(); // If authenticated, continue to the next middleware
    } else {
        res.redirect('/login'); // If not authenticated, redirect to the login page
    }
};

module.exports = isAuthenticated; // Export the middleware function
