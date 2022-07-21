const users = [];

const removeUser = id => {
  //console.log(users);
  const index = users.findIndex(user => user.id === id);
  let removedUser = users.splice(index, 1)[0];
  // console.log(users);
  return removedUser;
};
const addUser = ({ id, username, room }) => {
  //  Clean input
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();
  // Validate the data

  if (!username || !room) {
    return {
      error: "username and room are required"
    };
  }

  //Check that user is not joined in another room
  /*
  const inAnotherRoom = users.find(user => {
    return user.id === id;
  });
  if (inAnotherRoom) {
    removeUser(id);
  }*/
  // Check for existing user
  const existingUser = users.find(user => {
    return user.room === room && user.username === username;
  });

  // Validate username
  if (existingUser) {
    return {
      error: "This username already in use"
    };
  }
  // Store user
  const user = { id, username, room };
  users.push(user);
  console.log(users);
  return { user };
};

const getUser = id => {
  return users.find(user => user.id === id);
};

const getPresenter = room => {
  const presenter = users.find(user => {
    return user.room === room && user.username === "presenter";
  });
  return presenter;
};
const getUsersInRoom = room => {
  room = room.trim().toLowerCase();
  let userList = users.filter(user => user.room === room);
  return userList;
};

module.exports = { addUser, removeUser, getUser, getUsersInRoom, getPresenter };

//Testing addUser
/*
addUser({
  id: 2,
  username: "Shahid ",
  room: "heaven"
});
const result = addUser({
  id: 2,
  username: "shahid",
  room: "heaven"
});

console.log(result);
console.log(users);
*/

// Testing removeUser
/*
addUser({
  id: 2,
  username: "Shahid ",
  room: "heaven"
});

console.log(users);
const removedUser = removeUser(2);
console.log(removedUser);
console.log(users);
*/

// Testing getUsersInroom
/*
addUser({
  id: 2,
  username: "Shahid ",
  room: "heaven"
});

addUser({
  id: 3,
  username: "md",
  room: "heaven"
});
addUser({
  id: 4,
  username: "hussain",
  room: "sky"
});

const usersHeaven = getUsersInRoom("sky");
console.log(usersHeaven);
*/

//testing get user
/*
addUser({
  id: 2,
  username: "Shahid ",
  room: "heaven"
});

addUser({
  id: 3,
  username: "md",
  room: "heaven"
});
addUser({
  id: 4,
  username: "hussain",
  room: "sky"
});

const user = getUser(4);
console.log(user);
*/
