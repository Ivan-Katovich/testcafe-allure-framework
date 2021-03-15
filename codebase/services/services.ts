import timeService from './entries/timeService';
import infrastructureService from './entries/infrastructureService';
import osService from './entries/osService';
import sortingService from './entries/sortingService';
import randomService from './entries/randomService';
import excelService from './entries/excelService';
import databaseService from './entries/databaseService';
import numericService from './entries/numericService';
import modifierService from './entries/modifierService';
import arrayService from './entries/arrayService';
import regexService from './entries/regexService';
import cultureService from './entries/cultureService';
import nodeService from './entries/nodeService';

export default class Services {
    public name = 'Services';

    // Getters
    public time = timeService;
    public infra = infrastructureService;
    public db = databaseService;
    public os = osService;
    public sorting = sortingService;
    public random = randomService;
    public excel = excelService;
    public num = numericService;
    public modifiers = modifierService;
    public array = arrayService;
    public regex = regexService;
    public culture = cultureService;
    public node = nodeService;
}
