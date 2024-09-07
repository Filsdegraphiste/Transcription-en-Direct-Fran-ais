const toggleBtn = document.getElementById('toggleBtn');
const clearBtn = document.getElementById('clearBtn');
const transcriptionBox = document.getElementById('transcription');
const tailleTexteSlider = document.getElementById('tailleTexte');

let recognition;
let enCoursDeReconnaissance = false;
let texteFinal = ''; // To store the final results

// Vérification de la compatibilité du navigateur avec SpeechRecognition API
if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.lang = 'fr-FR';  // Langue : Français
    recognition.interimResults = true;
    recognition.continuous = true; // Continuous recognition

    // When recognition starts
    recognition.onstart = function() {
        enCoursDeReconnaissance = true;
        toggleBtn.textContent = "Arrêter la Transcription";
    };

    // Handle speech results
    recognition.onresult = function(event) {
        let texteIntermediaire = ''; // Temporary holder for interim results
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            const result = event.results[i];
            // If it's a final result, add it to the final transcription
            if (result.isFinal) {
                texteFinal += result[0].transcript;
            } else {
                texteIntermediaire += result[0].transcript;
            }
        }
        // Update the transcription box with both final and interim texts
        transcriptionBox.textContent = texteFinal + ' ' + texteIntermediaire;
        scrollToEnd(); // Ensure the latest text is visible
    };

    // When recognition ends
    recognition.onend = function() {
        if (enCoursDeReconnaissance) {
            console.log("Recognition ended, restarting...");
            recognition.start(); // Restart if it's still supposed to be active
        } else {
            toggleBtn.textContent = "Démarrer la Transcription";
        }
    };

    // Start/Stop transcription based on user interaction
    toggleBtn.addEventListener('click', function() {
        if (enCoursDeReconnaissance) {
            recognition.stop(); // Explicitly stop
            enCoursDeReconnaissance = false;
        } else {
            recognition.start(); // Start on user action
            enCoursDeReconnaissance = true;
        }
    });

    // Clear the transcription text
    clearBtn.addEventListener('click', function() {
        texteFinal = ''; // Clear the final text
        transcriptionBox.textContent = '';
    });

    // Change text size
    tailleTexteSlider.addEventListener('input', function() {
        transcriptionBox.style.fontSize = `${tailleTexteSlider.value}px`;
    });
} else {
    alert('La reconnaissance vocale n\'est pas supportée dans ce navigateur. Essayez avec Google Chrome.');
}

// Function to scroll to the end of the transcription box
function scrollToEnd() {
    transcriptionBox.scrollTop = transcriptionBox.scrollHeight;
}
