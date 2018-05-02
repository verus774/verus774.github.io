export default class {
    constructor(firstName, lastName = '', email = '') {
        if (!firstName) throw 'must provide first name';

        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;

        this.score = [];
    }

    get bestScore() {
        return Math.min(...this.score);
    }
}
