# Visualization project

## INFORMATION

## 1. Pré-requis

Avoir [node](https://nodejs.org/en/download/) installé sur sa machine pour la version locale.
Avoir [docker](https://docs.docker.com/get-docker/) installé pour la version docker.

## 2. Installation

### 🐋2.1 Docker

Pour utiliser la version Docker du projet, voir [ce lien](https://hub.docker.com/r/antiprismus/visualization) concernant l'installation.

### 2.2. Local

#### 2.2.1 Structure des données

> Les données doivent être placées dans le dossier `public/static` selon la structure suivante :

📂static
┣ 📂data
┃ ┣ 📜distance_fifth.csv
┃ ┣ 📜distance_first.csv
┃ ┣ 📜distance_fourth.csv
┃ ┣ 📜distance_second.csv
┃ ┣ 📜distance_third.csv
┃ ┣ 📜neighbor_fifth.csv
┃ ┣ 📜neighbor_first.csv
┃ ┣ 📜neighbor_fourth.csv
┃ ┣ 📜neighbor_second.csv
┃ ┗ 📜neighbor_third.csv
┣ 📂files
┃ ┗ 📂dev
┃ ┃ ┣ 📜completedTree.json
┃ ┃ ┣ 📜keyword_ranking_for_app.json
┃ ┃ ┣ 📜short_keywords_for_app.json
┃ ┃ ┗ 📜short_properties_for_app_new.json
┣ 📂images
┗ 📂pdf

### Data

Ce dossier contient deux types de fichiers :

*  `distance_{level}.csv`
*  `neighbor_{level}.csv`

Le premier fichier contient les distances entre chaque nœud.

Le second fichier contient un mapping des 10 nœuds les plus proches pour chaque nœud.

> Ces fichiers peuvent être générés grâce aux embeddings en utilisant  [ce script](https://github.com/ibethus/visualization-project/blob/main/src/helpers/get_distance_neighbor.py) qui provient du code source de l'application.

> Lancez-le avec cette commande : `py get_distance_neighbor.py name_of_your_embedding.csv your/output/folder/path`

> **Il doit toujours y avoir cinq niveaux**

### Files

Tous les fichiers doivent être mis dans le dossier `production`.

#### `completedTree.json`

Ce fichier décrit la structure de l'arbre de données.  Pour rappel, les **cinq niveaux** doivent être présents (et en ajoutant le niveau zéro `root`). 

Notre exemple ci-contre ne contient que deux niveaux (plus le niveau zéro `root`.

```json
[
	// Niveau zéro
	[
		{ "name": "root" } // position 0
	],
	
	// Niveau un
	[
		{ "name": "Cross section", "parent": 0}, // position 0
		{ "name": "Maps", "parent": 0}, // position 1
		{ "name": "Graphs and Tables", "parent": 0}, // position 2
		{ "name": "Photos", "parent": 0} // position 3
	],
	
	// Niveau deux
	[
		{ "name": "Well section", "parent": 0}, // position 0
		{ "name": "Geology", "parent": 0}, // position 1
		{ "name": "One time", "parent": 1}, // position 2
		{ "name": "Permanent", "parent": 1}, // position 3
		{ "name": "Results", "parent": 2}, // position 4
		{ "name": "Description", "parent": 2}, // position 5
		{ "name": "Photos", "parent": 3} // position 6
	],
	...
]
```
> Chaque niveau est représenté par un tableau de données. On retrouve donc le niveau zéro composé du nœud `root`, le niveau un composé des nœuds `Cross Section, Maps, Graphs and Tables, Photos` et ainsi de suite.

> Il faut savoir que dans ce fichier, le numéro écrit à la suite de `"parent"` correspond à la position du parent de notre nœud dans son niveau. On voit donc que le parent du nœud `Result` au niveau deux est le nœud `Graphs and Tables` du niveau un.

#### `keyword_ranking_for_app.json`

Ce fichier contient tous les mots-clés classifiés par rang.

```json
[
	{
		"Rank 1": "forage_sondage",
		"Rank 2": "drilling/forage",
		"Rank 3": "carottage carottages carotte carottes carottés carottier forage forages foration nivelés nivellement ouvrage ouvrages piezair piézairs piézogaz piezometre piezometres piézomètres piezometrie piézométrie piezometrique piézométrique piézométriques piezos puits sondage sondage sondages sondages well"
	},
	{
		"Rank 1": "lithologie",
		"Rank 2": "lithologie",
		"Rank 3": "argile argiles argiles argileuse argileux argilo balast ballast bitume bitumineuse bitumineux cailloux calcaire calcaires ciment cimentation granulométrique gravats graveleuse graveleuses graveleux gravier graviers gypse limon limoneuse limoneuses limoneux limono limons lithologie lithologique porosité remblai remblais remblayage sable sables sableuse sableuses sableux"
	}
]
```

#### `short_keywords_for_app.json`

Ce fichier contient les mots-clés pour chaque nœud, classés par rang et par champ dans lequel le mot est présent (`tesseract`, `caption` and `page_text`). L'id correspond à l'identifiant du nœud.

```json
[
	{
		"id": 1,
		"tesseract_keyword_rank1": "milieux",
		"tesseract_keyword_rank2": "sol",
		"tesseract_keyword_rank3": "",
		"caption_keyword_rank1": "",
		"caption_keyword_rank2": "",
		"caption_keyword_rank3": "",
		"page_text_keyword_rank1": "forage_sondage, milieux",
		"page_text_keyword_rank2": "drilling/forage, sol",
		"page_text_keyword_rank3": "carotte, forage, terre"
	}
]

```

#### `short_properties_for_app_new.json`

Ce fichier contient toutes les informations importantes relatives à un nœud. C'est le fichier le plus important et il doit être traité avec précaution. <br/>

⚡ **Informations importantes** ⚡

*  `Path` : le chemin vers l'image dans le dossier `image` (comme décrit dans la structure de données)
*  `page` : la page à laquelle l'image peut être retrouvée dans son pdf (⚠️ nous ajoutons +1 à cette valeur dans le code)
*  `converted_timeline` : la date formattée du document. Le format doit ressembler exactement au format ci contre :  
    * Pour une date : `yyyy-mm-dd`. 
    * Pour une période : `yyyy-mm-dd/yyyy-mm-dd` respectivement date de début et date de fin.
    * Ce champ peut être vide.

> Si il arrive qu'un champ soit vide car il n'y a pas d'informations, sa valeur doit être `null`. Si autre chose est renseigné, certaines fonctionnalités pourraient avoir un comportement non souhaité.

```json
[
	{
		"id": 1,
		"Path": "path/to/my/image/my_image.png",
		"page": 9,
		"caption": "Figure 1 : Localisation du site (extrait de la carte IGN, source : Géoportail.fr)",
		"tesseract": "A RTS SU Se Zone d tude 48",
		"report_name": "my_report_name",
		"site_name": "Saint-Jean-de-La-Ruelle",
		"page_text": null,
		"timeline": "Juin 2017",
		"converted_timeline": "2017-06-01",
		"path_to_report": "path/to/my/report.pdf",
		"level1": "Maps",
		"level2": "Permanent",
		"level3": "Maps Geology",
		"level4": "Maps Geology",
		"level5": "Maps Geology",
		"pred level1": "Maps",
		"pred level2": "Permanent",
		"pred level3": "Maps Geology",
		"pred level4": "Maps Geology",
		"pred level5": "Maps Geology"
	}
]

```

#### `/images`

Ce dossier contient toutes les images nécessaires pour que le projet se lance correctement. Elles ne seront pas versionnées sur git.

#### `/pdf`

Ce dossier contient tous les pdf nécessaires pour que le projet se lance correctement. Ils ne seront pas versionnés sur git.

## 3. Fonctionnalités et utilisation

Notre application est divisée en deux parties, un arbre et un graphe.

Les boutons  `Detach graph`, `Show images` et `Export JSON` présents sur la partie haute de l'écran permettent respectivement de :

   * détacher la partie graphe dans une autre fenêtre web (elle communiquera toujours avec l'arbre)
   * afficher une nouvelle section sur la partie droite de l'écran dans laquelle seront affichées des informations.
   * exporter les données actuelles sous forme de fichier JSON

### 3.1. Arbre

#### 3.1.1. Apparence

L'arbre représente des catégories d'images hiérarchisées. Chaque nœud correspond donc à une catégorie dans laquelle des images ont été rangées.

On peut rétracter les enfants d'un nœud en cliquant dessus, l'apparence de l'arbre sera donc modifiée. 

#### 3.1.2. Informations sur les nœuds

En cliquant sur le nom d'un nœud, différentes choses sont possibles.

On peut voir les images contenues dans ce nœud dans la fenêtre ouverte par le bouton `Show Images` mentionnée ci-dessus.

> Pour masquer cette fenêtre, il suffit de recliquer sur le bouton `Hide Images`

Cliquer sur les images dans cette fenêtre ouvrira le PDF auquel elle est associée, à la page exacte où elle est présente. 

> Si aucun PDF n'est associé à l'image, l'annotation rouge `No PDF` apparait sous l'image. Cliquer dessus ouvrira donc simplement l'image dans une nouvelle fenêtre.

En cliquant une nouvelle fois sur le nom d'un nœud, la catégorie s'ouvrira sous la première dans la fenêtre de droite.
Il est donc possible de drag and drop les images d'une catégorie à une autre afin de modifier les données.

> Exporter les données en JSON avec le bouton mentionné au début de cette partie permet donc de récupérer les modifications faites.

### 2. Graphe

#### 3.2.1. Apparence

Le graphe représente la proximité (en terme d'apparence) entre chaque image. Chaque nœud représente donc une image. Sa couleur est associée à la catégorie dans laquelle elle est classée dans l'arbre.

> Voir la légende pour les différentes couleurs et les catégories

Il est possible de moduler l'échelle des distances entre chaque nœud afin de rendre le graphe plus lisible avec le curseur situé en bas à droite du graphe.

En passant sa souris sur un nœud, on peut voir un aperçu de l'image qu'il représente ainsi que des 5 images qui lui sont le plus similaires.
On peut cliquer sur l'aperçu afin d'ouvrir une nouvelle fenêtre dans laquelle l'image sera affichée en grand. Il y est aussi possible d'afficher le PDF associé.

> On peut aussi retrouver la date de l'image et l'éditer, mais cette fonctionnalité n'est pas encore implémentée et n'est pas fonctionnelle.

#### 3.2.2. Filtres

Comme mentionnée précédemment, lorsque qu'une catégorie est sélectionnée dans l'arbre, le graphe va entouré en rouge les nœuds correspondant à la catégories. On peut donc facilement repérer quelles images sont classées dans quelle catégories.

L'utilisation des filtres suivant mettra en évidence les nœuds qui y correspondent en réduisant l'opacité des autres nœuds.

#### Dates

Il est possible de filtrer par date sur la partie haute du graphe. De base, la date la plus vieille et la date la plus récente parmi toutes les données sont renseignées.

> Certaines images ne sont pas datées. Cela explique donc pourquoi quelques nœuds sont en opacité faible lors du chargement du graphe : ils ne sont pas pris en compte dans la recherche par date.

#### Niveaux

Il est possible de visualiser le graphe dépendant du niveau de hiérarchie des catégories représentées en utilisant la liste déroulante `Levels`

#### Mots-clés

Il est possible de filtrer par mots-clés en sélectionnant un rang de mots-clés. Une liste se remplira donc et il suffit de cocher ce que l'on veut chercher. 

Les nœuds correspondants seront mis en valeur, et des logos apparaitront à côtés de ces derniers. Chaque logo correspond à un champ dans lequel le(s) mot(s)-clé(s) ont été trouvés.

#### Champs

Il est aussi possible de pouvoir rechercher dans des champs particulier, comme la légende de l'image, son texte de description, ou l'image elle-même.







