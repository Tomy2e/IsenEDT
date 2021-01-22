# IsenEDT

:warning: L'application est toujours en cours de développement.

## Qu'est-ce que IsenEDT ?
IsenEDT est une application créée par un étudiant pour les étudiants de l'ISEN Yncréa Ouest.
Cette application permet à tous les étudiants de l'école de consulter son emploi du temps
rapidement et simplement, sans passer par l'ENT de l'école.

## Télécharger l'application
L'application est téléchargeable gratuitement sur le [Play Store](https://play.google.com/store/apps/details?id=com.tomy2e.isenedt).
Attention, la version actuellement téléchargeable sur le Play Store ne correspond actuellement pas à celle disponible sur ce dépôt git.

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
$ ionic capacitor run android -l --host=192.168.1.15
```

L'application peut être [débuggée via la console Chrome](https://ionicframework.com/docs/developing/android#using-chrome-devtools)
lorsque l'appareil Android est connecté à l'ordinateur, il suffit pour cela d'ouvrir un nouvel onglet et accéder à la page `chrome://inspect`.

## Contributions
Les contributions se font directement via les Pull Requests du dépôt GitHub.
