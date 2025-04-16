let user = { name: "", bloodGroup: "", contact: "", place: "", email: "", emergencyContact: "" };
let location = { lat: 0, lng: 0 };
let isHindi = false;
let detectionActive = false;
let detectionInterval;

// Language Toggle
function toggleLanguage() {
    isHindi = !isHindi;
    document.querySelector('.header span').textContent = isHindi ? "सुरक्षित अलर्ट" : "SafeAlert";
    document.querySelector('.tagline').textContent = isHindi ? "अपकी सुरक्षा हमारा ईमान! 🇮🇳" : "Apki Suraksha Hamara Imaan! 🇮🇳";
    document.querySelectorAll('.button')[0].textContent = isHindi ? "👤 यूजर प्रोफाइल" : "👤 User Profile";
    document.querySelectorAll('.button')[1].textContent = isHindi ? "🚨 आपातकालीन संपर्क सेट करें" : "🚨 Set Emergency Contact";
    document.getElementById('startDetectionBtn').textContent = isHindi ? "⚠️ दुर्घटना का पता लगाना शुरू करें" : "⚠️ Start Detection";
    document.getElementById('stopDetectionBtn').textContent = isHindi ? "⚠️ पता लगाना बंद करें" : "⚠️ Stop Detection";
    document.querySelectorAll('.button')[3].textContent = isHindi ? "📍 लाइव लोकेशन" : "📍 Live Location";
    document.querySelectorAll('.button')[4].textContent = isHindi ? "💬 SMS अलर्ट" : "💬 SMS Alert";
    document.querySelector('.profile-form h3').textContent = isHindi ? "प्रोफाइल विवरण" : "Profile Details";
    document.getElementById('userName').placeholder = isHindi ? "नाम" : "Name";
    document.getElementById('bloodGroup').placeholder = isHindi ? "रक्त समूह (वैकल्पिक)" : "Blood Group (Optional)";
    document.getElementById('userContact').placeholder = isHindi ? "संपर्क नंबर" : "Contact Number";
    document.getElementById('userPlace').placeholder = isHindi ? "स्थान" : "Place";
    document.getElementById('userEmail').placeholder = isHindi ? "ईमेल" : "Email";
    document.querySelectorAll('.profile-form button')[0].textContent = isHindi ? "सहेजें" : "Save";
    document.querySelectorAll('.profile-form button')[1].textContent = isHindi ? "बंद करें" : "Close";
    document.querySelectorAll('.footer p')[0].textContent = isHindi ? "<strong>गोपनीयता नीति:</strong> आपका डेटा सुरक्षित है और केवल आपातकालीन उद्देश्यों के लिए उपयोग किया जाता है।" : "<strong>Privacy Policy:</strong> Your data is secure and used only for emergency purposes.";
    document.querySelectorAll('.footer p')[1].textContent = isHindi ? "<strong>अस्वीकरण:</strong> यह ऐप केवल सूचनात्मक उपयोग के लिए है। पेशेवर सहायता का विकल्प नहीं है।" : "<strong>Disclaimer:</strong> This app is for informational use only. Not a substitute for professional help.";
    document.querySelectorAll('.footer p')[2].textContent = isHindi ? "<strong>हमारे बारे में:</strong> सुरक्षित अलर्ट आपकी सुरक्षा सुनिश्चित करने के लिए प्यार और देखभाल के साथ विकसित किया गया है।" : "<strong>About Us:</strong> SafeAlert is developed to ensure your safety with love and care.";
}

// Profile Functions
function toggleProfileForm() {
    document.getElementById("profileForm").classList.toggle("active");
}

function closeProfileForm() {
    document.getElementById("profileForm").classList.remove("active");
}

function saveProfile() {
    user.name = document.getElementById("userName").value || "";
    user.bloodGroup = document.getElementById("bloodGroup").value || "";
    user.contact = document.getElementById("userContact").value || "";
    user.place = document.getElementById("userPlace").value || "";
    user.email = document.getElementById("userEmail").value || "";
    document.getElementById("status").textContent = isHindi ? "प्रोफाइल सहेजी गई!" : "Profile Saved!";
    setTimeout(() => document.getElementById("status").textContent = "", 3000);
    closeProfileForm();
}

