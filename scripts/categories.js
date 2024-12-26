import { popUpToggle } from '../scripts/main.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

//Seperating content generation based on category
export function renderCategory(catg, id, sortMethod) {
  const userData = JSON.parse(localStorage.getItem(`user-${id}`));

  switch (catg) {
    case 'details':
      renderDetails(userData);
      break;

    case 'meetings':
      renderMeetings(userData, sortMethod);
      break;

    case 'notes':
      renderNotes(userData, sortMethod);
      break;

    case 'files':
      renderFiles(userData, sortMethod);
      break;
  }
}



function renderDetails(userData) {
  //Getting the details from the user's data
  const name = userData.name;
  const details = userData.details;
  const { sex, idNum, birthDate, phoneNum, email, address, institution, interests, foundRole } = details;
  //Using day.js library to calculate age
  const age = birthDate ? dayjs().diff(dayjs(birthDate, 'YYYY-MM-DD'), 'year') : '-';



  //Creating elements for details page,
  const contentHTML = `
    <div class="basic-details">
      <div class="details name">שם: ${name}</div>
      <div class="details sex">מין: <select class="input sex">
        <option${sex === '' ? ' selected="selected"' : ''} value=""></option>
        <option${sex === 'זכר' ? ' selected="selected"' : ''} value="זכר">זכר</option>
        <option${sex === 'נקבה' ? ' selected="selected"' : ''} value="נקבה">נקבה</option>
      </select></div>
      <div class="details id-num">מספר ת"ז: <input class="input idNum" type="number" value="${idNum}"></div>
      <div class="details birth-date">תאריך לידה: <input class="input birthDate" type="date" value="${birthDate}"></div>
      <div class="details age">גיל: ${age}</div>
    </div>

    <div class="devider"></div>

    <div class="contact-info-details">
      <div class="details phone-num">מספר טלפון: <input class="input phoneNum" type="number" value="${phoneNum}"></div>
      <div class="details email">מייל: <input class="input email" value="${email}" style="width: ${Math.max(25, email.length)}ch;"></div>
      <div class="details address">כתובת: <input class="input address" value="${address}" style="width: ${Math.max(20, address.length)}ch;"></div>
    </div>

    <div class="devider"></div>

    <div class="military-details">
      <div class="details institution">
       עמותה:
        <input class="input institution" value="${institution}" list="institutionList" style="width: ${Math.max(15, address.length)}ch;">
        <datalist id="institutionList">
          <option value="גוונים">
          <option value="חיבורים">  
          <option value="אבני דרך לחיים">
          <option value="רואים רחוק">
          <option value="שלווה">
        </datalist>
      </div>
      <div class="details interest">תחומי עניין: <input class="input interests" value="${interests}" style="width: ${Math.max(15, email.length)}ch;"></div>
      <div class="details found-role">נמצא תפקיד: <input class="input foundRole" type="checkbox" ${foundRole ? ' checked' : ''}></div>
    </div>

    <div class="devider"></div>

    <button class="js-details-save details save-button">שמירה</button>
  `;

  document.querySelector('.js-content').innerHTML = contentHTML;


  //Updating user info from details page when save button is pressed
  document.querySelector('.js-details-save').addEventListener('click', () => {
    Object.keys(details).forEach(detail => {
      details[detail] = document.querySelector(`.input.${detail}`).value;
    });
    details.foundRole = document.querySelector('.input.foundRole').checked;
    localStorage.setItem(`user-${userData.id}`, JSON.stringify(userData));
    renderCategory('details', userData.id);
  });
};



