# my-next-metro
Node app which retrieve next metro's schedules from RATP Network in Paris.

This project use the webservice https://github.com/pgrimaud/horaires-ratp-api created by https://github.com/pgrimaud and the following node.js SDK for dialogflow https://github.com/dialogflow/dialogflow-nodejs-client

Change dialogFlowTextRequest variable in app.js with the request you want to send using french language.
You have to precise in your request a metro line, a station and a destination.

Examples : 
- "Quel est le prochain métro à Bonne Nouvelle sur la ligne 9 direction Montreuil ?"
- "Donne-moi les prochains horaires de la ligne 6 à l'arrêt Corvisart direction Charles de Gaulle Etoile"
- "Barbès ligne 4 direction Montrouge"

Launch app.js (command line : node app.js), open a browser and go to http://localhost:8000 to execute the server callback.

After that, you can see the schedules in your terminal
