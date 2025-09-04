// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');
const voiceButton = document.getElementById('voiceButton');
const ttsButton = document.getElementById('ttsButton');
const languageSelect = document.getElementById('languageSelect');
const uploadFeature = document.getElementById('uploadFeature');
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const canvasBg = document.getElementById('interactiveBg');

// Variables for speech synthesis
let speechSynthesis = window.speechSynthesis;
let lastBotResponse = "";

// Theme Toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    document.body.classList.toggle('dark-mode');
    
    if (document.body.classList.contains('dark-mode')) {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
    } else {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
    }
});

// Interactive Background
const ctx = canvasBg.getContext('2d');
canvasBg.width = window.innerWidth;
canvasBg.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvasBg.width = window.innerWidth;
    canvasBg.height = window.innerHeight;
});

// Particles for background
const particles = [];
const particleCount = 100;

for (let i = 0; i < particleCount; i++) {
    particles.push({
        x: Math.random() * canvasBg.width,
        y: Math.random() * canvasBg.height,
        radius: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        color: `rgba(${Math.random() * 100 + 100}, ${Math.random() * 100 + 50}, ${Math.random() * 255}, ${Math.random() * 0.3 + 0.1})`
    });
}

function drawParticles() {
    ctx.clearRect(0, 0, canvasBg.width, canvasBg.height);
    
    for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        
        p.x += p.speedX;
        p.y += p.speedY;
        
        if (p.x < 0 || p.x > canvasBg.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvasBg.height) p.speedY *= -1;
        
        // Draw connections between particles
        for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dist = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);
            
            if (dist < 100) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(142, 45, 226, ${0.2 - dist/500})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        }
    }
    
    requestAnimationFrame(drawParticles);
}

drawParticles();

// Chat functionality
function addMessage(message, isUser, fileData = null) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');
    
    if (fileData) {
        messageDiv.innerHTML = `
            <div>${message}</div>
            <div class="file-message">
                <strong>Uploaded file:</strong> ${fileData.name}
                ${fileData.type.includes('image') ? 
                    `<img src="${fileData.url}" class="file-preview" alt="Uploaded image">` : 
                    `<div><i class="fas fa-file" style="font-size: 2rem;"></i> ${fileData.type}</div>`
                }
            </div>
        `;
    } else {
        messageDiv.textContent = message;
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Store the last bot response for text-to-speech
    if (!isUser) {
        lastBotResponse = message;
    }
}

// Simulate API call to Gemini AI
function getBotResponse(userMessage, fileData = null) {
    // This is a simulation - in a real implementation, you would use the Gemini API
    const responses = [
        "That's an interesting question about technology. Based on my knowledge, I would suggest looking into the fundamental principles first.",
        "I understand your question about that concept. It's important to consider both the theoretical and practical aspects in advanced technology.",
        "For that topic, I recommend studying the relationship between theory and application. Would you like me to explain specific areas in more detail?",
        "That's a great question! In Engineering Technology, we often approach this by considering real-world constraints and optimization techniques.",
        "In Science for Technology, we examine how scientific principles form the foundation for technological innovations. Would you like examples?",
        "For ICT, that concept is fundamental. It's used in various applications from data management to network security."
    ];
    
    // If a file was uploaded, add specific file-related response
    let fileResponse = "";
    if (fileData) {
        fileResponse = ` I've analyzed your ${fileData.type} file and found it relevant to your question. `;
    }
    
    // Add signature to all responses
    return fileResponse + responses[Math.floor(Math.random() * responses.length)] + 
           "\n\n— For more explanations, contact Rusith Banuka at 077-340 2519 or check the Rusith Banuka YouTube channel.";
}

sendButton.addEventListener('click', () => {
    const message = userInput.value.trim();
    if (message) {
        addMessage(message, true);
        userInput.value = '';
        
        // Check if there are any files to process
        const files = fileInput.files;
        let fileData = null;
        
        if (files.length > 0) {
            fileData = {
                name: files[0].name,
                type: files[0].type,
                url: URL.createObjectURL(files[0])
            };
        }
        
        // Simulate thinking delay
        setTimeout(() => {
            const response = getBotResponse(message, fileData);
            addMessage(response, false);
            
            // Clear the file input after processing
            fileInput.value = '';
        }, 1000);
    }
});

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendButton.click();
    }
});

// Voice recognition
let recognition = null;
if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        userInput.value = transcript;
    };
    
    recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
    };
}

voiceButton.addEventListener('click', () => {
    if (recognition) {
        recognition.start();
    } else {
        alert("Speech recognition not supported in this browser. Try Chrome or Edge.");
    }
});

// Text-to-speech functionality
ttsButton.addEventListener('click', () => {
    if (lastBotResponse) {
        // Stop any ongoing speech
        speechSynthesis.cancel();
        
        // Create speech request
        const utterance = new SpeechSynthesisUtterance(lastBotResponse);
        
        // Set language based on selection
        const lang = languageSelect.value;
        utterance.lang = lang === 'si' ? 'si-LK' : (lang === 'ta' ? 'ta-IN' : 'en-US');
        
        // Speak the text
        speechSynthesis.speak(utterance);
    } else {
        alert("No response available to read aloud.");
    }
});

// File upload functionality
uploadArea.addEventListener('click', () => {
    fileInput.click();
});

// Drag and drop for files
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.backgroundColor = 'rgba(142, 45, 226, 0.2)';
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.backgroundColor = '';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.backgroundColor = '';
    
    if (e.dataTransfer.files.length) {
        fileInput.files = e.dataTransfer.files;
        
        // Notify user of successful upload
        const file = e.dataTransfer.files[0];
        addMessage(`I've uploaded a file: ${file.name}`, true, {
            name: file.name,
            type: file.type,
            url: URL.createObjectURL(file)
        });
    }
});

fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        addMessage(`I've uploaded a file: ${file.name}`, true, {
            name: file.name,
            type: file.type,
            url: URL.createObjectURL(file)
        });
    }
});

// Language change
languageSelect.addEventListener('change', () => {
    const lang = languageSelect.value;
    let message = "";
    
    switch(lang) {
        case 'si':
            message = "භාෂාව සිංහලට වෙනස් කරන ලදී. මට ඉංජිනේරු තාක්ෂණය, තාක්ෂණය සඳහා විද්‍යාව සහ තොරතුරු හා සන්නිවේදන තාක්ෂණය පිළිබඳව ඔබට සහාය විය හැක.";
            break;
        case 'ta':
            message = "மொழி தமிழாக மாற்றப்பட்டது. பொறியியல் தொழில்நுட்பம், தொழில்நுட்பத்திற்கான அறிவியல் மற்றும் தகவல் மற்றும் தொடர்பு தொழில்நுட்பம் குறித்து உங்களுக்கு உதவிகரமாக இருக்கும்.";
            break;
        default:
            message = "Language changed to English. I can assist you with Engineering Technology, Science for Technology, and Information and Communication Technology.";
    }
    
    addMessage(message, false);
});