import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

// Your Firebase configuration
const firebaseConfig = {
    // Add your Firebase config here
    apiKey: "your-api-key",
    authDomain: "your-auth-domain",
    projectId: "your-project-id",
    storageBucket: "your-storage-bucket",
    messagingSenderId: "your-messaging-sender-id",
    appId: "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function checkAuth() {
    // Get the current page path
    const currentPath = window.location.pathname;
    
    // List of public pages that don't require authentication
    const publicPages = ['/loginpage.html', '/signup.html', '/forgot-password.html'];
    
    onAuthStateChanged(auth, (user) => {
        console.log('Current user:', user); // Debug log
        console.log('Current path:', currentPath); // Debug log
        
        if (!user && !publicPages.includes(currentPath)) {
            // User is not logged in and trying to access a protected page
            console.log('Redirecting to login page...'); // Debug log
            window.location.href = '/loginpage.html';
        } else if (user && publicPages.includes(currentPath)) {
            // User is logged in but on a public page (like login)
            console.log('Redirecting to index...'); // Debug log
            window.location.href = '/index.html';
        }
    });
}

export { checkAuth }; 