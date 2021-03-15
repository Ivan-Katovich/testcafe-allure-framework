import { CustomLogger } from '../../../../support/utils/log';
import BasePage from '../basePage';
import infrastructureService from '../../../../services/entries/infrastructureService';
import moment = require('moment');
import * as processes from '../../collections/processes';

export default class ProcessBlueprint extends BasePage {
    private workflowId: number;
    private workflowResource: any;
    private currentTask: any;
    private contentGroups: any;
    private newTasksCount: number = 0;

    public async open(workflowId: number): Promise<void> {
        CustomLogger.logger.log('method', `Open Blueprint with id = ${workflowId} (API)`);
        this.workflowId = workflowId;
        this.workflowResource = (await this.get(`/Integration/Collaboration/extendedWorkflowResource/${this.workflowId}/`)).data;
    }

    public addTask(): void {
        CustomLogger.logger.log('method', `Add task to blueprint (API)`);
        this.currentTask = infrastructureService.clone(processes.workflowTask);
        this.currentTask.TaskId = this.currentTask.TaskId - this.newTasksCount;
        this.newTasksCount++;
        this.workflowResource.WorkflowTasks.push(this.currentTask);
        if (this.workflowResource.InitialTaskId === null) {
            this.workflowResource.InitialTaskId = this.currentTask.TaskId;
        }
    }

    public setTaskName(name: string): void {
        CustomLogger.logger.log('method', `Set Task Name as '${name}' (API)`);
        this.currentTask.TaskName = name;
        this.currentTask.CustomResourceName = name;
    }

    public async setTaskType(value: string): Promise<void> {
        CustomLogger.logger.log('method', `Set Task Type as '${value}' (API)`);
        const taskTypes = (await this.get('/AdminPortal/WorkflowMetaTask/getTaskTypes/', {
            collaborationLevelCode: this.workflowResource.WorkflowLevelTypeCodeId
        })).data;
        this.currentTask.WorkflowMetaTask = taskTypes.find((x) => x.WorkflowMetaTaskName === value);
        this.currentTask.TaskTypeCodeId = this.currentTask.WorkflowMetaTask.CodeId;
    }

    public async setResource(value: string): Promise<void> {
        CustomLogger.logger.log('method', `Set Resource as '${value}' (API)`);
        const resourceList = (await this.get('/AdminPortal/ResourceListItem/GetUserResourceList/')).data;
        const resources = [];
        Object.values(resourceList).filter((x) => x).forEach((x: []) => resources.push(...x));
        this.currentTask.ResourceId = resources.find((x) => x.ResourceName === value).ResourceId;
    }

    public async setContentGroups(value: string): Promise<void> {
        CustomLogger.logger.log('method', `Set Content Groups as '${value}' (API)`);
        await this.getContentGroups();
        this.currentTask.WorkflowTaskContentGroups = [ this.contentGroups.find((x) => x.ContentGroupName === value) ];
    }

    public setGoToTask(value: string): void {
        CustomLogger.logger.log('method', `Set Go To Task as '${value}' (API)`);
        this.currentTask.DefaultFlowTaskId = this.workflowResource.WorkflowTasks.find((x) => x.TaskName === value).TaskId;
    }

    public selectTask(name: string): void {
        CustomLogger.logger.log('method', `Select Task = '${name}' (API)`);
        this.currentTask = this.workflowResource.WorkflowTasks.find((x) => x.TaskName === name);
    }

    public async save(): Promise<void> {
        CustomLogger.logger.log('method', `Save Blueprint (API)`);
        const body = {
            Workflow: this.workflowResource,
            WorkflowActivityDelete: []
        };

        await this.post('/AdminPortal/ProcessDesigner/saveWorkflowActivity', body);
    }

    private async getContentGroups(): Promise<void> {
        if (!this.contentGroups) {
            this.contentGroups = (await this.get('/AdminPortal/Lookups/getContentGroups')).data;
        }
        return this.contentGroups;
    }
}
