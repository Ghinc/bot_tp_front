// Configuration
const API_URL = 'https://bot-tp-back.vercel.app';

// État de l'application
let sessionId = null;
let messageCount = 0;
let isLoading = false;

// Éléments DOM
const elements = {
    messages: document.getElementById('messages'),
    messageInput: document.getElementById('messageInput'),
    sendBtn: document.getElementById('sendBtn'),
    resetBtn: document.getElementById('resetBtn'),
    promptType: document.getElementById('promptType'),
    status: document.getElementById('status'),
    statusText: document.getElementById('statusText'),
    msgCount: document.getElementById('msgCount'),
    sessionInfo: document.getElementById('sessionInfo')
};

// Initialisation au chargement de la page
window.addEventListener('DOMContentLoaded', init);

async function init() {
    console.log('Initialisation de l\'application...');

    // Vérifier la santé du serveur
    await checkHealth();

    // Créer une session initiale
    await createSession();

    // Attacher les événements
    attachEventListeners();
}

// Vérifier la santé du serveur
async function checkHealth() {
    try {
        const response = await fetch(`${API_URL}/health`);
        const data = await response.json();

        if (data.status === 'ok' && data.openaiConfigured) {
            updateStatus('connected', 'Connecté au serveur');
        } else if (!data.openaiConfigured) {
            updateStatus('error', 'Serveur OK mais OpenAI non configuré');
            showErrorMessage('Le serveur backend n\'a pas de clé API OpenAI configurée. Vérifiez le fichier .env du backend.');
        } else {
            updateStatus('error', 'Erreur de connexion');
        }
    } catch (error) {
        console.error('Erreur de connexion au serveur:', error);
        updateStatus('error', 'Impossible de se connecter au serveur');
        showErrorMessage('Impossible de se connecter au serveur. Vérifiez que le backend est bien démarré sur le port 3000.');
    }
}

// Créer une nouvelle session
async function createSession() {
    try {
        const promptType = elements.promptType.value;

        const response = await fetch(`${API_URL}/api/sessions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                promptType,
                context: {
                    tpSubject: 'Travaux Pratiques',
                    studentLevel: 'tous niveaux'
                }
            })
        });

        const data = await response.json();

        if (data.success) {
            sessionId = data.sessionId;
            messageCount = 0;
            updateSessionInfo();
            console.log('Session créée:', sessionId);
        } else {
            throw new Error(data.error || 'Erreur de création de session');
        }
    } catch (error) {
        console.error('Erreur lors de la création de session:', error);
        showErrorMessage('Erreur lors de la création de la session: ' + error.message);
    }
}

// Attacher les événements
function attachEventListeners() {
    elements.sendBtn.addEventListener('click', sendMessage);

    elements.messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    elements.resetBtn.addEventListener('click', resetConversation);

    elements.promptType.addEventListener('change', resetConversation);
}

// Envoyer un message
async function sendMessage() {
    const message = elements.messageInput.value.trim();

    if (!message || isLoading || !sessionId) {
        return;
    }

    // Désactiver l'interface pendant l'envoi
    setLoading(true);

    // Afficher le message utilisateur
    addMessage('user', message);

    // Vider l'input
    elements.messageInput.value = '';

    // Afficher l'indicateur de saisie
    const loadingId = showTypingIndicator();

    try {
        const response = await fetch(`${API_URL}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sessionId,
                message
            })
        });

        const data = await response.json();

        // Retirer l'indicateur de saisie
        removeTypingIndicator(loadingId);

        if (data.success) {
            // Afficher la réponse du bot
            addMessage('bot', data.response);
            messageCount += 2; // user + bot
            updateSessionInfo();
        } else {
            throw new Error(data.error || 'Erreur lors de l\'envoi du message');
        }
    } catch (error) {
        console.error('Erreur lors de l\'envoi du message:', error);
        removeTypingIndicator(loadingId);
        addMessage('bot', 'Désolé, une erreur s\'est produite. Veuillez réessayer.');
        showErrorMessage('Erreur: ' + error.message);
    } finally {
        setLoading(false);
    }
}

