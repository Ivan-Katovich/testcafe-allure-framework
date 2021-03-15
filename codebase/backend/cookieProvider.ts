
const cookieProvider = {
    cookie: null,
    setCookie(cookie, force: boolean = false) {
        if (this.cookie && this.cookie === cookie && !force) {
            return;
        } else {
            this.cookie = cookie;
        }
    },
    getCookie() {
        return this.cookie;
    }
};

export default cookieProvider;
