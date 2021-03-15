import app from '../../../../../app';

fixture `REGRESSION.collaborationPortal.pack. - Test ID 30654: Verify_Submit, Return and Remove functionality on Email and FL preview`
    // .only
    // .skip
    .meta('category', 'Single Thread')
    .before(async () => {
        await app.step('Set Default state of the User and CG (API)', async () => {
            await app.api.login();
            await app.setDefaults();
        });
    })
    .after(async () => {
        await app.step('Set a schedule for Action process (API)', async () => {
            const designer = app.api.administration.processDesigner;
            await designer.open(data.action.email.process);
            designer.setDateTime(app.services.time.moment().add(5, 'minutes'));
            await designer.save();
            await designer.open(data.action.formLetter.process);
            designer.setDateTime(app.services.time.moment().add(5, 'minutes'));
            await designer.save();
        });
    });

const data = {
    matter: {
        category: 'Patent',
        query: 'TA PA All Cases',
        email: {
            process: 'TA Matter Process Email (Patent)',
            tasks: {
                emailTask: 'Email',
                previousTask: 'RM',
                nextTask: 'RM2'
            },
            masterIdColumnName: 'PATENTMASTERID'
        },
        formLetter: {
            process: 'TA Matter Process FL (Patent)',
            tasks: {
                flTask: 'FL',
                previousTask: 'RM',
                nextTask: 'RM2'
            },
            masterIdColumnName: 'PATENTMASTERID'
        }
    },
    action: {
        category: 'Trademark',
        query: 'TA TM All Actions',
        email: {
            process: 'TA Action Process Email (Trademark)',
            tasks: {
                emailTask: 'Email',
                previousTask: 'RM',
                nextTask: 'RM2'
            },
            masterIdColumnName: 'Trademarks_TRADEMARKMASTERID',
            childIdColumnName: 'TRADEMARKACTIONID'
        },
        formLetter: {
            process: 'TA Action Process FL (Trademark)',
            tasks: {
                flTask: 'FL',
                previousTask: 'RM',
                nextTask: 'RM2'
            },
            masterIdColumnName: 'Trademarks_TRADEMARKMASTERID',
            childIdColumnName: 'TRADEMARKACTIONID'
        }
    }
};

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step('Create records (API)', async () => {
            app.memory.current.recordsArray = [
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple')
            ];
        });
        await app.step('Add records to the Records Management task and submit (API)', async () => {
            await app.api.login();
            await app.api.query.runQuery(data.matter.category + '>' + data.matter.query);
            await app.api.query.collaborateRecordsWithIds(data.matter.email.process, app.memory.current.recordsArray.map((x) => x.respData.Record.MasterId));
            await app.api.collaboration.executeTask(data.matter.email.process, data.matter.email.tasks.previousTask);
            await app.api.collaboration.submitAllRecords();
        });
    })
    ('Verify Remove on the Email modal for Matter process (Step 1-6, 12)', async (t: TestController) => {
        await app.step('Open Collaboration Portal (Step 2)', async () => {
            await app.ui.getRole(undefined, '/UI/collaboration');
            await app.ui.waitLoading();
        });
        await app.step('Open the Email task', async () => {
            const process = app.ui.collaborationBoard.getProcess(data.matter.email.process);
            const task = process.getTask(data.matter.email.tasks.emailTask);
            await task.open();
            await app.ui.waitLoading();
        });
        await app.step('Select records and click Open (Step 3)', async () => {
            const query = app.ui.queryBoard.queryResultsGrid;
            await query.getCheckbox(0).check();
            await query.getCheckbox(1).check();
            await query.getCheckbox(2).check();
            await app.ui.queryBoard.click('menuItems', 'Open');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.emailModal.isVisible()).ok();
        });
        await app.step('Verify the Remove button (Step 4)', async () => {
            await app.ui.emailModal.click('taskControls');
            await t
                .expect(await app.ui.kendoPopup.isEnabled('simpleItems', 'Remove')).ok();
        });
        await app.step('Click the Remove button (Step 5)', async () => {
            await app.ui.kendoPopup.selectItem('Remove');
            await t
                .expect(await app.ui.confirmationModal.isVisible()).ok()
                .expect(await app.ui.confirmationModal.getText('confirmationMessage')).eql('Are you sure you want to remove the selected record(s) from the process?')
                .expect(await app.ui.confirmationModal.isVisible('buttons', 'Yes')).ok()
                .expect(await app.ui.confirmationModal.isVisible('buttons', 'Cancel')).ok();
        });
        await app.step('Click "Yes" on the Confirmation modal (Step 6)', async () => {
            const recordBefore = await app.ui.emailModal.getText('title', 0, { asDisplayed: true });
            const previewListBefore = await app.ui.emailModal.getPreviewListItems();
            const nextRecord = previewListBefore[previewListBefore.indexOf(recordBefore) + 1];
            await app.ui.confirmationModal.click('buttons', 'Yes');
            await app.ui.waitLoading();
            const previewListAfter = await app.ui.emailModal.getPreviewListItems();
            const recordAfter = await app.ui.emailModal.getText('title', 0, { asDisplayed: true });

            await t
                .expect(await app.ui.emailModal.isVisible()).ok()
                .expect(previewListAfter).eql(app.services.array.removeFirstOccurance(previewListBefore, recordBefore))
                .expect(await app.ui.emailModal.getSelectedRecord()).eql(nextRecord)
                .expect(recordAfter).eql(nextRecord);
        });
        await app.step('Click "Cancel" on the Confirmation modal (Step 12)', async () => {
            const recordBefore = await app.ui.emailModal.getText('title', 0, { asDisplayed: true });
            const previewListBefore = await app.ui.emailModal.getPreviewListItems();
            await app.ui.emailModal.click('taskControls');
            await app.ui.kendoPopup.selectItem('Remove');
            await app.ui.confirmationModal.cancel();
            await app.ui.waitLoading();
            const previewListAfter = await app.ui.emailModal.getPreviewListItems();
            const recordAfter = await app.ui.emailModal.getText('title', 0, { asDisplayed: true });

            await t
                .expect(await app.ui.confirmationModal.waitTillElementNotPresent()).ok()
                .expect(recordBefore).eql(recordAfter)
                .expect(previewListBefore).eql(previewListAfter);
        });
    })
    .after(async () => {
        await app.step('Remove all records from tasks (API)', async () => {
            try {
                await app.api.collaboration.executeTask(data.matter.email.process, data.matter.email.tasks.previousTask);
                await app.api.collaboration.removeAllRecords();
                await app.api.collaboration.executeTask(data.matter.email.process, data.matter.email.tasks.emailTask);
                await app.api.collaboration.removeAllRecords();
                await app.api.collaboration.executeTask(data.matter.email.process, data.matter.email.tasks.nextTask);
                await app.api.collaboration.removeAllRecords();
            } catch (err) {}
        });
        await app.step('Remove created records (API)', async () => {
            await app.api.combinedFunctionality.deleteRecords(app.memory.current.recordsArray.map((x) => x.respData));
        });
    });

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step('Create records (API)', async () => {
            app.memory.current.recordsArray = [
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple')
            ];
        });
        await app.step('Add records to the Records Management task and submit (API)', async () => {
            await app.api.login();
            await app.api.query.runQuery(data.matter.category + '>' + data.matter.query);
            await app.api.query.collaborateRecordsWithIds(data.matter.email.process, app.memory.current.recordsArray.map((x) => x.respData.Record.MasterId));
            await app.api.collaboration.executeTask(data.matter.email.process, data.matter.email.tasks.previousTask);
            await app.api.collaboration.submitAllRecords();
        });
    })
    ('Verify Remove on the Email modal when one of the records is removed for Matter process (Step 7-9)', async (t: TestController) => {
        await app.step('Open Collaboration Portal', async () => {
            await app.ui.getRole(undefined, '/UI/collaboration');
            await app.ui.waitLoading();
        });
        await app.step('Open the Email task', async () => {
            const process = app.ui.collaborationBoard.getProcess(data.matter.email.process);
            const task = process.getTask(data.matter.email.tasks.emailTask);
            await task.open();
            await app.ui.waitLoading();
        });
        await app.step('Select 3 records and click Open (Step 7)', async () => {
            const query = app.ui.queryBoard;
            await query.queryResultsGrid.getCheckbox(0).check();
            await query.queryResultsGrid.getCheckbox(1).check();
            await query.queryResultsGrid.getCheckbox(2).check();
            await app.ui.queryBoard.click('menuItems', 'Open');
            await app.ui.waitLoading();
        });
        await app.step('Delete one of the selected records (API) (Step 8)', async () => {
            const recordId = await (await app.ui.queryBoard.queryResultsGrid.getRecord(1)).getValue(data.matter.email.masterIdColumnName);
            await app.api.collaboration.executeTask(data.matter.email.process, data.matter.email.tasks.emailTask);
            await app.api.collaboration.removeRecords([ recordId ]);
        });
        await app.step('Select Remove from Task Controls on the Email modal (Step 9)', async () => {
            await app.ui.emailModal.click('taskControls');
            await app.ui.kendoPopup.selectItem('Remove');
            await app.ui.confirmationModal.confirm();
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.emailModal.getText('errorContainer', 0, { asDisplayed: true })).eql(
                    'Attention\n' +
                    'One or more selected record(s) no longer resides at the current task due to:\n' +
                    ' Record deletion\n' +
                    ' Submission\n' +
                    ' Return by another user\n' +
                    ' Task delegation\n' +
                    ' Task responsibility');
        });
    })
    .after(async () => {
        await app.step('Remove all records from tasks (API)', async () => {
            try {
                await app.api.collaboration.executeTask(data.matter.email.process, data.matter.email.tasks.previousTask);
                await app.api.collaboration.removeAllRecords();
                await app.api.collaboration.executeTask(data.matter.email.process, data.matter.email.tasks.emailTask);
                await app.api.collaboration.removeAllRecords();
                await app.api.collaboration.executeTask(data.matter.email.process, data.matter.email.tasks.nextTask);
                await app.api.collaboration.removeAllRecords();
            } catch (err) {}
        });
        await app.step('Remove created records (API)', async () => {
            await app.api.combinedFunctionality.deleteRecords(app.memory.current.recordsArray.map((x) => x.respData));
        });
    });

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step('Create records (API)', async () => {
            app.memory.current.recordsArray = [
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple')
            ];
        });
        await app.step('Add records to the Records Management task and submit (API)', async () => {
            await app.api.login();
            await app.api.query.runQuery(data.matter.category + '>' + data.matter.query);
            await app.api.query.collaborateRecordsWithIds(data.matter.email.process, app.memory.current.recordsArray.map((x) => x.respData.Record.MasterId));
            await app.api.collaboration.executeTask(data.matter.email.process, data.matter.email.tasks.previousTask);
            await app.api.collaboration.submitAllRecords();
        });
    })
    ('Verify Remove in the task when one of the records is removed for Matter process (Step 10)', async (t: TestController) => {
        await app.step('Open Collaboration Portal', async () => {
            await app.ui.getRole(undefined, '/UI/collaboration');
            await app.ui.waitLoading();
        });
        await app.step('Open the Email task', async () => {
            const process = app.ui.collaborationBoard.getProcess(data.matter.email.process);
            const task = process.getTask(data.matter.email.tasks.emailTask);
            await task.open();
            await app.ui.waitLoading();
        });
        await app.step('Delete one of the selected records (API)', async () => {
            const recordId = await (await app.ui.queryBoard.queryResultsGrid.getRecord(0)).getValue(data.matter.email.masterIdColumnName);
            await app.api.collaboration.executeTask(data.matter.email.process, data.matter.email.tasks.emailTask);
            await app.api.collaboration.removeRecords([ recordId ]);
        });
        await app.step('Select 3 records and click Open', async () => {
            const query = app.ui.queryBoard;
            await query.queryResultsGrid.getCheckbox(0).check();
            await query.queryResultsGrid.getCheckbox(1).check();
            await query.queryResultsGrid.getCheckbox(2).check();
            await app.ui.queryBoard.click('menuItems', 'Open');
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.emailModal.getText('errorContainer', 0, { asDisplayed: true })).eql(
                    'Attention\n' +
                    'One or more selected record(s) no longer resides at the current task due to:\n' +
                    ' Record deletion\n' +
                    ' Submission\n' +
                    ' Return by another user\n' +
                    ' Task delegation\n' +
                    ' Task responsibility');
        });
    })
    .after(async () => {
        await app.step('Remove all records from tasks (API)', async () => {
            try {
                await app.api.collaboration.executeTask(data.matter.email.process, data.matter.email.tasks.previousTask);
                await app.api.collaboration.removeAllRecords();
                await app.api.collaboration.executeTask(data.matter.email.process, data.matter.email.tasks.emailTask);
                await app.api.collaboration.removeAllRecords();
                await app.api.collaboration.executeTask(data.matter.email.process, data.matter.email.tasks.nextTask);
                await app.api.collaboration.removeAllRecords();
            } catch (err) {}
        });
        await app.step('Remove created records (API)', async () => {
            await app.api.combinedFunctionality.deleteRecords(app.memory.current.recordsArray.map((x) => x.respData));
        });
    });

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step('Create records (API)', async () => {
            app.memory.current.recordsArray = [
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple')
            ];
        });
        await app.step('Add records to the Records Management task and submit (API)', async () => {
            await app.api.login();
            await app.api.query.runQuery(data.matter.category + '>' + data.matter.query);
            await app.api.query.collaborateRecordsWithIds(data.matter.email.process, app.memory.current.recordsArray.map((x) => x.respData.Record.MasterId));
            await app.api.collaboration.executeTask(data.matter.email.process, data.matter.email.tasks.previousTask);
            await app.api.collaboration.submitAllRecords();
        });
    })
    ('Verify Delegate on the Email modal when all records are removed for Matter process (Step 11)', async (t: TestController) => {
        await app.step('Open Collaboration Portal', async () => {
            await app.ui.getRole(undefined, '/UI/collaboration');
            await app.ui.waitLoading();
        });
        await app.step('Open the Email task', async () => {
            const process = app.ui.collaborationBoard.getProcess(data.matter.email.process);
            const task = process.getTask(data.matter.email.tasks.emailTask);
            await task.open();
            await app.ui.waitLoading();
        });
        await app.step('Select 3 records and click Open', async () => {
            const query = app.ui.queryBoard;
            await query.queryResultsGrid.getCheckbox(0).check();
            await query.queryResultsGrid.getCheckbox(1).check();
            await query.queryResultsGrid.getCheckbox(2).check();
            await app.ui.queryBoard.click('menuItems', 'Open');
            await app.ui.waitLoading();
        });
        await app.step('Delete one of the selected records (API)', async () => {
            const recordIds = [
                await (await app.ui.queryBoard.queryResultsGrid.getRecord(0)).getValue(data.matter.email.masterIdColumnName),
                await (await app.ui.queryBoard.queryResultsGrid.getRecord(1)).getValue(data.matter.email.masterIdColumnName),
                await (await app.ui.queryBoard.queryResultsGrid.getRecord(2)).getValue(data.matter.email.masterIdColumnName)
            ];
            await app.api.collaboration.executeTask(data.matter.email.process, data.matter.email.tasks.emailTask);
            await app.api.collaboration.removeRecords(recordIds);
        });
        await app.step('Click Task Control -> Delegate', async () => {
            await app.ui.emailModal.click('taskControls');
            await app.ui.kendoPopup.selectItem('Delegate');
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.errorModal.getText('errorMessage', 0, { asDisplayed: true })).eql(
                    'One or more selected record(s) no longer resides at the current task due to:\n' +
                    'Record deletion\n' +
                    'Submission\n' +
                    'Return by another user\n' +
                    'Task delegation\n' +
                    'Task responsibility');
        });
    })
    .after(async () => {
        await app.step('Remove all records from tasks (API)', async () => {
            try {
                await app.api.collaboration.executeTask(data.matter.email.process, data.matter.email.tasks.previousTask);
                await app.api.collaboration.removeAllRecords();
                await app.api.collaboration.executeTask(data.matter.email.process, data.matter.email.tasks.emailTask);
                await app.api.collaboration.removeAllRecords();
                await app.api.collaboration.executeTask(data.matter.email.process, data.matter.email.tasks.nextTask);
                await app.api.collaboration.removeAllRecords();
            } catch (err) { }
        });
        await app.step('Remove created records (API)', async () => {
            await app.api.combinedFunctionality.deleteRecords(app.memory.current.recordsArray.map((x) => x.respData));
        });
    });

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step('Create records (API)', async () => {
            app.memory.current.recordsArray = [
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple')
            ];
        });
        await app.step('Add records to the Records Management task and submit (API)', async () => {
            await app.api.login();
            await app.api.query.runQuery(data.matter.category + '>' + data.matter.query);
            await app.api.query.collaborateRecordsWithIds(data.matter.email.process, app.memory.current.recordsArray.map((x) => x.respData.Record.MasterId));
            await app.api.collaboration.executeTask(data.matter.email.process, data.matter.email.tasks.previousTask);
            await app.api.collaboration.submitAllRecords();
        });
    })
    .requestHooks(app.ui.requestLogger.collaborationSubmit)
    ('Verify Submit on the Email modal for Matter process (Step 1-5)', async (t: TestController) => {
        await app.step('Open Collaboration Portal', async () => {
            await app.ui.getRole(undefined, '/UI/collaboration');
            await app.ui.waitLoading();
        });
        await app.step('Open the Email task', async () => {
            const process = app.ui.collaborationBoard.getProcess(data.matter.email.process);
            const task = process.getTask(data.matter.email.tasks.emailTask);
            await task.open();
        });
        await app.step('Select records and click Open (Step 3)', async () => {
            const query = app.ui.queryBoard.queryResultsGrid;
            await query.getCheckbox(0).check();
            await query.getCheckbox(1).check();
            await query.getCheckbox(2).check();
            await app.ui.queryBoard.click('menuItems', 'Open');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.emailModal.isVisible()).ok();
        });
        await app.step('Verify the Submit button (Step 4)', async () => {
            await app.ui.emailModal.click('taskControls');
            await t
                .expect(await app.ui.kendoPopup.isEnabled('simpleItems', 'Submit')).ok();
        });
        await app.step('Click the Submit button (Step 5)', async () => {
            const recordBefore = await app.ui.emailModal.getText('title', 0, { asDisplayed: true });
            const previewListBefore = await app.ui.emailModal.getPreviewListItems();
            const nextRecord = previewListBefore[previewListBefore.indexOf(recordBefore) + 1];
            await app.ui.kendoPopup.selectItem('Submit');
            await app.ui.waitLoading();
            const previewListAfter = await app.ui.emailModal.getPreviewListItems();
            const recordAfter = await app.ui.emailModal.getText('title', 0, { asDisplayed: true });

            await t
                .expect(await app.ui.emailModal.isVisible()).ok()
                .expect(previewListAfter).eql(app.services.array.removeFirstOccurance(previewListBefore, recordBefore))
                .expect(await app.ui.emailModal.getSelectedRecord()).eql(nextRecord)
                .expect(recordAfter).eql(nextRecord);
        });
        await app.step('Verify record is submitted (API)', async () => {
            const submittedRecordId = app.ui.getLastRequestBody('collaborationSubmit').selectedRecords[0].masterId;
            await app.api.collaboration.executeTask(data.matter.email.process, data.matter.email.tasks.nextTask);
            const ids = await app.api.collaboration.getRecordIdsFromResults();
            await t
                .expect(ids.includes(submittedRecordId.toString())).ok();
        });
    })
    .after(async () => {
        await app.step('Remove all records from tasks (API)', async () => {
            try {
                await app.api.collaboration.executeTask(data.matter.email.process, data.matter.email.tasks.previousTask);
                await app.api.collaboration.removeAllRecords();
                await app.api.collaboration.executeTask(data.matter.email.process, data.matter.email.tasks.emailTask);
                await app.api.collaboration.removeAllRecords();
                await app.api.collaboration.executeTask(data.matter.email.process, data.matter.email.tasks.nextTask);
                await app.api.collaboration.removeAllRecords();
            } catch (err) { }
        });
        await app.step('Remove created records (API)', async () => {
            await app.api.combinedFunctionality.deleteRecords(app.memory.current.recordsArray.map((x) => x.respData));
        });
    });

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step('Create records (API)', async () => {
            app.memory.current.recordsArray = [
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple')
            ];
        });
        await app.step('Add records to the Records Management task and submit (API)', async () => {
            await app.api.login();
            await app.api.query.runQuery(data.matter.category + '>' + data.matter.query);
            await app.api.query.collaborateRecordsWithIds(data.matter.email.process, app.memory.current.recordsArray.map((x) => x.respData.Record.MasterId));
            await app.api.collaboration.executeTask(data.matter.email.process, data.matter.email.tasks.previousTask);
            await app.api.collaboration.submitAllRecords();
        });
    })
    ('Verify Submit on the Email modal when one of the records is submitted (Step 7-9)', async (t: TestController) => {
        await app.step('Open Collaboration Portal', async () => {
            await app.ui.getRole(undefined, '/UI/collaboration');
            await app.ui.waitLoading();
        });
        await app.step('Open the Email task', async () => {
            const process = app.ui.collaborationBoard.getProcess(data.matter.email.process);
            const task = process.getTask(data.matter.email.tasks.emailTask);
            await task.open();
        });
        await app.step('Select 3 records and click Open (Step 7)', async () => {
            const query = app.ui.queryBoard;
            await query.queryResultsGrid.getCheckbox(0).check();
            await query.queryResultsGrid.getCheckbox(1).check();
            await query.queryResultsGrid.getCheckbox(2).check();
            await app.ui.queryBoard.click('menuItems', 'Open');
            await app.ui.waitLoading();
        });
        await app.step('Submit one of the selected records (API) (Step 8)', async () => {
            const recordId = await (await app.ui.queryBoard.queryResultsGrid.getRecord(1)).getValue(data.matter.email.masterIdColumnName);
            await app.api.collaboration.executeTask(data.matter.email.process, data.matter.email.tasks.emailTask);
            await app.api.collaboration.submitRecords([ recordId ]);
        });
        await app.step('Select Submit from Task Controls on the Email modal (Step 9)', async () => {
            await app.ui.emailModal.click('taskControls');
            await app.ui.kendoPopup.selectItem('Submit');
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.emailModal.getText('errorContainer', 0, { asDisplayed: true })).eql(
                    'Attention\n' +
                    'One or more selected record(s) no longer resides at the current task due to:\n' +
                    ' Record deletion\n' +
                    ' Submission\n' +
                    ' Return by another user\n' +
                    ' Task delegation\n' +
                    ' Task responsibility');
        });
    })
    .after(async () => {
        await app.step('Remove all records from tasks (API)', async () => {
            try {
                await app.api.collaboration.executeTask(data.matter.email.process, data.matter.email.tasks.previousTask);
                await app.api.collaboration.removeAllRecords();
                await app.api.collaboration.executeTask(data.matter.email.process, data.matter.email.tasks.emailTask);
                await app.api.collaboration.removeAllRecords();
                await app.api.collaboration.executeTask(data.matter.email.process, data.matter.email.tasks.nextTask);
                await app.api.collaboration.removeAllRecords();
            } catch (err) { }
        });
        await app.step('Remove created records (API)', async () => {
            await app.api.combinedFunctionality.deleteRecords(app.memory.current.recordsArray.map((x) => x.respData));
        });
    });

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step('Create records (API)', async () => {
            app.memory.current.recordsArray = [
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple')
            ];
        });
        await app.step('Add records to the Records Management task and submit (API)', async () => {
            await app.api.login();
            await app.api.query.runQuery(data.matter.category + '>' + data.matter.query);
            await app.api.query.collaborateRecordsWithIds(data.matter.email.process, app.memory.current.recordsArray.map((x) => x.respData.Record.MasterId));
            await app.api.collaboration.executeTask(data.matter.email.process, data.matter.email.tasks.previousTask);
            await app.api.collaboration.submitAllRecords();
        });
    })
    ('Verify Email modal in the task when one of the records is submited for Matter process (Step 10)', async (t: TestController) => {
        await app.step('Open Collaboration Portal', async () => {
            await app.ui.getRole(undefined, '/UI/collaboration');
            await app.ui.waitLoading();
        });
        await app.step('Open the Email task', async () => {
            const process = app.ui.collaborationBoard.getProcess(data.matter.email.process);
            const task = process.getTask(data.matter.email.tasks.emailTask);
            await task.open();
            await app.ui.waitLoading();
        });
        await app.step('Submit one of the selected records (API)', async () => {
            const recordId = await (await app.ui.queryBoard.queryResultsGrid.getRecord(0)).getValue(data.matter.email.masterIdColumnName);
            await app.api.collaboration.executeTask(data.matter.email.process, data.matter.email.tasks.emailTask);
            await app.api.collaboration.submitRecords([ recordId ]);
        });
        await app.step('Select 3 records and click Open', async () => {
            const query = app.ui.queryBoard;
            await query.queryResultsGrid.getCheckbox(0).check();
            await query.queryResultsGrid.getCheckbox(1).check();
            await query.queryResultsGrid.getCheckbox(2).check();
            await app.ui.queryBoard.click('menuItems', 'Open');
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.emailModal.getText('errorContainer', 0, { asDisplayed: true })).eql(
                    'Attention\n' +
                    'One or more selected record(s) no longer resides at the current task due to:\n' +
                    ' Record deletion\n' +
                    ' Submission\n' +
                    ' Return by another user\n' +
                    ' Task delegation\n' +
                    ' Task responsibility');
        });
    })
    .after(async () => {
        await app.step('Remove all records from tasks (API)', async () => {
            try {
                await app.api.collaboration.executeTask(data.matter.email.process, data.matter.email.tasks.previousTask);
                await app.api.collaboration.removeAllRecords();
                await app.api.collaboration.executeTask(data.matter.email.process, data.matter.email.tasks.emailTask);
                await app.api.collaboration.removeAllRecords();
                await app.api.collaboration.executeTask(data.matter.email.process, data.matter.email.tasks.nextTask);
                await app.api.collaboration.removeAllRecords();
            } catch (err) { }
        });
        await app.step('Remove created records (API)', async () => {
            await app.api.combinedFunctionality.deleteRecords(app.memory.current.recordsArray.map((x) => x.respData));
        });
    });

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step('Create records (API)', async () => {
            app.memory.current.recordsArray = [
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple')
            ];
        });
        await app.step('Add records to the Records Management task and submit (API)', async () => {
            await app.api.login();
            await app.api.query.runQuery(data.matter.category + '>' + data.matter.query);
            await app.api.query.collaborateRecordsWithIds(data.matter.email.process, app.memory.current.recordsArray.map((x) => x.respData.Record.MasterId));
            await app.api.collaboration.executeTask(data.matter.email.process, data.matter.email.tasks.previousTask);
            await app.api.collaboration.submitAllRecords();
        });
    })
    ('Verify Delegate on the Email modal when all records are submited for Matter process (Step 11)', async (t: TestController) => {
        await app.step('Open Collaboration Portal', async () => {
            await app.ui.getRole(undefined, '/UI/collaboration');
            await app.ui.waitLoading();
        });
        await app.step('Open the Email task', async () => {
            const process = app.ui.collaborationBoard.getProcess(data.matter.email.process);
            const task = process.getTask(data.matter.email.tasks.emailTask);
            await task.open();
            await app.ui.waitLoading();
        });
        await app.step('Select 3 records and click Open', async () => {
            const query = app.ui.queryBoard;
            await query.queryResultsGrid.getCheckbox(0).check();
            await query.queryResultsGrid.getCheckbox(1).check();
            await query.queryResultsGrid.getCheckbox(2).check();
            await app.ui.queryBoard.click('menuItems', 'Open');
            await app.ui.waitLoading();
        });
        await app.step('Submit all selected records (API)', async () => {
            const recordIds = [
                await (await app.ui.queryBoard.queryResultsGrid.getRecord(0)).getValue(data.matter.email.masterIdColumnName),
                await (await app.ui.queryBoard.queryResultsGrid.getRecord(1)).getValue(data.matter.email.masterIdColumnName),
                await (await app.ui.queryBoard.queryResultsGrid.getRecord(2)).getValue(data.matter.email.masterIdColumnName)
            ];
            await app.api.collaboration.executeTask(data.matter.email.process, data.matter.email.tasks.emailTask);
            await app.api.collaboration.submitRecords(recordIds);
        });
        await app.step('Click Task Control -> Delegate', async () => {
            await app.ui.emailModal.click('taskControls');
            await app.ui.kendoPopup.selectItem('Delegate');
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.errorModal.getText('errorMessage', 0, { asDisplayed: true })).eql(
                    'One or more selected record(s) no longer resides at the current task due to:\n' +
                    'Record deletion\n' +
                    'Submission\n' +
                    'Return by another user\n' +
                    'Task delegation\n' +
                    'Task responsibility');
        });
    })
    .after(async () => {
        await app.step('Remove all records from tasks (API)', async () => {
            try {
                await app.api.collaboration.executeTask(data.matter.email.process, data.matter.email.tasks.previousTask);
                await app.api.collaboration.removeAllRecords();
                await app.api.collaboration.executeTask(data.matter.email.process, data.matter.email.tasks.emailTask);
                await app.api.collaboration.removeAllRecords();
                await app.api.collaboration.executeTask(data.matter.email.process, data.matter.email.tasks.nextTask);
                await app.api.collaboration.removeAllRecords();
            } catch (error) {}
        });
        await app.step('Remove created records (API)', async () => {
            await app.api.combinedFunctionality.deleteRecords(app.memory.current.recordsArray.map((x) => x.respData));
        });
    });

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step('Create records (API)', async () => {
            app.memory.current.recordsArray = [
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple')
            ];
        });
        await app.step('Add records to the Records Management task and submit (API)', async () => {
            await app.api.login();
            await app.api.query.runQuery(data.matter.category + '>' + data.matter.query);
            await app.api.query.collaborateRecordsWithIds(data.matter.email.process, app.memory.current.recordsArray.map((x) => x.respData.Record.MasterId));
            await app.api.collaboration.executeTask(data.matter.email.process, data.matter.email.tasks.previousTask);
            await app.api.collaboration.submitAllRecords();
        });
    })
    .requestHooks(app.ui.requestLogger.collaborationReturn)
    ('Verify Return on the Email modal for Matter process (Step 1-6, 12)', async (t: TestController) => {
        await app.step('Open Collaboration Portal (Step 2)', async () => {
            await app.ui.getRole(undefined, '/UI/collaboration');
            await app.ui.waitLoading();
        });
        await app.step('Open the Email task', async () => {
            const process = app.ui.collaborationBoard.getProcess(data.matter.email.process);
            const task = process.getTask(data.matter.email.tasks.emailTask);
            await task.open();
            await app.ui.waitLoading();
        });
        await app.step('Select records and click Open (Step 3)', async () => {
            const query = app.ui.queryBoard.queryResultsGrid;
            await query.getCheckbox(0).check();
            await query.getCheckbox(1).check();
            await query.getCheckbox(2).check();
            await app.ui.queryBoard.click('menuItems', 'Open');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.emailModal.isVisible()).ok();
        });
        await app.step('Verify the Return button (Step 4)', async () => {
            await app.ui.emailModal.click('taskControls');
            await t
                .expect(await app.ui.kendoPopup.isEnabled('simpleItems', 'Remove')).ok();
        });
        await app.step('Click the Return button (Step 5)', async () => {
            await app.ui.kendoPopup.selectItem('Return');
            await t
                .expect(await app.ui.confirmationModal.isVisible()).ok()
                .expect(await app.ui.confirmationModal.getText('confirmationMessage')).eql('Are you sure you want to reassign selected record(s) to the previous task?')
                .expect(await app.ui.confirmationModal.isVisible('buttons', 'Yes')).ok()
                .expect(await app.ui.confirmationModal.isVisible('buttons', 'Cancel')).ok();
        });
        await app.step('Click "Yes" on the Confirmation modal (Step 6)', async () => {
            const recordBefore = await app.ui.emailModal.getText('title', 0, { asDisplayed: true });
            const previewListBefore = await app.ui.emailModal.getPreviewListItems();
            const nextRecord = previewListBefore[previewListBefore.indexOf(recordBefore) + 1];
            await app.ui.confirmationModal.click('buttons', 'Yes');
            await app.ui.waitLoading();
            const previewListAfter = await app.ui.emailModal.getPreviewListItems();
            const recordAfter = await app.ui.emailModal.getText('title', 0, { asDisplayed: true });

            await t
                .expect(await app.ui.emailModal.isVisible()).ok()
                .expect(previewListAfter).eql(app.services.array.removeFirstOccurance(previewListBefore, recordBefore))
                .expect(await app.ui.emailModal.getSelectedRecord()).eql(nextRecord)
                .expect(recordAfter).eql(nextRecord);
        });
        await app.step('Click "Cancel" on the Confirmation modal (Step 12)', async () => {
            const recordBefore = await app.ui.emailModal.getText('title', 0, { asDisplayed: true });
            const previewListBefore = await app.ui.emailModal.getPreviewListItems();
            await app.ui.emailModal.click('taskControls');
            await app.ui.kendoPopup.selectItem('Return');
            await app.ui.confirmationModal.cancel();
            await app.ui.waitLoading();
            const previewListAfter = await app.ui.emailModal.getPreviewListItems();
            const recordAfter = await app.ui.emailModal.getText('title', 0, { asDisplayed: true });

            await t
                .expect(await app.ui.confirmationModal.waitTillElementNotPresent()).ok()
                .expect(recordBefore).eql(recordAfter)
                .expect(previewListBefore).eql(previewListAfter);
        });
        await app.step('Verify record is submitted (API)', async () => {
            const submittedRecordId = app.ui.getLastRequestBody('collaborationReturn')[0].masterId;
            await app.api.collaboration.executeTask(data.matter.email.process, data.matter.email.tasks.previousTask);
            const ids = await app.api.collaboration.getRecordIdsFromResults();
            await t
                .expect(ids.includes(submittedRecordId.toString())).ok();
        });
    })
    .after(async () => {
        await app.step('Remove all records from tasks (API)', async () => {
            try {
                await app.api.collaboration.executeTask(data.matter.email.process, data.matter.email.tasks.previousTask);
                await app.api.collaboration.removeAllRecords();
                await app.api.collaboration.executeTask(data.matter.email.process, data.matter.email.tasks.emailTask);
                await app.api.collaboration.removeAllRecords();
                await app.api.collaboration.executeTask(data.matter.email.process, data.matter.email.tasks.nextTask);
                await app.api.collaboration.removeAllRecords();
            } catch (err) { }
        });
        await app.step('Remove created records (API)', async () => {
            await app.api.combinedFunctionality.deleteRecords(app.memory.current.recordsArray.map((x) => x.respData));
        });
    });

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step('Create records (API)', async () => {
            app.memory.current.recordsArray = [
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple')
            ];
        });
        await app.step('Add records to the Records Management task and submit (API)', async () => {
            await app.api.login();
            await app.api.query.runQuery(data.matter.category + '>' + data.matter.query);
            await app.api.query.collaborateRecordsWithIds(data.matter.email.process, app.memory.current.recordsArray.map((x) => x.respData.Record.MasterId));
            await app.api.collaboration.executeTask(data.matter.email.process, data.matter.email.tasks.previousTask);
            await app.api.collaboration.submitAllRecords();
        });
    })
    ('Verify Return on the Email modal when one of the records is returned for Matter process (Step 7-9)', async (t: TestController) => {
        await app.step('Open Collaboration Portal', async () => {
            await app.ui.getRole(undefined, '/UI/collaboration');
            await app.ui.waitLoading();
        });
        await app.step('Open the Email task', async () => {
            const process = app.ui.collaborationBoard.getProcess(data.matter.email.process);
            const task = process.getTask(data.matter.email.tasks.emailTask);
            await task.open();
        });
        await app.step('Select 3 records and click Open (Step 7)', async () => {
            const query = app.ui.queryBoard;
            await query.queryResultsGrid.getCheckbox(0).check();
            await query.queryResultsGrid.getCheckbox(1).check();
            await query.queryResultsGrid.getCheckbox(2).check();
            await app.ui.queryBoard.click('menuItems', 'Open');
            await app.ui.waitLoading();
        });
        await app.step('Return one of the selected records (API) (Step 8)', async () => {
            const recordId = await (await app.ui.queryBoard.queryResultsGrid.getRecord(1)).getValue(data.matter.email.masterIdColumnName);
            await app.api.collaboration.executeTask(data.matter.email.process, data.matter.email.tasks.emailTask);
            await app.api.collaboration.returnRecords([ recordId ]);
        });
        await app.step('Select Return from Task Controls on the Email modal (Step 9)', async () => {
            await app.ui.emailModal.click('taskControls');
            await app.ui.kendoPopup.selectItem('Return');
            await app.ui.confirmationModal.confirm();
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.emailModal.getText('errorContainer', 0, { asDisplayed: true })).eql(
                    'Attention\n' +
                    'One or more selected record(s) no longer resides at the current task due to:\n' +
                    ' Record deletion\n' +
                    ' Submission\n' +
                    ' Return by another user\n' +
                    ' Task delegation\n' +
                    ' Task responsibility');
        });
    })
    .after(async () => {
        await app.step('Remove all records from tasks (API)', async () => {
            try {
                await app.api.collaboration.executeTask(data.matter.email.process, data.matter.email.tasks.previousTask);
                await app.api.collaboration.removeAllRecords();
                await app.api.collaboration.executeTask(data.matter.email.process, data.matter.email.tasks.emailTask);
                await app.api.collaboration.removeAllRecords();
                await app.api.collaboration.executeTask(data.matter.email.process, data.matter.email.tasks.nextTask);
                await app.api.collaboration.removeAllRecords();
            } catch (err) { }
        });
        await app.step('Remove created records (API)', async () => {
            await app.api.combinedFunctionality.deleteRecords(app.memory.current.recordsArray.map((x) => x.respData));
        });
    });

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step('Create records (API)', async () => {
            app.memory.current.recordsArray = [
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple')
            ];
        });
        await app.step('Add records to the Records Management task and submit (API)', async () => {
            await app.api.login();
            await app.api.query.runQuery(data.matter.category + '>' + data.matter.query);
            await app.api.query.collaborateRecordsWithIds(data.matter.email.process, app.memory.current.recordsArray.map((x) => x.respData.Record.MasterId));
            await app.api.collaboration.executeTask(data.matter.email.process, data.matter.email.tasks.previousTask);
            await app.api.collaboration.submitAllRecords();
        });
    })
    ('Verify Email modal in the task when one of the records is returned for Matter process (Step 10)', async (t: TestController) => {
        await app.step('Open Collaboration Portal', async () => {
            await app.ui.getRole(undefined, '/UI/collaboration');
            await app.ui.waitLoading();
        });
        await app.step('Open the Email task', async () => {
            const process = app.ui.collaborationBoard.getProcess(data.matter.email.process);
            const task = process.getTask(data.matter.email.tasks.emailTask);
            await task.open();
            await app.ui.waitLoading();
        });
        await app.step('Return one of the selected records (API)', async () => {
            const recordId = await (await app.ui.queryBoard.queryResultsGrid.getRecord(0)).getValue(data.matter.email.masterIdColumnName);
            await app.api.collaboration.executeTask(data.matter.email.process, data.matter.email.tasks.emailTask);
            await app.api.collaboration.returnRecords([ recordId ]);
        });
        await app.step('Select 3 records and click Open', async () => {
            const query = app.ui.queryBoard;
            await query.queryResultsGrid.getCheckbox(0).check();
            await query.queryResultsGrid.getCheckbox(1).check();
            await query.queryResultsGrid.getCheckbox(2).check();
            await app.ui.queryBoard.click('menuItems', 'Open');
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.emailModal.getText('errorContainer', 0, { asDisplayed: true })).eql(
                    'Attention\n' +
                    'One or more selected record(s) no longer resides at the current task due to:\n' +
                    ' Record deletion\n' +
                    ' Submission\n' +
                    ' Return by another user\n' +
                    ' Task delegation\n' +
                    ' Task responsibility');
        });
    })
    .after(async () => {
        await app.step('Remove all records from tasks (API)', async () => {
            try {
                await app.api.collaboration.executeTask(data.matter.email.process, data.matter.email.tasks.previousTask);
                await app.api.collaboration.removeAllRecords();
                await app.api.collaboration.executeTask(data.matter.email.process, data.matter.email.tasks.emailTask);
                await app.api.collaboration.removeAllRecords();
                await app.api.collaboration.executeTask(data.matter.email.process, data.matter.email.tasks.nextTask);
                await app.api.collaboration.removeAllRecords();
            } catch (err) { }
        });
        await app.step('Remove created records (API)', async () => {
            await app.api.combinedFunctionality.deleteRecords(app.memory.current.recordsArray.map((x) => x.respData));
        });
    });

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step('Create records (API)', async () => {
            app.memory.current.recordsArray = [
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple')
            ];
        });
        await app.step('Add records to the Records Management task and submit (API)', async () => {
            await app.api.login();
            await app.api.query.runQuery(data.matter.category + '>' + data.matter.query);
            await app.api.query.collaborateRecordsWithIds(data.matter.email.process, app.memory.current.recordsArray.map((x) => x.respData.Record.MasterId));
            await app.api.collaboration.executeTask(data.matter.email.process, data.matter.email.tasks.previousTask);
            await app.api.collaboration.submitAllRecords();
        });
    })
    ('Verify Delegate on the Email modal when all records are returned for Matter process (Step 11)', async (t: TestController) => {
        await app.step('Open Collaboration Portal', async () => {
            await app.ui.getRole(undefined, '/UI/collaboration');
            await app.ui.waitLoading();
        });
        await app.step('Open the Email task', async () => {
            const process = app.ui.collaborationBoard.getProcess(data.matter.email.process);
            const task = process.getTask(data.matter.email.tasks.emailTask);
            await task.open();
            await app.ui.waitLoading();
        });
        await app.step('Select 3 records and click Open', async () => {
            const query = app.ui.queryBoard;
            await query.queryResultsGrid.getCheckbox(0).check();
            await query.queryResultsGrid.getCheckbox(1).check();
            await query.queryResultsGrid.getCheckbox(2).check();
            await app.ui.queryBoard.click('menuItems', 'Open');
            await app.ui.waitLoading();
        });
        await app.step('Return all selected records (API)', async () => {
            const recordIds = [
                await (await app.ui.queryBoard.queryResultsGrid.getRecord(0)).getValue(data.matter.email.masterIdColumnName),
                await (await app.ui.queryBoard.queryResultsGrid.getRecord(1)).getValue(data.matter.email.masterIdColumnName),
                await (await app.ui.queryBoard.queryResultsGrid.getRecord(2)).getValue(data.matter.email.masterIdColumnName)
            ];
            await app.api.collaboration.executeTask(data.matter.email.process, data.matter.email.tasks.emailTask);
            await app.api.collaboration.returnRecords(recordIds);
        });
        await app.step('Click Task Control -> Delegate', async () => {
            await app.ui.emailModal.click('taskControls');
            await app.ui.kendoPopup.selectItem('Delegate');
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.errorModal.getText('errorMessage', 0, { asDisplayed: true })).eql(
                    'One or more selected record(s) no longer resides at the current task due to:\n' +
                    'Record deletion\n' +
                    'Submission\n' +
                    'Return by another user\n' +
                    'Task delegation\n' +
                    'Task responsibility');
        });
    })
    .after(async () => {
        await app.step('Remove all records from tasks (API)', async () => {
            try {
                await app.api.collaboration.executeTask(data.matter.email.process, data.matter.email.tasks.previousTask);
                await app.api.collaboration.removeAllRecords();
                await app.api.collaboration.executeTask(data.matter.email.process, data.matter.email.tasks.emailTask);
                await app.api.collaboration.removeAllRecords();
                await app.api.collaboration.executeTask(data.matter.email.process, data.matter.email.tasks.nextTask);
                await app.api.collaboration.removeAllRecords();
            } catch (err) { }
        });
        await app.step('Remove created records (API)', async () => {
            await app.api.combinedFunctionality.deleteRecords(app.memory.current.recordsArray.map((x) => x.respData));
        });
    });

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step('Create records (API)', async () => {
            app.memory.current.recordsArray = [
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple')
            ];
        });
        await app.step('Add records to the Records Management task and submit (API)', async () => {
            await app.api.login();
            await app.api.query.runQuery(data.matter.category + '>' + data.matter.query);
            await app.api.query.collaborateRecordsWithIds(data.matter.formLetter.process, app.memory.current.recordsArray.map((x) => x.respData.Record.MasterId));
            await app.api.collaboration.executeTask(data.matter.formLetter.process, data.matter.formLetter.tasks.previousTask);
            await app.api.collaboration.submitAllRecords();
        });
    })
    ('Verify Remove on the Form Letter modal for Matter process (Step 1-6, 12)', async (t: TestController) => {
        await app.step('Open Collaboration Portal (Step 2)', async () => {
            await app.ui.getRole(undefined, '/UI/collaboration');
            await app.ui.waitLoading();
        });
        await app.step('Open the Form Letter task', async () => {
            const process = app.ui.collaborationBoard.getProcess(data.matter.formLetter.process);
            const task = process.getTask(data.matter.formLetter.tasks.flTask);
            await task.open();
            await app.ui.waitLoading();
        });
        await app.step('Select records and click Open (Step 3)', async () => {
            const query = app.ui.queryBoard.queryResultsGrid;
            await query.getCheckbox(0).check();
            await query.getCheckbox(1).check();
            await query.getCheckbox(2).check();
            await app.ui.queryBoard.click('menuItems', 'Open');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.formLetterModal.isVisible()).ok();
        });
        await app.step('Verify the Remove button (Step 4)', async () => {
            await app.ui.formLetterModal.click('taskControls');
            await t
                .expect(await app.ui.kendoPopup.isEnabled('simpleItems', 'Remove')).ok();
        });
        await app.step('Click the Remove button (Step 5)', async () => {
            await app.ui.kendoPopup.selectItem('Remove');
            await t
                .expect(await app.ui.confirmationModal.isVisible()).ok()
                .expect(await app.ui.confirmationModal.getText('confirmationMessage')).eql('Are you sure you want to remove the selected record(s) from the process?')
                .expect(await app.ui.confirmationModal.isVisible('buttons', 'Yes')).ok()
                .expect(await app.ui.confirmationModal.isVisible('buttons', 'Cancel')).ok();
        });
        await app.step('Click "Yes" on the Confirmation modal (Step 6)', async () => {
            const recordBefore = await app.ui.formLetterModal.getText('title', 0, { asDisplayed: true });
            const previewListBefore = await app.ui.formLetterModal.getPreviewListItems();
            const nextRecord = previewListBefore[previewListBefore.indexOf(recordBefore) + 1];
            await app.ui.confirmationModal.click('buttons', 'Yes');
            await app.ui.waitLoading();
            const previewListAfter = await app.ui.formLetterModal.getPreviewListItems();
            const recordAfter = await app.ui.formLetterModal.getText('title', 0, { asDisplayed: true });

            await t
                .expect(await app.ui.formLetterModal.isVisible()).ok()
                .expect(previewListAfter).eql(app.services.array.removeFirstOccurance(previewListBefore, recordBefore))
                .expect(await app.ui.formLetterModal.getSelectedRecord()).eql(nextRecord)
                .expect(recordAfter).eql(nextRecord);
        });
        await app.step('Click "Cancel" on the Confirmation modal (Step 12)', async () => {
            const recordBefore = await app.ui.formLetterModal.getText('title', 0, { asDisplayed: true });
            const previewListBefore = await app.ui.formLetterModal.getPreviewListItems();
            await app.ui.formLetterModal.click('taskControls');
            await app.ui.kendoPopup.selectItem('Remove');
            await app.ui.confirmationModal.cancel();
            await app.ui.waitLoading();
            const previewListAfter = await app.ui.formLetterModal.getPreviewListItems();
            const recordAfter = await app.ui.formLetterModal.getText('title', 0, { asDisplayed: true });

            await t
                .expect(await app.ui.confirmationModal.waitTillElementNotPresent()).ok()
                .expect(recordBefore).eql(recordAfter)
                .expect(previewListBefore).eql(previewListAfter);
        });
    })
    .after(async () => {
        await app.step('Remove all records from tasks (API)', async () => {
            try {
                await app.api.collaboration.executeTask(data.matter.formLetter.process, data.matter.formLetter.tasks.previousTask);
                await app.api.collaboration.removeAllRecords();
                await app.api.collaboration.executeTask(data.matter.formLetter.process, data.matter.formLetter.tasks.flTask);
                await app.api.collaboration.removeAllRecords();
                await app.api.collaboration.executeTask(data.matter.formLetter.process, data.matter.formLetter.tasks.nextTask);
                await app.api.collaboration.removeAllRecords();
            } catch (err) { }
        });
        await app.step('Remove created records (API)', async () => {
            await app.api.combinedFunctionality.deleteRecords(app.memory.current.recordsArray.map((x) => x.respData));
        });
    });

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step('Create records (API)', async () => {
            app.memory.current.recordsArray = [
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple')
            ];
        });
        await app.step('Add records to the Records Management task and submit (API)', async () => {
            await app.api.login();
            await app.api.query.runQuery(data.matter.category + '>' + data.matter.query);
            await app.api.query.collaborateRecordsWithIds(data.matter.formLetter.process, app.memory.current.recordsArray.map((x) => x.respData.Record.MasterId));
            await app.api.collaboration.executeTask(data.matter.formLetter.process, data.matter.formLetter.tasks.previousTask);
            await app.api.collaboration.submitAllRecords();
        });
    })
    ('Verify Remove on the Form Letter modal when one of the records is removed for Matter process (Step 7-9)', async (t: TestController) => {
        await app.step('Open Collaboration Portal', async () => {
            await app.ui.getRole(undefined, '/UI/collaboration');
            await app.ui.waitLoading();
        });
        await app.step('Open the Form Letter task', async () => {
            const process = app.ui.collaborationBoard.getProcess(data.matter.formLetter.process);
            const task = process.getTask(data.matter.formLetter.tasks.flTask);
            await task.open();
        });
        await app.step('Select 3 records and click Open (Step 7)', async () => {
            const query = app.ui.queryBoard;
            await query.queryResultsGrid.getCheckbox(0).check();
            await query.queryResultsGrid.getCheckbox(1).check();
            await query.queryResultsGrid.getCheckbox(2).check();
            await app.ui.queryBoard.click('menuItems', 'Open');
            await app.ui.waitLoading();
        });
        await app.step('Delete one of the selected records (API) (Step 8)', async () => {
            const recordId = await (await app.ui.queryBoard.queryResultsGrid.getRecord(1)).getValue(data.matter.formLetter.masterIdColumnName);
            await app.api.collaboration.executeTask(data.matter.formLetter.process, data.matter.formLetter.tasks.flTask);
            await app.api.collaboration.removeRecords([ recordId ]);
        });
        await app.step('Select Remove from Task Controls on the From Letter modal (Step 9)', async () => {
            await app.ui.formLetterModal.click('taskControls');
            await app.ui.kendoPopup.selectItem('Remove');
            await app.ui.confirmationModal.confirm();
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.formLetterModal.getText('errorContainer', 0, { asDisplayed: true })).eql(
                    'Attention\n' +
                    'One or more selected record(s) no longer resides at the current task due to:\n' +
                    ' Record deletion\n' +
                    ' Submission\n' +
                    ' Return by another user\n' +
                    ' Task delegation\n' +
                    ' Task responsibility');
        });
    })
    .after(async () => {
        await app.step('Remove all records from tasks (API)', async () => {
            try {
                await app.api.collaboration.executeTask(data.matter.formLetter.process, data.matter.formLetter.tasks.previousTask);
                await app.api.collaboration.removeAllRecords();
                await app.api.collaboration.executeTask(data.matter.formLetter.process, data.matter.formLetter.tasks.flTask);
                await app.api.collaboration.removeAllRecords();
                await app.api.collaboration.executeTask(data.matter.formLetter.process, data.matter.formLetter.tasks.nextTask);
                await app.api.collaboration.removeAllRecords();
            } catch (error) {}
        });
        await app.step('Remove created records (API)', async () => {
            await app.api.combinedFunctionality.deleteRecords(app.memory.current.recordsArray.map((x) => x.respData));
        });
    });

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step('Create records (API)', async () => {
            app.memory.current.recordsArray = [
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple')
            ];
        });
        await app.step('Add records to the Records Management task and submit (API)', async () => {
            await app.api.login();
            await app.api.query.runQuery(data.matter.category + '>' + data.matter.query);
            await app.api.query.collaborateRecordsWithIds(data.matter.formLetter.process, app.memory.current.recordsArray.map((x) => x.respData.Record.MasterId));
            await app.api.collaboration.executeTask(data.matter.formLetter.process, data.matter.formLetter.tasks.previousTask);
            await app.api.collaboration.submitAllRecords();
        });
    })
    ('Verify Remove in the task when one of the records is removed for Matter process (Step 10)', async (t: TestController) => {
        await app.step('Open Collaboration Portal', async () => {
            await app.ui.getRole(undefined, '/UI/collaboration');
            await app.ui.waitLoading();
        });
        await app.step('Open the Form Letter task', async () => {
            const process = app.ui.collaborationBoard.getProcess(data.matter.formLetter.process);
            const task = process.getTask(data.matter.formLetter.tasks.flTask);
            await task.open();
            await app.ui.waitLoading();
        });
        await app.step('Delete one of the selected records (API)', async () => {
            const recordId = await (await app.ui.queryBoard.queryResultsGrid.getRecord(0)).getValue(data.matter.formLetter.masterIdColumnName);
            await app.api.collaboration.executeTask(data.matter.formLetter.process, data.matter.formLetter.tasks.flTask);
            await app.api.collaboration.removeRecords([ recordId ]);
        });
        await app.step('Select 3 records and click Open', async () => {
            const query = app.ui.queryBoard;
            await query.queryResultsGrid.getCheckbox(0).check();
            await query.queryResultsGrid.getCheckbox(1).check();
            await query.queryResultsGrid.getCheckbox(2).check();
            await app.ui.queryBoard.click('menuItems', 'Open');
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.formLetterModal.getText('errorContainer', 0, { asDisplayed: true })).eql(
                    'Attention\n' +
                    'One or more selected record(s) no longer resides at the current task due to:\n' +
                    ' Record deletion\n' +
                    ' Submission\n' +
                    ' Return by another user\n' +
                    ' Task delegation\n' +
                    ' Task responsibility');
        });
    })
    .after(async () => {
        await app.step('Remove all records from tasks (API)', async () => {
            try {
                await app.api.collaboration.executeTask(data.matter.formLetter.process, data.matter.formLetter.tasks.previousTask);
                await app.api.collaboration.removeAllRecords();
                await app.api.collaboration.executeTask(data.matter.formLetter.process, data.matter.formLetter.tasks.flTask);
                await app.api.collaboration.removeAllRecords();
                await app.api.collaboration.executeTask(data.matter.formLetter.process, data.matter.formLetter.tasks.nextTask);
                await app.api.collaboration.removeAllRecords();
            } catch (err) { }
        });
        await app.step('Remove created records (API)', async () => {
            await app.api.combinedFunctionality.deleteRecords(app.memory.current.recordsArray.map((x) => x.respData));
        });
    });

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step('Create records (API)', async () => {
            app.memory.current.recordsArray = [
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple')
            ];
        });
        await app.step('Add records to the Records Management task and submit (API)', async () => {
            await app.api.login();
            await app.api.query.runQuery(data.matter.category + '>' + data.matter.query);
            await app.api.query.collaborateRecordsWithIds(data.matter.formLetter.process, app.memory.current.recordsArray.map((x) => x.respData.Record.MasterId));
            await app.api.collaboration.executeTask(data.matter.formLetter.process, data.matter.formLetter.tasks.previousTask);
            await app.api.collaboration.submitAllRecords();
        });
    })
    ('Verify Delegate on the Form Letter modal when all records are removed for Matter process (Step 11)', async (t: TestController) => {
        await app.step('Open Collaboration Portal', async () => {
            await app.ui.getRole(undefined, '/UI/collaboration');
            await app.ui.waitLoading();
        });
        await app.step('Open the Form Letter task', async () => {
            const process = app.ui.collaborationBoard.getProcess(data.matter.formLetter.process);
            const task = process.getTask(data.matter.formLetter.tasks.flTask);
            await task.open();
            await app.ui.waitLoading();
        });
        await app.step('Select 3 records and click Open', async () => {
            const query = app.ui.queryBoard;
            await query.queryResultsGrid.getCheckbox(0).check();
            await query.queryResultsGrid.getCheckbox(1).check();
            await query.queryResultsGrid.getCheckbox(2).check();
            await app.ui.queryBoard.click('menuItems', 'Open');
            await app.ui.waitLoading();
        });
        await app.step('Delete one of the selected records (API)', async () => {
            const recordIds = [
                await (await app.ui.queryBoard.queryResultsGrid.getRecord(0)).getValue(data.matter.formLetter.masterIdColumnName),
                await (await app.ui.queryBoard.queryResultsGrid.getRecord(1)).getValue(data.matter.formLetter.masterIdColumnName),
                await (await app.ui.queryBoard.queryResultsGrid.getRecord(2)).getValue(data.matter.formLetter.masterIdColumnName)
            ];
            await app.api.collaboration.executeTask(data.matter.formLetter.process, data.matter.formLetter.tasks.flTask);
            await app.api.collaboration.removeRecords(recordIds);
        });
        await app.step('Click Task Control -> Delegate', async () => {
            await app.ui.formLetterModal.click('taskControls');
            await app.ui.kendoPopup.selectItem('Delegate');
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.errorModal.getText('errorMessage', 0, { asDisplayed: true })).eql(
                    'One or more selected record(s) no longer resides at the current task due to:\n' +
                    'Record deletion\n' +
                    'Submission\n' +
                    'Return by another user\n' +
                    'Task delegation\n' +
                    'Task responsibility');
        });
    })
    .after(async () => {
        await app.step('Remove all records from tasks (API)', async () => {
            try {
                await app.api.collaboration.executeTask(data.matter.formLetter.process, data.matter.formLetter.tasks.previousTask);
                await app.api.collaboration.removeAllRecords();
                await app.api.collaboration.executeTask(data.matter.formLetter.process, data.matter.formLetter.tasks.flTask);
                await app.api.collaboration.removeAllRecords();
                await app.api.collaboration.executeTask(data.matter.formLetter.process, data.matter.formLetter.tasks.nextTask);
                await app.api.collaboration.removeAllRecords();
            } catch (err) { }
        });
        await app.step('Remove created records (API)', async () => {
            await app.api.combinedFunctionality.deleteRecords(app.memory.current.recordsArray.map((x) => x.respData));
        });
    });

