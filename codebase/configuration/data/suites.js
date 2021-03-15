module.exports = {
    // Regression
    regression: [
        './codebase/tests/regression/*.ts',
        './codebase/tests/regression/*/*.ts',
        './codebase/tests/regression/*/*/*.ts',
        './codebase/tests/regression/*/*/*/*.ts',
        './codebase/tests/regression/*/*/*/*/*.ts'
    ],
    cp: [
        './codebase/tests/regression/docketingPortal/collaborationPortal/*.ts',
        './codebase/tests/regression/docketingPortal/collaborationPortal/*/*.ts',
        './codebase/tests/regression/docketingPortal/collaborationPortal/*/*/*.ts',
    ],
    cb: [
        './codebase/tests/regression/docketingPortal/criteriaBuilder/*.ts',
    ],
    def: [
        './codebase/tests/regression/docketingPortal/dataEntryForm/*.ts',
    ],
    ch: [
        './codebase/tests/regression/docketingPortal/dataEntryForm/childs/*.ts',
    ],
    qlr: [
        './codebase/tests/regression/docketingPortal/queryList&Results/*.ts',
        './codebase/tests/regression/docketingPortal/queryList&Results/*/*.ts',
    ],
    gs: [
        './codebase/tests/regression/docketingPortal/globalSearch/*.ts',
        './codebase/tests/regression/docketingPortal/globalSearch/*/*.ts',
    ],
    up: [
        './codebase/tests/regression/docketingPortal/userPreferences/*.ts',
        './codebase/tests/regression/docketingPortal/userPreferences/*/*.ts',
    ],

    // Smoke
    smoke: ['./codebase/tests/smoke/*.ts', './codebase/tests/smoke/*/*.ts'],
    docketing: ['./codebase/tests/smoke/docketingPortal/*.ts'],
    administration: ['./codebase/tests/smoke/administration/*.ts'],
    iprules: ['./codebase/tests/smoke/iprules/*.ts'],

    compose(suiteStr) {
        const suite = suiteStr.split('/').reduce((array, part) => {
            return [...array, ...this[part]];
        }, []);
        console.log(suite);
        console.log();
        return suite;
    }
};
