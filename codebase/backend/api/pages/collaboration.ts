import BasePage from './basePage';
import infrastructureService from '../../../services/entries/infrastructureService';
import { query } from '../collections/preferences';

export default class Collaboration extends BasePage {

    private queryResults: any;
    private queryMetadata: any;
    private currentTask: any;
    private currentTaskId: any;

    public async collaborateSelected(collaborateInfo: {WorkflowResourceId: number, MasterIds: number[]}): Promise<any> {
        return (await this.post('/Integration/collaborate/selected/', collaborateInfo)).data;
    }

    public async submitCollaborationTask(taskId: number, submitInfo: {selectedRecords: Array<{masterId: number, childId: number}>, modifiers: any}): Promise<any> {
        return (await this.post(`/Integration/Collaboration/tasks/${taskId}/submit/`, submitInfo)).data;
    }

    public async submitAllRecords(): Promise<void> {
        let body = infrastructureService.clone(query.collaboration);
        body.WorkflowLevel = this.currentTask.WorkflowLevel;
        body.TaskId = this.currentTaskId;
        body.IpType = this.currentTask.IpType;

        body.ItemsCount = this.queryResults.Count;
        await this.post(`/Integration/Collaboration/tasks/${this.currentTaskId}/submitall/`, { queryRequest: body });
    }

    public async removeAllRecords(): Promise<void> {
        let body = infrastructureService.clone(query.collaboration);
        body.WorkflowLevel = this.currentTask.WorkflowLevel;
        body.TaskId = this.currentTaskId;
        body.IpType = this.currentTask.IpType;

        body.ItemsCount = this.queryResults.Count;
        await this.post(`/Integration/Collaboration/tasks/${this.currentTaskId}/removeall/`, body);
    }

    public async returnAllRecords(): Promise<void> {
        let body = infrastructureService.clone(query.collaboration);
        body.WorkflowLevel = this.currentTask.WorkflowLevel;
        body.TaskId = this.currentTaskId;
        body.IpType = this.currentTask.IpType;

        body.ItemsCount = this.queryResults.Count;
        await this.post(`/Integration/Collaboration/tasks/${this.currentTaskId}/returnall/`, body);
    }

    public async removeRecords(ids: number[]): Promise<void> {
        const recordIdColumnIndex = this.queryResults.FieldNames.indexOf(this.queryMetadata.MasterIdFieldAliasName);
        const childIdColumnIndex = this.queryResults.FieldNames.indexOf(this.currentTask.ChildIdFieldName);
        const body = ids.map((x) => {
            return { masterId: x, childId: childIdColumnIndex ? this.queryResults.Rows.find((y) => y[recordIdColumnIndex] === x)[childIdColumnIndex] : 0};
        });
        await this.post(`/Integration/Collaboration/tasks/${this.currentTaskId}/remove/`, body);
    }

    public async removeRecordsWithChild(records: Array<{ masterId: number, childId: number }>): Promise<void> {
        await this.post(`/Integration/Collaboration/tasks/${this.currentTaskId}/remove/`, records);
    }

    public async submitRecords(ids: number[]): Promise<void> {
        const recordIdColumnIndex = this.queryResults.FieldNames.indexOf(this.queryMetadata.MasterIdFieldAliasName);
        const childIdColumnIndex = this.queryResults.FieldNames.indexOf(this.currentTask.ChildIdFieldName);
        const body = { selectedRecords: ids.map((x) => {
            return { masterId: x, childId: childIdColumnIndex ? this.queryResults.Rows.find((y) => y[recordIdColumnIndex] === x)[childIdColumnIndex] : 0};
        })};
        await this.post(`/Integration/Collaboration/tasks/${this.currentTaskId}/submit/`, body);
    }

    public async submitRecordsWithChild(records: Array<{ masterId: number, childId: number }>): Promise<void> {
        const body = { selectedRecords: records };
        await this.post(`/Integration/Collaboration/tasks/${this.currentTaskId}/submit/`, body);
    }

    public async submitFirstRecords(number: number, differentRecords: boolean = true): Promise<void> {
        const recordIdColumnIndex = this.queryResults.FieldNames.indexOf(this.queryMetadata.MasterIdFieldAliasName);
        const childIdColumnIndex = this.queryResults.FieldNames.indexOf(this.currentTask.ChildIdFieldName);
        let rows = this.queryResults.Rows;
        if (differentRecords) {
            rows = rows
                .filter((x, i, self) => self.findIndex((y) => y[recordIdColumnIndex] === x[recordIdColumnIndex]) === i);
        }
        const selectedRecords = rows.filter((x, i) => i < number).map((x) => {
            return { masterId: x[recordIdColumnIndex], childId: x[childIdColumnIndex] };
        });
        await this.post(`/Integration/Collaboration/tasks/${this.currentTaskId}/submit/`, { selectedRecords });
    }

    public async returnRecords(ids: number[]): Promise<void> {
        const recordIdColumnIndex = this.queryResults.FieldNames.indexOf(this.queryMetadata.MasterIdFieldAliasName);
        const childIdColumnIndex = this.queryResults.FieldNames.indexOf(this.currentTask.ChildIdFieldName);
        const body = ids.map((x) => {
            return { masterId: x, childId: childIdColumnIndex ? this.queryResults.Rows.find((y) => y[recordIdColumnIndex] === x)[childIdColumnIndex] : 0};
        });
        await this.post(`/Integration/Collaboration/tasks/${this.currentTaskId}/return/`, body);
    }

    public async returnRecordsWithChild(records: Array<{ masterId: number, childId: number }>): Promise<void> {
        await this.post(`/Integration/Collaboration/tasks/${this.currentTaskId}/return/`, records);
    }

    public async executeTask(processName: string, taskName: string): Promise<any> {
        this.currentTaskId = (await this.get('/Integration/Collaboration/collaborationtasks/')).data
            .find((x) => x.WorkflowName === processName).Tasks
            .find((x) => x.TaskName === taskName).TaskId;

        this.currentTask = (await this.get(`/Integration/Collaboration/collaborationtasks/${this.currentTaskId}`)).data;
        let body = infrastructureService.clone(query.collaboration);
        body.WorkflowLevel = this.currentTask.WorkflowLevel;
        body.TaskId = this.currentTaskId;
        body.IpType = this.currentTask.IpType;

        this.queryMetadata = (await this.get(`/Queries/collaborationquerymetadata/${this.currentTask.QueryFormatId}`)).data;
        this.queryResults = (await this.post(`/Queries/collaborationqueryexecution/${this.currentTask.QueryFormatId}`, body)).data;
    }

    public async getRecordIdsFromResults(): Promise<number[]> {
        const columnIndex = this.queryResults.FieldNames
            .map((name: string, index: number) => {
                return { name, index };
            })
            .find((x) => x.name === this.queryMetadata.MasterIdFieldAliasName).index;
        return this.queryResults.Rows.map((x) => {
            return x[columnIndex];
        });
    }
}