function renderMeetings(userData, sortMethod) {
  const meetings = userData.meetings;
  let bubblesHTML = '';

  //Sort meetings based on the selected sort method
  let sortedMeetings = meetings.slice();
  if (sortMethod != 'id') {
    sortedMeetings.sort((a, b) => {
      switch (sortMethod) {
        case 'nto':
          return dayjs(b.date).diff(a.date, 'day');
          break;

        case 'otn':
          return dayjs(a.date).diff(b.date, 'day');
          break;

        case 'title':
          return a.title.localeCompare(b.title);
          break

        case 'subtitle':
          return a.subtitle.localeCompare(b.subtitle);
          break;
      }
    });
  }

  //Creating elements for each meeting
  sortedMeetings.forEach(meeting => {
    bubblesHTML += `
      <div class="bubble-container">
        <div class="bubble-title">
          ${dayjs(meeting.date).format('DD-MM-YYYY')} - ${meeting.title}
          <button class="js-edit-bubble bubble-button" data-id="${meeting.id}"><img class="trash-icon" src="images/edit icon.png"</button>
          <button class="js-delete-bubble bubble-button" data-id="${meeting.id}"><img class="trash-icon" src="images/trash icon.png"</button>
        </div>
        <div class="bubble-subtitle">גורם פגישה: ${meeting.subtitle}</div>
        <textarea class="js-bubble-content bubble-content" placeholder="הכנס טקסט בועה כאן..." data-id="${meeting.id}">${meeting.content}</textarea>
      </div>
    `;
  });

  //Creating general meetings page elements
  const contentHTML = `
    <div class="meetings header-container">
      מיון לפי:
      <select class="js-sort-select input sort">
        <option${sortMethod === 'id' ? ' selected="selected"' : ''}>סדר הוספה</option>
        <option${sortMethod === 'nto' ? ' selected="selected"' : ''}>תאריך (חדש לישן)</option>
        <option${sortMethod === 'otn' ? ' selected="selected"' : ''}>תאריך (ישן לחדש)</option>
        <option${sortMethod === 'title' ? ' selected="selected"' : ''}>כותרת פגישה</option>
        <option${sortMethod === 'subtitle' ? ' selected="selected"' : ''}>גורם פגישה</option>
      </select>

      <button class="js-add-bubble bubble-add-button">+</button>
    </div>

    <div class="bubbles-container">
      ${bubblesHTML}
    </div>
  `;

  document.querySelector('.js-content').innerHTML = contentHTML;


  //Updating sort method
  document.querySelector('.js-sort-select').addEventListener('change', (event) => {
    switch (event.target.value) {
      case 'סדר הוספה':
        sortMethod = 'id';
        break;

      case 'תאריך (חדש לישן)':
        sortMethod = 'nto';
        break;

      case 'תאריך (ישן לחדש)':
        sortMethod = 'otn'
        break;

      case 'כותרת פגישה':
        sortMethod = 'title';
        break;

      case 'גורם פגישה':
        sortMethod = 'subtitle';
        break;
    }
    renderCategory('meetings', userData.id, sortMethod);
  });

  //Adding new metting
  document.querySelector('.js-add-bubble').addEventListener('click', () => {
    modifyMeetings('add');
  });

  //Editing an existing meeting
  document.querySelectorAll('.js-edit-bubble').forEach(button => {
    button.addEventListener('click', () => {
      const { id } = button.dataset;
      modifyMeetings('edit', Number(id));
    });
  });

  //Deleting a meeting
  document.querySelectorAll('.js-delete-bubble').forEach(button => {
    button.addEventListener('click', () => {
      const { id } = button.dataset;
      const meeting = getMeeting(Number(id), meetings);

      //Setting pop up elements
      document.querySelector('.js-pop-up-title').innerHTML = 'מחק פגישה?';
      document.querySelector('.js-pop-up-content').innerHTML = `
        <button class="js-delete-bubble-button pop-up-element pop-up-button delete-user-button">מחק</button>
        <button class="js-cancel-button pop-up-element pop-up-button">בטל</button>
      `;
      popUpToggle(true);

      //Adding funtionality to the pop up
      document.querySelector('.js-delete-bubble-button').addEventListener('click', () => {
        for (let i = id; i < meetings.length; i++) {
          meetings[i].id--;
        }
        meetings.splice(id, 1);
        saveData(userData);
        renderCategory('meetings', userData.id, sortMethod);
        popUpToggle(false);
      });

      //Closing pop up if cancel button is pressed
      document.querySelector('.js-cancel-button').addEventListener('click', () => {
        popUpToggle(false);
      });
    });
  });

  //Saving bubble content whenever it's updated
  document.querySelectorAll('.js-bubble-content').forEach(text => {
    text.addEventListener('input', (event) => {
      const { id } = text.dataset;
      meetings[id].content = text.value;
      saveData(userData);
    });
  });

  //This function sets the pop up for adding or editing a meeting
  function modifyMeetings(type, id) {
    let meeting;
    if (type === 'edit') {
      meeting = getMeeting(id, meetings);
    }
    //Setting pop up elements
    document.querySelector('.js-pop-up-title').innerHTML = type === 'add' ? 'הוסף פגישה:' : 'ערוך פגישה:';
    document.querySelector('.js-pop-up-content').innerHTML = `
      תאריך: <input class="js-pop-up-date pop-up-element pop-up-date" type="date"${type === 'edit' ? `value="${dayjs(meeting.date, 'D-M-YYYY').format('YYYY-MM-DD')}"` : ''}>

      <div>
        כותרת: <input class="js-pop-up-title-input pop-up-element"${type === 'edit' ? `value="${meeting.title}"` : ''}>
        <div>גורם: <input class="js-pop-up-subtitle pop-up-element"${type === 'edit' ? `value="${meeting.subtitle}"` : ''}></div>
      </div>

      <button class="js-add-bubble-button pop-up-element pop-up-button">${type === 'add' ? 'הוסף' : 'שמור'}</button>
      <button class="js-cancel-button pop-up-element pop-up-button">בטל</button>
      <div class="js-pop-up-error pop-up-error">אנא מלא את כל הפרטים</div>
    `;
    popUpToggle(true);

    //Getting data and saving new bubble when add button is pressed
    document.querySelector('.js-add-bubble-button').addEventListener('click', () => {
      const date = document.querySelector('.js-pop-up-date').value;
      const title = document.querySelector('.js-pop-up-title-input').value;
      const subtitle = document.querySelector('.js-pop-up-subtitle').value;

      //Displaying an error if one of the fields is left empty
      if (date && title && subtitle) {
        if (type === 'add') {
          meetings.push(new meetingBubble(meetings.length, title, '', subtitle, date));
        } else {
          meetings[id].date = date;
          meetings[id].title = title;
          meetings[id].subtitle = subtitle;
        }
        saveData(userData);
        renderCategory('meetings', userData.id, sortMethod);
        popUpToggle(false);
      } else {
        document.querySelector('.js-pop-up-error').classList.add('show');
      }
    });

    //Closing pop up if cancel button is pressed
    document.querySelector('.js-cancel-button').addEventListener('click', () => {
      popUpToggle(false);
    });
  };

  //Getting a meeting from the meetings list based on id
  function getMeeting(id, meetings) {
    let foundMeeting;
    meetings.forEach(meeting => {
      if (meeting.id === id) {
        foundMeeting = meeting;
      }
    });
    return foundMeeting;
  };
};



