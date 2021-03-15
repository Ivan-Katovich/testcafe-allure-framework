import { Selector, t } from 'testcafe';
import { CustomLogger } from '../../support/utils/log';
import BaseObject from '../baseObject';

export default class CollaborationBoard extends BaseObject {
    public name = 'CollaborationBoard';
    protected container = Selector('.collaboration-portal', { visibilityCheck: true });

    // Elements
    protected groups = this.container.find('[class*="collaboration-portal__processes_"]');
    protected groupTypes = this.groups.find('.collaboration-portal__metrics_type');
    protected processes = this.container.find('.collaboration-process');
    protected errorHeader = this.container.find('.collaboration-portal__acccess_denied');
    protected errorBody = this.container.find('.collaboration-portal__contact_admin');

    // Methods
    public getProcess(nameOrNumber) {
        return new CollaborationProcess(this.processes, nameOrNumber);
    }

    public async getProcessArray(): Promise<string []> {
        const count = await this.processes.count;
        const array = [];
        for (let i = 0; i < count; i++) {
            const processName = await this.processes.nth(i).find('.collaboration-process__name').innerText;
            array.push(processName);
        }

        return array;
    }

    public async getGroupTotal(name: string): Promise<number> {
        return Number(await this.groupTypes.withExactText(name)
            .sibling('.collaboration-portal__metrics_counter').innerText);
    }
}

class CollaborationProcess extends BaseObject {
    constructor(root: Selector, nameOrNumber) {
        super();
        if (typeof nameOrNumber === 'string') {
            this.container = root.find('.collaboration-process__name')
                .withText(nameOrNumber)
                .parent(1);
            this.name = nameOrNumber;
        } else {
            this.container = root.nth(nameOrNumber);
            this.number = nameOrNumber;
        }

        this.tasks = this.container.find('.collaboration-process__task');
        this.processName = this.container.find('.collaboration-process__name');
        this.description = this.container.find('.collaboration-process__description');
    }

    public number: number;

    // Elements
    protected tasks: Selector;
    protected processName: Selector;
    protected description: Selector;

    // Methods
    public getTask(nameOrNumber) {
        return new CollaborationTask(this.tasks, nameOrNumber);
    }

    public getTaskCount() {
        return this.getCount('tasks');
    }
}

class CollaborationTask extends BaseObject {
    constructor(root: Selector, nameOrNumber) {
        super();
        if (typeof nameOrNumber === 'number') {
            this.container = root.nth(nameOrNumber);
            this.number = nameOrNumber;
        } else {
            this.container = root
                .find('.collaboration-task__name')
                .withText(nameOrNumber)
                .parent(1);
            this.name = nameOrNumber;
        }
        this.taskName = this.container.find('.collaboration-task__name');
        this.recordCount = this.container.find('.collaboration-task-record-count');
    }

    public number: number;

    // Elements
    protected taskName: Selector;
    protected recordCount: Selector;

    // Methods
    public async open() {
        CustomLogger.logger.log('method', `User open '${this.name ? this.name : this.number}' task`);
        await t.click(this.container);
    }
}
