"use strict";

//
class Note {
  constructor(id, title, text) {
    this.id = id;
    this.title = title;
    this.text = text;
  }
}

class App {
  constructor() {
    this.notes = JSON.parse(localStorage.getItem("notes")) || [];
    this.selectedNoteId = "";
    this.miniSidebar = true;

    // select different HTML elements
    this.$activeForm = document.querySelector(".active-form");
    this.$inactiveForm = document.querySelector(".inactive-form");
    this.$noteTitle = document.querySelector("#note-title");
    this.$noteText = document.querySelector("#note-text");
    this.$notes = document.querySelector(".notes");
    this.$form = document.querySelector("#form");
    this.$modal = document.querySelector(".modal");
    this.$modalForm = document.querySelector("#modal-form");
    this.$modalTitle = document.querySelector("#modal-title");
    this.$modalText = document.querySelector("#modal-text");
    this.$closeModalForm = document.querySelector("#modal-btn");
    this.$sidebar = document.querySelector(".sidebar");
    this.$sidebarActiveItem = document.querySelector(".active-item");

    this.addEventListeners();
    this.displayNotes();
  }

  addEventListeners() {
    document.body.addEventListener("click", (event) => {
      // The this keyword is the this for the parent function in this case it points to our App

      this.handleFormClick(event);
      this.closeModal(event);
      this.openModal(event);
      this.handleArchiving(event);
    });

    // prevents the form from being sent and the page reloading
    this.$form.addEventListener("submit", (event) => {
      event.preventDefault();
      const title = this.$noteTitle.value;
      const text = this.$noteText.value;
      this.addNote({ title, text });
      this.closeActiveForm();
    });

    this.$closeModalForm.addEventListener("click", (event) => {
      event.preventDefault();
    });

    this.$sidebar.addEventListener("mouseover", (event) => {
      this.handleToggleSidebar();
    });

    this.$sidebar.addEventListener("mouseout", (event) => {
      this.handleToggleSidebar();
    });
  }

  handleFormClick(event) {
    // check if we clicked on the active form, by checking if the element we clicked is inside our active-form and inactive-form paraent.

    // when the click event accours, we check what element caused the event and if the event was caused by the active-form or inactive-form.
    const isActiveFormClickedOn = this.$activeForm.contains(event.target);
    const isInactiveFormClickedOn = this.$inactiveForm.contains(event.target);

    const title = this.$noteTitle.value;
    const text = this.$noteText.value;

    // if we click on the inactive from run the openFormFunction
    if (isInactiveFormClickedOn) {
      this.openActiveForm();

      // if we click outside the active and inactive form, run the closeFormFunction
    } else if (!isActiveFormClickedOn && !isInactiveFormClickedOn) {
      this.addNote({ title, text });
      this.closeActiveForm();
    }
  }

  //
  openModal(event) {
    // it is the note that we selected.
    const $selectedNote = event.target.closest(".note");
    if ($selectedNote && !event.target.closest(".archive")) {
      this.selectedNoteId = $selectedNote.id;
      const [, title, text] = $selectedNote.children;

      this.$modalTitle.value = title.innerHTML;
      this.$modalText.value = text.innerHTML;
      this.$modal.classList.add("open-modal");
    } else {
      return;
    }
  }

  closeModal(event) {
    // check if is what caused the event inside a modal form
    const isModalFormClickedOn = this.$modalForm.contains(event.target);
    const isClosedModalBtnClickedOn = this.$closeModalForm.contains(
      event.target
    );
    if (
      (!isModalFormClickedOn || isClosedModalBtnClickedOn) &&
      this.$modal.classList.contains("open-modal")
    ) {
      this.editNote(this.selectedNoteId, {
        title: this.$modalTitle.value,
        text: this.$modalText.value,
      });
      this.$modal.classList.remove("open-modal");
    }
  }