function setEmergencyContact() {
    let newContact = prompt(isHindi ? "आपातकालीन संपर्क नंबर दर्ज करें" : "Enter Emergency Contact:", user.emergencyContact);
    if (newContact) user.emergencyContact = newContact;
    document.getElementById("status").textContent = isHindi ? "आपातकालीन संपर्क सेट हुआ!" : "Emergency Contact Set!";
    setTimeout(() => document.getElementById("status").textContent = "", 3000);
}

// Detection Functions
function toggleDetection() {
    if (!detectionActive) {
        detectionActive = true;
        document.getElementById("startDetectionBtn").style.display = "none";
        document.getElementById("stopDetectionBtn").style.display = "block";
        startDetection();
        document.getElementById("status").textContent = isHindi ? "पता लगाना शुरू हुआ!" : "Detection Started!";
    }
}

function stopDetection() {
    detectionActive = false;
    clearInterval(detectionInterval);
    if (window.DeviceMotionEvent) {
        window.removeEventListener("devicemotion", handleMotion);
    }
    document.getElementById("stopDetectionBtn").style.display = "none";
    document.getElementById("startDetectionBtn").style.display = "block";
    document.getElementById("status").textContent = isHindi ? "पता लगाना बंद हुआ!" : "Detection Stopped!";
    setTimeout(() => document.getElementById("status").textContent = "", 3000);
}

function startDetection() {
    if (window.DeviceMotionEvent) {
        window.addEventListener("devicemotion", handleMotion, true);
    } else {
        document.getElementById("status").textContent = isHindi ? "डिवाइस मॉशन सपोर्ट नहीं!" : "Device Motion Not Supported!";
    }
    detectionInterval = setInterval(updateLocation, 5000); // Update location every 5 seconds
}

function handleMotion(event) {
    let acceleration = event.accelerationIncludingGravity;
    let jerk = Math.sqrt((acceleration.x ** 2) + (acceleration.y ** 2) + (acceleration.z ** 2));
    if (jerk > 20 && detectionActive && user.emergencyContact) {
        let message = isHindi ? `दुर्घटना! यूजर: ${user.name}, लोकेशन: लैट ${location.lat.toFixed(4)}, लॉंग ${location.lng.toFixed(4)}, संपर्क: ${user.emergencyContact}` : `Crash! User: ${user.name}, Location: Lat ${location.lat.toFixed(4)}, Long ${location.lng.toFixed(4)}, Contact: ${user.emergencyContact}`;
        document.getElementById("status").textContent = isHindi ? "दुर्घटना का पता चला!" : "Crash Detected!";
        sendSMSAlert(message);
        setTimeout(() => document.getElementById("status").textContent = "", 5000);
    }
}

function updateLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                location.lat = position.coords.latitude;
                location.lng = position.coords.longitude;
            },
            (error) => {
                document.getElementById("status").textContent = isHindi ? "लोकेशन एक्सेस नहीं!" : "Location Access Denied!";
                setTimeout(() => document.getElementById("status").textContent = "", 3000);
            }
        );
    } else {
        location = { lat: 28.7041 + (Math.random() - 0.5) * 0.1, lng: 77.1025 + (Math.random() - 0.5) * 0.1 };
    }
}

function showLocation() {
    updateLocation();
    document.getElementById("status").textContent = isHindi ? `लाइव लोकेशन: लैट ${location.lat.toFixed(4)}, लॉंग ${location.lng.toFixed(4)}` : `Live Location: Lat ${location.lat.toFixed(4)}, Long ${location.lng.toFixed(4)}`;
    setTimeout(() => document.getElementById("status").textContent = "", 5000);
}

function sendSMSAlert(message) {
    console.log("SMS Alert (Placeholder):", message);
    // For real SMS, use Twilio API with a backend server
    document.getElementById("status").textContent = isHindi ? "SMS अलर्ट भेजा गया!" : "SMS Alert Sent!";
    setTimeout(() => document.getElementById("status").textContent = "", 5000);
}