test
    // .only
    .meta('brief', 'true')
    .requestHooks(app.ui.requestLogger.collaborationSubmit)
    .before(async () => {
        await app.step('Create records (API)', async () => {
            app.memory.current.recordsArray = [
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple')
            ];
        });
        await app.step('Add records to the Records Management task and submit (API)', async () => {
            await app.api.login();
            await app.api.query.runQuery(data.matter.category + '>' + data.matter.query);
            await app.api.query.collaborateRecordsWithIds(data.matter.formLetter.process, app.memory.current.recordsArray.map((x) => x.respData.Record.MasterId));
            await app.api.collaboration.executeTask(data.matter.formLetter.process, data.matter.formLetter.tasks.previousTask);
            await app.api.collaboration.submitAllRecords();
        });
    })
    ('Verify Submit on the Form Letter modal for Matter process (Step 1-5)', async (t: TestController) => {
        await app.step('Open Collaboration Portal', async () => {
            await app.ui.getRole(undefined, '/UI/collaboration');
            await app.ui.waitLoading();
        });
        await app.step('Open the Form Letter task', async () => {
            const process = app.ui.collaborationBoard.getProcess(data.matter.formLetter.process);
            const task = process.getTask(data.matter.formLetter.tasks.flTask);
            await task.open();
        });
        await app.step('Select records and click Open (Step 3)', async () => {
            const query = app.ui.queryBoard.queryResultsGrid;
            await query.getCheckbox(0).check();
            await query.getCheckbox(1).check();
            await query.getCheckbox(2).check();
            await app.ui.queryBoard.click('menuItems', 'Open');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.formLetterModal.isVisible()).ok();
        });
        await app.step('Verify the Submit button (Step 4)', async () => {
            await app.ui.formLetterModal.click('taskControls');
            await t
                .expect(await app.ui.kendoPopup.isEnabled('simpleItems', 'Submit')).ok();
        });
        await app.step('Click the Submit button (Step 5)', async () => {
            const recordBefore = await app.ui.formLetterModal.getText('title', 0, { asDisplayed: true });
            const previewListBefore = await app.ui.formLetterModal.getPreviewListItems();
            const nextRecord = previewListBefore[previewListBefore.indexOf(recordBefore) + 1];
            await app.ui.kendoPopup.selectItem('Submit');
            await app.ui.waitLoading();
            const previewListAfter = await app.ui.formLetterModal.getPreviewListItems();
            const recordAfter = await app.ui.formLetterModal.getText('title', 0, { asDisplayed: true });

            await t
                .expect(await app.ui.formLetterModal.isVisible()).ok()
                .expect(previewListAfter).eql(app.services.array.removeFirstOccurance(previewListBefore, recordBefore))
                .expect(await app.ui.formLetterModal.getSelectedRecord()).eql(nextRecord)
                .expect(recordAfter).eql(nextRecord);
        });
        await app.step('Verify record is submitted (API)', async () => {
            const submittedRecordId = app.ui.getLastRequestBody('collaborationSubmit').selectedRecords[0].masterId;
            await app.api.collaboration.executeTask(data.matter.formLetter.process, data.matter.formLetter.tasks.nextTask);
            const ids = await app.api.collaboration.getRecordIdsFromResults();
            await t
                .expect(ids.includes(submittedRecordId.toString())).ok();
        });
    })
    .after(async () => {
        await app.step('Remove all records from tasks (API)', async () => {
            try {
                await app.api.collaboration.executeTask(data.matter.formLetter.process, data.matter.formLetter.tasks.previousTask);
                await app.api.collaboration.removeAllRecords();
                await app.api.collaboration.executeTask(data.matter.formLetter.process, data.matter.formLetter.tasks.flTask);
                await app.api.collaboration.removeAllRecords();
                await app.api.collaboration.executeTask(data.matter.formLetter.process, data.matter.formLetter.tasks.nextTask);
                await app.api.collaboration.removeAllRecords();
            } catch (err) { }
        });
        await app.step('Remove created records (API)', async () => {
            await app.api.combinedFunctionality.deleteRecords(app.memory.current.recordsArray.map((x) => x.respData));
        });
    });

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step('Create records (API)', async () => {
            app.memory.current.recordsArray = [
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple')
            ];
        });
        await app.step('Add records to the Records Management task and submit (API)', async () => {
            await app.api.login();
            await app.api.query.runQuery(data.matter.category + '>' + data.matter.query);
            await app.api.query.collaborateRecordsWithIds(data.matter.formLetter.process, app.memory.current.recordsArray.map((x) => x.respData.Record.MasterId));
            await app.api.collaboration.executeTask(data.matter.formLetter.process, data.matter.formLetter.tasks.previousTask);
            await app.api.collaboration.submitAllRecords();
        });
    })
    ('Verify Submit on the Form Letter modal when one of the records is submitted for Matter process (Step 7-9)', async (t: TestController) => {
        await app.step('Open Collaboration Portal', async () => {
            await app.ui.getRole(undefined, '/UI/collaboration');
            await app.ui.waitLoading();
        });
        await app.step('Open the Form Letter task', async () => {
            const process = app.ui.collaborationBoard.getProcess(data.matter.formLetter.process);
            const task = process.getTask(data.matter.formLetter.tasks.flTask);
            await task.open();
        });
        await app.step('Select 3 records and click Open (Step 7)', async () => {
            const query = app.ui.queryBoard;
            await query.queryResultsGrid.getCheckbox(0).check();
            await query.queryResultsGrid.getCheckbox(1).check();
            await query.queryResultsGrid.getCheckbox(2).check();
            await app.ui.queryBoard.click('menuItems', 'Open');
            await app.ui.waitLoading();
        });
        await app.step('Submit one of the selected records (API) (Step 8)', async () => {
            const recordId = await (await app.ui.queryBoard.queryResultsGrid.getRecord(1)).getValue(data.matter.formLetter.masterIdColumnName);
            await app.api.collaboration.executeTask(data.matter.formLetter.process, data.matter.formLetter.tasks.flTask);
            await app.api.collaboration.submitRecords([ recordId ]);
        });
        await app.step('Select Submit from Task Controls on the Form Letter modal (Step 9)', async () => {
            await app.ui.formLetterModal.click('taskControls');
            await app.ui.kendoPopup.selectItem('Submit');
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.formLetterModal.getText('errorContainer', 0, { asDisplayed: true })).eql(
                    'Attention\n' +
                    'One or more selected record(s) no longer resides at the current task due to:\n' +
                    ' Record deletion\n' +
                    ' Submission\n' +
                    ' Return by another user\n' +
                    ' Task delegation\n' +
                    ' Task responsibility');
        });
    })
    .after(async () => {
        await app.step('Remove all records from tasks (API)', async () => {
            try {
                await app.api.collaboration.executeTask(data.matter.formLetter.process, data.matter.formLetter.tasks.previousTask);
                await app.api.collaboration.removeAllRecords();
                await app.api.collaboration.executeTask(data.matter.formLetter.process, data.matter.formLetter.tasks.flTask);
                await app.api.collaboration.removeAllRecords();
                await app.api.collaboration.executeTask(data.matter.formLetter.process, data.matter.formLetter.tasks.nextTask);
                await app.api.collaboration.removeAllRecords();
            } catch (err) { }
        });
        await app.step('Remove created records (API)', async () => {
            await app.api.combinedFunctionality.deleteRecords(app.memory.current.recordsArray.map((x) => x.respData));
        });
    });

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step('Create records (API)', async () => {
            app.memory.current.recordsArray = [
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple')
            ];
        });
        await app.step('Add records to the Records Management task and submit (API)', async () => {
            await app.api.login();
            await app.api.query.runQuery(data.matter.category + '>' + data.matter.query);
            await app.api.query.collaborateRecordsWithIds(data.matter.formLetter.process, app.memory.current.recordsArray.map((x) => x.respData.Record.MasterId));
            await app.api.collaboration.executeTask(data.matter.formLetter.process, data.matter.formLetter.tasks.previousTask);
            await app.api.collaboration.submitAllRecords();
        });
    })
    ('Verify Form Letter modal in the task when one of the records is submited for Matter process (Step 10)', async (t: TestController) => {
        await app.step('Open Collaboration Portal', async () => {
            await app.ui.getRole(undefined, '/UI/collaboration');
            await app.ui.waitLoading();
        });
        await app.step('Open the Form Letter task', async () => {
            const process = app.ui.collaborationBoard.getProcess(data.matter.formLetter.process);
            const task = process.getTask(data.matter.formLetter.tasks.flTask);
            await task.open();
            await app.ui.waitLoading();
        });
        await app.step('Submit one of the selected records (API)', async () => {
            const recordId = await (await app.ui.queryBoard.queryResultsGrid.getRecord(0)).getValue(data.matter.formLetter.masterIdColumnName);
            await app.api.collaboration.executeTask(data.matter.formLetter.process, data.matter.formLetter.tasks.flTask);
            await app.api.collaboration.submitRecords([ recordId ]);
        });
        await app.step('Select 3 records and click Open', async () => {
            const query = app.ui.queryBoard;
            await query.queryResultsGrid.getCheckbox(0).check();
            await query.queryResultsGrid.getCheckbox(1).check();
            await query.queryResultsGrid.getCheckbox(2).check();
            await app.ui.queryBoard.click('menuItems', 'Open');
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.formLetterModal.getText('errorContainer', 0, { asDisplayed: true })).eql(
                    'Attention\n' +
                    'One or more selected record(s) no longer resides at the current task due to:\n' +
                    ' Record deletion\n' +
                    ' Submission\n' +
                    ' Return by another user\n' +
                    ' Task delegation\n' +
                    ' Task responsibility');
        });
    })
    .after(async () => {
        await app.step('Remove all records from tasks (API)', async () => {
            try {
                await app.api.collaboration.executeTask(data.matter.formLetter.process, data.matter.formLetter.tasks.previousTask);
                await app.api.collaboration.removeAllRecords();
                await app.api.collaboration.executeTask(data.matter.formLetter.process, data.matter.formLetter.tasks.flTask);
                await app.api.collaboration.removeAllRecords();
                await app.api.collaboration.executeTask(data.matter.formLetter.process, data.matter.formLetter.tasks.nextTask);
                await app.api.collaboration.removeAllRecords();
            } catch (err) { }
        });
        await app.step('Remove created records (API)', async () => {
            await app.api.combinedFunctionality.deleteRecords(app.memory.current.recordsArray.map((x) => x.respData));
        });
    });

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step('Create records (API)', async () => {
            app.memory.current.recordsArray = [
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple')
            ];
        });
        await app.step('Add records to the Records Management task and submit (API)', async () => {
            await app.api.login();
            await app.api.query.runQuery(data.matter.category + '>' + data.matter.query);
            await app.api.query.collaborateRecordsWithIds(data.matter.formLetter.process, app.memory.current.recordsArray.map((x) => x.respData.Record.MasterId));
            await app.api.collaboration.executeTask(data.matter.formLetter.process, data.matter.formLetter.tasks.previousTask);
            await app.api.collaboration.submitAllRecords();
        });
    })
    ('Verify Delegate on the Form Letter modal when all records are submited for Matter process (Step 11)', async (t: TestController) => {
        await app.step('Open Collaboration Portal', async () => {
            await app.ui.getRole(undefined, '/UI/collaboration');
            await app.ui.waitLoading();
        });
        await app.step('Open the Form Letter task', async () => {
            const process = app.ui.collaborationBoard.getProcess(data.matter.formLetter.process);
            const task = process.getTask(data.matter.formLetter.tasks.flTask);
            await task.open();
            await app.ui.waitLoading();
        });
        await app.step('Select 3 records and click Open', async () => {
            const query = app.ui.queryBoard;
            await query.queryResultsGrid.getCheckbox(0).check();
            await query.queryResultsGrid.getCheckbox(1).check();
            await query.queryResultsGrid.getCheckbox(2).check();
            await app.ui.queryBoard.click('menuItems', 'Open');
            await app.ui.waitLoading();
        });
        await app.step('Submit all selected records (API)', async () => {
            const recordIds = [
                await (await app.ui.queryBoard.queryResultsGrid.getRecord(0)).getValue(data.matter.formLetter.masterIdColumnName),
                await (await app.ui.queryBoard.queryResultsGrid.getRecord(1)).getValue(data.matter.formLetter.masterIdColumnName),
                await (await app.ui.queryBoard.queryResultsGrid.getRecord(2)).getValue(data.matter.formLetter.masterIdColumnName)
            ];
            await app.api.collaboration.executeTask(data.matter.formLetter.process, data.matter.formLetter.tasks.flTask);
            await app.api.collaboration.submitRecords(recordIds);
        });
        await app.step('Click Task Control -> Delegate', async () => {
            await app.ui.formLetterModal.click('taskControls');
            await app.ui.kendoPopup.selectItem('Delegate');
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.errorModal.getText('errorMessage', 0, { asDisplayed: true })).eql(
                    'One or more selected record(s) no longer resides at the current task due to:\n' +
                    'Record deletion\n' +
                    'Submission\n' +
                    'Return by another user\n' +
                    'Task delegation\n' +
                    'Task responsibility');
        });
    })
    .after(async () => {
        await app.step('Remove all records from tasks (API)', async () => {
            try {
                await app.api.collaboration.executeTask(data.matter.formLetter.process, data.matter.formLetter.tasks.previousTask);
                await app.api.collaboration.removeAllRecords();
                await app.api.collaboration.executeTask(data.matter.formLetter.process, data.matter.formLetter.tasks.flTask);
                await app.api.collaboration.removeAllRecords();
                await app.api.collaboration.executeTask(data.matter.formLetter.process, data.matter.formLetter.tasks.nextTask);
                await app.api.collaboration.removeAllRecords();
            } catch (err) { }
        });
        await app.step('Remove created records (API)', async () => {
            await app.api.combinedFunctionality.deleteRecords(app.memory.current.recordsArray.map((x) => x.respData));
        });
    });

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step('Create records (API)', async () => {
            app.memory.current.recordsArray = [
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple')
            ];
        });
        await app.step('Add records to the Records Management task and submit (API)', async () => {
            await app.api.login();
            await app.api.query.runQuery(data.matter.category + '>' + data.matter.query);
            await app.api.query.collaborateRecordsWithIds(data.matter.formLetter.process, app.memory.current.recordsArray.map((x) => x.respData.Record.MasterId));
            await app.api.collaboration.executeTask(data.matter.formLetter.process, data.matter.formLetter.tasks.previousTask);
            await app.api.collaboration.submitAllRecords();
        });
    })
    .requestHooks(app.ui.requestLogger.collaborationReturn)
    ('Verify Return on the Form Letter modal for Matter process (Step 1-6, 12)', async (t: TestController) => {
        await app.step('Open Collaboration Portal (Step 2)', async () => {
            await app.ui.getRole(undefined, '/UI/collaboration');
            await app.ui.waitLoading();
        });
        await app.step('Open the Form Letter task', async () => {
            const process = app.ui.collaborationBoard.getProcess(data.matter.formLetter.process);
            const task = process.getTask(data.matter.formLetter.tasks.flTask);
            await task.open();
        });
        await app.step('Select records and click Open (Step 3)', async () => {
            const query = app.ui.queryBoard.queryResultsGrid;
            await query.getCheckbox(0).check();
            await query.getCheckbox(1).check();
            await query.getCheckbox(2).check();
            await app.ui.queryBoard.click('menuItems', 'Open');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.formLetterModal.isVisible()).ok();
        });
        await app.step('Verify the Return button (Step 4)', async () => {
            await app.ui.formLetterModal.click('taskControls');
            await t
                .expect(await app.ui.kendoPopup.isEnabled('simpleItems', 'Remove')).ok();
        });
        await app.step('Click the Return button (Step 5)', async () => {
            await app.ui.kendoPopup.selectItem('Return');
            await t
                .expect(await app.ui.confirmationModal.isVisible()).ok()
                .expect(await app.ui.confirmationModal.getText('confirmationMessage')).eql('Are you sure you want to reassign selected record(s) to the previous task?')
                .expect(await app.ui.confirmationModal.isVisible('buttons', 'Yes')).ok()
                .expect(await app.ui.confirmationModal.isVisible('buttons', 'Cancel')).ok();
        });
        await app.step('Click "Yes" on the Confirmation modal (Step 6)', async () => {
            const recordBefore = await app.ui.formLetterModal.getText('title', 0, { asDisplayed: true });
            const previewListBefore = await app.ui.formLetterModal.getPreviewListItems();
            const nextRecord = previewListBefore[previewListBefore.indexOf(recordBefore) + 1];
            await app.ui.confirmationModal.click('buttons', 'Yes');
            await app.ui.waitLoading();
            const previewListAfter = await app.ui.formLetterModal.getPreviewListItems();
            const recordAfter = await app.ui.formLetterModal.getText('title', 0, { asDisplayed: true });

            await t
                .expect(await app.ui.formLetterModal.isVisible()).ok()
                .expect(previewListAfter).eql(app.services.array.removeFirstOccurance(previewListBefore, recordBefore))
                .expect(await app.ui.formLetterModal.getSelectedRecord()).eql(nextRecord)
                .expect(recordAfter).eql(nextRecord);
        });
        await app.step('Click "Cancel" on the Confirmation modal (Step 12)', async () => {
            const recordBefore = await app.ui.formLetterModal.getText('title', 0, { asDisplayed: true });
            const previewListBefore = await app.ui.formLetterModal.getPreviewListItems();
            await app.ui.formLetterModal.click('taskControls');
            await app.ui.kendoPopup.selectItem('Return');
            await app.ui.confirmationModal.cancel();
            await app.ui.waitLoading();
            const previewListAfter = await app.ui.formLetterModal.getPreviewListItems();
            const recordAfter = await app.ui.formLetterModal.getText('title', 0, { asDisplayed: true });

            await t
                .expect(await app.ui.confirmationModal.waitTillElementNotPresent()).ok()
                .expect(recordBefore).eql(recordAfter)
                .expect(previewListBefore).eql(previewListAfter);
        });
        await app.step('Verify record is submitted (API)', async () => {
            const submittedRecordId = app.ui.getLastRequestBody('collaborationReturn')[0].masterId;
            await app.api.collaboration.executeTask(data.matter.formLetter.process, data.matter.formLetter.tasks.previousTask);
            const ids = await app.api.collaboration.getRecordIdsFromResults();
            await t
                .expect(ids.includes(submittedRecordId.toString())).ok();
        });
    })
    .after(async () => {
        await app.step('Remove all records from tasks (API)', async () => {
            try {
                await app.api.collaboration.executeTask(data.matter.formLetter.process, data.matter.formLetter.tasks.previousTask);
                await app.api.collaboration.removeAllRecords();
                await app.api.collaboration.executeTask(data.matter.formLetter.process, data.matter.formLetter.tasks.flTask);
                await app.api.collaboration.removeAllRecords();
                await app.api.collaboration.executeTask(data.matter.formLetter.process, data.matter.formLetter.tasks.nextTask);
                await app.api.collaboration.removeAllRecords();
            } catch (err) { }
        });
        await app.step('Remove created records (API)', async () => {
            await app.api.combinedFunctionality.deleteRecords(app.memory.current.recordsArray.map((x) => x.respData));
        });
    });

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step('Create records (API)', async () => {
            app.memory.current.recordsArray = [
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple')
            ];
        });
        await app.step('Add records to the Records Management task and submit (API)', async () => {
            await app.api.login();
            await app.api.query.runQuery(data.matter.category + '>' + data.matter.query);
            await app.api.query.collaborateRecordsWithIds(data.matter.formLetter.process, app.memory.current.recordsArray.map((x) => x.respData.Record.MasterId));
            await app.api.collaboration.executeTask(data.matter.formLetter.process, data.matter.formLetter.tasks.previousTask);
            await app.api.collaboration.submitAllRecords();
        });
    })
    ('Verify Return on the Form Letter modal when one of the records is returned for Matter process (Step 7-9)', async (t: TestController) => {
        await app.step('Open Collaboration Portal', async () => {
            await app.ui.getRole(undefined, '/UI/collaboration');
            await app.ui.waitLoading();
        });
        await app.step('Open the Form Letter task', async () => {
            const process = app.ui.collaborationBoard.getProcess(data.matter.formLetter.process);
            const task = process.getTask(data.matter.formLetter.tasks.flTask);
            await task.open();
            await app.ui.waitLoading();
        });
        await app.step('Select 3 records and click Open (Step 7)', async () => {
            const query = app.ui.queryBoard;
            await query.queryResultsGrid.getCheckbox(0).check();
            await query.queryResultsGrid.getCheckbox(1).check();
            await query.queryResultsGrid.getCheckbox(2).check();
            await app.ui.queryBoard.click('menuItems', 'Open');
            await app.ui.waitLoading();
        });
        await app.step('Return one of the selected records (API) (Step 8)', async () => {
            const recordId = await (await app.ui.queryBoard.queryResultsGrid.getRecord(1)).getValue(data.matter.formLetter.masterIdColumnName);
            await app.api.collaboration.executeTask(data.matter.formLetter.process, data.matter.formLetter.tasks.flTask);
            await app.api.collaboration.returnRecords([ recordId ]);
        });
        await app.step('Select Return from Task Controls on the Form Letter modal (Step 9)', async () => {
            await app.ui.formLetterModal.click('taskControls');
            await app.ui.kendoPopup.selectItem('Return');
            await app.ui.confirmationModal.confirm();
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.formLetterModal.getText('errorContainer', 0, { asDisplayed: true })).eql(
                    'Attention\n' +
                    'One or more selected record(s) no longer resides at the current task due to:\n' +
                    ' Record deletion\n' +
                    ' Submission\n' +
                    ' Return by another user\n' +
                    ' Task delegation\n' +
                    ' Task responsibility');
        });
    })
    .after(async () => {
        await app.step('Remove all records from tasks (API)', async () => {
            try {
                await app.api.collaboration.executeTask(data.matter.formLetter.process, data.matter.formLetter.tasks.previousTask);
                await app.api.collaboration.removeAllRecords();
                await app.api.collaboration.executeTask(data.matter.formLetter.process, data.matter.formLetter.tasks.flTask);
                await app.api.collaboration.removeAllRecords();
                await app.api.collaboration.executeTask(data.matter.formLetter.process, data.matter.formLetter.tasks.nextTask);
                await app.api.collaboration.removeAllRecords();
            } catch (err) {}
        });
        await app.step('Remove created records (API)', async () => {
            await app.api.combinedFunctionality.deleteRecords(app.memory.current.recordsArray.map((x) => x.respData));
        });
    });

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step('Create records (API)', async () => {
            app.memory.current.recordsArray = [
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple')
            ];
        });
        await app.step('Add records to the Records Management task and submit (API)', async () => {
            await app.api.login();
            await app.api.query.runQuery(data.matter.category + '>' + data.matter.query);
            await app.api.query.collaborateRecordsWithIds(data.matter.formLetter.process, app.memory.current.recordsArray.map((x) => x.respData.Record.MasterId));
            await app.api.collaboration.executeTask(data.matter.formLetter.process, data.matter.formLetter.tasks.previousTask);
            await app.api.collaboration.submitAllRecords();
        });
    })
    ('Verify Form Letter modal in the task when one of the records is returned for Matter process (Step 10)', async (t: TestController) => {
        await app.step('Open Collaboration Portal', async () => {
            await app.ui.getRole(undefined, '/UI/collaboration');
            await app.ui.waitLoading();
        });
        await app.step('Open the Form Letter task', async () => {
            const process = app.ui.collaborationBoard.getProcess(data.matter.formLetter.process);
            const task = process.getTask(data.matter.formLetter.tasks.flTask);
            await task.open();
            await app.ui.waitLoading();
        });
        await app.step('Return one of the selected records (API)', async () => {
            const recordId = await (await app.ui.queryBoard.queryResultsGrid.getRecord(0)).getValue(data.matter.formLetter.masterIdColumnName);
            await app.api.collaboration.executeTask(data.matter.formLetter.process, data.matter.formLetter.tasks.flTask);
            await app.api.collaboration.returnRecords([ recordId ]);
        });
        await app.step('Select 3 records and click Open', async () => {
            const query = app.ui.queryBoard;
            await query.queryResultsGrid.getCheckbox(0).check();
            await query.queryResultsGrid.getCheckbox(1).check();
            await query.queryResultsGrid.getCheckbox(2).check();
            await app.ui.queryBoard.click('menuItems', 'Open');
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.formLetterModal.getText('errorContainer', 0, { asDisplayed: true })).eql(
                    'Attention\n' +
                    'One or more selected record(s) no longer resides at the current task due to:\n' +
                    ' Record deletion\n' +
                    ' Submission\n' +
                    ' Return by another user\n' +
                    ' Task delegation\n' +
                    ' Task responsibility');
        });
    })
    .after(async () => {
        await app.step('Remove all records from tasks (API)', async () => {
            try {
                await app.api.collaboration.executeTask(data.matter.formLetter.process, data.matter.formLetter.tasks.previousTask);
                await app.api.collaboration.removeAllRecords();
                await app.api.collaboration.executeTask(data.matter.formLetter.process, data.matter.formLetter.tasks.flTask);
                await app.api.collaboration.removeAllRecords();
                await app.api.collaboration.executeTask(data.matter.formLetter.process, data.matter.formLetter.tasks.nextTask);
                await app.api.collaboration.removeAllRecords();
            } catch (err) { }
        });
        await app.step('Remove created records (API)', async () => {
            await app.api.combinedFunctionality.deleteRecords(app.memory.current.recordsArray.map((x) => x.respData));
        });
    });

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step('Create records (API)', async () => {
            app.memory.current.recordsArray = [
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple'),
                await app.api.combinedFunctionality.createRecord('patent', 'simple')
            ];
        });
        await app.step('Add records to the Records Management task and submit (API)', async () => {
            await app.api.login();
            await app.api.query.runQuery(data.matter.category + '>' + data.matter.query);
            await app.api.query.collaborateRecordsWithIds(data.matter.formLetter.process, app.memory.current.recordsArray.map((x) => x.respData.Record.MasterId));
            await app.api.collaboration.executeTask(data.matter.formLetter.process, data.matter.formLetter.tasks.previousTask);
            await app.api.collaboration.submitAllRecords();
        });
    })
    ('Verify Delegate on the Form Letter modal when all records are returned for Matter process (Step 11)', async (t: TestController) => {
        await app.step('Open Collaboration Portal', async () => {
            await app.ui.getRole(undefined, '/UI/collaboration');
            await app.ui.waitLoading();
        });
        await app.step('Open the Form Letter task', async () => {
            const process = app.ui.collaborationBoard.getProcess(data.matter.formLetter.process);
            const task = process.getTask(data.matter.formLetter.tasks.flTask);
            await task.open();
            await app.ui.waitLoading();
        });
        await app.step('Select 3 records and click Open', async () => {
            const query = app.ui.queryBoard;
            await query.queryResultsGrid.getCheckbox(0).check();
            await query.queryResultsGrid.getCheckbox(1).check();
            await query.queryResultsGrid.getCheckbox(2).check();
            await app.ui.queryBoard.click('menuItems', 'Open');
            await app.ui.waitLoading();
        });
        await app.step('Return all selected records (API)', async () => {
            const recordIds = [
                await (await app.ui.queryBoard.queryResultsGrid.getRecord(0)).getValue(data.matter.formLetter.masterIdColumnName),
                await (await app.ui.queryBoard.queryResultsGrid.getRecord(1)).getValue(data.matter.formLetter.masterIdColumnName),
                await (await app.ui.queryBoard.queryResultsGrid.getRecord(2)).getValue(data.matter.formLetter.masterIdColumnName)
            ];
            await app.api.collaboration.executeTask(data.matter.formLetter.process, data.matter.formLetter.tasks.flTask);
            await app.api.collaboration.returnRecords(recordIds);
        });
        await app.step('Click Task Control -> Delegate', async () => {
            await app.ui.formLetterModal.click('taskControls');
            await app.ui.kendoPopup.selectItem('Delegate');
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.errorModal.getText('errorMessage', 0, { asDisplayed: true })).eql(
                    'One or more selected record(s) no longer resides at the current task due to:\n' +
                    'Record deletion\n' +
                    'Submission\n' +
                    'Return by another user\n' +
                    'Task delegation\n' +
                    'Task responsibility');
        });
    })
    .after(async () => {
        await app.step('Remove all records from tasks (API)', async () => {
            try {
                await app.api.collaboration.executeTask(data.matter.formLetter.process, data.matter.formLetter.tasks.previousTask);
                await app.api.collaboration.removeAllRecords();
                await app.api.collaboration.executeTask(data.matter.formLetter.process, data.matter.formLetter.tasks.flTask);
                await app.api.collaboration.removeAllRecords();
                await app.api.collaboration.executeTask(data.matter.formLetter.process, data.matter.formLetter.tasks.nextTask);
                await app.api.collaboration.removeAllRecords();
            } catch (err) { }
        });
        await app.step('Remove created records (API)', async () => {
            await app.api.combinedFunctionality.deleteRecords(app.memory.current.recordsArray.map((x) => x.respData));
        });
    });

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step('Add records to the Email task (API)', async () => {
            await app.api.login();
            await app.api.collaboration.executeTask(data.action.email.process, data.action.email.tasks.previousTask);
            await app.api.collaboration.submitFirstRecords(5);
        });
    })
    ('Verify Remove on the Email modal for Action process (Step 1-6, 12)', async (t: TestController) => {
        await app.step('Open Collaboration Portal (Step 2)', async () => {
            await app.ui.getRole(undefined, '/UI/collaboration');
            await app.ui.waitLoading();
        });
        await app.step('Open the Email task', async () => {
            const process = app.ui.collaborationBoard.getProcess(data.action.email.process);
            const task = process.getTask(data.action.email.tasks.emailTask);
            await task.open();
            await app.ui.waitLoading();
        });
        await app.step('Select records and click Open (Step 3)', async () => {
            const query = app.ui.queryBoard.queryResultsGrid;
            await query.getCheckbox(0).check();
            await query.getCheckbox(1).check();
            await query.getCheckbox(2).check();
            await app.ui.queryBoard.click('menuItems', 'Open');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.emailModal.isVisible()).ok();
        });
        await app.step('Verify the Remove button (Step 4)', async () => {
            await app.ui.emailModal.click('taskControls');
            await t
                .expect(await app.ui.kendoPopup.isEnabled('simpleItems', 'Remove')).ok();
        });
        await app.step('Click the Remove button (Step 5)', async () => {
            await app.ui.kendoPopup.selectItem('Remove');
            await t
                .expect(await app.ui.confirmationModal.isVisible()).ok()
                .expect(await app.ui.confirmationModal.getText('confirmationMessage')).eql('Are you sure you want to remove the selected record(s) from the process?')
                .expect(await app.ui.confirmationModal.isVisible('buttons', 'Yes')).ok()
                .expect(await app.ui.confirmationModal.isVisible('buttons', 'Cancel')).ok();
        });
        await app.step('Click "Yes" on the Confirmation modal (Step 6)', async () => {
            const recordBefore = await app.ui.emailModal.getText('title', 0, { asDisplayed: true });
            const previewListBefore = await app.ui.emailModal.getPreviewListItems();
            const nextRecord = previewListBefore[previewListBefore.indexOf(recordBefore) + 1];
            await app.ui.confirmationModal.click('buttons', 'Yes');
            await app.ui.waitLoading();
            const previewListAfter = await app.ui.emailModal.getPreviewListItems();
            const recordAfter = await app.ui.emailModal.getText('title', 0, { asDisplayed: true });

            await t
                .expect(await app.ui.emailModal.isVisible()).ok()
                .expect(previewListAfter).eql(app.services.array.removeFirstOccurance(previewListBefore, recordBefore))
                .expect(await app.ui.emailModal.getSelectedRecord()).eql(nextRecord)
                .expect(recordAfter).eql(nextRecord);
        });
        await app.step('Click "Cancel" on the Confirmation modal (Step 12)', async () => {
            const recordBefore = await app.ui.emailModal.getText('title', 0, { asDisplayed: true });
            const previewListBefore = await app.ui.emailModal.getPreviewListItems();
            await app.ui.emailModal.click('taskControls');
            await app.ui.kendoPopup.selectItem('Remove');
            await app.ui.confirmationModal.cancel();
            await app.ui.waitLoading();
            const previewListAfter = await app.ui.emailModal.getPreviewListItems();
            const recordAfter = await app.ui.emailModal.getText('title', 0, { asDisplayed: true });

            await t
                .expect(await app.ui.confirmationModal.waitTillElementNotPresent()).ok()
                .expect(recordBefore).eql(recordAfter)
                .expect(previewListBefore).eql(previewListAfter);
        });
    })
    .after(async () => {
        await app.step(`Return all records to the '${data.action.email.tasks.previousTask}' task (API)`, async () => {
            try {
                await app.api.collaboration.executeTask(data.action.email.process, data.action.email.tasks.nextTask);
                await app.api.collaboration.returnAllRecords();
                await app.api.collaboration.executeTask(data.action.email.process, data.action.email.tasks.emailTask);
                await app.api.collaboration.returnAllRecords();
            } catch (err) { }
        });
    });

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step('Add records to the Email task (API)', async () => {
            await app.api.login();
            await app.api.collaboration.executeTask(data.action.email.process, data.action.email.tasks.previousTask);
            await app.api.collaboration.submitFirstRecords(5);
        });
    })
    ('Verify Remove on the Email modal when one of the records is removed for Action process (Step 7-9)', async (t: TestController) => {
        await app.step('Open Collaboration Portal', async () => {
            await app.ui.getRole(undefined, '/UI/collaboration');
            await app.ui.waitLoading();
        });
        await app.step('Open the Email task', async () => {
            const process = app.ui.collaborationBoard.getProcess(data.action.email.process);
            const task = process.getTask(data.action.email.tasks.emailTask);
            await task.open();
        });
        await app.step('Select 3 records and click Open (Step 7)', async () => {
            const query = app.ui.queryBoard;
            await query.queryResultsGrid.getCheckbox(0).check();
            await query.queryResultsGrid.getCheckbox(1).check();
            await query.queryResultsGrid.getCheckbox(2).check();
            await app.ui.queryBoard.click('menuItems', 'Open');
            await app.ui.waitLoading();
        });
        await app.step('Delete one of the selected records (API) (Step 8)', async () => {
            await app.api.collaboration.executeTask(data.action.email.process, data.action.email.tasks.emailTask);
            const recordId = {
                 masterId: await (await app.ui.queryBoard.queryResultsGrid.getRecord(1)).getValue(data.action.email.masterIdColumnName),
                    childId: await (await app.ui.queryBoard.queryResultsGrid.getRecord(1)).getValue(data.action.email.childIdColumnName)
                };
            await app.api.collaboration.removeRecordsWithChild([ recordId ]);
        });
        await app.step('Select Remove from Task Controls on the Email modal (Step 9)', async () => {
            await app.ui.emailModal.click('taskControls');
            await app.ui.kendoPopup.selectItem('Remove');
            await app.ui.confirmationModal.confirm();
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.emailModal.getText('errorContainer', 0, { asDisplayed: true })).eql(
                    'Attention\n' +
                    'One or more selected record(s) no longer resides at the current task due to:\n' +
                    ' Record deletion\n' +
                    ' Submission\n' +
                    ' Return by another user\n' +
                    ' Task delegation\n' +
                    ' Task responsibility');
        });
    })
    .after(async () => {
        await app.step(`Return all records to the '${data.action.email.tasks.previousTask}' task (API)`, async () => {
            try {
                await app.api.collaboration.executeTask(data.action.email.process, data.action.email.tasks.nextTask);
                await app.api.collaboration.returnAllRecords();
                await app.api.collaboration.executeTask(data.action.email.process, data.action.email.tasks.emailTask);
                await app.api.collaboration.returnAllRecords();
            } catch (err) { }
        });
    });

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step('Add records to the Email task (API)', async () => {
            await app.api.login();
            await app.api.collaboration.executeTask(data.action.email.process, data.action.email.tasks.previousTask);
            await app.api.collaboration.submitFirstRecords(5);
        });
    })
    ('Verify Remove in the task when one of the records is removed for Action process (Step 10)', async (t: TestController) => {
        await app.step('Open Collaboration Portal', async () => {
            await app.ui.getRole(undefined, '/UI/collaboration');
            await app.ui.waitLoading();
        });
        await app.step('Open the Email task', async () => {
            const process = app.ui.collaborationBoard.getProcess(data.action.email.process);
            const task = process.getTask(data.action.email.tasks.emailTask);
            await task.open();
            await app.ui.waitLoading();
        });
        await app.step('Delete one of the selected records (API)', async () => {
            const recordId = {
                masterId: await (await app.ui.queryBoard.queryResultsGrid.getRecord(1)).getValue(data.action.email.masterIdColumnName),
                   childId: await (await app.ui.queryBoard.queryResultsGrid.getRecord(1)).getValue(data.action.email.childIdColumnName)
               };
            await app.api.collaboration.executeTask(data.action.email.process, data.action.email.tasks.emailTask);
            await app.api.collaboration.removeRecordsWithChild([ recordId ]);
        });
        await app.step('Select 3 records and click Open', async () => {
            const query = app.ui.queryBoard;
            await query.queryResultsGrid.getCheckbox(0).check();
            await query.queryResultsGrid.getCheckbox(1).check();
            await query.queryResultsGrid.getCheckbox(2).check();
            await app.ui.queryBoard.click('menuItems', 'Open');
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.emailModal.getText('errorContainer', 0, { asDisplayed: true })).eql(
                    'Attention\n' +
                    'One or more selected record(s) no longer resides at the current task due to:\n' +
                    ' Record deletion\n' +
                    ' Submission\n' +
                    ' Return by another user\n' +
                    ' Task delegation\n' +
                    ' Task responsibility');
        });
    })
    .after(async () => {
        await app.step(`Return all records to the '${data.action.email.tasks.previousTask}' task (API)`, async () => {
            try {
                await app.api.collaboration.executeTask(data.action.email.process, data.action.email.tasks.nextTask);
                await app.api.collaboration.returnAllRecords();
                await app.api.collaboration.executeTask(data.action.email.process, data.action.email.tasks.emailTask);
                await app.api.collaboration.returnAllRecords();
            } catch (err) { }
        });
    });

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step('Add records to the Email task (API)', async () => {
            await app.api.login();
            await app.api.collaboration.executeTask(data.action.email.process, data.action.email.tasks.previousTask);
            await app.api.collaboration.submitFirstRecords(5);
        });
    })
    ('Verify Delegate on the Email modal when all records are removed for Action process (Step 11)', async (t: TestController) => {
        await app.step('Open Collaboration Portal', async () => {
            await app.ui.getRole(undefined, '/UI/collaboration');
            await app.ui.waitLoading();
        });
        await app.step('Open the Email task', async () => {
            const process = app.ui.collaborationBoard.getProcess(data.action.email.process);
            const task = process.getTask(data.action.email.tasks.emailTask);
            await task.open();
            await app.ui.waitLoading();
        });
        await app.step('Select 3 records and click Open', async () => {
            const query = app.ui.queryBoard;
            await query.queryResultsGrid.getCheckbox(0).check();
            await query.queryResultsGrid.getCheckbox(1).check();
            await query.queryResultsGrid.getCheckbox(2).check();
            await app.ui.queryBoard.click('menuItems', 'Open');
            await app.ui.waitLoading();
        });
        await app.step('Delete one of the selected records (API)', async () => {
            const queryGrid = app.ui.queryBoard.queryResultsGrid;
            const recordIds = [
                { masterId: await (await queryGrid.getRecord(0)).getValue(data.action.email.masterIdColumnName),
                    childId: await (await queryGrid.getRecord(0)).getValue(data.action.email.childIdColumnName)},
                { masterId: await (await queryGrid.getRecord(1)).getValue(data.action.email.masterIdColumnName),
                    childId: await (await queryGrid.getRecord(1)).getValue(data.action.email.childIdColumnName)},
                { masterId: await (await queryGrid.getRecord(2)).getValue(data.action.email.masterIdColumnName),
                    childId: await (await queryGrid.getRecord(2)).getValue(data.action.email.childIdColumnName)}
            ];
            await app.api.collaboration.executeTask(data.action.email.process, data.action.email.tasks.emailTask);
            await app.api.collaboration.removeRecordsWithChild(recordIds);
        });
        await app.step('Click Task Control -> Delegate', async () => {
            await app.ui.emailModal.click('taskControls');
            await app.ui.kendoPopup.selectItem('Delegate');
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.errorModal.getText('errorMessage', 0, { asDisplayed: true })).eql(
                    'One or more selected record(s) no longer resides at the current task due to:\n' +
                    'Record deletion\n' +
                    'Submission\n' +
                    'Return by another user\n' +
                    'Task delegation\n' +
                    'Task responsibility');
        });
    })
    .after(async () => {
        await app.step(`Return all records to the '${data.action.email.tasks.previousTask}' task (API)`, async () => {
            try {
                await app.api.collaboration.executeTask(data.action.email.process, data.action.email.tasks.nextTask);
                await app.api.collaboration.returnAllRecords();
                await app.api.collaboration.executeTask(data.action.email.process, data.action.email.tasks.emailTask);
                await app.api.collaboration.returnAllRecords();
            } catch (err) { }
        });
    });

