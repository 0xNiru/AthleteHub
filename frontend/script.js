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
  document.getElementById("profileName").innerText = document.getElementById("editName").value;
  document.getElementById("profileRole").innerText = document.getElementById("editRole").value;
  
  const preview = document.getElementById("preview").src;
  if (preview) {
      document.getElementById("profileImage").src = preview;
  }

  closeEditProfile();
}

// Dummy Performance Data
    const matchResults = [5, 2, 4, 3, 6, 1, 4]; // Wins per match
    const matches = ["Match 1", "Match 2", "Match 3", "Match 4", "Match 5", "Match 6", "Match 7"];

    // Calculate Win Rate
    const wins = 15, losses = 3, draws = 2;
    const winRate = ((wins / (wins + losses + draws)) * 100).toFixed(2);
    document.getElementById("winRate").innerText = `${winRate}%`;

    // Chart.js Performance Chart
    const ctx = document.getElementById("performanceChart").getContext("2d");
    new Chart(ctx, {
        type: "bar",
        data: {
            labels: matches,
            datasets: [{
                label: "Wins",
                data: matchResults,
                backgroundColor: "rgba(54, 162, 235, 0.6)",
                borderColor: "rgba(54, 162, 235, 1)",
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

async function predictInjury() {
    const symptoms = document.getElementById("symptoms").value;
    if (!symptoms) {
        alert("Please enter your symptoms!");
        return;
    }

    document.getElementById("aiResponse").classList.remove("hidden");
    document.getElementById("predictionText").innerText = "⏳ Analyzing with AI...";

    try {
        // Use your deployed API URL instead of localhost
        const API_URL = "https://athletehub-production.up.railway.app/predict";  // Update this with your actual backend URL
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ symptoms })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || `Server error: ${response.status}`);
        }

        document.getElementById("predictionText").innerText = data.prediction;
    } catch (error) {
        console.error('Detailed error:', error);
        document.getElementById("predictionText").innerText = 
            `❌ Error: ${error.message}. Please check the console for more details.`;
    }
}

document.getElementById('financialPlanForm').addEventListener('submit', async function(e) {
    e.preventDefault();

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
