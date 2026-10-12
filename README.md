# Mentor-Extension

Extension Chrome qui compte le nombre de « Eh » prononcés, avec la possibilité de sauvegarder le score sous un nom et un prénom.

![Aperçu du popup](images/p1.png)

## Table des matières

- [Mentor-Extension](#mentor-extension)
  - [Table des matières](#table-des-matières)
  - [Description](#description)
  - [Fonctionnalités](#fonctionnalités)
  - [Technologies utilisées](#technologies-utilisées)
  - [Prérequis](#prérequis)
  - [Installation](#installation)
  - [Utilisation](#utilisation)
  - [Structure du projet](#structure-du-projet)
  - [Documentation](#documentation)
  - [Contribuer](#contribuer)
  - [Auteur](#auteur)

## Description

Mentor-Extension ajoute un popup au navigateur Chrome. Il affiche un compteur de « Eh » que l'on incrémente d'un clic. La valeur est conservée même après la fermeture du popup ou du navigateur. Il est aussi possible de sauvegarder la valeur du compteur sous un nom et un prénom, puis de supprimer ces sauvegardes.

## Fonctionnalités

- Incrémenter le compteur avec le bouton **+**
- Réinitialiser le compteur avec le bouton **Reinitialize**
- Conserver la valeur du compteur entre deux ouvertures du popup
- Sauvegarder la valeur du compteur avec un nom et un prénom
- Consulter la liste des sauvegardes
- Supprimer une sauvegarde

## Technologies utilisées

- HTML, CSS, JavaScript (sans framework)
- API Chrome Extensions (Manifest V3)
- `chrome.storage.sync` pour la persistance des données

## Prérequis

- Google Chrome (ou un navigateur basé sur Chromium : Edge, Brave…)
- Git (pour cloner le dépôt)

## Installation

1. Cloner le dépôt :
   ```bash
   git clone <url-du-depot>
   cd Mentor-Extension
   ```
2. Ouvrir `chrome://extensions` dans Chrome.
3. Activer le **Mode développeur** (en haut à droite).
4. Cliquer sur **Charger l'extension non empaquetée**.
5. Sélectionner le dossier `Mentor-Extension`.
6. L'extension apparaît dans la barre d'outils (icône en forme de puzzle si elle n'est pas épinglée).

Après toute modification du code, cliquer sur le bouton ↻ de l'extension dans `chrome://extensions` pour la recharger.

## Utilisation

1. Cliquer sur l'icône de l'extension pour ouvrir le popup.
2. Cliquer sur **+** pour augmenter le compteur.
3. Cliquer sur **Reinitialize** pour le remettre à 0.
4. Cliquer sur **Sauvegarder**, saisir un nom et un prénom, puis **Valider** pour enregistrer la valeur actuelle.
5. Cliquer sur **Supprimer** à côté d'une sauvegarde pour la retirer de la liste.

Le guide complet pour les utilisateurs se trouve dans [`docs/documentation-utilisateur.md`](docs/documentation-utilisateur.md).

## Structure du projet

```
Mentor-Extension/
├── docs/
│   ├── adr/
│   │   ├── 0001-choix-du-stockage.md   # Décision : stockage des données
│   │   └── 0002-sauvegarde-en-double.md # Décision : sauvegarde en double
│   └── documentation-utilisateur.md    # Guide utilisateur
├── images/
│   └── p1.png                          # Capture d'écran
├── scripts/
│   └── counter.js                      # Logique du popup (compteur, sauvegardes)
├── styles/
│   └── counter.css                     # Styles du popup
├── views/
│   └── counter.html                    # Interface du popup
├── main.js                             # Service worker de l'extension
├── manifest.json                       # Configuration de l'extension (Manifest V3)
└── README.md
```

## Documentation

- [Documentation utilisateur](docs/documentation-utilisateur.md)
- [ADR 0001 : choix du stockage des données](docs/adr/0001-choix-du-stockage.md)
- [ADR 0002 : comportement en cas de sauvegarde en double](docs/adr/0002-sauvegarde-en-double.md)

## Contribuer

1. Créer une branche à partir de `main` : `git checkout -b feature/nom-de-la-fonctionnalite`
2. Faire ses modifications et les commiter : `git commit -m "feat: description"`
3. Pousser la branche : `git push -u origin feature/nom-de-la-fonctionnalite`
4. Ouvrir une Pull Request vers `main` en référençant l'issue concernée (`Closes #numéro`).

## Auteur

Tymoteusz Mlodzinski