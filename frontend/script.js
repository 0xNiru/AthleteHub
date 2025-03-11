tailwind.config = {
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    200: '#bae6fd',
                    300: '#7dd3fc',
                    400: '#38bdf8',
                    500: '#0ea5e9',
                    600: '#0284c7',
                    700: '#0369a1',
                    800: '#075985',
                    900: '#0c4a6e',
                },
                secondary: {
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b',
                    900: '#0f172a',
                },
                accent: {
                    50: '#fffbeb',
                    100: '#fef3c7',
                    200: '#fde68a',
                    300: '#fcd34d',
                    400: '#fbbf24',
                    500: '#f59e0b',
                    600: '#d97706',
                    700: '#b45309',
                    800: '#92400e',
                    900: '#78350f',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            spacing: {
                '128': '32rem',
            }
        }
    }
}

// for Menu Toggle

    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    menuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });


    /
        import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
        import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
        import { checkAuth } from './auth.js';

        // Firebase configuration
        const firebaseConfig = {
            apiKey: "AIzaSyDpfdLyJ4rFmEgWCw900gQUWOvI9TEVvYU",
            authDomain: "atheletehub-59ffa.firebaseapp.com",
            projectId: "atheletehub-59ffa",
            storageBucket: "atheletehub-59ffa.firebasestorage.app",
            messagingSenderId: "140956597666",
            appId: "1:140956597666:web:cbdbfff48ef76d78d8c6fb",
            measurementId: "G-BMR5HGZM59"
        };

        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);

        // Check authentication when page loads
        checkAuth();

        // Handle logout
        document.getElementById('logoutBtn').addEventListener('click', () => {
            signOut(auth).then(() => {
                window.location.href = '/loginpage.html';
            }).catch((error) => {
                console.error('Logout error:', error);
            });
        });

        // Load athlete data
        window.addEventListener('DOMContentLoaded', () => {
            loadAthleteData();
        });

        // Make loadAthleteData available globally
        window.loadAthleteData = loadAthleteData;
    
        // Functions for profile editing
        function openEditProfile() {
            document.getElementById("editProfileModal").classList.remove("hidden");
            document.getElementById("editName").value = document.getElementById("profileName").innerText;
            document.getElementById("editRole").value = document.getElementById("profileRole").innerText;
        }

        function closeEditProfile() {
            document.getElementById("editProfileModal").classList.add("hidden");
        }

        function previewImage(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById("preview").src = e.target.result;
                    document.getElementById("preview").classList.remove("hidden");
                };
                reader.readAsDataURL(file);
            }
        }

        function saveProfile() {
            const name = document.getElementById("editName").value;
            const role = document.getElementById("editRole").value;
            
            document.getElementById("profileName").innerText = name;
            document.getElementById("profileRole").innerText = role;
            
            const preview = document.getElementById("preview").src;
            if (preview && !preview.includes('undefined')) {
                document.getElementById("profileImage").src = preview;
                localStorage.setItem('athleteProfileImage', preview);
            }

            // Save to localStorage
            localStorage.setItem('athleteName', name);
            localStorage.setItem('athleteRole', role);

            closeEditProfile();
        }

        // Event slider functions
        let currentIndex = 0;

        function updateSlide() {
            document.getElementById("eventSlider").style.transform = `translateX(-${currentIndex * 100}%)`;
        }

        function nextSlide() {
            const totalSlides = document.querySelectorAll(".event-slide").length;
            if (currentIndex < totalSlides - 1) {
                currentIndex++;
            } else {
                currentIndex = 0; // Loop back to first slide
            }
            updateSlide();
        }

        function prevSlide() {
            const totalSlides = document.querySelectorAll(".event-slide").length;
            if (currentIndex > 0) {
                currentIndex--;
            } else {
                currentIndex = totalSlides - 1; // Loop back to last slide
            }
            updateSlide();
        }

        function registerEvent(eventName) {
            alert(`✅ Registered for ${eventName}!`);
        }

        // Injury prediction function
       /* async function predictInjury() {
            const symptoms = document.getElementById("symptoms").value;
            if (!symptoms) {
                alert("Please enter your symptoms!");
                return;
            }
    
            document.getElementById("aiResponse").classList.remove("hidden");
            document.getElementById("predictionText").innerText = "⏳ Analyzing with AI...";
    
            try {
                console.log("Sending request with symptoms:", symptoms);
                const response = await fetch("https://athletehub-production.up.railway.app/predict", {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({ symptoms })
                });
    
                console.log("Response status:", response.status);
                const responseText = await response.text();
                console.log("Raw response:", responseText);
    
                let data;
                try {
                    data = JSON.parse(responseText);
                } catch (e) {
                    console.error("Failed to parse JSON:", e);
                    throw new Error("Invalid JSON response from server");
                }
    
                if (!response.ok) {
                    throw new Error(`Server error: ${data.error || response.status}`);
                }
    
                document.getElementById("predictionText").innerText = data.prediction;
            } catch (error) {
                console.error('Detailed error:', error);
                document.getElementById("predictionText").innerText = 
                    `❌ Error: ${error.message || "Could not connect to the AI service. Please try again later."}`;
            }
        }

        // Financial plan form handler
        document.addEventListener('DOMContentLoaded', function() {
            const form = document.getElementById('financialPlanForm');
            
            form.addEventListener('submit', async function(e) {
                e.preventDefault();  // Prevent form submission

                const formData = {
                    sport: document.getElementById('sport').value,
                    level: document.getElementById('level').value,
                    monthly_budget: document.getElementById('monthly_budget').value,
                    goals: document.getElementById('goals').value
                };

                // Validate form data
                if (!formData.sport || !formData.level || !formData.monthly_budget || !formData.goals) {
                    alert('Please fill in all fields');
                    return;
                }

                document.getElementById('financialPlanResponse').classList.remove('hidden');
                document.getElementById('planText').innerHTML = "Generating your financial plan...";

                try {
                    console.log('Sending request with data:', formData);
                    const response = await fetch('https://athletehub-production.up.railway.app/financial-plan', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify(formData)
                    });

                    console.log('Response status:', response.status);
                    const responseText = await response.text();
                    console.log('Raw response:', responseText);

                    let data;
                    try {
                        data = JSON.parse(responseText);
                    } catch (e) {
                        console.error('Failed to parse JSON:', e);
                        throw new Error('Invalid response from server');
                    }

                    if (!response.ok) {
                        throw new Error(data.error || 'Failed to generate financial plan');
                    }

                    document.getElementById('planText').innerHTML = data.financial_plan;
                } catch (error) {
                    console.error('Error details:', error);
                    document.getElementById('planText').innerHTML = 
                        `Error generating financial plan: ${error.message}. Please try again.`;
                }
            });
        }); */ 

        // Injury prediction function
