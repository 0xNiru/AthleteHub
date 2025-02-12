import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

function checkAuth() {
    const auth = getAuth();
    // Get the current page path
    const currentPath = window.location.pathname;
    
    // List of public pages that don't require authentication
    const publicPages = ['/loginpage.html', '/signup.html', '/forgot-password.html'];
    
    onAuthStateChanged(auth, (user) => {
        if (!user && !publicPages.includes(currentPath)) {
            // User is not logged in and trying to access a protected page
            window.location.href = '/loginpage.html';
        } else if (user && publicPages.includes(currentPath)) {
            // User is logged in but on a public page (like login)
            window.location.href = '/index.html';
        }
    });
}

export { checkAuth }; 