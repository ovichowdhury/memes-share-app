import fs from 'fs';
import path from 'path';


const configPath = path.resolve(__dirname + '/../../appconfig.json');
export const appConf: any = JSON.parse(fs.readFileSync(configPath, 'utf-8'));


export function getPort() {
    return Number(appConf.PORT) || 3000;
}

export function getDatabaseType() {
    return appConf.DB_TYPE || "postgres";
}



