export class Auth {
    static getToken() {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('t');
        if (!token) {
            window.location.replace('/login');
        }
        return token;
    }
}