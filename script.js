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

    recognition.onstart = () => {
        enCoursDeReconnaissance = true;
        toggleBtn.textContent = "Arrêter la Transcription";
    };

    recognition.onresult = (event) => {
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

    recognition.onend = () => {
        enCoursDeReconnaissance = false;
        toggleBtn.textContent = "Démarrer la Transcription";

        // Automatically restart the recognition to maintain continuous transcription
        if (enCoursDeReconnaissance) {
            recognition.start();
        }
    };

    toggleBtn.addEventListener('click', () => {
        if (enCoursDeReconnaissance) {
            recognition.stop();
            enCoursDeReconnaissance = false; // Ensure we stop properly
        } else {
            recognition.start();
            enCoursDeReconnaissance = true;
        }
    });

    clearBtn.addEventListener('click', () => {
        texteFinal = ''; // Clear the final text
        transcriptionBox.textContent = '';
    });

    tailleTexteSlider.addEventListener('input', () => {
        transcriptionBox.style.fontSize = `${tailleTexteSlider.value}px`;
    });
} else {
    alert('La reconnaissance vocale n\'est pas supportée dans ce navigateur. Essayez avec Google Chrome.');
}

// Function to scroll to the end of the transcription box
function scrollToEnd() {
    transcriptionBox.scrollTop = transcriptionBox.scrollHeight;
}