test
    // .only
    .meta('brief', 'true')
    .requestHooks(app.ui.requestLogger.collaborationSubmit)
    .before(async () => {
        await app.step('Add records to the Email task (API)', async () => {
            await app.api.login();
            await app.api.collaboration.executeTask(data.action.email.process, data.action.email.tasks.previousTask);
            await app.api.collaboration.submitFirstRecords(5);
        });
    })
    ('Verify Submit on the Email modal for Action process (Step 1-5)', async (t: TestController) => {
        await app.step('Open Collaboration Portal', async () => {
            await app.ui.getRole(undefined, '/UI/collaboration');
            await app.ui.waitLoading();
        });
        await app.step('Open the Email task', async () => {
            const process = app.ui.collaborationBoard.getProcess(data.action.email.process);
            const task = process.getTask(data.action.email.tasks.emailTask);
            await task.open();
        });
        await app.step('Select records and click Open (Step 3)', async () => {
            const query = app.ui.queryBoard.queryResultsGrid;
            await query.getCheckbox(0).check();
            await query.getCheckbox(1).check();
            await query.getCheckbox(2).check();
            await app.ui.queryBoard.click('menuItems', 'Open');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.emailModal.isVisible()).ok();
        });
        await app.step('Verify the Submit button (Step 4)', async () => {
            await app.ui.emailModal.click('taskControls');
            await t
                .expect(await app.ui.kendoPopup.isEnabled('simpleItems', 'Submit')).ok();
        });
        await app.step('Click the Submit button (Step 5)', async () => {
            const recordBefore = await app.ui.emailModal.getText('title', 0, { asDisplayed: true });
            const previewListBefore = await app.ui.emailModal.getPreviewListItems();
            const nextRecord = previewListBefore[previewListBefore.indexOf(recordBefore) + 1];
            await app.ui.kendoPopup.selectItem('Submit');
            await app.ui.waitLoading();
            const previewListAfter = await app.ui.emailModal.getPreviewListItems();
            const recordAfter = await app.ui.emailModal.getText('title', 0, { asDisplayed: true });

            await t
                .expect(await app.ui.emailModal.isVisible()).ok()
                .expect(previewListAfter).eql(app.services.array.removeFirstOccurance(previewListBefore, recordBefore))
                .expect(await app.ui.emailModal.getSelectedRecord()).eql(nextRecord)
                .expect(recordAfter).eql(nextRecord);
        });
        await app.step('Verify record is submitted (API)', async () => {
            const submittedRecordId = app.ui.getLastRequestBody('collaborationSubmit').selectedRecords[0].masterId;
            await app.api.collaboration.executeTask(data.action.email.process, data.action.email.tasks.nextTask);
            const ids = await app.api.collaboration.getRecordIdsFromResults();
            await t
                .expect(ids.includes(submittedRecordId.toString())).ok();
        });
    })
    .after(async () => {
        await app.step(`Return all records to the '${data.action.email.tasks.previousTask}' task (API)`, async () => {
            try {
                await app.api.collaboration.executeTask(data.action.email.process, data.action.email.tasks.nextTask);
                await app.api.collaboration.returnAllRecords();
                await app.api.collaboration.executeTask(data.action.email.process, data.action.email.tasks.emailTask);
                await app.api.collaboration.returnAllRecords();
            } catch (err) { }
        });
    });

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step('Add records to the Email task (API)', async () => {
            await app.api.login();
            await app.api.collaboration.executeTask(data.action.email.process, data.action.email.tasks.previousTask);
            await app.api.collaboration.submitFirstRecords(5);
        });
    })
    ('Verify Submit on the Email modal when one of the records is submitted for Action process (Step 7-9)', async (t: TestController) => {
        await app.step('Open Collaboration Portal', async () => {
            await app.ui.getRole(undefined, '/UI/collaboration');
            await app.ui.waitLoading();
        });
        await app.step('Open the Email task', async () => {
            const process = app.ui.collaborationBoard.getProcess(data.action.email.process);
            const task = process.getTask(data.action.email.tasks.emailTask);
            await task.open();
        });
        await app.step('Select 3 records and click Open (Step 7)', async () => {
            const query = app.ui.queryBoard;
            await query.queryResultsGrid.getCheckbox(0).check();
            await query.queryResultsGrid.getCheckbox(1).check();
            await query.queryResultsGrid.getCheckbox(2).check();
            await app.ui.queryBoard.click('menuItems', 'Open');
            await app.ui.waitLoading();
        });
        await app.step('Submit one of the selected records (API) (Step 8)', async () => {
            const recordId = {
                masterId: await (await app.ui.queryBoard.queryResultsGrid.getRecord(1)).getValue(data.action.email.masterIdColumnName),
                   childId: await (await app.ui.queryBoard.queryResultsGrid.getRecord(1)).getValue(data.action.email.childIdColumnName)
               };
            await app.api.collaboration.executeTask(data.action.email.process, data.action.email.tasks.emailTask);
            await app.api.collaboration.submitRecordsWithChild([ recordId ]);
        });
        await app.step('Select Submit from Task Controls on the Email modal (Step 9)', async () => {
            await app.ui.emailModal.click('taskControls');
            await app.ui.kendoPopup.selectItem('Submit');
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.emailModal.getText('errorContainer', 0, { asDisplayed: true })).eql(
                    'Attention\n' +
                    'One or more selected record(s) no longer resides at the current task due to:\n' +
                    ' Record deletion\n' +
                    ' Submission\n' +
                    ' Return by another user\n' +
                    ' Task delegation\n' +
                    ' Task responsibility');
        });
    })
    .after(async () => {
        await app.step(`Return all records to the '${data.action.email.tasks.previousTask}' task (API)`, async () => {
            try {
                await app.api.collaboration.executeTask(data.action.email.process, data.action.email.tasks.nextTask);
                await app.api.collaboration.returnAllRecords();
                await app.api.collaboration.executeTask(data.action.email.process, data.action.email.tasks.emailTask);
                await app.api.collaboration.returnAllRecords();
            } catch (err) { }
        });
    });

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step('Add records to the Email task (API)', async () => {
            await app.api.login();
            await app.api.collaboration.executeTask(data.action.email.process, data.action.email.tasks.previousTask);
            await app.api.collaboration.submitFirstRecords(5);
        });
    })
    ('Verify Email modal in the task when one of the records is submited for Action process (Step 10)', async (t: TestController) => {
        await app.step('Open Collaboration Portal', async () => {
            await app.ui.getRole(undefined, '/UI/collaboration');
            await app.ui.waitLoading();
        });
        await app.step('Open the Email task', async () => {
            const process = app.ui.collaborationBoard.getProcess(data.action.email.process);
            const task = process.getTask(data.action.email.tasks.emailTask);
            await task.open();
            await app.ui.waitLoading();
        });
        await app.step('Submit one of the selected records (API)', async () => {
            const recordId = {
                masterId: await (await app.ui.queryBoard.queryResultsGrid.getRecord(1)).getValue(data.action.email.masterIdColumnName),
                   childId: await (await app.ui.queryBoard.queryResultsGrid.getRecord(1)).getValue(data.action.email.childIdColumnName)
               };
            await app.api.collaboration.executeTask(data.action.email.process, data.action.email.tasks.emailTask);
            await app.api.collaboration.submitRecordsWithChild([ recordId ]);
        });
        await app.step('Select 3 records and click Open', async () => {
            const query = app.ui.queryBoard;
            await query.queryResultsGrid.getCheckbox(0).check();
            await query.queryResultsGrid.getCheckbox(1).check();
            await query.queryResultsGrid.getCheckbox(2).check();
            await app.ui.queryBoard.click('menuItems', 'Open');
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.emailModal.getText('errorContainer', 0, { asDisplayed: true })).eql(
                    'Attention\n' +
                    'One or more selected record(s) no longer resides at the current task due to:\n' +
                    ' Record deletion\n' +
                    ' Submission\n' +
                    ' Return by another user\n' +
                    ' Task delegation\n' +
                    ' Task responsibility');
        });
    })
    .after(async () => {
        await app.step(`Return all records to the '${data.action.email.tasks.previousTask}' task (API)`, async () => {
            try {
                await app.api.collaboration.executeTask(data.action.email.process, data.action.email.tasks.nextTask);
                await app.api.collaboration.returnAllRecords();
                await app.api.collaboration.executeTask(data.action.email.process, data.action.email.tasks.emailTask);
                await app.api.collaboration.returnAllRecords();
            } catch (err) { }
        });
    });

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step('Add records to the Email task (API)', async () => {
            await app.api.login();
            await app.api.collaboration.executeTask(data.action.email.process, data.action.email.tasks.previousTask);
            await app.api.collaboration.submitFirstRecords(5);
        });
    })
    ('Verify Delegate on the Email modal when all records are submited for Action process (Step 11)', async (t: TestController) => {
        await app.step('Open Collaboration Portal', async () => {
            await app.ui.getRole(undefined, '/UI/collaboration');
            await app.ui.waitLoading();
        });
        await app.step('Open the Email task', async () => {
            const process = app.ui.collaborationBoard.getProcess(data.action.email.process);
            const task = process.getTask(data.action.email.tasks.emailTask);
            await task.open();
            await app.ui.waitLoading();
        });
        await app.step('Select 3 records and click Open', async () => {
            const query = app.ui.queryBoard;
            await query.queryResultsGrid.getCheckbox(0).check();
            await query.queryResultsGrid.getCheckbox(1).check();
            await query.queryResultsGrid.getCheckbox(2).check();
            await app.ui.queryBoard.click('menuItems', 'Open');
            await app.ui.waitLoading();
        });
        await app.step('Submit all selected records (API)', async () => {
            const queryGrid = app.ui.queryBoard.queryResultsGrid;
            const recordIds = [
                { masterId: await (await queryGrid.getRecord(0)).getValue(data.action.email.masterIdColumnName),
                    childId: await (await queryGrid.getRecord(0)).getValue(data.action.email.childIdColumnName)},
                { masterId: await (await queryGrid.getRecord(1)).getValue(data.action.email.masterIdColumnName),
                    childId: await (await queryGrid.getRecord(1)).getValue(data.action.email.childIdColumnName)},
                { masterId: await (await queryGrid.getRecord(2)).getValue(data.action.email.masterIdColumnName),
                    childId: await (await queryGrid.getRecord(2)).getValue(data.action.email.childIdColumnName)}
            ];
            await app.api.collaboration.executeTask(data.action.email.process, data.action.email.tasks.emailTask);
            await app.api.collaboration.submitRecordsWithChild(recordIds);
        });
        await app.step('Click Task Control -> Delegate', async () => {
            await app.ui.emailModal.click('taskControls');
            await app.ui.kendoPopup.selectItem('Delegate');
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.errorModal.getText('errorMessage', 0, { asDisplayed: true })).eql(
                    'One or more selected record(s) no longer resides at the current task due to:\n' +
                    'Record deletion\n' +
                    'Submission\n' +
                    'Return by another user\n' +
                    'Task delegation\n' +
                    'Task responsibility');
        });
    })
    .after(async () => {
        await app.step(`Return all records to the '${data.action.email.tasks.previousTask}' task (API)`, async () => {
            try {
                await app.api.collaboration.executeTask(data.action.email.process, data.action.email.tasks.nextTask);
                await app.api.collaboration.returnAllRecords();
                await app.api.collaboration.executeTask(data.action.email.process, data.action.email.tasks.emailTask);
                await app.api.collaboration.returnAllRecords();
            } catch (err) { }
        });
    });

