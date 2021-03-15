import { CustomLogger } from '../../support/utils/log';
import * as fs from 'fs';
import time from './timeService';
const findFiles = require('file-regex/dist/index');
const del = require('del');
const path = require('path');

const osService = {
    name: 'OsService',

    async removeDownloads(files: string[]) {
        for (let file of files) {
            try {
                await del(`${process.env.USERPROFILE}\\Downloads\\${file}`, {force: true});
                CustomLogger.logger.log('method', `File '${file}' is deleted successfully`);
            } catch (err) {
                CustomLogger.logger.log('method', `There are no file '${file}' in the default download directory`);
            }
        }
    },

    async removeFilesInFolder(folderPath: string, files: string[]) {
        for (let file of files) {
            try {
                await del(`${folderPath}\\${file}`, {force: true});
                CustomLogger.logger.log('method', `File '${file}' is deleted successfully`);
            } catch (err) {
                CustomLogger.logger.log('method', `There are no file '${file}' in the default download directory`);
            }
        }
    },

    createFile(filePath: string, content: string = '') {
        fs.writeFileSync(filePath, content);
        CustomLogger.logger.log('method', `File '${filePath}' was created successfully`);
    },

    readFile(filePath: string, encoding: string = 'UTF8') {
        return fs.readFileSync(filePath, encoding);
    },

    async waitForFileExists(file): Promise<boolean> {
        try {
            const state = await time.wait(async () => {
                const filesDwl = await findFiles(`${process.env.USERPROFILE}\\Downloads`, file);
                // const filesDoc = await findFiles(`${process.env.USERPROFILE}\\Documents`, file);
                return filesDwl.length > 0;
            }, {timeout: 20000});
            CustomLogger.logger.log('method', `File '${file}' ${state ? 'exists' : 'doesn\'t exist'}`);
            return state;
        } catch (err) {
            CustomLogger.logger.log('WARN', `Something went wrong with finding ${file}`);
            return false;
        }
    },

    path
};

export default osService;