  handleArchiving(event) {
    const $selectedNote = event.target.closest(".note");
    if ($selectedNote && event.target.closest(".archive")) {
      this.selectedNoteId = $selectedNote.id;
      this.deleteNote(this.selectedNoteId);
    } else {
      return;
    }
  }

  openActiveForm() {
    this.$activeForm.style.display = "block";
    this.$inactiveForm.style.display = "none";
    this.$noteText.focus();
  }

  closeActiveForm() {
    this.$activeForm.style.display = "none";
    this.$inactiveForm.style.display = "block";
    this.$noteText.value = "";
    this.$noteTitle.value = "";
  }
  addNote({ title, text }) {
    // if we have a title or text add a note
    if (text || title) {
      const newNote = new Note(cuid(), title, text);
      this.notes = [...this.notes, newNote];
      this.render();
    }
  }

  editNote(id, { title, text }) {
    this.notes = this.notes.map((note) => {
      if (note.id == id) {
        note.title = title;
        note.text = text;
      }
      return note;
    });
    this.render();
  }

  deleteNote(id) {
    this.notes = this.notes.filter((note) => note.id != id);
    this.render();
  }

  handleMouseOverNote(element) {
    const $note = document.querySelector(`#${element.id}`);
    const $checkNote = $note.querySelector(".check-circle");
    const $noteFooter = $note.querySelector(".note-footer");
    $checkNote.style.visibility = "visible";
    $noteFooter.style.visibility = "visible";
  }

  handleMouseOutNote(element) {
    const $note = document.querySelector(`#${element.id}`);
    const $checkNote = $note.querySelector(".check-circle");
    const $noteFooter = $note.querySelector(".note-footer");
    $checkNote.style.visibility = "hidden";
    $noteFooter.style.visibility = "hidden";
  }

  handleToggleSidebar() {
    if (this.miniSidebar) {
      this.$sidebar.style.width = "250px";
      this.$sidebar.classList.add("sidebar-hover");
      this.$sidebarActiveItem.classList.add("sidebar-active-item");
      this.miniSidebar = false;
    } else {
      this.$sidebar.style.width = "80px";
      this.$sidebar.classList.remove("sidebar-hover");
      this.$sidebarActiveItem.classList.remove("sidebar-active-item");
      this.miniSidebar = true;
    }
  }

  saveNotes() {
    localStorage.setItem("notes", JSON.stringify(this.notes));
  }

  render() {
    this.saveNotes();
    this.displayNotes();
  }

  displayNotes() {
    this.$notes.innerHTML = this.notes
      .map(
        ({ title, text, id }) =>
          ` <div id= ${id} class="note" onmouseover="app.handleMouseOverNote(this)" onmouseout="app.handleMouseOutNote(this)">
          <span class="material-symbols-outlined check-circle"
            >check_circle</span
          >
          <div class="title">${title}</div>
          <div class="text">${text}</div>
          <div class="note-footer">
            <div class="tooltip">
              <span class="material-symbols-outlined hover small-icon"
                >add_alert</span
              >
              <span class="tooltip-text">Remind me</span>
            </div>
            <div class="tooltip">
              <span class="material-symbols-outlined hover small-icon"
                >person_add</span
              >
              <span class="tooltip-text">Collaborator</span>
            </div>
            <div class="tooltip">
              <span class="material-symbols-outlined hover small-icon"
                >palette</span
              >
              <span class="tooltip-text">Change Color</span>
            </div>
            <div class="tooltip">
              <span class="material-symbols-outlined hover small-icon"
                >image</span
              >
              <span class="tooltip-text">Add Image</span>
            </div>
            <div class="tooltip archive">
              <span class="material-symbols-outlined hover small-icon"
                >archive</span
              >
              <span class="tooltip-text">Archive</span>
            </div>
            <div class="tooltip">
              <span class="material-symbols-outlined hover small-icon"
                >more_vert</span
              >
              <span class="tooltip-text">More</span>
            </div>
          </div>
        </div>
        `
      )
      .join("");
  }
}

const app = new App();