async function predictInjury() {
    const symptoms = document.getElementById("symptoms").value;
    if (!symptoms) {
        alert("Please enter your symptoms!");
        return;
    }

    document.getElementById("aiResponse").classList.remove("hidden");
    document.getElementById("predictionText").innerText = "⏳ Analyzing with AI...";

    try {
        const response = await fetch("https://athletehub-production.up.railway.app/predict", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ symptoms })
        });

        const responseText = await response.text();
        let data = JSON.parse(responseText);

        if (!response.ok) {
            throw new Error(`Server error: ${data.error || response.status}`);
        }

        // ✅ Use `marked.parse()` for better Markdown formatting
        document.getElementById("predictionText").innerHTML = marked.parse(data.prediction);
    } catch (error) {
        document.getElementById("predictionText").innerText = `❌ Error: ${error.message}`;
    }
}

// Financial plan handler
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('financialPlanForm');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault(); 

        const formData = {
            sport: document.getElementById('sport').value,
            level: document.getElementById('level').value,
            monthly_budget: document.getElementById('monthly_budget').value,
            goals: document.getElementById('goals').value
        };

        if (!formData.sport || !formData.level || !formData.monthly_budget || !formData.goals) {
            alert('Please fill in all fields');
            return;
        }

        document.getElementById('financialPlanResponse').classList.remove('hidden');
        document.getElementById('planText').innerText = "Generating your financial plan...";

        try {
            const response = await fetch('https://athletehub-production.up.railway.app/financial-plan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const responseText = await response.text();
            let data = JSON.parse(responseText);

            if (!response.ok) {
                throw new Error(data.error || 'Failed to generate financial plan');
            }

            // ✅ Use `marked.parse()` here as well
            document.getElementById('planText').innerHTML = marked.parse(data.financial_plan);
        } catch (error) {
            document.getElementById('planText').innerText = `Error: ${error.message}`;
        }
    });
});

        // Function to load athlete data
        function loadAthleteData() {
            // Try to get athlete name from localStorage
            let firstName = localStorage.getItem('athleteFirstName');
            let lastName = localStorage.getItem('athleteLastName');
            let fullName = '';
            
            if (firstName && lastName) {
                fullName = `${firstName} ${lastName}`;
            } else {
                // Fallback to athleteName if first/last name not available
                fullName = localStorage.getItem('athleteName');
                
                // If still no name, use a default
                if (!fullName) {
                    fullName = "Athlete";
                    // Generate random first and last name for demo
                    const randomNames = [
                        "John Smith", "Jane Doe", "Alex Johnson", 
                        "Maria Garcia", "Wei Chen", "Aisha Patel"
                    ];
                    fullName = randomNames[Math.floor(Math.random() * randomNames.length)];
                }
            }
            
            // Set profile name
            document.getElementById('profileName').innerText = fullName;
            
            // Get role or set default
            const role = localStorage.getItem('athleteRole') || "Professional Athlete";
            document.getElementById('profileRole').innerText = role;
            
            // Get profile image or keep default
            const profileImage = localStorage.getItem('athleteProfileImage');
            if (profileImage) {
                document.getElementById('profileImage').src = profileImage;
            }
            
            // Generate a unique athlete ID based on name
            const athleteId = `ATH${fullName.replace(/\s+/g, '').substring(0, 4).toUpperCase()}${Math.floor(Math.random() * 10000)}`;
            document.getElementById('athleteId').innerText = `ID: ${athleteId}`;
            
            // Generate random performance data based on athlete name
            // This ensures the same athlete always gets the same stats
            const nameSeed = fullName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            const rng = seedRandom(nameSeed);
            
            // Set wins, losses, draws
            const wins = Math.floor(rng() * 20) + 5; // At least 5 wins
            const losses = Math.floor(rng() * 10) + 1; // At least 1 loss
            const draws = Math.floor(rng() * 5); // 0-4 draws
            
            document.getElementById('wins').innerText = wins;
            document.getElementById('losses').innerText = losses;
            document.getElementById('draws').innerText = draws;
            
            // Calculate win rate
            const totalMatches = wins + losses + draws;
            const winRate = ((wins / totalMatches) * 100).toFixed(1);
            document.getElementById('winRate').innerText = `${winRate}%`;
            
            // Generate match results for chart
            const matchResults = [];
            const matches = [];
            for (let i = 1; i <= 7; i++) {
                matchResults.push(Math.floor(rng() * 6) + 1); // 1-6 points per match
                matches.push(`Match ${i}`);
            }
            
            // Generate fitness data
            const steps = Math.floor(rng() * 5000) + 8000; // 8000-13000 steps
            const heartRate = Math.floor(rng() * 20) + 65; // 65-85 bpm
            const calories = Math.floor(rng() * 300) + 400; // 400-700 calories
            
            document.getElementById('steps').innerText = steps.toLocaleString();
            document.getElementById('heartRate').innerText = `${heartRate} bpm`;
            document.getElementById('calories').innerText = `${calories} kcal`;
            
            // Initialize charts
            initializeCharts(matches, matchResults);
        }
        
        // Seeded random number generator for consistent results
        function seedRandom(seed) {
            return function() {
                seed = (seed * 9301 + 49297) % 233280;
                return seed / 233280;
            };
        }
        
        // Initialize charts
        function initializeCharts(matches, matchResults) {
            // Performance Chart
            const performanceCtx = document.getElementById("performanceChart").getContext("2d");
            new Chart(performanceCtx, {
                type: "bar",
                data: {
                    labels: matches,
                    datasets: [{
                        label: "Points Scored",
                        data: matchResults,
                        backgroundColor: "rgba(14, 165, 233, 0.6)",
                        borderColor: "rgba(14, 165, 233, 1)",
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: { beginAtZero: true }
                    }
                }
            });

            // Fitness Chart
            const fitnessCtx = document.getElementById("fitnessChart").getContext("2d");
            const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
            
            // Generate random step data based on athlete name
            const stepData = [];
            for (let i = 0; i < 7; i++) {
                stepData.push(Math.floor(Math.random() * 5000) + 8000);
            }

            new Chart(fitnessCtx, {
                type: "line",
                data: {
                    labels: days,
                    datasets: [{
                        label: "Steps Taken",
                        data: stepData,
                        backgroundColor: "rgba(14, 165, 233, 0.2)",
                        borderColor: "rgba(14, 165, 233, 1)",
                        borderWidth: 2,
                        tension: 0.3
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: { beginAtZero: true }
                    }
                }
            });
        }
    
