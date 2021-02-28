console.log("=== AGENDA ===");

// IIFE - nome da estrutura (Imediataly Invoked Function Expression) (Funcao Imediata)
(function () {
    console.log("Starting APP....");

    // UI - (User Interface)
    const ui = {
        fieldName: document.querySelector("#name"),
        fieldEmail: document.querySelector("#email"),
        fields: document.querySelectorAll("input"),
        buttonAdd: document.querySelector(".pure-button-primary"),
        tableContacts: document.querySelector(".pure-table tbody")
    };

   // console.log(ui);

    // Actions
    const validateFields = function(e) {
        e.preventDefault();
        console.log("validating...", ui.fields);
        //console.log(ui.fields[0])
        //console.log(ui.fields[1])
        
        let data = {}
        let errors = 0;

        ui.fields.forEach(function(field) {
            //console.log(field.value, field.value == "");
            if (field.value == "") {
                //console.log(field.id, field.value,"vazio");
                errors +=1 ;
                field.classList.add("error");
            } else {
                //console.log(field.id, field.value,"preenchido");
                data[field.id] = field.value;
                field.classList.remove("error");
            }
        });

        // console.log(errors, data);

        if (errors > 0) {
            document.querySelector(".error").focus();
        } else {
            addContact(data);
        }
        //debugger;
    };

    const addContact = function(contact) {
        console.log("JS",contact);
        console.log("JSON",JSON.stringify(contact)); // converte para JSON

        const endpoint = "http://localhost:5000/contacts" // o endereco do sistema de backend
        const config = {
            method: "POST",
            body: JSON.stringify(contact),
            headers: new Headers({
                "Content-type": "application/json"
            })
        };

        //Promise API
        fetch(endpoint, config)
        .then(getContacts)  // onfullfilled (success)
        .catch(addContactError) // onrejected (error)

        //getContacts()
    };

    const addContactError = function() {
        debugger;
    };

    const clearFields = function () {
        ui.fields.forEach(function(field){
            console.log(field);
            field.value = "";
        })
        ui.fieldName.focus();
    };

    const getContacts = function() {

        const endpoint = "http://localhost:5000/contacts?_sort=id&_order=desc" // o endereco do sistema de backend
        const config = {
            method: "GET",
            headers: new Headers({
                "Content-type": "application/json"
            })
        };

        // fetch retorna PROMISSE, como a primeira retorna uma segunda PROMISSE teve q encadear
            fetch(endpoint, config) // promisse 1
                .then(convertToJson) // promisse 2
                    .then(getContactsSuccess)
                    .catch(getContactsError)
                .catch(getContactsError);
            
            clearFields();
    };

    const convertToJson = function(resp) {
        return resp.json();
    };

    const getContactsError = function() {
        debugger;
    };

    const getContactsSuccess = function(contacts) {
        console.table(contacts);

        const html = contacts.map(function(contact){
                
                return `
                <tr>
                    <td>${contact.id}</td>
                    <td>${contact.name}</td>
                    <td>${contact.email}</td>
                    <td>${contact.phone}</td>
                    <td><a href="#">Excluir</a></td>
                </tr>
            `;
        }).join("");

        //console.log(html);

        ui.tableContacts.innerHTML = html;
    


};

    const removeContact = function() {};

    // Mapping Events (UI + Actions) juntando as duas partes
    ui.buttonAdd.onclick = validateFields;

    // Initialize
    getContacts();

})();