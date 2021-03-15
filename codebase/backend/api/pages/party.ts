import DataEntryForm from './dataEntryForm';

export default class Party extends DataEntryForm {

    public async openRelatedParties(): Promise<void> {
        await this.openChild('Related Parties');
    }
}
