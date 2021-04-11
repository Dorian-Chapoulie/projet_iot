
<p align="center">
  <img src="https://ak.picdn.net/shutterstock/videos/13894196/thumb/6.jpg" alt="Sublime's custom image"/>
</p>

<h1 align="center"> Jupiter </h1>
<h2 align="center">  Projet  IOT </h2>
<center> <h3> Février 2021 - Mai 2021 <h3> </center>
<h2 align="center">  Sous la direction de :
<br> Gilles menez</h2>

<h2 align="center">  Avec la participation de :</h2>
<center> <h3> Dorian Chapoulié <br> Rémi Longin <br> Léo Guillaumet <br> Raphael Bolier </h3> </center>

---

<h3> Table des matières </h3>

<h4>Jupiter : Présentation du projet
<br>
Jupiter : Fonctionnalités </h4>

1. Récupération de la liste des robots disponibles
2. Prise du controle d'un robot
3. Contrôle de la direction
<br>3.1 Le contrôle de la direction
<br>3.2 Le contrôle de la motorisation
<br>3.3 Le contrôle de la caméra embarquée
4. Données Publiées
5. Utilisation des données
6. Tableau des protocoles TCP


# Jupiter : Présentation du projet 

Jupiter est une mission d'exploration des locaux de la MIAGE par :
* Dorian Chapoulié
* Rémi Longin
* Léo Guillaumet
* Raphael Bolier

La mission consiste à déployer l'astromobile <b>Jupiter</b> sur le sol terrien pour étudier sa surface et collecter des données concernant la température de celle-ci.
L'objectif final est de transférer ces données à un utilisateur contrôlant le robot à distance afin d’obtenir une « heat-map » des locaux.
L’utilisateur percevra un flux vidéo généré à partir d’un ESP32-CAM installé sur Jupiter.

# Jupiter : Fonctionnalités

## 1. Récupération de la liste des robots disponibles

Nous souhaitons pouvoir choisir quel robot contrôler. Pour cela, dans ce cas notre robot sera un client MQTT qui sera abonné à un topic consacré au listage des robots.

Lorsque le robot recevra un message provenant du topic de listage, il répondra en indiquant s’il est disponible ou non (un robot est considéré disponible dès lors qu’il n’est pas entrain d’être contrôlé).

## 2. Prise du control d’un robot

Lorsqu’un utilisateur souhaite contrôler le robot depuis notre interface web, un appel sur une route sera effectué à une API en Node.JS pour que celle-ci se connecte au serveur TCP du robot. Si la connexion réussie, alors l’interface web passe en mode
« contrôle », sinon un message d’erreur est affiché.
Le front est relié à notre API grâce aux websockets. Cela permet d’envoyer les commandes au robot en temps réel.

## 3. Contrôle d’un robot

L’utilisateur peut contrôler Jupiter via notre interface web. Les contrôles sont répartis en 3 catégories :

1. Le contrôle de la direction
2. Le contrôle de la motorisation
3. Le contrôle de la caméra embarquée


### 3.1	Le contrôle de la caméra embarquée

Le contrôle de la direction se fait à l’aide des touches Q et D du clavier :

1. Q pour aller à gauche
2. D pour aller à droite

### 3.2	Le contrôle de la motorisation

Le contrôle de la motorisation se fait à l’aide des touches ESPACE/CTRL-L/Z/S du clavier :

1. ESPACE pour augmenter la vitesse
2. CTRL-L pour réduire la vitesse
3. Z pour avancer
4. S pour reculer

Lorsque le robot reçoit une instruction de contrôle de motorisation, il l’effectue pour
5 secondes. A chaque fois qu’il reçoit une instruction de ce type, le timer est remis à
0.Si le timer arrive à 5 secondes, alors le robot s’arrête jusqu’à ce qu’il reçoive une
autre instruction.
Si le robot ne reçoit pas d’instruction pendant 5 minutes, le client est déconnecté et le robot repasse en mode « disponible », et un autre utilisateur pourra en prendre le contrôle.

### 3.3	Le contrôle de la caméra embarquée

La caméra est montée sur un support comportant 2 servos moteurs, permettant un contrôle en 2 dimensions. De plus, elle enverra nombre réduit d’images par seconde afin de préserver l’autonomie de la batterie.
Le contrôle de la caméra embarquée se fait à l’aide des flèches directionnels du clavier :

1. Haut pour monter la caméra
2. Bas pour baisser la caméra
3. Droite pour tourner la caméra à droite
4. Gauche pour tourner la caméra à gauche

## 4. Données publiées

Le robot va publier périodiquement les données du capteur de température et la puissance en DB des réseaux l’entourant sur un topic MQTT.

L’API étant abonnée à ce topic, elle reçoit ces données, elle va les stocker en base, ce qui permet de générer des « heat-map » et un tracé du parcours du robot, par session.

Notre interface web sera principalement composé de 2 modes :

1. Le mode Contrôle
2. Le mode Spectateur
3. Le mode Historique

De plus, elle sera aussi abonnée au topic des données. Cela permet de créer un affichage de la heat-map et de la position de n’importe quel robot en temps réel, même en étant simple spectateur.
Le mode Historique permet de revoir les ancien tracés et heat-map.

## 5. Données publiées

Grâce à la liste en DB des réseaux aux alentours du robot, nous pouvons utiliser une triangulation de celui-ci. Nous allons donc faire une estimation de la position en fonction de la puissance des réseaux.
De plus, comme nous avons la température à une certaine position, nous pouvons générer une heat-map en temps réel.

## 6.Tableau des protocoles TCP

Nous avons créé un tableau (non définitif) des protocoles TCP utilisé pour communiquer entre le robot et l’API :

| Protocol | Description |
---------| --------- |
|I-D-< valeur> | <b>Emetteur </b> : API <br> <b>Receveur </b>: Jupiter <br> <b> Description </b> : Protocole permettant de contrôler de la direction du robot <br> <b>Paramètres </b> : Q/D <br> <b>Exemple </b> : I-D-D => aller à droite | 
|I-M-< valeur> |  <b>Emetteur </b> : API <br> <b>Receveur </b>: Jupiter <br> <b> Description </b> : Protocole permettant de contrôler la motorisation du robot <br> <b>Paramètres </b> : A/B/Z/S <br> <b>Exemple </b> : I-M-A => augmenter la vitesse |  
|I-C-< valeur> | <b>Emetteur </b> : API <br> <b>Receveur </b>: Jupiter <br> <b> Description </b> : Protocole permettant de contrôler la caméra du robot <br> <b>Paramètres </b> : H/B/G/D <br> <b>Exemple </b> : I-C-G => déplacer la caméra à gauche |  
