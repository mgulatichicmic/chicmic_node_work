
const CONFIG = require('../../config');
/********************************
 **** Managing all the services ***
 ********* independently ********
 ********************************/
module.exports = {
    userService: require(`./userService`),
    authService: require(`./authService`),
};