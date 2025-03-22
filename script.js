const apiKey = "2fed1a18bcd14d12db0ae1be5f77811a807ea231";  

async function fetchAQI() {
    
    let city = document.getElementById("cityInput").value.trim();

    if (city === "") {
        alert("Please enter a city name!");
        return;
    }

    let url = `https://api.waqi.info/feed/${city}/?token=${apiKey}`;
    
    try {
        let response = await fetch(url);
        let data = await response.json();
        
        if (data.status === "ok") {
            updateAQI(data.data.aqi, data.data.city.name);
        } else {
            document.getElementById("aqiValue").innerText = "City not found. Try again!";
        }
    }
    catch (error) {
        console.error("Error fetching AQI:", error);
    }
}

async function getLocationAQI() {
    const aqiElement = document.getElementById("aqiValue");

    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const url = `https://api.waqi.info/feed/geo:${lat};${lon}/?token=${apiKey}`;

            try {
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`API request failed: ${response.status}`);
                }

                const data = await response.json();

                if (data.status === "ok") {
                    updateAQI(data.data.aqi, data.data.city.name);
                } else {
                    aqiElement.innerText = "Location AQI not found!";
                }
            } catch (error) {
                console.error("Error fetching location AQI:", error);
                aqiElement.innerText = "Failed to fetch AQI data.";
            }
        },
        (error) => {
            console.error("Geolocation error:", error);
            alert("Unable to get your location. Please enable location services.");
            aqiElement.innerText = "";
        }
    );
}


document.addEventListener("DOMContentLoaded", () => {
    const darkModeToggle = document.getElementById("darkModeToggle");
    const body = document.body;

    if (localStorage.getItem("darkMode") === "enabled") {
        body.classList.add("dark-mode");
        darkModeToggle.innerText = "☀️"; 
    } else {
        darkModeToggle.innerText = "🌙"; 
    }

    darkModeToggle.addEventListener("click", () => {
        body.classList.toggle("dark-mode");

        if (body.classList.contains("dark-mode")) {
            localStorage.setItem("darkMode", "enabled");
            darkModeToggle.innerText = "☀️"; 
        } else {
            localStorage.setItem("darkMode", "disabled");
            darkModeToggle.innerText = "🌙"; 
        }
    });
});



function updateAQI(aqi, city) {

    let aqiBox = document.getElementById("aqiBox");
    let aqiValue = document.getElementById("aqiValue");

    aqiValue.innerText = `AQI for ${city}: ${aqi}`;
    
    if (aqi <= 50) {
        aqiBox.className = "aqi-box good";
    } else if (aqi <= 100) {
        aqiBox.className = "aqi-box moderate";
    } else if (aqi <= 200) {
        aqiBox.className = "aqi-box unhealthy";
    } else if (aqi <= 300) {
        aqiBox.className = "aqi-box very-unhealthy";
    } else {
        aqiBox.className = "aqi-box hazardous";
    }
}

document.getElementById("cityInput").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        fetchAQI();
    }
});
