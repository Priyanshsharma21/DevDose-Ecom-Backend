/**
 * This function basically use to wrap your normal function around it, so that you don't have to use try catch in async await again and again and also if you are using promises then no need of catch and promise chaining, pass any function as params to this BigPromise and your job is done.
 *
 * @param {function} param1 - Takes a function as parameter
 * @returns {Promise} it returns a promise
 */


export default (func)=> (req,res,next)=>{
    return Promise.resolve(func(req,res,next)).catch(next);
}