# Voici un guide étape par étape pour lancer L'application

1-Assurez-vous que votre machine a Node.js version 18 et npm (le gestionnaire de paquets de Node.js) installés. Vous pouvez vérifier cela en exécutant les commandes node --version et npm --version dans un terminal
telecharger node js à l'url  suivant <https://nodejs.org/en/download>

2-Assurez-vous d'avoir le sgdb nosql  mongodb installer sur la machine , ou utiliser une image docker mongodb.
verifier si mongodb est installer sur vôtre machine local en tapant la commande suivante dans le terminal  mongod--version
telecharger mongodb  à l'url suivant <https://www.mongodb.com/try/download/community>

3-lancer le serveur mongodb en tapant la commande mongod dans le terminal

4-Installez les dépendances de l'application en exécutant la commande npm install dans votre terminal. Assurez-vous que le fichier package.json est présent dans le répertoire racine de l' application.

5-Lancez l' application en utilisant la commande npm start dans le terminal . Cela lancera un serveur de développement et vous pourrez accéder à votre application en ouvrant votre navigateur web et en accédant à l'adresse <http://localhost:5000/>
