import fs from "fs";

let users = [];

function SyncDB() {
 // console.log("Sync the db");
 // users = JSON.parse(fs.readFileSync("data/users.json").toString());
}

function SaveDBToJson(jsonToSave) {
  // fs.writeFileSync("data/albums.json", JSON.stringify(jsonToSave, null, 4));
}

SyncDB();

function GetUser(req, res) {
  const user = users.find((x: { _id: string }) => x._id == req.params.id);
  console.log("GetUser->",  user);

  if (typeof user != "undefined") {
    res.status(200).json({
      status: "success",
      data: user,
    });
  } else {
    res.status(404).json({ status: "fail", message: "invalid id" });
  }
}

const UpdateUser = (req, res) => {
  let user = users.find((x: { _id: string }) => x._id == req.params.id);

  if (typeof user != "undefined") {
    const target_object = req.body;
    const keys_1 = Object.keys(user);

    for (const [key_1, value] of Object.entries(target_object)) {
      keys_1.forEach((key) => {
        if (key == key_1) {
          console.log("modify ", key_1);
          console.log("current_value ", user[key_1]);
          console.log("new_value ", target_object[key]);
          user[key_1] = target_object[key];
        }
      });
    }

    users[req.params.id] = user;
    SaveDBToJson(users);
    res.status(200).json({
      status: "success",
      data: user,
    });
  } else {
    res.status(404).json({ status: "fail", message: "invalid id" });
  }
};

const DeleteUser = (req, res) => {
  console.log("q albums->", users.length);
  const result = users.filter((album) => album.id != req.params.id);
  console.log("q users->", result.length);

  let user = users.find((x: { _id: string }) => x._id == req.params.id);

  if (typeof user != "undefined") {
    SaveDBToJson(result);
    SyncDB();
    res.status(200).json({
      status: "Ok",
    });
  } else {
    res.status(404).json({ status: "fail", message: "invalid id" });
  }
};

function GetAllUsers(req, res) {
  res.status(200).json({
    status: "success",
    results: users.length,
    data: users,
  });
}

const CreateUser = (req, res) => {
  const Id = users[users.length - 1].id + 1;
  const newUser = Object.assign({ id: Id }, req.body);
  users.push(newUser);
  SaveDBToJson(users);
  SyncDB();
  res.status(201).json({
    status: "success",
    data: newUser,
  });
};

export default { GetAllUsers, CreateUser, GetUser, UpdateUser, DeleteUser };