# ADR 02 : Comportement en cas de sauvegarde avec un nom et un prénom déjà enregistrés

| | |
|---|---|
| **Statut** | Accepté |
| **Date** | 12 octobre 2026 |
| **Projet** | Mentor-Extension |
| **Décideur(s)** | THUILLIEZ Raphael, DIBON LANDRIEU Viktor, MLODZINSKI tymoteusz |
| **Lié à** | [ADR 0001 : choix du stockage](0001-choix-du-stockage.md) |

## 1. Contexte

L'utilisateur peut sauvegarder la valeur du compteur sous un nom et un prénom. Il peut arriver qu'il saisisse une deuxième fois la même personne, par exemple pour enregistrer un score plus récent. Il faut décider de ce que fait l'extension dans ce cas.

## 2. Facteurs de décision

1. **Simplicité pour l'utilisateur** : le comportement doit être prévisible et ne pas demander d'étape supplémentaire.
2. **Respect des quotas** : la clé `saves` est limitée à environ 8 Ko (voir ADR 0001).
3. **Lisibilité de la liste** : éviter de multiplier les lignes pour la même personne.
4. **Simplicité du code** : limiter le nombre de cas à gérer.

## 3. Options étudiées

### Option A : créer une nouvelle entrée à chaque sauvegarde

- (+) Conserve tout l'historique
- (−) La liste peut contenir de nombreuses lignes pour la même personne
- (−) Consomme le quota de 8 Ko plus vite
- (−) Il est difficile de savoir quelle ligne est la plus récente

### Option B : remplacer l'entrée existante (retenue)

- (+) Une seule ligne par personne, toujours la valeur la plus récente
- (+) Économise le quota
- (+) Aucune étape supplémentaire pour l'utilisateur
- (−) L'ancienne valeur est perdue
- (−) Deux personnes différentes portant le même nom et prénom se remplacent mutuellement

### Option C : refuser la sauvegarde avec un message d'erreur

- (+) Aucune donnée perdue par erreur
- (−) L'utilisateur doit d'abord supprimer l'ancienne sauvegarde, ce qui est pénible
- (−) Ajoute un cas d'erreur à gérer et à expliquer

## 4. Décision

On choisit l'**option B : remplacer l'entrée existante**.

**Règles retenues :**

- Les espaces au début et à la fin du nom et du prénom sont ignorés (`trim`).
- La comparaison ne tient pas compte des majuscules et des minuscules (« Dupont » et « dupont » désignent la même personne).
- L'identifiant de la sauvegarde existante est conservé, seule sa valeur est mise à jour.

## 5. Conséquences

**Positives**

- Comportement simple et prévisible, expliqué en une phrase dans la documentation utilisateur.
- Liste courte et lisible, quota préservé.

**Négatives et limites**

- Pas d'historique des scores d'une même personne.
- Les homonymes ne peuvent pas être distingués.

## 6. Plan de réexamen

Cette décision sera revue si les utilisateurs ont besoin de conserver un historique, ou si des homonymes posent problème. Une évolution possible serait d'ajouter la date de sauvegarde à chaque entrée, ou de demander une confirmation avant de remplacer une valeur existante.