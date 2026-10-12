# ADR 01 : Choix de la solution de stockage des données

| | |
|---|---|
| **Statut** | Accepté |
| **Date** | 12 octobre 2026 |
| **Projet** | Mentor-Extension |
| **Décideur(s)** | THUILLIEZ Raphael, DIBON LANDRIEU Viktor, MLODZINSKI tymoteusz |
| **Remplace / remplacé par** | Aucun |

## 1. Contexte

L'extension affiche un compteur de « Eh » dans un popup. Un popup d'extension est détruit à chaque fermeture : toutes les variables JavaScript sont alors perdues. Il faut donc conserver durablement :

- la valeur du compteur (clé `nbEh`) ;
- la liste des sauvegardes (clé `saves`), chacune composée d'un identifiant, d'un nom, d'un prénom et d'une valeur.

Le compteur est écrit **à chaque clic** sur le bouton « + ». Les sauvegardes, elles, ne sont écrites que lors d'une validation ou d'une suppression.

## 2. Facteurs de décision

1. **Persistance** : les données doivent survivre à la fermeture du popup et au redémarrage du navigateur.
2. **Adaptation aux extensions** : l'API doit être utilisable depuis le popup et, plus tard, depuis le service worker (`main.js`).
3. **Simplicité** : peu de code, pas de dépendance, stockage d'objets JavaScript sans sérialisation manuelle.
4. **Capacité** : quelques entiers et quelques dizaines de petits objets suffisent.
5. **Débit d'écriture** : le compteur écrit à chaque clic, ce qui peut être limité par certaines API.

## 3. Options étudiées

### Option 1 : `chrome.storage.sync`

- (+) API prévue pour les extensions, asynchrone, accessible depuis le popup et le service worker
- (+) Stocke directement des objets JavaScript
- (+) Données synchronisées entre les appareils de l'utilisateur connecté à Chrome
- (−) Quotas limités : environ 100 Ko au total, 8 Ko par clé, 512 clés au maximum
- (−) Limite d'écritures : environ 120 par minute et 1800 par heure
- (−) Nécessite la permission `storage` dans le `manifest.json`

### Option 2 : `chrome.storage.local`

- (+) Même API que `sync`, accessible depuis le popup et le service worker
- (+) Quota beaucoup plus large (environ 10 Mo) et pas de limite d'écriture comparable
- (−) Pas de synchronisation entre appareils
- (−) Nécessite aussi la permission `storage`

### Option 3 : `localStorage`

- (+) Très simple, aucune permission nécessaire
- (−) API synchrone, qui ne gère que des chaînes de caractères (sérialisation JSON manuelle)
- (−) Non disponible dans un service worker, donc impossible de partager les données avec `main.js`
- (−) Les données peuvent être effacées avec l'historique de navigation

### Comparaison

| Critère | `storage.sync` | `storage.local` | `localStorage` |
|---|---|---|---|
| Persistance | Oui | Oui | Oui (effaçable) |
| Accessible au service worker | Oui | Oui | Non |
| Objets JavaScript directs | Oui | Oui | Non (JSON manuel) |
| Capacité | ~100 Ko | ~10 Mo | ~5 Mo |
| Limite d'écriture | Oui | Non | Non |
| Synchronisation entre appareils | Oui | Non | Non |
| Permission requise | Oui | Oui | Non |

## 4. Décision

On utilise **`chrome.storage.sync`** pour le compteur (clé `nbEh`) et pour les sauvegardes (clé `saves`).

**Justification :**

- Les données sont très petites, très en dessous des quotas.
- C'est l'API recommandée pour les extensions, utilisable depuis tous les contextes (popup et service worker).
- La synchronisation entre appareils est un bonus sans coût de développement.
- `localStorage` est écarté parce qu'il est inaccessible au service worker. `chrome.storage.local` reste une alternative valable, mais n'apporte rien de plus pour le besoin actuel.

## 5. Conséquences

**Positives**

- Les données persistent après la fermeture du popup et le redémarrage de Chrome.
- Le service worker pourra lire les mêmes données (par exemple pour afficher le compteur sur l'icône).
- Le code reste court et lisible.

**Négatives et risques**

| Risque | Impact | Atténuation |
|---|---|---|
| Clé `saves` limitée à environ 8 Ko | Au-delà de quelques dizaines de sauvegardes, l'écriture échoue | Basculer sur `storage.local` |
| Limite d'environ 120 écritures par minute | Une série de clics très rapides pourrait dépasser la limite et faire échouer des écritures | Basculer sur `storage.local`, ou regrouper les écritures (délai après le dernier clic) |
| Permission `storage` obligatoire | L'extension ne fonctionne pas sans elle | La déclarer dans `manifest.json` |
| Données liées au profil Chrome | Désinstaller l'extension efface les données | Documenté dans la documentation utilisateur |

## 6. Plan de réexamen

Cette décision sera revue si l'un de ces cas se présente :

- le nombre de sauvegardes approche la limite de 8 Ko par clé ;
- des erreurs d'écriture apparaissent dans la console lors d'un usage intensif du compteur ;
- une fonctionnalité nécessite plus de capacité de stockage.

**Migration prévue :** l'API de `chrome.storage.local` est identique à celle de `sync`. Il suffira de remplacer `chrome.storage.sync` par `chrome.storage.local` dans `scripts/counter.js` (et dans `main.js` si utilisé), puis de créer un nouvel ADR qui remplace celui-ci.

## 7. Références

- Documentation de l'API `chrome.storage` (developer.chrome.com)
- ADR 0002 : [Comportement en cas de sauvegarde en double](0002-sauvegarde-en-double.md)