import { CustomLogger } from '../../support/utils/log';
import {Options} from '../../interfaces';
const sql = require('mssql');
declare const globalConfig: any;

const databaseService = {
    name: 'DatabaseService',

    connection: null,

    async connect() {
        try {
            this.connection = await sql.connect(globalConfig.database);
            CustomLogger.logger.log('method', 'Connection to the database was successfully completed.');
        } catch (err) {
            CustomLogger.logger.log('WARN', `Connection to the database failed with error: '${err}'.`);
            throw Error(err);
        }
    },

    async close() {
        try {
            await sql.close();
            this.connection = null;
            CustomLogger.logger.log('method', 'Connection to the database was successfully closed.');
        } catch (err) {
            CustomLogger.logger.log('WARN', `The connection to the database wasn't closed due to error: '${err}'`);
        }
    },

    async executeDatabaseQuery(stringQuery: string, options: Options = {closeConnection: true}) {
        options.closeConnection = options.closeConnection === undefined ? true : options.closeConnection;
        try {
            if (!this.connection) {
                await this.connect();
            }
            const result = await this.connection.request().query(stringQuery);
            CustomLogger.logger.log('method', 'The query was successfully executed on database.');
            if (options.closeConnection) {
                await this.close();
            }
            return result;
        } catch (err) {
            CustomLogger.logger.log('WARN', 'The query failed to be executed on database.');
            if (options.closeConnection) {
                await this.close();
            }
            throw Error(err);
        }
    }
};

export default databaseService;
