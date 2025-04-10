import * as Contacts from './contacts.js';




// Selectores
const inputName = document.querySelector('#name-input');
const inputNumber = document.querySelector('#phone-input');
const form = document.querySelector('#main-form');
const formBtn = document.querySelector('#main-form-btn');
const contactsList = document.querySelector('#contacts-list');


// Regex o Expreciones regulares
const NAME_REGEX = /^[A-Z][a-z]*[ ][A-Z][a-z]{3,}[ ]{0,1}$/;
const PHONE_REGEX = /^[0](412|424|414|426|416|212)[0-9]{7}$/;

// Validaciones de formulario
let nameValidation = false;
let phoneValidation = false;


// Funciones
const renderValidation = (input, validation) => {
  const helperText = input.nextElementSibling;  
  if (input.value === '') {
    input.classList.remove('input-invalid');
    input.classList.remove('input-valid');
    helperText?.classList.remove('show-helper-text');
  } else if (validation) {
    input.classList.add('input-valid');
    input.classList.remove('input-invalid');
    helperText?.classList.remove('show-helper-text');
  } else {
    input.classList.add('input-invalid');
    input.classList.remove('input-valid');
    helperText?.classList.add('show-helper-text');
  }
}

const renderButtonState = () => {
  if (nameValidation && phoneValidation) {
    formBtn.disabled = false;
  } else {
    formBtn.disabled = true;
  }
}



// Eventos
inputName.addEventListener('input', e => {
  nameValidation = NAME_REGEX.test(inputName.value);
  renderValidation(inputName, nameValidation);
  renderButtonState();
});

inputNumber.addEventListener('input', e => {
  phoneValidation = PHONE_REGEX.test(inputNumber.value);
  renderValidation(inputNumber, phoneValidation);
  renderButtonState();
});

form.addEventListener('submit', e => {
  e.preventDefault();
  // 1. Validar
  if (!nameValidation || !phoneValidation) return;
  // 2. Obtener el numero y el nombre.
  const phone = inputNumber.value;
  const name = inputName.value;
  // 3. Asignar un id. Ramdom
  const id = crypto.randomUUID();
  // 4. Estructurar el contacto
  const newContact = {id, name, phone};
  // 5. Agregar al array de contactos
  Contacts.addContact(newContact);
  // 6. Guardar en el navegador
  Contacts.saveInBrowser();
  // 7. Renderizar en el navegador
  Contacts.renderContacts(contactsList); 
});

contactsList.addEventListener('click', e => {
  const deleteBtn = e.target.closest('.delete-btn');
  const editBtn = e.target.closest('.edit-btn');

  if (deleteBtn) {
    //1. Encuentro el li
    const li = deleteBtn.parentElement.parentElement;
    //2. Actualizo el array de js, usando el metodo filter para devolver todos los contactos exepto el que quiero eliminar.
    //Manera explicita
    //contacts = contacts.filter(contact =>{
      // if (contact.id !== li. id) return contact;})

      Contacts.removeContact(li.id);
      //3. Renderizo los contactos actualizados
      Contacts.renderContacts(contactsList);
      //4.Guardar los datos en el navegador
      Contacts.saveInBrowser();
  }
  
  if (editBtn) {
    // 1. Encuentro el li
    const li = editBtn.parentElement.parentElement;
    // 2. Obtener el status
    const status = li.getAttribute('status');
    // 3. Obtener los inputs
    const contactInputName = li.children[0].children[0];
    const contactInputPhone = li.children[0].children[1];
    // 4. Obtener el boton
    const contactEditBtn = li.children[1].children[0];
    if (status === 'inputs-deshabilitados') {
      // 1. Remover el readonly (No se puede editar) de los inputs
      contactInputName.removeAttribute('readonly');
      contactInputPhone.removeAttribute('readonly');
      
      // 2. Cambiar el status a inouts-habilitados
      li.setAttribute('status','inputs-habilitados');
      // 3. Cambiar icono del boton para reflejar el estado
      contactInputName.classList.remove('contacts-list-item-name-input');
      contactInputPhone.classList.remove('contacts-list-item-phone-input');
      contactInputName.classList.add('contacts-list-item-phone-input-editable');
      contactInputPhone.classList.add('contacts-list-item-phone-input-editable');
      

      contactInputName.addEventListener('input', e => {
        nameValidation = NAME_REGEX.test(contactInputName.value);
        renderValidation(contactInputName, nameValidation);
        if (nameValidation) {
          editBtn.disabled = false;
        } else {
          editBtn.disabled = true;
        }
      });
      contactInputPhone.addEventListener('input', e => {
        phoneValidation = PHONE_REGEX.test(contactInputPhone.value);
        renderValidation(contactInputPhone, phoneValidation);
        if (phoneValidation) {
          editBtn.disabled = false;
        } else {
          editBtn.disabled = true;
        }
      });
      
      
      contactEditBtn.innerHTML = Contacts.editIconEnabled
      // 4. Cambiar estilos de los inputs para reflejar el estado
      

    }
    if (status === 'inputs-habilitados') {
      contactInputName.setAttribute('readonly', true);
      contactInputPhone.setAttribute('readonly', true);

      li.setAttribute('status', 'inputs-deshabilitados');
      

      contactEditBtn.innerHTML = Contacts.editIconDisabled;
      
      // actualizar el contacto 
      const updatedContact = {
        id: li.id,
        name: contactInputName.value,
        phone: contactInputPhone.value,

      }
      Contacts.updatedContact(updatedContact);
      // guardar en el navegador
      Contacts.saveInBrowser();
      // Mostrar la lista actualizada en el HTML
      Contacts.renderContacts(contactsList);
      
    }
  }

})



window.onload = () => {
  //1. Obtener los contactos
  Contacts.getContactsFromLocalStorage();
  //2. Renderizar los contactos
  Contacts.renderContacts(contactsList);
}