// Fonction pour formater le markdown basique
function formatMarkdown(text) {
    // Remplacer les titres ###
    text = text.replace(/### (.*?)(\n|$)/g, '<h3>$1</h3>');

    // Remplacer les titres ##
    text = text.replace(/## (.*?)(\n|$)/g, '<h2>$1</h2>');

    // Remplacer les listes à puces
    text = text.replace(/^[\s]*[-*] (.*?)$/gm, '<li>$1</li>');

    // Envelopper les listes
    text = text.replace(/(<li>.*?<\/li>)/gs, '<ul>$1</ul>');

    // Remplacer les blocs de code ```
    text = text.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');

    // Remplacer le code inline `
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Remplacer le gras **
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Remplacer l'italique *
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Remplacer les paragraphes (double saut de ligne)
    text = text.replace(/\n\n/g, '</p><p>');

    // Remplacer les simples retours à la ligne
    text = text.replace(/\n/g, '<br>');

    return '<p>' + text + '</p>';
}

// Ajouter un message à l'interface
function addMessage(role, content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role === 'user' ? 'user-message' : 'bot-message'}`;

    // Ajouter l'avatar pour les messages du bot
    if (role === 'bot') {
        const avatar = document.createElement('img');
        avatar.src = 'bisgambia-avatar.png';
        avatar.alt = 'BisgambIA';
        avatar.className = 'bot-avatar';
        messageDiv.appendChild(avatar);
    }

    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';

    const label = document.createElement('strong');
    label.textContent = role === 'user' ? 'Vous:' : '🎅 BisgambIA:';
    messageContent.appendChild(label);

    // Pour les messages du bot, formatter le markdown
    if (role === 'bot') {
        const formattedContent = formatMarkdown(content);
        messageContent.innerHTML += formattedContent;
    } else {
        // Pour les messages utilisateur, garder le texte brut
        const text = document.createElement('p');
        text.textContent = content;
        messageContent.appendChild(text);
    }

    messageDiv.appendChild(messageContent);
    elements.messages.appendChild(messageDiv);

    // Scroll vers le bas
    scrollToBottom();
}

// Afficher l'indicateur de saisie
function showTypingIndicator() {
    const loadingDiv = document.createElement('div');
    const id = 'loading-' + Date.now();
    loadingDiv.id = id;
    loadingDiv.className = 'message loading bot-message';

    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';

    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'typing-indicator';
    typingIndicator.innerHTML = '<span></span><span></span><span></span>';

    messageContent.appendChild(typingIndicator);
    loadingDiv.appendChild(messageContent);

    elements.messages.appendChild(loadingDiv);
    scrollToBottom();

    return id;
}

// Retirer l'indicateur de saisie
function removeTypingIndicator(id) {
    const loadingDiv = document.getElementById(id);
    if (loadingDiv) {
        loadingDiv.remove();
    }
}

// Réinitialiser la conversation
async function resetConversation() {
    if (isLoading) return;

    // Effacer les messages
    elements.messages.innerHTML = '';

    // Créer une nouvelle session
    await createSession();

    // Message de bienvenue
    addMessage('bot', 'Ho ho ho! Joyeux Noël! Je suis BisgambIA, votre assistant de Noël pour les TP. Comment puis-je vous aider aujourd\'hui?');

    console.log('Conversation réinitialisée');
}

// Mettre à jour le statut
function updateStatus(status, text) {
    elements.status.className = `status ${status}`;
    elements.statusText.textContent = text;
}

// Mettre à jour les infos de session
function updateSessionInfo() {
    elements.msgCount.textContent = messageCount;

    if (sessionId) {
        const shortId = sessionId.substring(sessionId.lastIndexOf('_') + 1);
        elements.sessionInfo.textContent = shortId;
    }
}

// Activer/Désactiver le mode chargement
function setLoading(loading) {
    isLoading = loading;
    elements.sendBtn.disabled = loading;
    elements.messageInput.disabled = loading;
    elements.resetBtn.disabled = loading;
    elements.promptType.disabled = loading;
}

// Afficher un message d'erreur
function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'message bot-message';

    const errorContent = document.createElement('div');
    errorContent.className = 'message-content error-message';
    errorContent.textContent = message;

    errorDiv.appendChild(errorContent);
    elements.messages.appendChild(errorDiv);

    scrollToBottom();
}

// Scroll vers le bas
function scrollToBottom() {
    elements.messages.scrollTop = elements.messages.scrollHeight;
}
