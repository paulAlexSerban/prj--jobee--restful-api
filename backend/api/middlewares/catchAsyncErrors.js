/**
 * Asynchronous Middleware Error Handling: 
 * The module.exports = func => (req, res, next) => { Promise.resolve(func(req, res, next)).catch(next); } is a middleware error 
 * handling pattern specifically for Express.js.
 * 
 * In this pattern, you're exporting an anonymous function that takes another function (func) as an argument. This func is your 
 * Express.js middleware function which includes the req, res, and next parameters. This function will return a new function 
 * that calls func inside Promise.resolve().catch().
 * 
 * The effect of this is that if func returns a promise (i.e., it's an async function), and that promise is rejected (i.e., an error is thrown), 
 * the error is caught and passed to the next middleware function in the Express.js pipeline, which could be a dedicated error handling middleware.
 * 
 * The advantage of this method is that it's a clean way to catch any errors that occur in any Promise returned by an async function. The 
 * downside is that the error handling logic is not immediately visible within the function that may throw the error, which could make the 
 * code a little harder to follow.
 * 
 * Also, it's important to note that this pattern will only handle errors for asynchronous operations (i.e., those that return a promise). 
 * Synchronous errors will still need to be caught using a try...catch block.
 * 
 * @param {*} func 
 * @returns 
 */

module.exports = func => (req, res, next) => {
    Promise.resolve(func(req, res, next)).catch(next);
}