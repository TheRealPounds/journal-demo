import { users } from '../data/users.js';
import { renderSidebar } from '../scripts/sidebar.js';
import { renderCategory } from './categories.js';

export let selectedCatg = 'details';

renderSidebar('');
renderContent(selectedCatg);

export function renderContent(catg) {
  //Getting user id from the selected element
  const selectedUser = document.querySelector('.js-selected-user');
  const id = selectedUser === null ? '' : selectedUser.dataset.id;
  let mainHeaderHTML;

  //Displaying a message and stopping if no user is selected
  if (!id) {
    mainHeaderHTML = '<div class="user-title">אנא בחר מתנדב</div>';
    document.querySelector('.js-main').innerHTML = mainHeaderHTML;
    return;
  }

  //Generating HTML for the user name, delete user button and the category buttons
  const userData = users.get(id);
  mainHeaderHTML = `
    <div class="user-title-container">
      <div class="js-user-title user-title">${userData.name}</div>
      <button class="js-delete-user user-delete-button"><img class="trash-icon" src="images/trash icon.png"></button>
    </div>

    <div class="js-catgs user-catgs">
      <button class="js-catg js-catg-details user-catg" data-name="details">פרטים</button>
      <button class="js-catg js-catg-meetings user-catg" data-name="meetings">פגישות</button>
      <button class="js-catg js-catg-notes user-catg" data-name="notes">הערות</button>
      <button class="js-catg js-catg-files user-catg" data-name="files">טפסים</button>
    </div>

    <div class="js-content main-content"></div>
  `;

  document.querySelector('.js-main').innerHTML = mainHeaderHTML;
  document.querySelector(`.js-catg-${selectedCatg}`).classList.add('selected');

  //Rendering content from selected category
  renderCategory(selectedCatg, id, 'id');


  //Adding functionality to the "delete user" button
  document.querySelector('.js-delete-user').addEventListener('click', () => {
    //Setting the look of the pop up
    document.querySelector('.js-pop-up-title').innerHTML = 'מחק מתנדב?';
    document.querySelector('.js-pop-up-content').innerHTML = `
      <button class="js-delete-user-button pop-up-element pop-up-button delete-user-button">מחק</button>
      <button class="js-cancel-button pop-up-element pop-up-button">בטל</button>
    `;
    popUpToggle(true);

    //Adding funtionality to the pop up
    document.querySelector('.js-delete-user-button').addEventListener('click', () => {
      //Removing user from users list and re-rendering sidebar and content
      users.remove(id);
      popUpToggle(false);
      renderSidebar(document.querySelector('.js-user-search').value);
      renderContent(catg);
    });

    //Closing pop up if cancel button is pressed
    document.querySelector('.js-cancel-button').addEventListener('click', () => {
      popUpToggle(false);
    });
  });

  //Adding functionality to category buttons
  document.querySelectorAll('.js-catg').forEach(button => {
    button.addEventListener('click', () => {
      selectedCatg = button.dataset.name;
      renderContent(selectedCatg);
    });
  });
};

//General pop up exit
document.querySelector('.js-pop-up-exit').addEventListener('click', () => {
  popUpToggle(false);
});

export function popUpToggle(state) {
  if (state) {
    document.querySelector('.js-pop-up').classList.add('pop-up-active');
  } else {
    document.querySelector('.js-pop-up').classList.remove('pop-up-active');
  }
}