test
    // .only
    .meta('brief', 'true')
    .requestHooks(app.ui.requestLogger.collaborationReturn)
    .before(async () => {
        await app.step('Add records to the Email task (API)', async () => {
            await app.api.login();
            await app.api.collaboration.executeTask(data.action.email.process, data.action.email.tasks.previousTask);
            await app.api.collaboration.submitAllRecords();
        });
    })
    ('Verify Return on the Email modal for Action process for Action process (Step 1-6, 12)', async (t: TestController) => {
        await app.step('Open Collaboration Portal (Step 2)', async () => {
            await app.ui.getRole(undefined, '/UI/collaboration');
            await app.ui.waitLoading();
        });
        await app.step('Open the Email task', async () => {
            const process = app.ui.collaborationBoard.getProcess(data.action.email.process);
            const task = process.getTask(data.action.email.tasks.emailTask);
            await task.open();
        });
        await app.step('Select records and click Open (Step 3)', async () => {
            const query = app.ui.queryBoard.queryResultsGrid;
            await query.getCheckbox(0).check();
            await query.getCheckbox(1).check();
            await query.getCheckbox(2).check();
            await app.ui.queryBoard.click('menuItems', 'Open');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.emailModal.isVisible()).ok();
        });
        await app.step('Verify the Return button (Step 4)', async () => {
            await app.ui.emailModal.click('taskControls');
            await t
                .expect(await app.ui.kendoPopup.isEnabled('simpleItems', 'Remove')).ok();
        });
        await app.step('Click the Return button (Step 5)', async () => {
            await app.ui.kendoPopup.selectItem('Return');
            await t
                .expect(await app.ui.confirmationModal.isVisible()).ok()
                .expect(await app.ui.confirmationModal.getText('confirmationMessage')).eql('Are you sure you want to reassign selected record(s) to the previous task?')
                .expect(await app.ui.confirmationModal.isVisible('buttons', 'Yes')).ok()
                .expect(await app.ui.confirmationModal.isVisible('buttons', 'Cancel')).ok();
        });
        await app.step('Click "Yes" on the Confirmation modal (Step 6)', async () => {
            const recordBefore = await app.ui.emailModal.getText('title', 0, { asDisplayed: true });
            const previewListBefore = await app.ui.emailModal.getPreviewListItems();
            const nextRecord = previewListBefore[previewListBefore.indexOf(recordBefore) + 1];
            await app.ui.confirmationModal.click('buttons', 'Yes');
            await app.ui.waitLoading();
            const previewListAfter = await app.ui.emailModal.getPreviewListItems();
            const recordAfter = await app.ui.emailModal.getText('title', 0, { asDisplayed: true });

            await t
                .expect(await app.ui.emailModal.isVisible()).ok()
                .expect(previewListAfter).eql(previewListBefore.filter((x, i, list) => x !== recordBefore || list.findIndex((y) => y === x) !== i))
                .expect(await app.ui.emailModal.getSelectedRecord()).eql(nextRecord)
                .expect(recordAfter).eql(nextRecord);
        });
        await app.step('Click "Cancel" on the Confirmation modal (Step 12)', async () => {
            const recordBefore = await app.ui.emailModal.getText('title', 0, { asDisplayed: true });
            const previewListBefore = await app.ui.emailModal.getPreviewListItems();
            await app.ui.emailModal.click('taskControls');
            await app.ui.kendoPopup.selectItem('Return');
            await app.ui.confirmationModal.cancel();
            await app.ui.waitLoading();
            const previewListAfter = await app.ui.emailModal.getPreviewListItems();
            const recordAfter = await app.ui.emailModal.getText('title', 0, { asDisplayed: true });

            await t
                .expect(await app.ui.confirmationModal.waitTillElementNotPresent()).ok()
                .expect(recordBefore).eql(recordAfter)
                .expect(previewListBefore).eql(previewListAfter);
        });
        await app.step('Verify record is submitted (API)', async () => {
            const submittedRecordId = app.ui.getLastRequestBody('collaborationReturn')[0].masterId;
            await app.api.collaboration.executeTask(data.action.email.process, data.action.email.tasks.previousTask);
            const ids = await app.api.collaboration.getRecordIdsFromResults();
            await t
                .expect(ids.includes(submittedRecordId.toString())).ok();
        });
    })
    .after(async () => {
        await app.step(`Return all records to the '${data.action.email.tasks.previousTask}' task (API)`, async () => {
            try {
                await app.api.collaboration.executeTask(data.action.email.process, data.action.email.tasks.nextTask);
                await app.api.collaboration.returnAllRecords();
                await app.api.collaboration.executeTask(data.action.email.process, data.action.email.tasks.emailTask);
                await app.api.collaboration.returnAllRecords();
            } catch (err) { }
        });
    });

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step('Add records to the Email task (API)', async () => {
            await app.api.login();
            await app.api.collaboration.executeTask(data.action.email.process, data.action.email.tasks.previousTask);
            await app.api.collaboration.submitFirstRecords(5);
        });
    })
    ('Verify Return on the Email modal when one of the records is returned for Action process (Step 7-9)', async (t: TestController) => {
        await app.step('Open Collaboration Portal', async () => {
            await app.ui.getRole(undefined, '/UI/collaboration');
            await app.ui.waitLoading();
        });
        await app.step('Open the Email task', async () => {
            const process = app.ui.collaborationBoard.getProcess(data.action.email.process);
            const task = process.getTask(data.action.email.tasks.emailTask);
            await task.open();
        });
        await app.step('Select 3 records and click Open (Step 7)', async () => {
            const query = app.ui.queryBoard;
            await query.queryResultsGrid.getCheckbox(0).check();
            await query.queryResultsGrid.getCheckbox(1).check();
            await query.queryResultsGrid.getCheckbox(2).check();
            await app.ui.queryBoard.click('menuItems', 'Open');
            await app.ui.waitLoading();
        });
        await app.step('Return one of the selected records (API) (Step 8)', async () => {
            const recordId = {
                masterId: await (await app.ui.queryBoard.queryResultsGrid.getRecord(1)).getValue(data.action.email.masterIdColumnName),
                   childId: await (await app.ui.queryBoard.queryResultsGrid.getRecord(1)).getValue(data.action.email.childIdColumnName)
               };
            await app.api.collaboration.executeTask(data.action.email.process, data.action.email.tasks.emailTask);
            await app.api.collaboration.returnRecordsWithChild([ recordId ]);
        });
        await app.step('Select Return from Task Controls on the Email modal (Step 9)', async () => {
            await app.ui.emailModal.click('taskControls');
            await app.ui.kendoPopup.selectItem('Return');
            await app.ui.confirmationModal.confirm();
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.emailModal.getText('errorContainer', 0, { asDisplayed: true })).eql(
                    'Attention\n' +
                    'One or more selected record(s) no longer resides at the current task due to:\n' +
                    ' Record deletion\n' +
                    ' Submission\n' +
                    ' Return by another user\n' +
                    ' Task delegation\n' +
                    ' Task responsibility');
        });
    })
    .after(async () => {
        await app.step(`Return all records to the '${data.action.email.tasks.previousTask}' task (API)`, async () => {
            try {
                await app.api.collaboration.executeTask(data.action.email.process, data.action.email.tasks.nextTask);
                await app.api.collaboration.returnAllRecords();
                await app.api.collaboration.executeTask(data.action.email.process, data.action.email.tasks.emailTask);
                await app.api.collaboration.returnAllRecords();
            } catch (err) { }
        });
    });

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step('Add records to the Email task (API)', async () => {
            await app.api.login();
            await app.api.collaboration.executeTask(data.action.email.process, data.action.email.tasks.previousTask);
            await app.api.collaboration.submitFirstRecords(5);
        });
    })
    ('Verify Email modal in the task when one of the records is returned for Action process (Step 10)', async (t: TestController) => {
        await app.step('Open Collaboration Portal', async () => {
            await app.ui.getRole(undefined, '/UI/collaboration');
            await app.ui.waitLoading();
        });
        await app.step('Open the Email task', async () => {
            const process = app.ui.collaborationBoard.getProcess(data.action.email.process);
            const task = process.getTask(data.action.email.tasks.emailTask);
            await task.open();
            await app.ui.waitLoading();
        });
        await app.step('Return one of the selected records (API)', async () => {
            const recordId = {
                masterId: await (await app.ui.queryBoard.queryResultsGrid.getRecord(1)).getValue(data.action.email.masterIdColumnName),
                   childId: await (await app.ui.queryBoard.queryResultsGrid.getRecord(1)).getValue(data.action.email.childIdColumnName)
               };
            await app.api.collaboration.executeTask(data.action.email.process, data.action.email.tasks.emailTask);
            await app.api.collaboration.returnRecordsWithChild([ recordId ]);
        });
        await app.step('Select 3 records and click Open', async () => {
            const query = app.ui.queryBoard;
            await query.queryResultsGrid.getCheckbox(0).check();
            await query.queryResultsGrid.getCheckbox(1).check();
            await query.queryResultsGrid.getCheckbox(2).check();
            await app.ui.queryBoard.click('menuItems', 'Open');
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.emailModal.getText('errorContainer', 0, { asDisplayed: true })).eql(
                    'Attention\n' +
                    'One or more selected record(s) no longer resides at the current task due to:\n' +
                    ' Record deletion\n' +
                    ' Submission\n' +
                    ' Return by another user\n' +
                    ' Task delegation\n' +
                    ' Task responsibility');
        });
    })
    .after(async () => {
        await app.step(`Return all records to the '${data.action.email.tasks.previousTask}' task (API)`, async () => {
            try {
                await app.api.collaboration.executeTask(data.action.email.process, data.action.email.tasks.nextTask);
                await app.api.collaboration.returnAllRecords();
                await app.api.collaboration.executeTask(data.action.email.process, data.action.email.tasks.emailTask);
                await app.api.collaboration.returnAllRecords();
            } catch (err) { }
        });
    });

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step('Add records to the Email task (API)', async () => {
            await app.api.login();
            await app.api.collaboration.executeTask(data.action.email.process, data.action.email.tasks.previousTask);
            await app.api.collaboration.submitFirstRecords(5);
        });
    })
    ('Verify Delegate on the Email modal when all records are returned for Action process (Step 11)', async (t: TestController) => {
        await app.step('Open Collaboration Portal', async () => {
            await app.ui.getRole(undefined, '/UI/collaboration');
            await app.ui.waitLoading();
        });
        await app.step('Open the Email task', async () => {
            const process = app.ui.collaborationBoard.getProcess(data.action.email.process);
            const task = process.getTask(data.action.email.tasks.emailTask);
            await task.open();
            await app.ui.waitLoading();
        });
        await app.step('Select 3 records and click Open', async () => {
            const query = app.ui.queryBoard;
            await query.queryResultsGrid.getCheckbox(0).check();
            await query.queryResultsGrid.getCheckbox(1).check();
            await query.queryResultsGrid.getCheckbox(2).check();
            await app.ui.queryBoard.click('menuItems', 'Open');
            await app.ui.waitLoading();
        });
        await app.step('Return all selected records (API)', async () => {
            const queryGrid = app.ui.queryBoard.queryResultsGrid;
            const recordIds = [
                { masterId: await (await queryGrid.getRecord(0)).getValue(data.action.email.masterIdColumnName),
                    childId: await (await queryGrid.getRecord(0)).getValue(data.action.email.childIdColumnName)},
                { masterId: await (await queryGrid.getRecord(1)).getValue(data.action.email.masterIdColumnName),
                    childId: await (await queryGrid.getRecord(1)).getValue(data.action.email.childIdColumnName)},
                { masterId: await (await queryGrid.getRecord(2)).getValue(data.action.email.masterIdColumnName),
                    childId: await (await queryGrid.getRecord(2)).getValue(data.action.email.childIdColumnName)}
            ];
            await app.api.collaboration.executeTask(data.action.email.process, data.action.email.tasks.emailTask);
            await app.api.collaboration.returnRecordsWithChild(recordIds);
        });
        await app.step('Click Task Control -> Delegate', async () => {
            await app.ui.emailModal.click('taskControls');
            await app.ui.kendoPopup.selectItem('Delegate');
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.errorModal.getText('errorMessage', 0, { asDisplayed: true })).eql(
                    'One or more selected record(s) no longer resides at the current task due to:\n' +
                    'Record deletion\n' +
                    'Submission\n' +
                    'Return by another user\n' +
                    'Task delegation\n' +
                    'Task responsibility');
        });
    })
    .after(async () => {
        await app.step(`Return all records to the '${data.action.email.tasks.previousTask}' task (API)`, async () => {
            try {
                await app.api.collaboration.executeTask(data.action.email.process, data.action.email.tasks.nextTask);
                await app.api.collaboration.returnAllRecords();
                await app.api.collaboration.executeTask(data.action.email.process, data.action.email.tasks.emailTask);
                await app.api.collaboration.returnAllRecords();
            } catch (err) { }
        });
    });

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step('Add records to the Form Letter task (API)', async () => {
            await app.api.login();
            await app.api.collaboration.executeTask(data.action.formLetter.process, data.action.formLetter.tasks.previousTask);
            await app.api.collaboration.submitFirstRecords(5);
        });
    })
    ('Verify Remove on the Form Letter modal for Action process (Step 1-6, 12)', async (t: TestController) => {
        await app.step('Open Collaboration Portal (Step 2)', async () => {
            await app.ui.getRole(undefined, '/UI/collaboration');
            await app.ui.waitLoading();
        });
        await app.step('Open the Form Letter task', async () => {
            const process = app.ui.collaborationBoard.getProcess(data.action.formLetter.process);
            const task = process.getTask(data.action.formLetter.tasks.flTask);
            await task.open();
            await app.ui.waitLoading();
        });
        await app.step('Select records and click Open (Step 3)', async () => {
            const query = app.ui.queryBoard.queryResultsGrid;
            await query.getCheckbox(0).check();
            await query.getCheckbox(1).check();
            await query.getCheckbox(2).check();
            await app.ui.queryBoard.click('menuItems', 'Open');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.formLetterModal.isVisible()).ok();
        });
        await app.step('Verify the Remove button (Step 4)', async () => {
            await app.ui.formLetterModal.click('taskControls');
            await t
                .expect(await app.ui.kendoPopup.isEnabled('simpleItems', 'Remove')).ok();
        });
        await app.step('Click the Remove button (Step 5)', async () => {
            await app.ui.kendoPopup.selectItem('Remove');
            await t
                .expect(await app.ui.confirmationModal.isVisible()).ok()
                .expect(await app.ui.confirmationModal.getText('confirmationMessage')).eql('Are you sure you want to remove the selected record(s) from the process?')
                .expect(await app.ui.confirmationModal.isVisible('buttons', 'Yes')).ok()
                .expect(await app.ui.confirmationModal.isVisible('buttons', 'Cancel')).ok();
        });
        await app.step('Click "Yes" on the Confirmation modal (Step 6)', async () => {
            const recordBefore = await app.ui.formLetterModal.getText('title', 0, { asDisplayed: true });
            const previewListBefore = await app.ui.formLetterModal.getPreviewListItems();
            const nextRecord = previewListBefore[previewListBefore.indexOf(recordBefore) + 1];
            await app.ui.confirmationModal.click('buttons', 'Yes');
            await app.ui.waitLoading();
            const previewListAfter = await app.ui.formLetterModal.getPreviewListItems();
            const recordAfter = await app.ui.formLetterModal.getText('title', 0, { asDisplayed: true });

            await t
                .expect(await app.ui.formLetterModal.isVisible()).ok()
                .expect(previewListAfter).eql(app.services.array.removeFirstOccurance(previewListBefore, recordBefore))
                .expect(await app.ui.formLetterModal.getSelectedRecord()).eql(nextRecord)
                .expect(recordAfter).eql(nextRecord);
        });
        await app.step('Click "Cancel" on the Confirmation modal (Step 12)', async () => {
            const recordBefore = await app.ui.formLetterModal.getText('title', 0, { asDisplayed: true });
            const previewListBefore = await app.ui.formLetterModal.getPreviewListItems();
            await app.ui.formLetterModal.click('taskControls');
            await app.ui.kendoPopup.selectItem('Remove');
            await app.ui.confirmationModal.cancel();
            await app.ui.waitLoading();
            const previewListAfter = await app.ui.formLetterModal.getPreviewListItems();
            const recordAfter = await app.ui.formLetterModal.getText('title', 0, { asDisplayed: true });

            await t
                .expect(await app.ui.confirmationModal.waitTillElementNotPresent()).ok()
                .expect(recordBefore).eql(recordAfter)
                .expect(previewListBefore).eql(previewListAfter);
        });
    })
    .after(async () => {
        await app.step(`Return all records to the '${data.action.formLetter.tasks.previousTask}' task (API)`, async () => {
            try {
                await app.api.collaboration.executeTask(data.action.formLetter.process, data.action.formLetter.tasks.nextTask);
                await app.api.collaboration.returnAllRecords();
                await app.api.collaboration.executeTask(data.action.formLetter.process, data.action.formLetter.tasks.flTask);
                await app.api.collaboration.returnAllRecords();
            } catch (err) { }
        });
    });

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step('Add records to the Form Letter task (API)', async () => {
            await app.api.login();
            await app.api.collaboration.executeTask(data.action.formLetter.process, data.action.formLetter.tasks.previousTask);
            await app.api.collaboration.submitFirstRecords(5);
        });
    })
    ('Verify Remove on the Form Letter modal when one of the records is removed for Action process (Step 7-9)', async (t: TestController) => {
        await app.step('Open Collaboration Portal', async () => {
            await app.ui.getRole(undefined, '/UI/collaboration');
            await app.ui.waitLoading();
        });
        await app.step('Open the Form Letter task', async () => {
            const process = app.ui.collaborationBoard.getProcess(data.action.formLetter.process);
            const task = process.getTask(data.action.formLetter.tasks.flTask);
            await task.open();
        });
        await app.step('Select 3 records and click Open (Step 7)', async () => {
            const query = app.ui.queryBoard;
            await query.queryResultsGrid.getCheckbox(0).check();
            await query.queryResultsGrid.getCheckbox(1).check();
            await query.queryResultsGrid.getCheckbox(2).check();
            await app.ui.queryBoard.click('menuItems', 'Open');
            await app.ui.waitLoading();
        });
        await app.step('Delete one of the selected records (API) (Step 8)', async () => {
            const recordId = {
                masterId: await (await app.ui.queryBoard.queryResultsGrid.getRecord(1)).getValue(data.action.formLetter.masterIdColumnName),
                   childId: await (await app.ui.queryBoard.queryResultsGrid.getRecord(1)).getValue(data.action.formLetter.childIdColumnName)
               };
            await app.api.collaboration.executeTask(data.action.formLetter.process, data.action.formLetter.tasks.flTask);
            await app.api.collaboration.removeRecordsWithChild([ recordId ]);
        });
        await app.step('Select Remove from Task Controls on the From Letter modal (Step 9)', async () => {
            await app.ui.formLetterModal.click('taskControls');
            await app.ui.kendoPopup.selectItem('Remove');
            await app.ui.confirmationModal.confirm();
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.formLetterModal.getText('errorContainer', 0, { asDisplayed: true })).eql(
                    'Attention\n' +
                    'One or more selected record(s) no longer resides at the current task due to:\n' +
                    ' Record deletion\n' +
                    ' Submission\n' +
                    ' Return by another user\n' +
                    ' Task delegation\n' +
                    ' Task responsibility');
        });
    })
    .after(async () => {
        await app.step(`Return all records to the '${data.action.formLetter.tasks.previousTask}' task (API)`, async () => {
            try {
                await app.api.collaboration.executeTask(data.action.formLetter.process, data.action.formLetter.tasks.nextTask);
                await app.api.collaboration.returnAllRecords();
                await app.api.collaboration.executeTask(data.action.formLetter.process, data.action.formLetter.tasks.flTask);
                await app.api.collaboration.returnAllRecords();
            } catch (err) { }
        });
    });

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step('Add records to the Form Letter task (API)', async () => {
            await app.api.login();
            await app.api.collaboration.executeTask(data.action.formLetter.process, data.action.formLetter.tasks.previousTask);
            await app.api.collaboration.submitFirstRecords(5);
        });
    })
    ('Verify Remove in the task when one of the records is removed for Action process (Step 10)', async (t: TestController) => {
        await app.step('Open Collaboration Portal', async () => {
            await app.ui.getRole(undefined, '/UI/collaboration');
            await app.ui.waitLoading();
        });
        await app.step('Open the Form Letter task', async () => {
            const process = app.ui.collaborationBoard.getProcess(data.action.formLetter.process);
            const task = process.getTask(data.action.formLetter.tasks.flTask);
            await task.open();
            await app.ui.waitLoading();
        });
        await app.step('Delete one of the selected records (API)', async () => {
            const recordId = {
                masterId: await (await app.ui.queryBoard.queryResultsGrid.getRecord(1)).getValue(data.action.formLetter.masterIdColumnName),
                   childId: await (await app.ui.queryBoard.queryResultsGrid.getRecord(1)).getValue(data.action.formLetter.childIdColumnName)
               };
            await app.api.collaboration.executeTask(data.action.formLetter.process, data.action.formLetter.tasks.flTask);
            await app.api.collaboration.removeRecordsWithChild([ recordId ]);
        });
        await app.step('Select 3 records and click Open', async () => {
            const query = app.ui.queryBoard;
            await query.queryResultsGrid.getCheckbox(0).check();
            await query.queryResultsGrid.getCheckbox(1).check();
            await query.queryResultsGrid.getCheckbox(2).check();
            await app.ui.queryBoard.click('menuItems', 'Open');
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.formLetterModal.getText('errorContainer', 0, { asDisplayed: true })).eql(
                    'Attention\n' +
                    'One or more selected record(s) no longer resides at the current task due to:\n' +
                    ' Record deletion\n' +
                    ' Submission\n' +
                    ' Return by another user\n' +
                    ' Task delegation\n' +
                    ' Task responsibility');
        });
    })
    .after(async () => {
        await app.step(`Return all records to the '${data.action.formLetter.tasks.previousTask}' task (API)`, async () => {
            try {
                await app.api.collaboration.executeTask(data.action.formLetter.process, data.action.formLetter.tasks.nextTask);
                await app.api.collaboration.returnAllRecords();
                await app.api.collaboration.executeTask(data.action.formLetter.process, data.action.formLetter.tasks.flTask);
                await app.api.collaboration.returnAllRecords();
            } catch (err) { }
        });
    });

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step('Add records to the Form Letter task (API)', async () => {
            await app.api.login();
            await app.api.collaboration.executeTask(data.action.formLetter.process, data.action.formLetter.tasks.previousTask);
            await app.api.collaboration.submitFirstRecords(5);
        });
    })
    ('Verify Delegate on the Form Letter modal when all records are removed for Action process (Step 11)', async (t: TestController) => {
        await app.step('Open Collaboration Portal', async () => {
            await app.ui.getRole(undefined, '/UI/collaboration');
            await app.ui.waitLoading();
        });
        await app.step('Open the Form Letter task', async () => {
            const process = app.ui.collaborationBoard.getProcess(data.action.formLetter.process);
            const task = process.getTask(data.action.formLetter.tasks.flTask);
            await task.open();
            await app.ui.waitLoading();
        });
        await app.step('Select 3 records and click Open', async () => {
            const query = app.ui.queryBoard;
            await query.queryResultsGrid.getCheckbox(0).check();
            await query.queryResultsGrid.getCheckbox(1).check();
            await query.queryResultsGrid.getCheckbox(2).check();
            await app.ui.queryBoard.click('menuItems', 'Open');
            await app.ui.waitLoading();
        });
        await app.step('Delete one of the selected records (API)', async () => {
            const queryGrid = app.ui.queryBoard.queryResultsGrid;
            const recordIds = [
                { masterId: await (await queryGrid.getRecord(0)).getValue(data.action.formLetter.masterIdColumnName),
                    childId: await (await queryGrid.getRecord(0)).getValue(data.action.formLetter.childIdColumnName)},
                { masterId: await (await queryGrid.getRecord(1)).getValue(data.action.formLetter.masterIdColumnName),
                    childId: await (await queryGrid.getRecord(1)).getValue(data.action.formLetter.childIdColumnName)},
                { masterId: await (await queryGrid.getRecord(2)).getValue(data.action.formLetter.masterIdColumnName),
                    childId: await (await queryGrid.getRecord(2)).getValue(data.action.formLetter.childIdColumnName)}
            ];
            await app.api.collaboration.executeTask(data.action.formLetter.process, data.action.formLetter.tasks.flTask);
            await app.api.collaboration.removeRecordsWithChild(recordIds);
        });
        await app.step('Click Task Control -> Delegate', async () => {
            await app.ui.formLetterModal.click('taskControls');
            await app.ui.kendoPopup.selectItem('Delegate');
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.errorModal.getText('errorMessage', 0, { asDisplayed: true })).eql(
                    'One or more selected record(s) no longer resides at the current task due to:\n' +
                    'Record deletion\n' +
                    'Submission\n' +
                    'Return by another user\n' +
                    'Task delegation\n' +
                    'Task responsibility');
        });
    })
    .after(async () => {
        await app.step(`Return all records to the '${data.action.formLetter.tasks.previousTask}' task (API)`, async () => {
            try {
                await app.api.collaboration.executeTask(data.action.formLetter.process, data.action.formLetter.tasks.nextTask);
                await app.api.collaboration.returnAllRecords();
                await app.api.collaboration.executeTask(data.action.formLetter.process, data.action.formLetter.tasks.flTask);
                await app.api.collaboration.returnAllRecords();
            } catch (err) { }
        });
    });