function renderNotes(userData, sortMethod) {
  const notes = userData.notes;
  let bubblesHTML = '';
  let bubbleContentHTML = '';

  //Sort notes based on the selected sort method
  let sortedNotes = notes.slice();
  if (sortMethod != 'id') {
    sortedNotes.sort((a, b) => {
      return a.title.localeCompare(b.title);
    });
  }

  //Creating elements for each note
  sortedNotes.forEach(note => {
    if (note.type === 'text') {
      bubbleContentHTML = `<textarea class="js-bubble-content bubble-content" placeholder="הכנס טקסט בועה כאן..." data-id="${note.id}">${note.content}</textarea>`;
    } else {
      bubbleContentHTML = `
        <div class="js-table ht-theme-main-dark" id="table-${note.id}"></div>
      `;
      //Adding graph element to bubbles which have it toggled on
      if (note.graph.toggle) {
        bubbleContentHTML += `<canvas class="graph-container" id="graph-${note.id}"></canvas>`;
      }
    }

    bubblesHTML += `
      <div class="bubble-container">
        <div class="bubble-title">
          ${note.title}
          <button class="js-edit-bubble bubble-button" data-id="${note.id}"><img class="trash-icon" src="images/edit icon.png"</button>
          ${note.type === 'table' ? `<button class="js-graph-bubble bubble-button" data-id="${note.id}"><img class="trash-icon" src="images/graph icon.png"</button>` : ''}
          <button class="js-delete-bubble bubble-button" data-id="${note.id}"><img class="trash-icon" src="images/trash icon.png"</button>
        </div>
        ${bubbleContentHTML}
      </div>
    `;
  });

  //Creating general notes page elements
  const contentHTML = `
    <div class="notes header-container">
      מיון לפי:
      <select class="js-sort-select input sort">
        <option${sortMethod === 'id' ? ' selected="selected"' : ''}>סדר הוספה</option>
        <option${sortMethod === 'title' ? ' selected="selected"' : ''}>כותרת</option>
      </select>

      <button class="js-add-bubble bubble-add-button">+</button>
    </div>

    <div class="bubbles-container">
      ${bubblesHTML}
    </div>
  `;

  //Rendering elements to page
  document.querySelector('.js-content').innerHTML = contentHTML;

  //Creating table in bubbles using Handsontable API
  notes.forEach(note => {
    if (note.type === 'table') {
      const container = document.querySelector(`#table-${note.id}`);
      const data = generateMatrix(note.content, note.sizeX, note.sizeY);

      const hot = new Handsontable(container, {
        data,
        rowHeaders: true,
        colHeaders: true,
        height: 'auto',
        autoWrapRow: true,
        autoWrapCol: true,
        licenseKey: 'non-commercial-and-evaluation',
        afterChange(change) {
          if (!change) {
            return;
          }
          fetch('https://handsontable.com/docs/scripts/json/save.json', {
            method: 'POST',
            mode: 'no-cors',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: change }),
          }).then(() => {
            //Every time a table is changed saving its data to local storage
            note.content = data;
            saveData(userData);
            //Re-rendering page only if the updated table has a graph
            if (note.graph.toggle) {
              renderCategory('notes', userData.id, sortMethod);
            }
          });
        }
      });

      //Creating graph in bubbles using Chart.js API
      if (note.graph.toggle) {
        const ctx = document.getElementById(`graph-${note.id}`);
        let xAxis = note.graph.xAxis.num - 1, yAxis = note.graph.yAxis.num - 1;
        const matrix = note.content;

        //Creating axis arrays
        if (note.graph.xAxis.type === 'col') {
          xAxis = getColumn(matrix, xAxis);
        } else {
          xAxis = matrix[xAxis];
        }
        if (note.graph.yAxis.type === 'col') {
          yAxis = getColumn(matrix, yAxis);
        } else {
          yAxis = matrix[yAxis];
        }

        //Rendering chart
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: xAxis,
            datasets: [{
              label: note.graph.name,
              data: yAxis,
              borderWidth: 1
            }]
          }
        });
      }
    }
  });

  //Updating sort method
  document.querySelector('.js-sort-select').addEventListener('change', (event) => {
    if (event.target.value === 'סדר הוספה') {
      sortMethod = 'id';
    } else {
      sortMethod = 'title';
    }
    renderCategory('notes', userData.id, sortMethod);
  });

  //Adding new note
  document.querySelector('.js-add-bubble').addEventListener('click', () => {
    modifyNotes('add');
  });

  //Editing an existing note
  document.querySelectorAll('.js-edit-bubble').forEach(button => {
    button.addEventListener('click', () => {
      const { id } = button.dataset;
      modifyNotes('edit', Number(id));
    });
  });

  //Editing table graphing
  document.querySelectorAll('.js-graph-bubble').forEach(button => {
    button.addEventListener('click', () => {
      const { id } = button.dataset;
      const note = getNote(Number(id), notes);
      let xAxisOptionsHTML = '', yAxisOptionsHTML = '';

      //Creating axis options
      for (let i = 1; i <= note.sizeX; i++) {
        xAxisOptionsHTML += `<option${note.graph.xAxis.type === 'col' && note.graph.xAxis.num === i ? ' selected="selected"' : ''}>טור ${i}</option>`;
      }
      for (let i = 1; i <= note.sizeY; i++) {
        xAxisOptionsHTML += `<option${note.graph.xAxis.type === 'row' && note.graph.xAxis.num === i ? ' selected="selected"' : ''}>שורה ${i}</option>`;
      }
      for (let i = 1; i <= note.sizeX; i++) {
        yAxisOptionsHTML += `<option${note.graph.yAxis.type === 'col' && note.graph.yAxis.num === i ? ' selected="selected"' : ''}>טור ${i}</option>`;
      }
      for (let i = 1; i <= note.sizeY; i++) {
        yAxisOptionsHTML += `<option${note.graph.yAxis.type === 'row' && note.graph.yAxis.num === i ? ' selected="selected"' : ''}>שורה ${i}</option>`;
      }

      //Setting pop up elements
      document.querySelector('.js-pop-up-title').innerHTML = 'גרף טבלה:';
      document.querySelector('.js-pop-up-content').innerHTML = `
        <div>הצג גרף: <input class="js-graph-toggle" type="checkbox"${note.graph.toggle ? ' checked' : ''}></div>

        <div class="js-graph-settings graph-settings${note.graph.toggle ? '' : ' hide'}">
          <div>שם גרף: <input class="js-graph-name input graph-name" value="${note.graph.name}"></div>
          <div>ציר אופקי: <select class="js-x-axis input graph-axis-select">${xAxisOptionsHTML}</select></div>
          <div>ציר אנכי (מספרים): <select class="js-y-axis input graph-axis-select">${yAxisOptionsHTML}</select></div>
        </div>

        <button class="js-graph-bubble-button pop-up-element pop-up-button graph-button">שמור</button>
        <button class="js-cancel-button pop-up-element pop-up-button">בטל</button>
      `;

      popUpToggle(true);

      //Toggling displaying graph settings based on toggle display option
      const graphToggle = document.querySelector('.js-graph-toggle');
      graphToggle.addEventListener('click', () => {
        const graphSettings = document.querySelector('.js-graph-settings').classList;
        if (graphToggle.checked) {
          graphSettings.remove('hide');
        } else {
          graphSettings.add('hide');
        }
      });

      //Saving graph data when save button is pressed
      document.querySelector('.js-graph-bubble-button').addEventListener('click', () => {
        const xAxis = document.querySelector('.js-x-axis').value;
        const yAxis = document.querySelector('.js-y-axis').value;
        notes[id].graph.toggle = graphToggle.checked;
        notes[id].graph.name = document.querySelector('.js-graph-name').value;
        notes[id].graph.xAxis.type = xAxis.includes('טור') ? 'col' : 'row';
        notes[id].graph.xAxis.num = Number(xAxis.replace(/\D/g, ''));
        notes[id].graph.yAxis.type = yAxis.includes('טור') ? 'col' : 'row';
        notes[id].graph.yAxis.num = Number(yAxis.replace(/\D/g, ''));
        saveData(userData);
        renderCategory('notes', userData.id, sortMethod);
        popUpToggle(false);
      });

      //Closing pop up if cancel button is pressed
      document.querySelector('.js-cancel-button').addEventListener('click', () => {
        popUpToggle(false);
      });
    });
  });

  //Deleting a note
  document.querySelectorAll('.js-delete-bubble').forEach(button => {
    button.addEventListener('click', () => {
      const { id } = button.dataset;
      const note = getNote(Number(id), notes);

      //Setting pop up elements
      document.querySelector('.js-pop-up-title').innerHTML = 'מחק הערה?';
      document.querySelector('.js-pop-up-content').innerHTML = `
        <button class="js-delete-bubble-button pop-up-element pop-up-button delete-user-button">מחק</button>
        <button class="js-cancel-button pop-up-element pop-up-button">בטל</button>
      `;
      popUpToggle(true);

      //Adding funtionality to the pop up
      document.querySelector('.js-delete-bubble-button').addEventListener('click', () => {
        for (let i = id; i < notes.length; i++) {
          notes[i].id--;
        }
        notes.splice(id, 1);
        saveData(userData);
        renderCategory('notes', userData.id, sortMethod);
        popUpToggle(false);
      });

      //Closing pop up if cancel button is pressed
      document.querySelector('.js-cancel-button').addEventListener('click', () => {
        popUpToggle(false);
      });
    });
  });

  //Saving text bubble content whenever it's updated
  document.querySelectorAll('.js-bubble-content').forEach(text => {
    text.addEventListener('input', (event) => {
      const { id } = text.dataset;
      notes[id].content = text.value;
      saveData(userData);
    });
  });

  //This function sets the pop up for adding or editing a note
  function modifyNotes(type, id) {
    let note;
    if (type === 'edit') {
      note = getNote(id, notes);
    }
    //Setting pop up elements
    document.querySelector('.js-pop-up-title').innerHTML = type === 'add' ? 'הוסף הערה:' : 'ערוך הערה:';
    document.querySelector('.js-pop-up-content').innerHTML = `
      כותרת: <input class="js-pop-up-title-input pop-up-element"${type === 'edit' ? `value="${note.title}"` : ''}>

      <div class="note-type-options">
        <select class="js-note-select input note-select${type === 'edit' ? ' hide' : ''}">
          <option${type === 'add' || note.type === 'text' ? ' selected="selected"' : ''}>טקסט</option>
          <option${type === 'edit' && note.type === 'table' ? ' selected="selected"' : ''}>טבלה</option>
        </select>
        <div class="js-table-size table-size${type === 'edit' && note.type === 'table' ? '' : ' hide'}"><input class="js-size-y input table-size"${type === 'edit' ? ` value="${note.sizeY}"` : ''} type="number"> x <input class="js-size-x input table-size"${type === 'edit' ? ` value="${note.sizeX}"` : ''} type="number"></div>
      </div>

      <button class="js-add-bubble-button pop-up-element pop-up-button">${type === 'add' ? 'הוסף' : 'שמור'}</button>
      <button class="js-cancel-button pop-up-element pop-up-button">בטל</button>
      <div class="js-pop-up-error pop-up-error">אנא מלא את כל הפרטים</div>
    `;
    popUpToggle(true);

    //Displaying table size option only if table option is selected
    if (type === 'add') {
      document.querySelector('.js-note-select').addEventListener('change', (event) => {
        const tableSizes = document.querySelector('.js-table-size').classList;
        if (event.target.value === 'טבלה') {
          tableSizes.remove('hide');
        } else {
          tableSizes.add('hide');
        }
      });
    }

    //Getting data and saving new bubble when add button is pressed
    document.querySelector('.js-add-bubble-button').addEventListener('click', () => {
      const title = document.querySelector('.js-pop-up-title-input').value;
      const noteType = document.querySelector('.js-note-select').value;
      let sizeX, sizeY;
      if (noteType === 'טבלה') {
        sizeX = Math.round(document.querySelector('.js-size-x').value);
        sizeY = Math.round(document.querySelector('.js-size-y').value);
      } else {
        sizeX = 1;
        sizeY = 1;
      }

      //Displaying an error if one of the fields is left empty
      if (title && sizeX > 0 && sizeY > 0) {
        if (type === 'add') {
          notes.push(new tableBubble(notes.length, title, '', document.querySelector('.js-note-select').value === 'טקסט' ? 'text' : 'table', sizeX, sizeY));
        } else {
          notes[id].title = title;
          notes[id].sizeX = sizeX;
          notes[id].sizeY = sizeY;
        }
        saveData(userData);
        renderCategory('notes', userData.id, sortMethod);
        popUpToggle(false);
      } else {
        document.querySelector('.js-pop-up-error').classList.add('show');
      }
    });

    //Closing pop up if cancel button is pressed
    document.querySelector('.js-cancel-button').addEventListener('click', () => {
      popUpToggle(false);
    });
  };

  //Getting a note from the notes list based on id
  function getNote(id, notes) {
    let foundNote;
    notes.forEach(note => {
      if (note.id === id) {
        foundNote = note;
      }
    });
    return foundNote;
  };

  //Generating data matrix from content field of note
  function generateMatrix(content, sizeX, sizeY) {
    let matrix;
    if (typeof content != 'object') {
      matrix = new Array(sizeY);
    } else {
      matrix = content;
      matrix.length = sizeY;
    }

    let newRow;
    for (let i = 0; i < sizeY; i++) {
      if (typeof matrix[i] != 'object') {
        matrix[i] = new Array(sizeX);
      } else {
        matrix[i].length = sizeX;
      }
    }

    return matrix;
  }

  //Getting a specified column from a matrix by index
  function getColumn(matrix, colNum) {
    const col = [];
    for(let i=0; i<matrix.length; i++) {
      col.push(matrix[i][colNum]);
    }
    return col;
  };
};



