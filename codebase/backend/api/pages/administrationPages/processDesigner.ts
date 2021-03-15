import { CustomLogger } from '../../../../support/utils/log';
import BasePage from '../basePage';
import infrastructureService from '../../../../services/entries/infrastructureService';
import moment = require('moment');
import * as processes from '../../collections/processes';
import ProcessBlueprint from './processBlueprint';

export default class ProcessDesigner extends BasePage {
    private allProcesses: any;
    private resourceId: number;
    private currentProcess: any;
    private contentGroups: any;
    private duplicateWorkflowId: number;

    get blueprint(): ProcessBlueprint {
        return this.createGetter(ProcessBlueprint, this.cookieProvider, this.resourceId);
    }

    public async createNew(): Promise<void> {
        this.currentProcess = infrastructureService.clone(processes.newProcess);
    }

    public async open(name: string): Promise<void> {
        await this.getAllProcesses();
        this.resourceId = this.allProcesses.find((x) => x.CustomResourceName === name).ResourceId;
        this.currentProcess = (await this.get('/AdminPortal/ProcessDesigner/get', { id: this.resourceId })).data;
    }

    public getID(): number {
        return this.currentProcess.WorkflowId;
    }

    public setActive(status: boolean): void {
        CustomLogger.logger.log('method', `Set active to ${status} (API)`);
        this.currentProcess.Status = status;
    }

    public setPriority(priority: number): void {
        CustomLogger.logger.log('method', `Set Priority to ${priority} (API)`);
        this.currentProcess.WorkflowPriority = priority;
    }

    public async setName(value: string): Promise<void> {
        CustomLogger.logger.log('method', `Set Name as '${value}' (API)`);
        this.currentProcess.Name = value;
        this.currentProcess.CustomResourceName = value;
    }

    public async setDescription(value: string): Promise<void> {
        CustomLogger.logger.log('method', `Set Description as '${value}' (API)`);
        this.currentProcess.Description = value;
        this.currentProcess.CustomResourceDescription = value;
    }

    public async setIPType(value: string): Promise<void> {
        CustomLogger.logger.log('method', `Set IP Type as '${value}' (API)`);
        const ipTypes = await this.common.getIpTypes();
        this.currentProcess.IPType = ipTypes.find((x) => x.Name === value).IpTypeId;
    }

    public async setOwner(value: string): Promise<void> {
        CustomLogger.logger.log('method', `Set Owner as '${value}' (API)`);
        if (value === null) {
            this.currentProcess.Owner = null;
        } else {
            await this.getContentGroups();
            this.currentProcess.Owner = this.contentGroups.find((x) => x.ContentGroupName === value).ContentGroupId;
        }
    }

    public async setCollaborationLevel(value: string): Promise<void> {
        CustomLogger.logger.log('method', `Set Collaboration Level as '${value}' (API)`);
        const codes = (await this.get(`/Common/codes/bytype/hierarchy/`, {
            type: 'WLT'
        })).data.Data;
        this.currentProcess.WorkflowLevelTypeCodeId = codes.find((x) => x.DisplayName === value).CodeId;
    }

    public async setContentGroups(value: string): Promise<void> {
        CustomLogger.logger.log('method', `Set Content Groups as '${value}' (API)`);
        await this.getContentGroups();
        this.currentProcess.ContentGroups = [ this.contentGroups.find((x) => x.ContentGroupName === value) ];
    }

    public async addContentGroups(value: string): Promise<void> {
        CustomLogger.logger.log('method', `Add the '${value}' group to process Content Groups (API)`);
        await this.getContentGroups();
        this.currentProcess.ContentGroups = [ this.contentGroups.find((x) => x.ContentGroupName === value), ...this.currentProcess.ContentGroups ];
    }

    public async setQueryFormat(value: string): Promise<void> {
        CustomLogger.logger.log('method', `Set Query Format as '${value}' (API)`);
        const queries = (await this.post('/AdminPortal/ProcessDesigner/getQueryDetailsByCollaborationLevelAndIPType',
            {
                ResourceTypeName: 'QUERY',
                IpTypeId: this.currentProcess.IPType,
                WorkflowLevelTypeCodeId: this.currentProcess.WorkflowLevelTypeCodeId
            })).data;
        this.currentProcess.WorkflowDataSourceId = queries.find((x) => x.Name === value).ResourceId;
    }

    public setDateTime(value: string | moment.Moment): void {
        if (typeof value !== 'string') {
            value = value.toISOString();
        }
        this.currentProcess.ActiveStartTime = value;
        this.currentProcess.StartDate = value;
    }

    public async save(): Promise<void> {
        CustomLogger.logger.log('method', `Save process (API)`);
        if (this.currentProcess.WorkflowId) {
            this.currentProcess = (await this.post('/AdminPortal/ProcessDesigner/update', this.currentProcess)).data;
        } else if (this.currentProcess.IsDuplicate) {
            this.currentProcess = (await this.post('/AdminPortal/ProcessDesigner/duplicate', {
                WorkflowResource: this.currentProcess,
                DuplicateWorkflowId: this.duplicateWorkflowId
            })).data;
            this.duplicateWorkflowId = 0;
        } else {
            this.currentProcess = (await this.post('/AdminPortal/ProcessDesigner/save', this.currentProcess)).data;
        }
        this.resourceId = this.currentProcess.ResourceId;
        await this.clearCache();
    }

    public async processBlueprint(): Promise<void> {
        CustomLogger.logger.log('method', `Perform Process Blueprint (API)`);
        this.createGetter(ProcessBlueprint, this.cookieProvider);
        await this.blueprint.open(this.currentProcess.WorkflowId);
    }

    public async duplicate(): Promise<void> {
        this.duplicateWorkflowId = this.currentProcess.WorkflowId;
        this.currentProcess = infrastructureService.clone(this.currentProcess);
        this.currentProcess.WorkflowId = 0;
        this.currentProcess.Status = false;
        this.currentProcess.ResourceId = 0;
        this.currentProcess.IsDuplicate = true;
        this.currentProcess.Name = '';
        this.currentProcess.Description = '';
        this.resourceId = 0;
    }

    public async getAllProcesses(): Promise<any> {
        this.allProcesses = (await this.get('/AdminPortal/ProcessDesigner/getAll')).data.Items;
        return this.allProcesses;
    }

    public async deleteProcess(id?: number): Promise<void> {
        if (!id) {
            id = this.currentProcess.WorkflowId;
        }
        CustomLogger.logger.log('method', `Delete process: ${id} (API)`);
        await this.post('/AdminPortal/ProcessDesigner/deleteAll', [ id ]);
    }

    public async deleteProcesses(ids: number[]): Promise<void> {
        CustomLogger.logger.log('method', `Delete current processes: ${ids} (API)`);
        await this.post('/AdminPortal/ProcessDesigner/deleteAll', ids);
    }

    private async getContentGroups(): Promise<void> {
        this.contentGroups = (await this.get('/AdminPortal/Lookups/getContentGroups')).data;
        return this.contentGroups;
    }
}
