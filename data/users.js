//Loading users from local storage, or creating it if it doesn't exist
let usersList = JSON.parse(localStorage.getItem('usersList'));

if (!usersList) {
  //Creating default user for demonstration purposes
  usersList = [{"name":"משתמש דוגמא","id":"משתמשדוגמא","selected":true}];
  localStorage.setItem('user-משתמשדוגמא', JSON.stringify({"name":"משתמש דוגמא","id":"משתמשדוגמא","details":{"sex":"זכר","idNum":"123456789","birthDate":"1970-01-01","phoneNum":"0541236789","email":"exmapleMail@gmail.com","address":"כתובת דוגמא","institution":"גוונים","interests":"מדעי המחשב","foundRole":true},"meetings":[{"id":0,"title":"סיום פרויקט","content":"היום סיימתי את הפרויקט!","subtitle":"מדריך","date":"2024-12-26"}],"notes":[{"id":0,"title":"הערת דוגמא","content":"","type":"text","sizeX":1,"sizeY":1,"graph":{"toggle":false,"name":"","xAxis":{"type":"col","num":1},"yAxis":{"type":"col","num":1}}},{"id":1,"title":"טבלת עם גרף","content":[["תפוחים","8","אדומים"],["תותים","12",null],["בננות","3","ירוקות"],["אבטיחים","2",null],["אגסים","5",null]],"type":"table","sizeX":3,"sizeY":5,"graph":{"toggle":true,"name":"כמות פירות","xAxis":{"type":"col","num":1},"yAxis":{"type":"col","num":2}}}],"files":[{"id":0,"name":"תעודת זהות","format":"png","size":2528635},{"id":1,"name":"טופס ביטוח","format":"pdf","size":209242},{"id":2,"name":"שאלון טבלה","format":"xlsx","size":20612},{"id":3,"name":"תיקייה","format":"zip","size":291666},{"id":4,"name":"פנים","format":"jpg","size":57995}]}));
}


//Defining class structure for each user
class user {
  name;
  id;
  details;
  meetings;
  notes;
  files;

  constructor(name, id) {
    this.name = name;
    this.id = id;
    this.details = {
      sex: '',
      idNum: '',
      birthDate: '',
      phoneNum: '',
      email: '',
      address: '',
      institution: '',
      interests: '',
      foundRole: false
    };
    this.meetings = [];
    this.notes = [];
    this.files = [];
    this.save();
  };

  //Saving a user's data to local storage
  save() {
    localStorage.setItem(`user-${this.id}`, JSON.stringify(this));
  };
}


//Defining user object for managing user data and operations
export const users = {
  usersList,

  //Saving users list to local storage
  save() {
    localStorage.setItem('usersList', JSON.stringify(this.usersList));
  },

  //Adding a new user to the users list, sorted by name, and creating its data using the user class
  add(name) {
    const namesList = [];
    this.usersList.forEach(user => {
      namesList.push(user.name);
    });
    namesList.push(name);
    namesList.sort();
    const id = name.toLowerCase().replaceAll(" ", "");
    this.usersList.splice(namesList.indexOf(name), 0, {name, id, selected: false});
    this.save();
    this.select(id);

    new user(name, id);
  },

  //Returning the data of a specific user from local storage based on id
  get(id) {
    return JSON.parse(localStorage.getItem(`user-${id}`));
  },

  //Removing a user from the users list and remove its data from local storage based on id
  remove(id) {
    let i = 0;
    this.usersList.forEach(user => {
      if (user.id === id) {
        usersList.splice(i, 1);
      }
      i++;
    });
    this.save();

    localStorage.removeItem(`user-${id}`);
  },

  //Clears the users list and the data of every user in it from local storage
  clear() {
    this.usersList.forEach(user => {
      localStorage.removeItem(`user-${user.id}`);
    });
    this.usersList = [];
    this.save();
  },

  //Checks if a user with that name already exists
  exists(name) {
    let exists = false;
    this.usersList.forEach(user => {
      if (user.name === name) {
        exists = true;
      }
    });
    return exists;
  },

  //Select a user by id and remove the previously selected user
  select(selectId) {
    this.usersList.forEach(user => {
      if (user.selected === true) {
        user.selected = false;
      }
      if (selectId === user.id) {
        user.selected = true;
      }
    });
    this.save();
  }
};