
    var form = document.createElement('FORM');
    form.setAttribute('class', 'crm-form');
    var hookElement = document.querySelector('#crm-form-hook');
    hookElement.appendChild(form);
    var bodyWrapper = document.createElement('DIV');
    form.appendChild(bodyWrapper);
    var inputWrapper0 = document.createElement('DIV');
            inputWrapper0.setAttribute('class', 'crm-form__input-wrapper');
            bodyWrapper.appendChild(inputWrapper0);
            bodyWrapper.setAttribute('class', 'crm-form__body-wrapper');
            var crmInput0 = document.createElement('INPUT');
            crmInput0.setAttribute('type', 'text');
            crmInput0.setAttribute('class', 'crm-form__input crm-form-data');
            crmInput0.setAttribute('name', 'First name');
            crmInput0.setAttribute('id', 'first-name');
            var label0 = document.createElement('LABEL');
            label0.setAttribute('for', 'first-name');
            label0.setAttribute('class', 'crm-form__label');
            var node0 = document.createTextNode('First name');
            label0.appendChild(node0);
            inputWrapper0.appendChild(label0);
            inputWrapper0.appendChild(crmInput0);var inputWrapper1 = document.createElement('DIV');
            inputWrapper1.setAttribute('class', 'crm-form__input-wrapper');
            bodyWrapper.appendChild(inputWrapper1);
            bodyWrapper.setAttribute('class', 'crm-form__body-wrapper');
            var crmInput1 = document.createElement('INPUT');
            crmInput1.setAttribute('type', 'text');
            crmInput1.setAttribute('class', 'crm-form__input crm-form-data');
            crmInput1.setAttribute('name', 'Last name');
            crmInput1.setAttribute('id', 'last-name');
            var label1 = document.createElement('LABEL');
            label1.setAttribute('for', 'last-name');
            label1.setAttribute('class', 'crm-form__label');
            var node1 = document.createTextNode('Last name');
            label1.appendChild(node1);
            inputWrapper1.appendChild(label1);
            inputWrapper1.appendChild(crmInput1);var input7 = document.createElement('INPUT');
                    input7.setAttribute('type', 'hidden');
                    input7.setAttribute('name', 'Zdroj');
                    input7.setAttribute('class', 'crm-form-data');
                    input7.setAttribute('id', 'zdroj');
                    input7.setAttribute('value', 'form');
                    form.appendChild(input7);
    var submitButton = document.createElement('BUTTON');
    var submitButtonText = document.createTextNode('Submit');
    submitButton.appendChild(submitButtonText);
    submitButton.setAttribute('class', 'crm-form__submit');
    submitButton.setAttribute('type', 'button');
    form.appendChild(submitButton);document.querySelectorAll('.crm-form').forEach(e => e.style.cssText = 'max-width: 100%; font-family: "Helvetica"; padding: 1rem;');document.querySelectorAll('.crm-form__body-wrapper').forEach(e => e.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));grid-gap: 1rem; margin-bottom: 1rem;');document.querySelectorAll('.crm-form__select').forEach(e => e.style.cssText = 'width: 100%; height: 2rem; outline: none; border: 1px solid black; background-color: rgb(248, 248, 248);font-size: 1rem; height: 2rem; text-transform: uppercase');document.querySelectorAll('.crm-form__input').forEach(e => e.style.cssText = 'width: 100%; padding-left: 0.5rem; border: 1px solid black; border-radius: 0.6rem; background-color: #fff; color: #000; height: 2rem; font-size: 1rem; outline: none; box-sizing: border-box;');document.querySelectorAll('.crm-form__input-wrapper').forEach(e => e.style.cssText = 'display: flex; flex-direction: column;');document.querySelectorAll('.crm-form__submit').forEach(e => e.style.cssText = 'place-self: flex-end; border: none; background-color: #596ecf; color: #fff; text-transform: uppercase; padding: 0.5rem 1.5rem; font-size: 1rem; border-radius: 0.6rem; outline: none; cursor: pointer;');document.querySelectorAll('.crm-form__label').forEach(e => e.style.cssText = 'padding-bottom: 0.5rem; color: #000; font-size: 1.3rem;');function crmSubmit() {
        let reqObject = {}
        Array.from(document.querySelectorAll('.crm-form-data')).forEach(el => reqObject[el.name] = el.value);
        submit();
        async function submit() {
          const res = await fetch(
            'http://localhost:8080/api/clients', {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify(reqObject),
            }
          )
          const resData = await res.json();
          if (resData.msg = 'Success') {
            document.querySelectorAll('.crm-form-data').forEach(el => el.classList.contains('crm-form__select') ? el.selectedIndex = 0 : el.value = "");
          } else {
            alert('Something went wrong')
          }
        }
      }
    document.querySelector('.crm-form__submit').addEventListener('click', crmSubmit);
    