function renderFiles(userData, sortMethod) {
  const files = userData.files;
  let filesHTML = '';
  
  //Sort files based on the selected sort method
  let sortedFiles = files.slice();
  if (sortMethod != 'id') {
    sortedFiles.sort((a, b) => {
      switch (sortMethod) {
        case 'name':
          return //dayjs(b.date).diff(a.date, 'day');
          break;

        case 'format':
          return a.format.localeCompare(b.format);
          break

        case 'size':
          return a.size > b.size;
          break;
      }
    });
  }

  //Creating elements for each file
  let colorToggle = false;
  sortedFiles.forEach(file => {
    filesHTML += `
      <div class="file-container color-${colorToggle ? 'light' : 'dark'}">
        <div class="file-right"><div class="file-element">${file.name} - </div><div class="file-element">${humanFileSize(file.size)}</div> <div class="file-element format">סוג: ${file.format}</div></div>
        <button class="js-file-delete file-delete-button" data-id="${file.id}"><img class="trash-icon" src="images/trash icon.png"></button>
      </div>
    `;
    colorToggle = !colorToggle;
  });

  //Creating general files page elements
  const contentHTML = `
    <div class="files header-container">
      <div class="files-disclaimer">(מכיוון שפרויקט זה יותר מכוון ביצירת front לא יצרתי שרת לשמור את הקבצים עצמם, עמוד זה רק מראה את הפרטים של הקובץ)</div>
      מיון לפי:
      <select class="js-sort-select input sort">
        <option${sortMethod === 'id' ? ' selected="selected"' : ''}>סדר הוספה</option>
        <option${sortMethod === 'name' ? ' selected="selected"' : ''}>שם</option>
        <option${sortMethod === 'format' ? ' selected="selected"' : ''}>סוג קובץ</option>
        <option${sortMethod === 'size' ? ' selected="selected"' : ''}>גודל קובץ</option>
      </select>
    </div>

    <div class="files-container">
      ${filesHTML}
      <div class="upload-file-container">
        <img class="upload-icon" src="images/upload icon.png">
        <div>העלה קובץ: <input class="js-file-upload" type="file" multiple></div>
      </div>
    </div>
  `;

  //Rendering elements to page
  document.querySelector('.js-content').innerHTML = contentHTML;

  //Updating sort method
  document.querySelector('.js-sort-select').addEventListener('change', (event) => {
    switch (event.target.value) {
      case 'סדר הוספה':
        sortMethod = 'id';
        break;

      case 'שם':
        sortMethod = 'name';
        break;

      case 'סוג קובץ':
        sortMethod = 'format'
        break;

      case 'גודל קובץ':
        sortMethod = 'size';
        break;
    }
    renderCategory('files', userData.id, sortMethod);
  });

  //Adding uploaded file data to local storage
  const uploadedFile = document.querySelector('.js-file-upload');
  uploadedFile.addEventListener('change', () => {
    for(let i=0; i<uploadedFile.files.length; i++) {
      const file = uploadedFile.files[i];
      const formatDot = file.name.lastIndexOf('.');
      files.push(new fileStruc(files.length, file.name.substring(0, formatDot), file.name.substring(formatDot + 1), file.size));
      saveData(userData);
      renderCategory('files', userData.id, sortMethod);
    }
  });

  //Adding functionality to delete buttons
  document.querySelectorAll('.js-file-delete').forEach(button => {
    button.addEventListener('click', () => {
      let { id } = button.dataset;
      id = Number(id);
      //Updating ids of any file after the deleted one
      for(let i=id; i<files.length; i++) {
        files[i].id--;
      }
      files.splice(id, 1);
      saveData(userData);
      renderCategory('files', userData.id, sortMethod);
    });
  });
};

