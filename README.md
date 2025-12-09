# Bot TP - Frontend

Interface conversationnelle simple pour le bot assistant pédagogique destiné aux travaux pratiques des étudiants.

## Description

Application web en HTML/CSS/JavaScript vanilla qui se connecte au backend Bot TP pour offrir une interface de chat intuitive et moderne.

## Prérequis

- Le backend doit être démarré sur le port 3000 ([bot_tp_back](../bot_tp_back))
- Un navigateur web moderne (Chrome, Firefox, Safari, Edge)

## Installation

Aucune installation nécessaire! C'est du HTML/CSS/JavaScript pur.

## Lancement

### Option 1: Serveur HTTP simple avec Python

```bash
# Python 3
python -m http.server 8080

# Puis ouvrir: http://localhost:8080
```

### Option 2: Serveur HTTP simple avec Node.js

```bash
# Installer http-server globalement (une seule fois)
npm install -g http-server

# Lancer le serveur
http-server -p 8080

# Puis ouvrir: http://localhost:8080
```

### Option 3: Extension VSCode

Si vous utilisez VSCode, installez l'extension "Live Server" et cliquez sur "Go Live" en bas à droite.

### Option 4: Double-clic sur index.html

Vous pouvez aussi simplement ouvrir le fichier `index.html` dans votre navigateur, mais certaines fonctionnalités peuvent ne pas fonctionner correctement avec le protocole `file://`.

## Fonctionnalités

- Interface de chat moderne et responsive
- Connexion automatique au backend sur le port 3000
- Sélection du type d'assistant (TP général, Tuteur programmation, Aide au debug)
- Indicateur de frappe pendant la génération de réponse
- Historique des messages
- Réinitialisation de la conversation
- Gestion des erreurs avec messages explicites
- Statistiques de session (nombre de messages, ID de session)
- Design moderne avec dégradés et animations

## Structure du projet

```
bot_tp_front/
├── index.html          # Structure HTML de l'interface
├── style.css           # Styles CSS avec design moderne
├── app.js              # Logique JavaScript et intégration API
└── README.md           # Ce fichier
```

## Utilisation

1. Assurez-vous que le backend est démarré sur `http://localhost:3000`
2. Ouvrez l'interface frontend dans votre navigateur
3. L'application se connecte automatiquement et crée une session
4. Sélectionnez le type d'assistant si besoin (TP Assistant par défaut)
5. Tapez votre message dans le champ de texte
6. Appuyez sur Entrée ou cliquez sur "Envoyer"
7. Le bot répond après quelques secondes
8. Utilisez "Nouvelle session" pour recommencer une conversation

## Types d'assistant disponibles

- **Assistant TP**: Assistant pédagogique général qui guide sans donner la solution complète
- **Tuteur Programmation**: Tuteur spécialisé en programmation avec explications détaillées
- **Aide au Debug**: Assistant de débogage qui aide à identifier et comprendre les erreurs

## Raccourcis clavier

- `Entrée`: Envoyer le message
- `Shift + Entrée`: Nouvelle ligne dans le message

## Personnalisation

### Modifier l'URL du backend

Si votre backend tourne sur un autre port ou serveur, modifiez la constante dans [app.js](app.js:2):

```javascript
const API_URL = 'http://localhost:3000'; // Changer ici
```

### Personnaliser les couleurs

Les couleurs principales sont dans [style.css](style.css):

```css
/* Dégradé principal */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Modifier le contexte initial

Le contexte envoyé lors de la création de session peut être modifié dans [app.js](app.js:67-71):

```javascript
context: {
    tpSubject: 'Travaux Pratiques',
    studentLevel: 'tous niveaux'
}
```

## Gestion des erreurs

L'application gère automatiquement plusieurs types d'erreurs:

- **Backend non accessible**: Message d'erreur si le serveur ne répond pas
- **OpenAI non configuré**: Alerte si la clé API n'est pas configurée
- **Erreur de session**: Rechargez la page pour créer une nouvelle session
- **Timeout**: Le message sera affiché après un certain délai

## Design responsive

L'interface s'adapte automatiquement aux différentes tailles d'écran:

- Desktop: Interface large avec sidebar potentielle
- Tablette: Interface adaptée
- Mobile: Interface plein écran optimisée

## Améliorations futures possibles

- Sauvegarde de l'historique dans localStorage
- Mode sombre
- Support du markdown dans les messages
- Upload de fichiers de code
- Copie des messages
- Export de la conversation
- Streaming des réponses (WebSockets)
- Multi-sessions avec onglets
- Syntaxe highlighting pour le code
- Réactions aux messages

## Débogage

### Le frontend ne se connecte pas au backend

1. Vérifiez que le backend est bien démarré: `http://localhost:3000/health`
2. Vérifiez la console du navigateur (F12) pour les erreurs CORS
3. Assurez-vous que le backend a CORS activé (normalement oui)

### Les messages ne s'envoient pas

1. Ouvrez la console du navigateur (F12)
2. Vérifiez les erreurs réseau dans l'onglet "Network"
3. Vérifiez que la session a bien été créée (ID affiché en bas)

### Erreur "OpenAI non configuré"

1. Vérifiez que le backend a un fichier `.env` avec `OPENAI_API_KEY`
2. Redémarrez le backend après avoir ajouté la clé

## Technologies utilisées

- HTML5
- CSS3 (Flexbox, Grid, Animations, Gradients)
- JavaScript ES6+ (Async/Await, Fetch API, DOM Manipulation)
- Aucune dépendance externe

## Support navigateurs

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

## Licence

MIT

## Auteur

Créé pour les travaux pratiques des étudiants.
