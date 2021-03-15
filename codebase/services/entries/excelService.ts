import { CustomLogger } from '../../support/utils/log';
import * as Excel from 'exceljs';
declare const globalConfig: any;

const excelService = {
    name: 'ExcelService',

    async getWorksheet(fileAddress, worksheetName) {
        try {
            let workbook = new Excel.Workbook();
            await workbook.xlsx.readFile(fileAddress);
            CustomLogger.logger.log('method', `Reading of the excel file ${fileAddress} is successfuly completed.`);
            return workbook.getWorksheet(worksheetName);
        } catch (err) {
            CustomLogger.logger.log('WARN', `The reading of the file ${fileAddress} failed due to error: ${err}.`);
            return null;
        }
    }
};

export default excelService;
