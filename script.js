const toggleBtn = document.getElementById('toggleBtn');
const clearBtn = document.getElementById('clearBtn');
const transcriptionBox = document.getElementById('transcription');
const tailleTexteSlider = document.getElementById('tailleTexte');

let recognition;
let enCoursDeReconnaissance = false; // Track if recognition is active
let texteFinal = ''; // Store the final results
let pauseTimeout;  // Timeout to track pauses
const PAUSE_DURATION = 2000; // 2 seconds

// Vérification de la compatibilité du navigateur avec SpeechRecognition API
if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.lang = 'fr-FR';  // Langue : Français
    recognition.interimResults = true;
    recognition.continuous = true; // Continuous recognition
    
    recognition.onstart = function () {
        enCoursDeReconnaissance = true;
        toggleBtn.textContent = "Arrêter la Transcription";
        console.log("Recognition started");
    };

    recognition.onresult = function (event) {
        let texteIntermediaire = ''; // Temporary holder for interim results
        clearTimeout(pauseTimeout); // Reset the pause timer on new speech input

        for (let i = event.resultIndex; i < event.results.length; ++i) {
            const result = event.results[i];
            if (result.isFinal) {
                texteFinal += result[0].transcript;
            } else {
                texteIntermediaire += result[0].transcript;
            }
        }

        transcriptionBox.textContent = texteFinal + ' ' + texteIntermediaire;
        scrollToEnd(); // Ensure the latest text is visible by scrolling

        // Set a timeout to add a period after 2 seconds of silence
        pauseTimeout = setTimeout(() => {
            if (!texteFinal.endsWith('.')) {
                texteFinal += '.';
                transcriptionBox.textContent = texteFinal;  // Update the display with the period
            }
        }, PAUSE_DURATION);
    };

    recognition.onend = function () {
        console.log("Recognition ended");
        enCoursDeReconnaissance = false;
        toggleBtn.textContent = "Démarrer la Transcription";
    };

    recognition.onerror = function (event) {
        console.error("Recognition error:", event.error);
        if (event.error === 'not-allowed') {
            alert('Microphone access is not allowed. Please enable microphone permissions.');
        }
    };

    // Start/Stop transcription based on user interaction
    toggleBtn.addEventListener('click', function () {
        if (!enCoursDeReconnaissance) {
            recognition.start(); // Start on user action
            enCoursDeReconnaissance = true;
            console.log("Starting recognition...");
        } else {
            recognition.stop(); // Stop recognition when user clicks the button
            enCoursDeReconnaissance = false;
            console.log("Recognition stopped by user");
        }
    });

    // Clear the transcription text
    clearBtn.addEventListener('click', function () {
        texteFinal = ''; // Clear the final text
        transcriptionBox.textContent = '';
    });

    // Change text size
    tailleTexteSlider.addEventListener('input', function () {
        transcriptionBox.style.fontSize = `${tailleTexteSlider.value}px`;
    });
} else {
    alert('La reconnaissance vocale n\'est pas supportée dans ce navigateur. Essayez avec Google Chrome.');
}

// Function to scroll to the end of the transcription box
function scrollToEnd() {
    transcriptionBox.scrollTop = transcriptionBox.scrollHeight;
}
