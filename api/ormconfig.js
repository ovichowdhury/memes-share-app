const fs = require('fs');


function getOrmConfig() {

    let appConf = fs.readFileSync('./appconfig.json', 'utf-8');

    appConf = JSON.parse(appConf);

    const nodeEnv = appConf.NODE_ENV || "prod";

    // conf for  database

    let ormConf = {
        "type": appConf.DB_TYPE,
        "host": appConf.DB_HOST,
        "port": appConf.DB_PORT,
        "username": appConf.DB_USERNAME,
        "password": appConf.DB_PASSWORD,
        "database": appConf.DB_NAME,
        "entities": [
            __dirname + "/dist/entity/**/*.entity.js"
        ],
        "migrations": ["migration/*.js"],
        "cli": {
            "migrationsDir": "migration"
        },
        "logging": false,
        "synchronize": false
    }

    if (nodeEnv === "dev") {
        ormConf.entities[0] = __dirname + "/src/entity/**/*.entity.ts";
        // ormConf.logging = true;
        ormConf.synchronize = true;
    }

    return ormConf;

}

module.exports = getOrmConfig();