test
    // .only
    .meta('brief', 'true')
    .requestHooks(app.ui.requestLogger.collaborationSubmit)
    .before(async () => {
        await app.step('Add records to the Form Letter task (API)', async () => {
            await app.api.login();
            await app.api.collaboration.executeTask(data.action.formLetter.process, data.action.formLetter.tasks.previousTask);
            await app.api.collaboration.submitFirstRecords(5);
        });
    })
    ('Verify Submit on the Form Letter modal for Action process (Step 1-5)', async (t: TestController) => {
        await app.step('Open Collaboration Portal', async () => {
            await app.ui.getRole(undefined, '/UI/collaboration');
            await app.ui.waitLoading();
        });
        await app.step('Open the Form Letter task', async () => {
            const process = app.ui.collaborationBoard.getProcess(data.action.formLetter.process);
            const task = process.getTask(data.action.formLetter.tasks.flTask);
            await task.open();
        });
        await app.step('Select records and click Open (Step 3)', async () => {
            const query = app.ui.queryBoard.queryResultsGrid;
            await query.getCheckbox(0).check();
            await query.getCheckbox(1).check();
            await query.getCheckbox(2).check();
            await app.ui.queryBoard.click('menuItems', 'Open');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.formLetterModal.isVisible()).ok();
        });
        await app.step('Verify the Submit button (Step 4)', async () => {
            await app.ui.formLetterModal.click('taskControls');
            await t
                .expect(await app.ui.kendoPopup.isEnabled('simpleItems', 'Submit')).ok();
        });
        await app.step('Click the Submit button (Step 5)', async () => {
            const recordBefore = await app.ui.formLetterModal.getText('title', 0, { asDisplayed: true });
            const previewListBefore = await app.ui.formLetterModal.getPreviewListItems();
            const nextRecord = previewListBefore[previewListBefore.indexOf(recordBefore) + 1];
            await app.ui.kendoPopup.selectItem('Submit');
            await app.ui.waitLoading();
            const previewListAfter = await app.ui.formLetterModal.getPreviewListItems();
            const recordAfter = await app.ui.formLetterModal.getText('title', 0, { asDisplayed: true });

            await t
                .expect(await app.ui.formLetterModal.isVisible()).ok()
                .expect(previewListAfter).eql(app.services.array.removeFirstOccurance(previewListBefore, recordBefore))
                .expect(await app.ui.formLetterModal.getSelectedRecord()).eql(nextRecord)
                .expect(recordAfter).eql(nextRecord);
        });
        await app.step('Verify record is submitted (API)', async () => {
            const submittedRecordId = app.ui.getLastRequestBody('collaborationSubmit').selectedRecords[0].masterId;
            await app.api.collaboration.executeTask(data.action.formLetter.process, data.action.formLetter.tasks.nextTask);
            const ids = await app.api.collaboration.getRecordIdsFromResults();
            await t
                .expect(ids.includes(submittedRecordId.toString())).ok();
        });
    })
    .after(async () => {
        await app.step(`Return all records to the '${data.action.formLetter.tasks.previousTask}' task (API)`, async () => {
            try {
                await app.api.collaboration.executeTask(data.action.formLetter.process, data.action.formLetter.tasks.nextTask);
                await app.api.collaboration.returnAllRecords();
                await app.api.collaboration.executeTask(data.action.formLetter.process, data.action.formLetter.tasks.flTask);
                await app.api.collaboration.returnAllRecords();
            } catch (err) { }
        });
    });

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step('Add records to the Form Letter task (API)', async () => {
            await app.api.login();
            await app.api.collaboration.executeTask(data.action.formLetter.process, data.action.formLetter.tasks.previousTask);
            await app.api.collaboration.submitFirstRecords(5);
        });
    })
    ('Verify Submit on the Form Letter modal when one of the records is submitted for Action process (Step 7-9)', async (t: TestController) => {
        await app.step('Open Collaboration Portal', async () => {
            await app.ui.getRole(undefined, '/UI/collaboration');
            await app.ui.waitLoading();
        });
        await app.step('Open the Form Letter task', async () => {
            const process = app.ui.collaborationBoard.getProcess(data.action.formLetter.process);
            const task = process.getTask(data.action.formLetter.tasks.flTask);
            await task.open();
        });
        await app.step('Select 3 records and click Open (Step 7)', async () => {
            const query = app.ui.queryBoard;
            await query.queryResultsGrid.getCheckbox(0).check();
            await query.queryResultsGrid.getCheckbox(1).check();
            await query.queryResultsGrid.getCheckbox(2).check();
            await app.ui.queryBoard.click('menuItems', 'Open');
            await app.ui.waitLoading();
        });
        await app.step('Submit one of the selected records (API) (Step 8)', async () => {
            const recordId = {
                masterId: await (await app.ui.queryBoard.queryResultsGrid.getRecord(1)).getValue(data.action.formLetter.masterIdColumnName),
                   childId: await (await app.ui.queryBoard.queryResultsGrid.getRecord(1)).getValue(data.action.formLetter.childIdColumnName)
               };
            await app.api.collaboration.executeTask(data.action.formLetter.process, data.action.formLetter.tasks.flTask);
            await app.api.collaboration.submitRecordsWithChild([ recordId ]);
        });
        await app.step('Select Submit from Task Controls on the Form Letter modal (Step 9)', async () => {
            await app.ui.formLetterModal.click('taskControls');
            await app.ui.kendoPopup.selectItem('Submit');
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.formLetterModal.getText('errorContainer', 0, { asDisplayed: true })).eql(
                    'Attention\n' +
                    'One or more selected record(s) no longer resides at the current task due to:\n' +
                    ' Record deletion\n' +
                    ' Submission\n' +
                    ' Return by another user\n' +
                    ' Task delegation\n' +
                    ' Task responsibility');
        });
    })
    .after(async () => {
        await app.step(`Return all records to the '${data.action.formLetter.tasks.previousTask}' task (API)`, async () => {
            try {
                await app.api.collaboration.executeTask(data.action.formLetter.process, data.action.formLetter.tasks.nextTask);
                await app.api.collaboration.returnAllRecords();
                await app.api.collaboration.executeTask(data.action.formLetter.process, data.action.formLetter.tasks.flTask);
                await app.api.collaboration.returnAllRecords();
            } catch (err) { }
        });
    });

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step('Add records to the Form Letter task (API)', async () => {
            await app.api.login();
            await app.api.collaboration.executeTask(data.action.formLetter.process, data.action.formLetter.tasks.previousTask);
            await app.api.collaboration.submitFirstRecords(5);
        });
    })
    ('Verify Form Letter modal in the task when one of the records is submited for Action process (Step 10)', async (t: TestController) => {
        await app.step('Open Collaboration Portal', async () => {
            await app.ui.getRole(undefined, '/UI/collaboration');
            await app.ui.waitLoading();
        });
        await app.step('Open the Form Letter task', async () => {
            const process = app.ui.collaborationBoard.getProcess(data.action.formLetter.process);
            const task = process.getTask(data.action.formLetter.tasks.flTask);
            await task.open();
            await app.ui.waitLoading();
        });
        await app.step('Submit one of the selected records (API)', async () => {
            const recordId = {
                masterId: await (await app.ui.queryBoard.queryResultsGrid.getRecord(1)).getValue(data.action.formLetter.masterIdColumnName),
                   childId: await (await app.ui.queryBoard.queryResultsGrid.getRecord(1)).getValue(data.action.formLetter.childIdColumnName)
               };
            await app.api.collaboration.executeTask(data.action.formLetter.process, data.action.formLetter.tasks.flTask);
            await app.api.collaboration.submitRecordsWithChild([ recordId ]);
        });
        await app.step('Select 3 records and click Open', async () => {
            const query = app.ui.queryBoard;
            await query.queryResultsGrid.getCheckbox(0).check();
            await query.queryResultsGrid.getCheckbox(1).check();
            await query.queryResultsGrid.getCheckbox(2).check();
            await app.ui.queryBoard.click('menuItems', 'Open');
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.formLetterModal.getText('errorContainer', 0, { asDisplayed: true })).eql(
                    'Attention\n' +
                    'One or more selected record(s) no longer resides at the current task due to:\n' +
                    ' Record deletion\n' +
                    ' Submission\n' +
                    ' Return by another user\n' +
                    ' Task delegation\n' +
                    ' Task responsibility');
        });
    })
    .after(async () => {
        await app.step(`Return all records to the '${data.action.formLetter.tasks.previousTask}' task (API)`, async () => {
            try {
                await app.api.collaboration.executeTask(data.action.formLetter.process, data.action.formLetter.tasks.nextTask);
                await app.api.collaboration.returnAllRecords();
                await app.api.collaboration.executeTask(data.action.formLetter.process, data.action.formLetter.tasks.flTask);
                await app.api.collaboration.returnAllRecords();
            } catch (err) { }
        });
    });

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step('Add records to the Form Letter task (API)', async () => {
            await app.api.login();
            await app.api.collaboration.executeTask(data.action.formLetter.process, data.action.formLetter.tasks.previousTask);
            await app.api.collaboration.submitFirstRecords(5);
        });
    })
    ('Verify Delegate on the Form Letter modal when all records are submited (Step 11)', async (t: TestController) => {
        await app.step('Open Collaboration Portal', async () => {
            await app.ui.getRole(undefined, '/UI/collaboration');
            await app.ui.waitLoading();
        });
        await app.step('Open the Form Letter task', async () => {
            const process = app.ui.collaborationBoard.getProcess(data.action.formLetter.process);
            const task = process.getTask(data.action.formLetter.tasks.flTask);
            await task.open();
            await app.ui.waitLoading();
        });
        await app.step('Select 3 records and click Open', async () => {
            const query = app.ui.queryBoard;
            await query.queryResultsGrid.getCheckbox(0).check();
            await query.queryResultsGrid.getCheckbox(1).check();
            await query.queryResultsGrid.getCheckbox(2).check();
            await app.ui.queryBoard.click('menuItems', 'Open');
            await app.ui.waitLoading();
        });
        await app.step('Submit all selected records (API)', async () => {
            const queryGrid = app.ui.queryBoard.queryResultsGrid;
            const recordIds = [
                { masterId: await (await queryGrid.getRecord(0)).getValue(data.action.formLetter.masterIdColumnName),
                    childId: await (await queryGrid.getRecord(0)).getValue(data.action.formLetter.childIdColumnName)},
                { masterId: await (await queryGrid.getRecord(1)).getValue(data.action.formLetter.masterIdColumnName),
                    childId: await (await queryGrid.getRecord(1)).getValue(data.action.formLetter.childIdColumnName)},
                { masterId: await (await queryGrid.getRecord(2)).getValue(data.action.formLetter.masterIdColumnName),
                    childId: await (await queryGrid.getRecord(2)).getValue(data.action.formLetter.childIdColumnName)}
            ];
            await app.api.collaboration.executeTask(data.action.formLetter.process, data.action.formLetter.tasks.flTask);
            await app.api.collaboration.submitRecordsWithChild(recordIds);
        });
        await app.step('Click Task Control -> Delegate', async () => {
            await app.ui.formLetterModal.click('taskControls');
            await app.ui.kendoPopup.selectItem('Delegate');
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.errorModal.getText('errorMessage', 0, { asDisplayed: true })).eql(
                    'One or more selected record(s) no longer resides at the current task due to:\n' +
                    'Record deletion\n' +
                    'Submission\n' +
                    'Return by another user\n' +
                    'Task delegation\n' +
                    'Task responsibility');
        });
    })
    .after(async () => {
        await app.step(`Return all records to the '${data.action.formLetter.tasks.previousTask}' task (API)`, async () => {
            try {
                await app.api.collaboration.executeTask(data.action.formLetter.process, data.action.formLetter.tasks.nextTask);
                await app.api.collaboration.returnAllRecords();
                await app.api.collaboration.executeTask(data.action.formLetter.process, data.action.formLetter.tasks.flTask);
                await app.api.collaboration.returnAllRecords();
            } catch (err) { }
        });
    });

