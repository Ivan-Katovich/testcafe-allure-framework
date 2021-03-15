import app from '../../../../../app';
import { t } from 'testcafe';
declare const globalConfig: any;
declare const fixture: any;

fixture `REGRESSION.collaborationPortal.pack. - Test ID 30585: Verify_Process tasks in collaboration portal dashboard.`
    // .only
    // .skip
    // .disablePageReloads
    .meta('category', 'Single Thread')
    .before(async () => {
        await app.step('Set Default state of the User and CG (API)', async () => {
            await app.api.login();
            await app.setDefaults();
        });
        await app.step(`Create new process (API)`, async () => {
            const designer = app.api.administration.processDesigner;
            await designer.createNew();
            await designer.setName(data.processes.levels.matter.name);
            await designer.setIPType(data.ipType);
            await designer.setOwner(globalConfig.user.contentGroup);
            await designer.setCollaborationLevel(data.processes.levels.matter.level);
            await designer.setQueryFormat(data.processes.levels.matter.query);
            await designer.setContentGroups(globalConfig.user.contentGroup);
            await designer.save();
            data.processes.levels.matter.id = designer.getID();
        });
        await app.step('Add task to created process (API)', async () => {
            const designer = app.api.administration.processDesigner;
            await designer.processBlueprint();
            designer.blueprint.addTask();
            designer.blueprint.setTaskName(data.processes.levels.matter.task.name);
            await designer.blueprint.setTaskType(data.processes.levels.matter.task.type);
            await designer.blueprint.setResource(data.processes.levels.matter.task.resourceType);
            await designer.blueprint.setContentGroups(globalConfig.user.contentGroup);
            await designer.blueprint.save();
        });
        await app.step('Make created process active (API)', async () => {
            const designer = app.api.administration.processDesigner;
            await designer.open(data.processes.levels.matter.name);
            designer.setActive(true);
            await designer.save();
        });
    })
    .after(async () => {
        await app.step('Delete process (API)', async () => {
            const designer = app.api.administration.processDesigner;
            await designer.deleteProcesses([data.processes.levels.matter.id]);
        });
    });

