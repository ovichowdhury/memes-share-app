*App Stack </br>
Node.js </br>
Typescript </br>
Postgres </br>
TypeORM </br>

*Folder structure </br>
api => All the source code for API </br>
api -> src => src without config </br>
api -> src -> app.js => Starting point of application </br>
api -> src -> routes => All the routes to handle api request </br>
api -> src -> middlewares => auth and exception handling middleware </br>
api -> src -> config => app config handle </br>
api -> src -> services => place for service layer (code merged in routes for time) </br>
api -> src -> entity => Typeorm entity folder </br>

*For Starting the app go to api folder </br>
npm i </br>
npm run start:dev</br>

for production start </br>
npm run build </br>
npm start </br>