test
    // .only
    .meta('brief', 'true')
    .requestHooks(app.ui.requestLogger.collaborationReturn)
    .before(async () => {
        await app.step('Add records to the Form Letter task (API)', async () => {
            await app.api.login();
            await app.api.collaboration.executeTask(data.action.formLetter.process, data.action.formLetter.tasks.previousTask);
            await app.api.collaboration.submitFirstRecords(5);
        });
    })
    ('Verify Return on the Form Letter modal for Action process (Step 1-6, 12)', async (t: TestController) => {
        await app.step('Open Collaboration Portal (Step 2)', async () => {
            await app.ui.getRole(undefined, '/UI/collaboration');
            await app.ui.waitLoading();
        });
        await app.step('Open the Form Letter task', async () => {
            const process = app.ui.collaborationBoard.getProcess(data.action.formLetter.process);
            const task = process.getTask(data.action.formLetter.tasks.flTask);
            await task.open();
        });
        await app.step('Select records and click Open (Step 3)', async () => {
            const query = app.ui.queryBoard.queryResultsGrid;
            await query.getCheckbox(0).check();
            await query.getCheckbox(1).check();
            await query.getCheckbox(2).check();
            await app.ui.queryBoard.click('menuItems', 'Open');
            await app.ui.waitLoading();
            await t
                .expect(await app.ui.formLetterModal.isVisible()).ok();
        });
        await app.step('Verify the Return button (Step 4)', async () => {
            await app.ui.formLetterModal.click('taskControls');
            await t
                .expect(await app.ui.kendoPopup.isEnabled('simpleItems', 'Remove')).ok();
        });
        await app.step('Click the Return button (Step 5)', async () => {
            await app.ui.kendoPopup.selectItem('Return');
            await t
                .expect(await app.ui.confirmationModal.isVisible()).ok()
                .expect(await app.ui.confirmationModal.getText('confirmationMessage')).eql('Are you sure you want to reassign selected record(s) to the previous task?')
                .expect(await app.ui.confirmationModal.isVisible('buttons', 'Yes')).ok()
                .expect(await app.ui.confirmationModal.isVisible('buttons', 'Cancel')).ok();
        });
        await app.step('Click "Yes" on the Confirmation modal (Step 6)', async () => {
            const recordBefore = await app.ui.formLetterModal.getText('title', 0, { asDisplayed: true });
            const previewListBefore = await app.ui.formLetterModal.getPreviewListItems();
            const nextRecord = previewListBefore[previewListBefore.indexOf(recordBefore) + 1];
            await app.ui.confirmationModal.click('buttons', 'Yes');
            await app.ui.waitLoading();
            const previewListAfter = await app.ui.formLetterModal.getPreviewListItems();
            const recordAfter = await app.ui.formLetterModal.getText('title', 0, { asDisplayed: true });

            await t
                .expect(await app.ui.formLetterModal.isVisible()).ok()
                .expect(previewListAfter).eql(previewListBefore.filter((x, i, list) => x !== recordBefore || list.findIndex((y) => y === x) !== i))
                .expect(await app.ui.formLetterModal.getSelectedRecord()).eql(nextRecord)
                .expect(recordAfter).eql(nextRecord);
        });
        await app.step('Click "Cancel" on the Confirmation modal (Step 12)', async () => {
            const recordBefore = await app.ui.formLetterModal.getText('title', 0, { asDisplayed: true });
            const previewListBefore = await app.ui.formLetterModal.getPreviewListItems();
            await app.ui.formLetterModal.click('taskControls');
            await app.ui.kendoPopup.selectItem('Return');
            await app.ui.confirmationModal.cancel();
            await app.ui.waitLoading();
            const previewListAfter = await app.ui.formLetterModal.getPreviewListItems();
            const recordAfter = await app.ui.formLetterModal.getText('title', 0, { asDisplayed: true });

            await t
                .expect(await app.ui.confirmationModal.waitTillElementNotPresent()).ok()
                .expect(recordBefore).eql(recordAfter)
                .expect(previewListBefore).eql(previewListAfter);
        });
        await app.step('Verify record is submitted (API)', async () => {
            const submittedRecordId = app.ui.getLastRequestBody('collaborationReturn')[0].masterId;
            await app.api.collaboration.executeTask(data.action.formLetter.process, data.action.formLetter.tasks.previousTask);
            const ids = await app.api.collaboration.getRecordIdsFromResults();
            await t
                .expect(ids.includes(submittedRecordId.toString())).ok();
        });
    })
    .after(async () => {
        await app.step(`Return all records to the '${data.action.formLetter.tasks.previousTask}' task (API)`, async () => {
            try {
                await app.api.collaboration.executeTask(data.action.formLetter.process, data.action.formLetter.tasks.nextTask);
                await app.api.collaboration.returnAllRecords();
                await app.api.collaboration.executeTask(data.action.formLetter.process, data.action.formLetter.tasks.flTask);
                await app.api.collaboration.returnAllRecords();
            } catch (err) { }
        });
    });

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step('Add records to the Form Letter task (API)', async () => {
            await app.api.login();
            await app.api.collaboration.executeTask(data.action.formLetter.process, data.action.formLetter.tasks.previousTask);
            await app.api.collaboration.submitFirstRecords(5);
        });
    })
    ('Verify Return on the Form Letter modal when one of the records is returned for Action process (Step 7-9)', async (t: TestController) => {
        await app.step('Open Collaboration Portal', async () => {
            await app.ui.getRole(undefined, '/UI/collaboration');
            await app.ui.waitLoading();
        });
        await app.step('Open the Form Letter task', async () => {
            const process = app.ui.collaborationBoard.getProcess(data.action.formLetter.process);
            const task = process.getTask(data.action.formLetter.tasks.flTask);
            await task.open();
        });
        await app.step('Select 3 records and click Open (Step 7)', async () => {
            const query = app.ui.queryBoard;
            await query.queryResultsGrid.getCheckbox(0).check();
            await query.queryResultsGrid.getCheckbox(1).check();
            await query.queryResultsGrid.getCheckbox(2).check();
            await app.ui.queryBoard.click('menuItems', 'Open');
            await app.ui.waitLoading();
        });
        await app.step('Return one of the selected records (API) (Step 8)', async () => {
            const recordId = {
                masterId: await (await app.ui.queryBoard.queryResultsGrid.getRecord(1)).getValue(data.action.formLetter.masterIdColumnName),
                   childId: await (await app.ui.queryBoard.queryResultsGrid.getRecord(1)).getValue(data.action.formLetter.childIdColumnName)
               };
            await app.api.collaboration.executeTask(data.action.formLetter.process, data.action.formLetter.tasks.flTask);
            await app.api.collaboration.returnRecordsWithChild([ recordId ]);
        });
        await app.step('Select Return from Task Controls on the Form Letter modal (Step 9)', async () => {
            await app.ui.formLetterModal.click('taskControls');
            await app.ui.kendoPopup.selectItem('Return');
            await app.ui.confirmationModal.confirm();
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.formLetterModal.getText('errorContainer', 0, { asDisplayed: true })).eql(
                    'Attention\n' +
                    'One or more selected record(s) no longer resides at the current task due to:\n' +
                    ' Record deletion\n' +
                    ' Submission\n' +
                    ' Return by another user\n' +
                    ' Task delegation\n' +
                    ' Task responsibility');
        });
    })
    .after(async () => {
        await app.step(`Return all records to the '${data.action.formLetter.tasks.previousTask}' task (API)`, async () => {
            try {
                await app.api.collaboration.executeTask(data.action.formLetter.process, data.action.formLetter.tasks.nextTask);
                await app.api.collaboration.returnAllRecords();
                await app.api.collaboration.executeTask(data.action.formLetter.process, data.action.formLetter.tasks.flTask);
                await app.api.collaboration.returnAllRecords();
            } catch (err) { }
        });
    });

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step('Add records to the Form Letter task (API)', async () => {
            await app.api.login();
            await app.api.collaboration.executeTask(data.action.formLetter.process, data.action.formLetter.tasks.previousTask);
            await app.api.collaboration.submitFirstRecords(5);
        });
    })
    ('Verify Form Letter modal in the task when one of the records is returned for Action process (Step 10)', async (t: TestController) => {
        await app.step('Open Collaboration Portal', async () => {
            await app.ui.getRole(undefined, '/UI/collaboration');
            await app.ui.waitLoading();
        });
        await app.step('Open the Form Letter task', async () => {
            const process = app.ui.collaborationBoard.getProcess(data.action.formLetter.process);
            const task = process.getTask(data.action.formLetter.tasks.flTask);
            await task.open();
            await app.ui.waitLoading();
        });
        await app.step('Return one of the selected records (API)', async () => {
            const recordId = {
                masterId: await (await app.ui.queryBoard.queryResultsGrid.getRecord(1)).getValue(data.action.formLetter.masterIdColumnName),
                   childId: await (await app.ui.queryBoard.queryResultsGrid.getRecord(1)).getValue(data.action.formLetter.childIdColumnName)
               };
            await app.api.collaboration.executeTask(data.action.formLetter.process, data.action.formLetter.tasks.flTask);
            await app.api.collaboration.returnRecordsWithChild([ recordId ]);
        });
        await app.step('Select 3 records and click Open', async () => {
            const query = app.ui.queryBoard;
            await query.queryResultsGrid.getCheckbox(0).check();
            await query.queryResultsGrid.getCheckbox(1).check();
            await query.queryResultsGrid.getCheckbox(2).check();
            await app.ui.queryBoard.click('menuItems', 'Open');
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.formLetterModal.getText('errorContainer', 0, { asDisplayed: true })).eql(
                    'Attention\n' +
                    'One or more selected record(s) no longer resides at the current task due to:\n' +
                    ' Record deletion\n' +
                    ' Submission\n' +
                    ' Return by another user\n' +
                    ' Task delegation\n' +
                    ' Task responsibility');
        });
    })
    .after(async () => {
        await app.step(`Return all records to the '${data.action.formLetter.tasks.previousTask}' task (API)`, async () => {
            try {
                await app.api.collaboration.executeTask(data.action.formLetter.process, data.action.formLetter.tasks.nextTask);
                await app.api.collaboration.returnAllRecords();
                await app.api.collaboration.executeTask(data.action.formLetter.process, data.action.formLetter.tasks.flTask);
                await app.api.collaboration.returnAllRecords();
            } catch (err) { }
        });
    });