//Saving new user data to local storage
function saveData(userData) {
  localStorage.setItem(`user-${userData.id}`, JSON.stringify(userData));
};

//Convert file size to human readable form
function humanFileSize(size) {
  var i = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
  return +((size / Math.pow(1024, i)).toFixed(2)) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
}


//Defining structure of bubble object for meetings and notes pages
class bubble {
  id;
  title;
  content;

  constructor(id, title, content) {
    this.id = id;
    this.title = title;
    this.content = content;
  };
};

//The meeting bubble has additional subtitle and date fields
class meetingBubble extends bubble {
  subtitle;
  date;

  constructor(id, title, content, subtitle, date) {
    super(id, title, content);
    this.subtitle = subtitle;
    this.date = date;
  };
};

//The table bubble has additional fields for the size of the table, as well as an object to store the graph data
class tableBubble extends bubble {
  type;
  sizeX;
  sizeY;
  graph;

  constructor(id, title, content, type, sizeX, sizeY) {
    super(id, title, content);
    this.type = type;
    this.sizeX = sizeX;
    this.sizeY = sizeY;
    this.graph = {
      toggle: false,
      name: '',
      xAxis: { type: 'col', num: 1 },
      yAxis: { type: 'col', num: 1 }
    };
  };
};

//Defining the structure of a file object
class fileStruc {
  id;
  name;
  format;
  size;

  constructor(id, name, format, size) {
    this.id = id;
    this.name = name;
    this.format = format;
    this.size = size;
  };
}