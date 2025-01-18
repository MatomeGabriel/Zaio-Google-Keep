"use strict";

class Note {
  constructor(id, title, text) {
    this.id = id;
    this.title = title;
    this.text = text;
  }
}

class App {
  constructor() {
    this.notes = [];
    // select different HTML elements
    this.$activeForm = document.querySelector(".active-form");
    this.$inactiveForm = document.querySelector(".inactive-form");
    this.$noteTitle = document.querySelector("#note-title");
    this.$noteText = document.querySelector("#note-text");
    this.$notes = document.querySelector(".notes");
    this.addEventListeners();
  }

  addEventListeners() {
    document.body.addEventListener("click", (event) => {
      // The this keyword is the this for the parent function in this case it points to our App
      this.handleFormClick(event);
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
      this.displayNotes();
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
  }

  displayNotes() {
    this.$notes.innerHTML = this.notes
      .map(
        ({ title, text }) =>
          ` <div class="note">
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
            <div class="tooltip">
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

  deleteNote(id) {
    this.notes = this.notes.filter((note) => note.id != id);
  }
}

const app = new App();