test
    // .only
    .meta('brief', 'true')
    .before(async () => {
        await app.step('Add records to the Form Letter task (API)', async () => {
            await app.api.login();
            await app.api.collaboration.executeTask(data.action.formLetter.process, data.action.formLetter.tasks.previousTask);
            await app.api.collaboration.submitFirstRecords(5);
        });
    })
    ('Verify Delegate on the Form Letter modal when all records are returned for Action process (Step 11)', async (t: TestController) => {
        await app.step('Open Collaboration Portal', async () => {
            await app.ui.getRole(undefined, '/UI/collaboration');
            await app.ui.waitLoading();
        });
        await app.step('Open the Form Letter task', async () => {
            const process = app.ui.collaborationBoard.getProcess(data.action.formLetter.process);
            const task = process.getTask(data.action.formLetter.tasks.flTask);
            await task.open();
            await app.ui.waitLoading();
        });
        await app.step('Select 3 records and click Open', async () => {
            const query = app.ui.queryBoard;
            await query.queryResultsGrid.getCheckbox(0).check();
            await query.queryResultsGrid.getCheckbox(1).check();
            await query.queryResultsGrid.getCheckbox(2).check();
            await app.ui.queryBoard.click('menuItems', 'Open');
            await app.ui.waitLoading();
        });
        await app.step('Return all selected records (API)', async () => {
            const queryGrid = app.ui.queryBoard.queryResultsGrid;
            const recordIds = [
                { masterId: await (await queryGrid.getRecord(0)).getValue(data.action.formLetter.masterIdColumnName),
                    childId: await (await queryGrid.getRecord(0)).getValue(data.action.formLetter.childIdColumnName)},
                { masterId: await (await queryGrid.getRecord(1)).getValue(data.action.formLetter.masterIdColumnName),
                    childId: await (await queryGrid.getRecord(1)).getValue(data.action.formLetter.childIdColumnName)},
                { masterId: await (await queryGrid.getRecord(2)).getValue(data.action.formLetter.masterIdColumnName),
                    childId: await (await queryGrid.getRecord(2)).getValue(data.action.formLetter.childIdColumnName)}
            ];
            await app.api.collaboration.executeTask(data.action.formLetter.process, data.action.formLetter.tasks.flTask);
            await app.api.collaboration.returnRecordsWithChild(recordIds);
        });
        await app.step('Click Task Control -> Delegate', async () => {
            await app.ui.formLetterModal.click('taskControls');
            await app.ui.kendoPopup.selectItem('Delegate');
            await app.ui.waitLoading();

            await t
                .expect(await app.ui.errorModal.getText('errorMessage', 0, { asDisplayed: true })).eql(
                    'One or more selected record(s) no longer resides at the current task due to:\n' +
                    'Record deletion\n' +
                    'Submission\n' +
                    'Return by another user\n' +
                    'Task delegation\n' +
                    'Task responsibility');
        });
    })
    .after(async () => {
        await app.step(`Return all records to the '${data.action.formLetter.tasks.previousTask}' task (API)`, async () => {
            try {
                await app.api.collaboration.executeTask(data.action.formLetter.process, data.action.formLetter.tasks.nextTask);
                await app.api.collaboration.returnAllRecords();
                await app.api.collaboration.executeTask(data.action.formLetter.process, data.action.formLetter.tasks.flTask);
                await app.api.collaboration.returnAllRecords();
            } catch (err) { }
        });
    });
