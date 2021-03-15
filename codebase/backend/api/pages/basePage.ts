import BaseAPI from '../../baseApi';
import Common from './common';

export default class BasePage extends BaseAPI {

    get common() {
        return this.createGetter(Common, this.cookieProvider);
    }

    public async clearCache(): Promise<void> {
        const urls = [
            '/queries/clearcache/all',
            '/records/clearcache/all',
            '/common/clearcache/all',
            '/assets/clearcache/all',
            '/usersmanagement/permissions/clearcache/all',
            '/usersmanagement/userresources/clearcache/all',
            '/usersmanagement/userpreferences/clearcache/all'
        ];
        const promises = urls.map((url) => {
            return this.get(url);
        });
        await Promise.all(promises);
    }
}
