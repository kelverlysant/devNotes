// elementos
const notesContainer = document.querySelector("#notes-container");

const noteTitle = document.querySelector("#title-input");

const noteInput = document.querySelector("#note-content");

const addNoteBtn = document.querySelector(".add-note");

const searchInput = document.querySelector("#search-input");

const exportBtn = document.querySelector("#export-notes")

// funções
function showNotes(){
    cleanNotes();

    getNotes().forEach((note)=>{
        const noteElement = createNote(note.id, note.title, note.content, note.fixed);

        notesContainer.appendChild(noteElement);
    });
};

function cleanNotes(){
    notesContainer.replaceChildren([]);
}

function addNote(){
    
    const notes = getNotes()

    const noteObject = {
        id: generateId(),
        title: noteTitle.value,
        content: noteInput.value,
        fixed: false,
    };

    const noteElement = createNote(noteObject.id ,noteObject.title, noteObject.content);
     
    notesContainer.appendChild(noteElement);

    notes.push(noteObject);
    saveNotes(notes)

    noteTitle.value = "";
    noteInput.value = "";
};

function generateId(){
    return Math.floor(Math.random() * 5000)
};

function createNote(id, title ,content, fixed){

    const element = document.createElement("div");
    element.classList.add("note");

    const titleElement = document.createElement("h4");
    titleElement.textContent = title;
    titleElement.classList.add("title")

    const textarea = document.createElement("textarea");
    textarea.value = content;
    textarea.placeholder = "Adicione algum texto...";

    
    element.appendChild(titleElement);
    element.appendChild(textarea);

    const pinIcon = document.createElement("i")

    pinIcon.classList.add(...["bi", "bi-pin"])
    
    element.appendChild(pinIcon)

    
    const deletIcon = document.createElement("i")

    deletIcon.classList.add(...["bi", "bi-x-lg"])
    
    element.appendChild(deletIcon)


    
    const duplicateIcon = document.createElement("i")

    duplicateIcon.classList.add(...["bi", "bi-file-earmark-plus"])
    
    element.appendChild(duplicateIcon)



    if(fixed){
        element.classList.add("fixed");
    };

// eventos do elemento
    element.querySelector(".bi-pin").addEventListener("click", ()=>{
        ToggleFixNote(id)
    });


    element.querySelector(".bi-x-lg").addEventListener("click", ()=>{
        deletNote(id, element )
       
    });

    element.querySelector(".bi-file-earmark-plus").addEventListener("click", ()=>{
        copyNote(id)
        console.log("testando")
    });

    element.querySelector("textarea").addEventListener("keyup", (e)=>{
        const noteContent = e.target.value;
        updateNote(id, noteContent);
    });
    return element;

};

function ToggleFixNote(id){
    const notes = getNotes();

    const targetNote = notes.filter((note)=> note.id === id)[0];
    targetNote.fixed = !targetNote.fixed;
    saveNotes(notes);
    showNotes();

};

function deletNote(id, element){
    const notes = getNotes().filter((note) => note.id !== id);
    saveNotes(notes);

    notesContainer.removeChild(element);
}

function copyNote(id){
    const notes = getNotes();

    const targetNotes = notes.filter((note) => note.id === id)[0];

    const noteObject ={
        id: generateId(),
        title: targetNotes.title,
        content: targetNotes.content,
        fixed: false,
    };

    const noteElement = createNote(noteObject.id, noteObject.title, noteObject.content, noteObject.fixed);
    notesContainer.appendChild(noteElement);
    notes.push(noteObject);
    saveNotes(notes);
};

function updateNote(id, newcontent){
    const notes = getNotes();

    const targetNote = notes.filter((note) => note.id === id)[0];

    targetNote.content = newcontent;

    saveNotes(notes);

};

function searchNotes(search){
    const searchResults = getNotes().filter((note)=>{
       return note.title.includes(search);
    });



    if(search !== ""){
        cleanNotes()

        searchResults.forEach((note) =>{
            const noteElement = createNote(note.id, note.title, note.content);
            notesContainer.appendChild(noteElement);
        });

        return;
    };

    cleanNotes();

    showNotes();
};

function exportDate(){

    const notes = getNotes();

    const csvString = [
        ["ID", "Title", "Content", "Fixed?"],
        ...notes.map((note) => [note.id, note.title, note.content, note.fixed])
    ]
    .map((e) => e.join(","))
    .join("\n");

    const element = document.createElement("a");

    element.href = "data:text/csv;charset=utf-8," + encodeURI(csvString);

    element.target = "_blank";
    element.download = "notes.csv";

    element.click();
}
// localstorage
function getNotes(){
    const notes = JSON.parse(localStorage.getItem("notes")|| "[]");

    const orderNotes = notes.sort((a,b) => (a.fixed > b.fixed ? -1 : 1))

    return orderNotes;
}

function saveNotes(notes){
    localStorage.setItem("notes", JSON.stringify(notes))
}


// eventos

addNoteBtn.addEventListener("click", () => addNote());

searchInput.addEventListener("keyup", (e)=>{
    const search = e.target.value;

    searchNotes(search);
})

noteInput.addEventListener("keydown", (e) =>{
    if(e.key === "Enter"){
        addNote();
    }
});
noteTitle.addEventListener("keydown", (e) =>{
    if(e.key === "Enter"){
        addNote();
    }
});

exportBtn.addEventListener("click", () =>{
    exportDate();
});
// inicialização
showNotes()