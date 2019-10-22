const generateForm = (req: any) => {
  const inputs: string[] = [];
  req.map((e: any, i: number): any => {
    if (e.fieldInForm) {
      if (e.fieldType === "text" || e.fieldType === "number") {
        console.log("text input generated");
        inputs.push(
            `var inputWrapper${i} = document.createElement('DIV');
            inputWrapper${i}.setAttribute('class', 'crm-form__input-wrapper');
            bodyWrapper.appendChild(inputWrapper${i});
            bodyWrapper.setAttribute('class', 'crm-form__body-wrapper');
            var crmInput${i} = document.createElement('INPUT');
            crmInput${i}.setAttribute('type', '${e.fieldType}');
            crmInput${i}.setAttribute('class', 'crm-form__input crm-form-data');
            crmInput${i}.setAttribute('name', '${e.fieldName}');
            crmInput${i}.setAttribute('id', '${e.fieldName.toLowerCase().replace(/ /g, '-')}');
            var label${i} = document.createElement('LABEL');
            label${i}.setAttribute('for', '${e.fieldName.toLowerCase().replace(/ /g, '-')}');
            label${i}.setAttribute('class', 'crm-form__label');
            var node${i} = document.createTextNode('${e.fieldName}');
            label${i}.appendChild(node${i});
            inputWrapper${i}.appendChild(label${i});
            inputWrapper${i}.appendChild(crmInput${i})`
        );
      } else if (e.fieldType === "select") {
        if (e.fieldFormVisible) {
          console.log("visible select generated");
          const optionsSelect: string[] = [];

          e.fieldOptions.map((option: any, index: number) => {
            optionsSelect.push(
              `var option${index} = document.createElement('OPTION');
              option${index}.setAttribute('value', '${option.value}');
              node${index} = document.createTextNode('${option.value}');
              option${index}.appendChild(node${index})
              select${i}.appendChild(option${index})`
            );
          });

          inputs.push(
            `var inputWrapper${i} = document.createElement('DIV');
              inputWrapper${i}.setAttribute('class', 'crm-form__input-wrapper')
              bodyWrapper.appendChild(inputWrapper${i});
              bodyWrapper.setAttribute('class', 'crm-form__body-wrapper');
              var label${i} = document.createElement('LABEL');
              label${i}.setAttribute('for', '${e.fieldName.toLowerCase().replace(/ /g, '-')}');
              label${i}.setAttribute('class', 'crm-form__label');
              node${i} = document.createTextNode('${e.fieldName}')
              label${i}.appendChild(node${i});
              inputWrapper${i}.appendChild(label${i});
              var select${i} = document.createElement('SELECT');
              select${i}.setAttribute('name', '${e.fieldName}');
              select${i}.setAttribute('class', 'crm-form__select crm-form-data');
              select${i}.setAttribute('id', '${e.fieldName.toLowerCase().replace(/ /g, '-')}');
              inputWrapper${i}.appendChild(select${i});
              var option${i} = document.createElement('OPTION');
              node${i} = document.createTextNode('---');
              option${i}.appendChild(node${i})
              select${i}.appendChild(option${i});
                ${optionsSelect.join(";")}`
          );
        } else {
          const hiddenPreSelectedOption = e.fieldOptions.filter(
            (option: any) => option.preselected
          );

          console.log("hidden select generated");

          const hiddenInput = `var input${i} = document.createElement('INPUT');
                    input${i}.setAttribute('type', 'hidden');
                    input${i}.setAttribute('name', '${e.fieldName}');
                    input${i}.setAttribute('class', 'crm-form-data');
                    input${i}.setAttribute('id', '${e.fieldName.toLowerCase().replace(/ /g, '-')}');
                    input${i}.setAttribute('value', '${hiddenPreSelectedOption[0].value}');
                    form.appendChild(input${i});`;

          inputs.push(hiddenInput);
        }
      }
    }
  });

  const styling = [
    { class: 'crm-form',
      styles: 'max-width: 100%; font-family: "Helvetica"; padding: 1rem;'
    },
    {
      class: 'crm-form__body-wrapper',
      styles: 'display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));grid-gap: 1rem; margin-bottom: 1rem;'
    },
    {
      class: 'crm-form__select',
      styles: 
      'width: 100%; height: 2rem; outline: none; border: 1px solid black; background-color: rgb(248, 248, 248);font-size: 1rem; height: 2rem; text-transform: uppercase'
    },
    {
      class: 'crm-form__input',
      styles: 'width: 100%; padding-left: 0.5rem; border: 1px solid black; border-radius: 0.6rem; background-color: #fff; color: #000; height: 2rem; font-size: 1rem; outline: none; box-sizing: border-box;'
    },
    {
      class: 'crm-form__input-wrapper',
      styles: 'display: flex; flex-direction: column;'
    },
    {
      class: 'crm-form__submit',
      styles: 'place-self: flex-end; border: none; background-color: #596ecf; color: #fff; text-transform: uppercase; padding: 0.5rem 1.5rem; font-size: 1rem; border-radius: 0.6rem; outline: none; cursor: pointer;'
    },
    {
      class: 'crm-form__label',
      styles: 'padding-bottom: 0.5rem; color: #000; font-size: 1.3rem;'
    }
  ]
  const stylingForm : string[] = []
  styling.map((typeEl : any) => {
    stylingForm.push(`document.querySelectorAll('.${typeEl.class}').forEach(e => e.style.cssText = '${typeEl.styles}')`)
  })

      const postFc = `function crmSubmit() {
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
      }`

  const finalStr = `
    var form = document.createElement('FORM');
    form.setAttribute('class', 'crm-form');
    var hookElement = document.querySelector('#crm-form-hook');
    hookElement.appendChild(form);
    var bodyWrapper = document.createElement('DIV');
    form.appendChild(bodyWrapper);
    ${inputs.join(";")}
    var submitButton = document.createElement('BUTTON');
    var submitButtonText = document.createTextNode('Submit');
    submitButton.appendChild(submitButtonText);
    submitButton.setAttribute('class', 'crm-form__submit');
    submitButton.setAttribute('type', 'button');
    form.appendChild(submitButton);${stylingForm.join(';')};${postFc}
    document.querySelector('.crm-form__submit').addEventListener('click', crmSubmit);
    `;

  return finalStr;
};

export default generateForm;
