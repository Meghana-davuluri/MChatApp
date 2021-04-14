const users = [];

//join user to chat

function userJoin(id, username, password) {
    const user ={ id, username, password};

    users.push(user);
    return user;

}

//Get current user
function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

//user leaves chat
function userLeave(id){
    const index = users.findIndex(user=>user.id === id);
    if(index!== -1)
    {
        return users.splice(index,1)[0];
    }
}

//Get room users

function getRoomUsers(password){
    return users.filter(user =>user.password === password);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers

};