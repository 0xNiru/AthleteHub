import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDpfdLyJ4rFmEgWCw900gQUWOvI9TEVvYU",
    authDomain: "atheletehub-59ffa.firebaseapp.com",
    projectId: "atheletehub-59ffa",
    storageBucket: "atheletehub-59ffa.firebasestorage.app",
    messagingSenderId: "140956597666",
    appId: "1:140956597666:web:cbdbfff48ef76d78d8c6fb",
    measurementId: "G-BMR5HGZM59"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function checkAuth() {
    const currentPath = window.location.pathname;
    
    // Define public pages that don't require authentication
    const publicPages = ['/loginpage.html', '/signup.html', '/forgot-password.html'];
    
    onAuthStateChanged(auth, (user) => {
        console.log('Current user:', user);
        console.log('Current path:', currentPath);
        
        if (!user && !publicPages.includes(currentPath)) {
            console.log('Redirecting to login page...');
            window.location.href = '/loginpage.html';  
        } else if (user && publicPages.includes(currentPath)) {
            console.log('Redirecting to index...');
            window.location.href = '/index.html';  
        }
    });
}

export { checkAuth };