const data = {
    ipType: 'PatentMasters',
    queryCategory: 'Patent',
    processes: {
        levels: {
            matter: {
                name: 'TA Matter ' + app.services.time.timestampShort(),
                longName: 'TA Process long name ' + app.services.random.str(100),
                longDescription: 'TA Description long name ' + app.services.random.str(100),
                task: {
                    name: 'RM', type: 'Record Management', resourceType: 'TA DEF for Patent'
                },
                query: 'TA PA All Cases',
                level: 'Matter',
                recordCount: 10,
                id: 0
            },
            action: {
                name: 'TA Action ' + app.services.time.timestampShort(),
                task: {
                    name: 'Query', type: 'Query', resourceType: 'PA All Actions'
                },
                task2: {
                    name: 'RM', type: 'Record Management', resourceType: 'TA DEF for Patent'
                },
                query: 'TA PA All Actions',
                level: 'Action',
                id: 0
            },
            portfolio: {
                name: 'TA Portfolio ' + app.services.time.timestampShort(),
                task: {
                    name: 'Portfolio Task', type: 'Portfolio Email',
                    resource: 'Daily Docket Distribution'
                },
                level: 'Portfolio',
                id: 0
            }
        },
        order: {
            process1: { name: 'A', recordCount: 5, priority: 5, id: 0 },
            process2: { name: 'B', recordCount: 10, priority: 1, id: 0 },
            process3: { name: 'C', recordCount: 15, priority: 7, id: 0 }
        }
    }
};

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step('Set long name and description to process (API)', async () => {
            const designer = app.api.administration.processDesigner;
            await designer.open(data.processes.levels.matter.name);
            await designer.setName(data.processes.levels.matter.longName);
            await designer.setDescription(data.processes.levels.matter.longDescription);
            await designer.save();
        });
    })
    ('Verify tooltip for process (Step 4)', async () => {
        await app.step('Go to Collaboration Portal', async () => {
            await app.ui.getRole(undefined, '/UI/collaboration');
            await app.ui.waitLoading();
        });
        await app.step('Verify process name tooltip', async () => {
            const process = app.ui.collaborationBoard.getProcess(data.processes.levels.matter.longName);
            await process.hover('processName');
            await t
                .expect(await app.ui.kendoPopup.getText('tooltip')).eql(data.processes.levels.matter.longName);
        });
        await app.step('Verify process description tooltip', async () => {
            await app.ui.header.hover('mainLogo');
            const process = app.ui.collaborationBoard.getProcess(data.processes.levels.matter.longName);
            await process.hover('description');
            await t
                .expect(await app.ui.kendoPopup.getText('tooltip')).eql(data.processes.levels.matter.longDescription);
        });
    })
    .after(async () => {
        await app.step('Set previous name and description to process (API)', async () => {
            const designer = app.api.administration.processDesigner;
            await designer.open(data.processes.levels.matter.longName);
            await designer.setName(data.processes.levels.matter.name);
            await designer.setDescription('');
            await designer.save();
        });
    });

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step('Add records to collaboration task (API)', async () => {
            await app.api.query.runQuery(data.queryCategory + '>' + data.processes.levels.matter.query);
            await app.api.query.collaborateRecords(data.processes.levels.matter.name, data.processes.levels.matter.recordCount);
        });
    })
    ('Verify Collaboration Portal dashboard (Step 4)', async () => {
        await app.step('Go to Collaboration Portal', async () => {
            await app.ui.getRole(undefined, '/UI/collaboration');
            await app.ui.waitLoading();
        });
        await app.step('Verify process and task on dashboard', async () => {
            const processes = await app.ui.collaborationBoard.getProcessArray();
            const process = app.ui.collaborationBoard.getProcess(data.processes.levels.matter.name);
            const task = process.getTask(0);
            await t
                .expect(await app.ui.collaborationBoard.getGroupTotal('Processes')).eql(await app.ui.collaborationBoard.getCount('processes'))
                .expect(processes.filter((x) => x === data.processes.levels.matter.name).length).eql(1)
                .expect(await process.getText('processName')).eql(data.processes.levels.matter.name)
                .expect(await process.getTaskCount()).eql(1)
                .expect(await task.getText('taskName')).eql(data.processes.levels.matter.task.name)
                .expect(Number(await task.getText('recordCount'))).eql(data.processes.levels.matter.recordCount);
        });
    })
    .after(async () => {
        await app.step('Remove all records from collaboration task (API)', async () => {
            await app.api.collaboration.executeTask(data.processes.levels.matter.name, data.processes.levels.matter.task.name);
            await app.api.collaboration.removeAllRecords();
        });
    });

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step('Duplicate process (API)', async () => {
            const designer = app.api.administration.processDesigner;
            await designer.open(data.processes.levels.matter.name);
            await designer.duplicate();
            await designer.setName(data.processes.order.process1.name);
            designer.setActive(true);
            await designer.save();
            data.processes.order.process1.id = designer.getID();

            await designer.duplicate();
            await designer.setName(data.processes.order.process2.name);
            designer.setActive(true);
            await designer.save();
            data.processes.order.process2.id = designer.getID();

            await designer.duplicate();
            await designer.setName(data.processes.order.process3.name);
            designer.setActive(true);
            await designer.save();
            data.processes.order.process3.id = designer.getID();
        });
    })
    ('Verify process order on dashboard (Step 5-6)', async (t) => {
        await app.step('Add same number of records to process (API)', async () => {
            await app.api.query.runQuery(data.queryCategory + '>' + data.processes.levels.matter.query);
            await app.api.query.collaborateRecords(data.processes.order.process1.name, 10);
            await app.api.query.collaborateRecords(data.processes.order.process2.name, 10);
            await app.api.query.collaborateRecords(data.processes.order.process3.name, 10);
        });
        await app.step('Go to Collaboration Portal', async () => {
            await app.ui.getRole(undefined, '/UI/collaboration');
            await app.ui.waitLoading();
        });
        await app.step('Verify process order: same number of records and priority', async () => {
            const expectedProcessOrder = [ data.processes.order.process1, data.processes.order.process2, data.processes.order.process3 ]
                .map((x) => x.name)
                .sort(app.services.sorting.appSortAlphabetically);
            const processes = await app.ui.collaborationBoard.getProcessArray();
            const actualProcessOrder = processes
                .filter((x) => expectedProcessOrder.includes(x));

            await t
                .expect(expectedProcessOrder).eql(actualProcessOrder);
        });
        await app.step('Remove all records from collaboration task (API)', async () => {
            await app.api.collaboration.executeTask(data.processes.order.process1.name, data.processes.levels.matter.task.name);
            await app.api.collaboration.removeAllRecords();
            await app.api.collaboration.executeTask(data.processes.order.process2.name, data.processes.levels.matter.task.name);
            await app.api.collaboration.removeAllRecords();
            await app.api.collaboration.executeTask(data.processes.order.process3.name, data.processes.levels.matter.task.name);
            await app.api.collaboration.removeAllRecords();
        });
        await app.step('Add different number of records to process (API)', async () => {
            await app.api.query.runQuery(data.queryCategory + '>' + data.processes.levels.matter.query);
            await app.api.query.collaborateRecords(data.processes.order.process1.name, data.processes.order.process1.recordCount);
            await app.api.query.collaborateRecords(data.processes.order.process2.name, data.processes.order.process2.recordCount);
            await app.api.query.collaborateRecords(data.processes.order.process3.name, data.processes.order.process3.recordCount);
        });
        await app.step('Verify process order: different number of records, same priority', async () => {
            await app.ui.refresh();
            const expectedProcessOrder = [ data.processes.order.process1, data.processes.order.process2, data.processes.order.process3 ]
                .sort((a, b) => a.recordCount > b.recordCount ? -1 : 1)
                .map((x) => x.name);
            const processes = await app.ui.collaborationBoard.getProcessArray();
            const actualProcessOrder = processes
                .filter((x) => expectedProcessOrder.includes(x));

            await t
                .expect(expectedProcessOrder).eql(actualProcessOrder);
        });
        await app.step('Remove all records from collaboration task (API)', async () => {
            await app.api.collaboration.executeTask(data.processes.order.process1.name, data.processes.levels.matter.task.name);
            await app.api.collaboration.removeAllRecords();
            await app.api.collaboration.executeTask(data.processes.order.process2.name, data.processes.levels.matter.task.name);
            await app.api.collaboration.removeAllRecords();
            await app.api.collaboration.executeTask(data.processes.order.process3.name, data.processes.levels.matter.task.name);
            await app.api.collaboration.removeAllRecords();
        });
        await app.step('Add different number of records to process (API)', async () => {
            await app.api.query.runQuery(data.queryCategory + '>' + data.processes.levels.matter.query);
            await app.api.query.collaborateRecords(data.processes.order.process1.name, data.processes.order.process1.recordCount);
            await app.api.query.collaborateRecords(data.processes.order.process2.name, data.processes.order.process2.recordCount);
            await app.api.query.collaborateRecords(data.processes.order.process3.name, data.processes.order.process3.recordCount);
        });
        await app.step('Set different priorities to processes (API)', async () => {
            const designer = app.api.administration.processDesigner;
            await designer.open(data.processes.order.process1.name);
            designer.setPriority(data.processes.order.process1.priority);
            await designer.save();

            await designer.open(data.processes.order.process2.name);
            designer.setPriority(data.processes.order.process2.priority);
            await designer.save();

            await designer.open(data.processes.order.process3.name);
            designer.setPriority(data.processes.order.process3.priority);
            await designer.save();
        });
        await app.step('Verify process order: different number of records and priority', async () => {
            await app.ui.refresh();
            const expectedProcessOrder = [ data.processes.order.process1, data.processes.order.process2, data.processes.order.process3 ]
                .sort((a, b) => a.priority > b.priority ? 1 :
                    (a.priority === b.priority ? (a.recordCount > b.recordCount ? -1 : 1) : -1))
                .map((x) => x.name);
            const processes = await app.ui.collaborationBoard.getProcessArray();
            const actualProcessOrder = processes
                .filter((x) => expectedProcessOrder.includes(x));

            await t
                .expect(expectedProcessOrder).eql(actualProcessOrder);
        });
    })
    .after(async () => {
        await app.step('Remove all records from collaboration task (API)', async () => {
            await app.api.collaboration.executeTask(data.processes.order.process1.name, data.processes.levels.matter.task.name);
            await app.api.collaboration.removeAllRecords();
            await app.api.collaboration.executeTask(data.processes.order.process2.name, data.processes.levels.matter.task.name);
            await app.api.collaboration.removeAllRecords();
            await app.api.collaboration.executeTask(data.processes.order.process3.name, data.processes.levels.matter.task.name);
            await app.api.collaboration.removeAllRecords();
        });
        await app.step('Delete created processes (API)', async () => {
            await app.api.administration.processDesigner.deleteProcesses([ data.processes.order.process1.id, data.processes.order.process2.id, data.processes.order.process3.id ]);
        });
    });

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step(`Create a new Action process (API)`, async () => {
            const designer = app.api.administration.processDesigner;
            await designer.createNew();
            await designer.setName(data.processes.levels.action.name);
            await designer.setIPType(data.ipType);
            await designer.setOwner(globalConfig.user.contentGroup);
            await designer.setCollaborationLevel(data.processes.levels.action.level);
            await designer.setQueryFormat(data.processes.levels.action.query);
            await designer.setContentGroups(globalConfig.user.contentGroup);
            await designer.save();

            await designer.processBlueprint();
            designer.blueprint.addTask();
            designer.blueprint.setTaskName(data.processes.levels.action.task.name);
            await designer.blueprint.setTaskType(data.processes.levels.action.task.type);
            await designer.blueprint.setResource(data.processes.levels.action.query);

            designer.blueprint.addTask();
            designer.blueprint.setTaskName(data.processes.levels.action.task2.name);
            await designer.blueprint.setTaskType(data.processes.levels.action.task2.type);
            await designer.blueprint.setResource(data.processes.levels.action.task2.resourceType);
            await designer.blueprint.setContentGroups(globalConfig.user.contentGroup);

            designer.blueprint.selectTask(data.processes.levels.action.task.name);
            designer.blueprint.setGoToTask(data.processes.levels.action.task2.name);
            await designer.blueprint.save();

            await designer.open(data.processes.levels.action.name);
            designer.setActive(true);
            await designer.save();
            data.processes.levels.action.id = designer.getID();
        });
        await app.step(`Create a new Portfolio process (API)`, async () => {
            const designer = app.api.administration.processDesigner;
            await designer.createNew();
            await designer.setName(data.processes.levels.portfolio.name);
            await designer.setIPType(data.ipType);
            await designer.setOwner(globalConfig.user.contentGroup);
            await designer.setCollaborationLevel(data.processes.levels.portfolio.level);
            await designer.setContentGroups(globalConfig.user.contentGroup);
            await designer.save();

            await designer.processBlueprint();
            designer.blueprint.addTask();
            designer.blueprint.setTaskName(data.processes.levels.portfolio.task.name);
            await designer.blueprint.setTaskType(data.processes.levels.portfolio.task.type);
            await designer.blueprint.setResource(data.processes.levels.portfolio.task.resource);
            await designer.blueprint.setContentGroups(globalConfig.user.contentGroup);
            await designer.blueprint.save();

            await designer.open(data.processes.levels.portfolio.name);
            designer.setActive(true);
            await designer.save();
            data.processes.levels.portfolio.id = designer.getID();
        });
    })
    ('Verify processes with different levels on dashboard (Step 7)', async () => {
        await app.step('Go to Collaboration Portal', async () => {
            await app.ui.getRole(undefined, '/UI/collaboration');
            await app.ui.waitLoading();
        });
        await app.step('Verify processes on dashboard', async () => {
            const processes = await app.ui.collaborationBoard.getProcessArray();
            await t
                .expect(processes.includes(data.processes.levels.matter.name)).ok()
                .expect(processes.includes(data.processes.levels.action.name)).ok()
                .expect(processes.includes(data.processes.levels.portfolio.name)).notOk();
        });
    })
    .after(async () => {
        await app.step('Delete process (API)', async () => {
            const designer = app.api.administration.processDesigner;
            await designer.deleteProcesses([ data.processes.levels.action.id, data.processes.levels.portfolio.id ]);
        });
    });
