class ExpressError extends Error {
    constructor(statuscode,message) {
        super();
        this.statuscode = statuscode;
        this.message = message;
    }
}
export default ExpressError;