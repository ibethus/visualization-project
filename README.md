# dawin-data-organiser

## Technos:
 * javascript (l'algo étant délocalisé du front il est possible d'en faire une version `.ts`)
 * Vuejs -> framework
 * D3JS -> package visualisation des données

## INFORMATION
La branche `develop` est configurée pour une démonstration et ne contient pas les données réélles, `git fetch --all && git checkout new-format` contient les dernières modifications liée a la version la plus récente du jeu de données fourni et une revisite des fonctions de mapping de données pour matcher la nouvelle structure du JSON de données.
## Pré-requis
- node >= v14.4.0
- installer les images dans le bon dossier:
    * le dossier blur que l'on nous a fourni contient un dossier `database` il suffit de placer directement le dossier `database` dans le repertoire `public/images/`.
    
## Project setup 
> si vous installez avec `yarn` toutes les commandes doivent être faites avec yarn, même chise pour `npm` les gestionnaire de package doit être le meme pour toutes les commandes

```
yarn install
```
ou
```
npm install
```

### Compiles and hot-reloads for development
```
yarn serve
```
```
npm run serve
```
### Lints and fixes files
```
yarn lint
```
```
npm run lint
```


### Gerer ses assets
- *Banque d'images*
    * `public/images` y placer votre dossier contenant vos images `database`. Ce dossier ne sera pas push sur git.
- *Banque de PDFs*
    * `public/pdf` y placer le dossier contenant les pdf liés aux images. Ce dossier ne sera pas push sur git. 
- *Vos données*
    * `src/assets/files` y mettre les fichiers `.json` il faut un fichier de définition de structure d'arbre et un fichier de données, seule la définition est nécessaire au fonctionnement de l'arbre mais il n'y aura aucune données dans vos noeud s'il n'y a pas le fichier de données.
    * **import des données**
        * dans le fichier `src/mixins/reorder.mixin.js` ajoutez vos import de la même manière que les import par défaut, commentez ou supprimez les imports de définition (`import * as definition from @/assets/files/votre_arbre.json`) et de données (`import * as images from @/assets/files/vos_données.json`) déja présents
    * **Les tags**
        * Les tags d'images sont générés automatiquement, il se peut que vous souhaitiez filtrer certain mots qui ne sont pas pertinents en temps que tag; allez dans le fichier `src/helpers/constants.js` et ajoutez les termes souhaités dans la liste `BLACKLISTED_WORDS` notez que les termes de moins de 3 lettres sont déjà automatiquement supprimés des tags.
- *Utilitaires*
    * Le fichier `src/mixins/reorder.mixin.js` contient le code de génération des tags, de mapping des données, de création de l'arbre et de l'export de l'arbre
    * Le fichier `src/classes/Tree.js` contient la définition d'un objet `Tree`correspondant à un noeud d'arbre, vous y retrouverez ses informations (nom du noeud, données du noeud, sa profondeur (`root` démarrant à -1), son positionnement dans sa profondeur (de gauche a droite sur un même niveau, l'indexation démarre à 0) etc)
    * Le fichier `src/helpers/event-bus.js` n'a pas vocation à être modifié il sert de gestionnaire d'evenement pour l'arbre

### Features
* Génération d'un arbre par jeu de données
* Mapping de données par noeud et par héritage de données (parent -> enfant)
* Tag des données
* Affichage des données d'un noeud (2 noeuds peuvent être mis en même temps, cette limite peut être modifiée dans `src/views/D3/Renderer.vue` au niveau de la méthode `selectNodes`)
* Aperçu de la donnée survolée
* Export des données de l'arbres au format JSON
* Modification des données d'un noeud par drag and drop (cela génère un champs `correction`dans le `json` exporté qui contient le nouveau noeud de la données ciblée) 


### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
