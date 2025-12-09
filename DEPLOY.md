# Déploiement sur GitHub Pages

## Prérequis
- Un compte GitHub
- Git installé sur votre machine
- Le backend déjà déployé sur Vercel: https://bot-tp-back.vercel.app/

## Étapes de déploiement

### 1. Créer un repository GitHub

1. Allez sur [GitHub](https://github.com)
2. Cliquez sur "New repository" (bouton vert en haut à droite)
3. Nommez votre repository, par exemple: `bisgambia-front`
4. Laissez-le en **Public**
5. Ne cochez PAS "Initialize with README" (vous avez déjà des fichiers)
6. Cliquez sur "Create repository"

### 2. Initialiser Git et pousser le code

Ouvrez un terminal dans le dossier `bot_tp_front` et exécutez:

```bash
# Initialiser le repository git
git init

# Ajouter tous les fichiers
git add .

# Faire le premier commit
git commit -m "Initial commit - BisgambIA"

# Renommer la branche en main (si nécessaire)
git branch -M main

# Ajouter le remote GitHub (REMPLACEZ par VOTRE URL)
git remote add origin https://github.com/VOTRE-USERNAME/bisgambia-front.git

# Pousser vers GitHub
git push -u origin main
```

**Important:** Remplacez `VOTRE-USERNAME/bisgambia-front` par votre nom d'utilisateur et le nom de votre repository!

### 3. Activer GitHub Pages

1. Sur GitHub, allez dans votre repository
2. Cliquez sur **Settings** (en haut à droite)
3. Dans le menu de gauche, cliquez sur **Pages**
4. Sous "Source", sélectionnez:
   - Branch: **main**
   - Folder: **/ (root)**
5. Cliquez sur **Save**

### 4. Attendre le déploiement

GitHub va déployer votre site automatiquement (cela prend 1-2 minutes).

Votre site sera disponible à l'adresse:
```
https://VOTRE-USERNAME.github.io/bisgambia-front/
```

### 5. Vérifier CORS sur le backend

**IMPORTANT:** Votre backend Vercel doit autoriser les requêtes depuis GitHub Pages.

Vérifiez que dans votre backend (`bot_tp_back/src/server.js`), le CORS est bien configuré:

```javascript
import cors from 'cors';

// Option 1: Autoriser toutes les origines (pour test)
app.use(cors());

// Option 2: Autoriser seulement votre domaine GitHub Pages (recommandé)
app.use(cors({
    origin: 'https://VOTRE-USERNAME.github.io'
}));
```

Si vous devez modifier le CORS:
1. Modifiez le fichier sur votre backend
2. Commitez et poussez sur Vercel
3. Vercel redéploiera automatiquement

## Mettre à jour le site

À chaque fois que vous modifiez le code:

```bash
# Ajouter les changements
git add .

# Commiter
git commit -m "Description de vos changements"

# Pousser vers GitHub
git push
```

GitHub Pages se mettra à jour automatiquement en 1-2 minutes.

## Tester localement avant de déployer

Pour tester localement avec le backend Vercel:

```bash
# Le backend est déjà configuré dans app.js
# Lancez simplement un serveur local
python -m http.server 8080
```

Ouvrez http://localhost:8080 et testez!

## Dépannage

### Le site ne se charge pas
- Attendez 2-3 minutes après l'activation de GitHub Pages
- Videz le cache de votre navigateur (Ctrl+Shift+R)

### Erreur CORS
- Vérifiez la configuration CORS de votre backend Vercel
- Consultez la console du navigateur (F12) pour voir l'erreur exacte

### Les images ne s'affichent pas
- Vérifiez que `bisgambia-avatar.png` est bien dans le repository
- Vérifiez que le chemin est relatif (pas absolu)

### Le backend ne répond pas
- Testez directement: https://bot-tp-back.vercel.app/health
- Si erreur 500, vérifiez les logs sur Vercel

## Structure finale

```
bisgambia-front/
├── index.html              # Page principale
├── style.css               # Styles
├── app.js                  # Logique (pointe vers Vercel)
├── bisgambia-avatar.png    # Avatar
├── README.md               # Documentation
├── DEPLOY.md              # Ce fichier
└── .gitignore             # Fichiers ignorés par Git
```

## URL finale

Une fois déployé, partagez cette URL avec vos étudiants:
```
https://VOTRE-USERNAME.github.io/bisgambia-front/
```

Joyeux Noël avec BisgambIA! 🎄🎅
