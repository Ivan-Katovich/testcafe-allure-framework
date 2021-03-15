import infrastructureService from '../services/entries/infrastructureService';

const memory = (function() {
    const defaultMemory = {
        id: null,
        createRecordData: null,
        additionalRecordData: null,
        contentGroupId: null,
        query: null,
        url: null,
        array: null,
        ids: [],
        names: [],
        props: [],
        respData: null,
        dataArray: [],
        actionBox: null,
        recordFirstColumnValue: null,
        recordName: null,
        recordsCount: null,
        recordsArray: [],
        masterId: null,
        ruleTypeId: null,
        number: null,
        exportName: null
    };
    const permanentMemory = {
        permanent: {
            contentGroupId: null
        }
    };
    return {
        current: {...infrastructureService.clone(defaultMemory), ...permanentMemory},
        reset() {
            this.current = {...infrastructureService.clone(defaultMemory), ...permanentMemory};
        }
    };
})();

export default memory;
