import { users } from '../data/users.js';
import { selectedCatg, renderContent, popUpToggle } from '../scripts/main.js';

let minimized = false;

export function renderSidebar(filter) {
  //For every user in the users list, checking if the name includes the filter word, if so generating an element for the sidebar list
  filter = filter.toLowerCase().replaceAll(" ", "");
  let usersHTML = '';
  users.usersList.forEach(user => {
    const { selected } = user;
    if (user.id.includes(filter)) {
      usersHTML += `<button class="js-user-button sidebar-user${selected ? ' js-selected-user selected-user' : ''}" data-id="${user.id}">${user.name}</button>`;
    }
  });

  document.querySelector('.js-sidebar-users').innerHTML = usersHTML;



  //Adding functionality to selecting a user from the users list
  document.querySelectorAll('.js-user-button').forEach(button => {
    button.addEventListener('click', () => {
      const { id } = button.dataset;
      users.select(id);
      renderSidebar(filter);
      renderContent(selectedCatg);
    });
  });
};


//Re-rendering sidebar list each time the search value changes
document.querySelector('.js-user-search').addEventListener('input', function(evt) {
  renderSidebar(this.value);
});

//Adding funtionality to the "add user" button
document.querySelector('.js-add-user').addEventListener('click', () => {
  //Setting the look of the pop up
  document.querySelector('.js-pop-up-title').innerHTML = 'הוסף מתנדב:';
  document.querySelector('.js-pop-up-content').innerHTML = `
    <div>
      שם:
      <input class="js-add-user-input pop-up-element">
      <div class="js-pop-up-error pop-up-error"></div>
    </div>
    <button class="js-add-user-button pop-up-element pop-up-button add-user-button">הוסף</button>
    <button class="js-cancel-button pop-up-element pop-up-button">בטל</button>
  `;
  popUpToggle(true);

  //Adding funtionality to the pop up
  document.querySelector('.js-add-user-button').addEventListener('click', () => {
    const name = document.querySelector('.js-add-user-input').value;
    const popUpError = document.querySelector('.js-pop-up-error');
    //Displaying the approprite error if the inputed name is empty or already exists, otherwise adding it to the users list
    if (name) {
      if (users.exists(name)) {
        popUpError.innerHTML = 'שם משתמש כבר קיים במערכת';
        popUpError.classList.add('pop-up-show-error');
      } else {
        users.add(name);
        popUpToggle(false);
        renderSidebar(document.querySelector('.js-user-search').value);
        renderContent(selectedCatg);
      }
    } else {
      popUpError.innerHTML = 'אנא הכנס שם משתמש תקין';
      popUpError.classList.add('show');
    }
  });

  //Closing pop up if cancel button is pressed
  document.querySelector('.js-cancel-button').addEventListener('click', () => {
    popUpToggle(false);
  });
});

//Adding funtionality to the "minimize sidebar" button
document.querySelector('.js-minimize').addEventListener('click', () => {
  //Toggling whether the sidebar is minimized
  minimized = !minimized;
  
  //Adding or removing class accordingly
  if (minimized) {
    document.querySelector('.js-sidebar').classList.add('minimized');
    document.querySelector('.js-minimize').classList.add('minimized');
    document.querySelector('.js-main').classList.add('minimized');
  } else {
    document.querySelector('.js-sidebar').classList.remove('minimized');
    document.querySelector('.js-minimize').classList.remove('minimized');
    document.querySelector('.js-main').classList.remove('minimized');
  }
});