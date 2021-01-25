# IsenEDT

[![build status](https://img.shields.io/github/workflow/status/Tomy2e/IsenEDT/Android%20Prod%20CI)](https://github.com/Tomy2e/IsenEDT/actions?query=workflow%3A%22Android+Prod+CI%22)

## Qu'est-ce que IsenEDT ?
IsenEDT est une application créée par un étudiant pour les étudiants de l'ISEN Yncréa Ouest.
Cette application permet à tous les étudiants de l'école de consulter son emploi du temps
rapidement et simplement, sans passer par l'ENT de l'école.

## Télécharger l'application
L'application est téléchargeable gratuitement sur le [Play Store](https://play.google.com/store/apps/details?id=com.tomy2e.isenedt).

## Tester sur navigateur
L'application utilise le plugin [Ionic Native HTTP](https://ionicframework.com/docs/native/http) qui n'est pas compatible avec les navigateurs web.
Il est donc impossible de tester l'application sur navigateur web.

## Tester sur Android
Afin de pouvoir tester l'application sur Android, les pré-requis suivants sont nécessaires:
- Une version récente de [Node.js](https://nodejs.org/en/download/)
- [Le package npm @ionic/cli installé](https://ionicframework.com/getting-started)
- Une version récente de [Android Studio](https://developer.android.com/studio) et du SDK Android

Vous pouvez ensuite commencer à tester le projet via les commandes suivantes.

```console
$ git clone https://github.com/Tomy2e/IsenEDT
$ cd IsenEDT
$ npm install
$ ionic capacitor sync
$ ionic capacitor run android -l --host=YOUR_IP_ADDRESS
```

L'application peut être [débuggée via la console Chrome](https://ionicframework.com/docs/developing/android#using-chrome-devtools)
lorsque l'appareil Android est connecté à l'ordinateur, il suffit pour cela d'ouvrir un nouvel onglet et accéder à la page `chrome://inspect`.

## Firebase Analytics
Le plugin Capacitor [Firebase Analytics](https://github.com/capacitor-community/firebase-analytics) est intégré à l'application
afin de mesurer son audience. Le tracking peut être désactivé au moment de la connexion et dans l'onglet `Paramètres` une fois authentifié.

Ce plugin nécessite un fichier `google-services.json` fourni par [Firebase](https://console.firebase.google.com/) qui doit être placé
dans le répertoire `/android/app`.

## Contributions
Les contributions se font directement via les Pull Requests du dépôt GitHub.
