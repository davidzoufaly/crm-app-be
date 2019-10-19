const generateForm = (req: any) => {
    const inputs: string[] = [];
    req.map((e : any, i : number): any => {
      if (e.fieldType === "text" || e.fieldType === "number") {
        console.log("text");
        inputs.push(
          `var crmInput${i} = document.createElement('INPUT');
          crmInput${i}.setAttribute('type', 'text');
          crmInput${i}.setAttribute('name', '${e.fieldName}');
          crmInput${i}.setAttribute('id', '${e.fieldName}');
          var label${i} = document.createElement('LABEL');
          label${i}.setAttribute('for', '${e.fieldName}');
          var node${i} = document.createTextNode('${e.fieldName}');
          label${i}.appendChild(node${i});
          form.appendChild(label${i});
          form.appendChild(crmInput${i})`
        );
      }
      else if (e.fieldType === "select") {
        if (e.fieldFormVisible) {
        console.log("visible select");
          const optionsSelect : string[] = [];

          e.fieldOptions.map((option : any, index : number) => {
            optionsSelect.push(
            `var option${index} = document.createElement('OPTION');
            option${index}.setAttribute('value', '${option.value}');
            node${index} = document.createTextNode('${option.value}');
            option${index}.appendChild(node${index})
            select${i}.appendChild(option${index})`)
          })

          inputs.push(
            `var label${i} = document.createElement('LABEL');
            label${i}.setAttribute('for', '${e.fieldName}')
            node${i} = document.createTextNode('${e.fieldName}')
            label${i}.appendChild(node${i});
            form.appendChild(label${i});
            var select${i} = document.createElement('SELECT');
            select${i}.setAttribute('name', '${e.fieldName}');
            select${i}.setAttribute('id', '${e.fieldName}');
              form.appendChild(select${i});
              ${optionsSelect.join(';')}`
          )
      } else {

        const hiddenPreSelectedOption = e.fieldOptions.filter((option : any) => (option.preSelected))
        
        console.log("hidden select");
        
        const hiddenInput = 
          `var input${i} = document.createElement('INPUT');
                  input${i}.setAttribute('type', 'hidden');
                  input${i}.setAttribute('name', '${e.fieldName}');
                  input${i}.setAttribute('id', '${e.fieldName}');
                  input${i}.setAttribute('value', '${hiddenPreSelectedOption[0].value}');
                  form.appendChild(input${i});`
        
          inputs.push(hiddenInput);
      }
    }
    });

    const finalStr = `
    var form = document.createElement('FORM');
    var hookElement = document.querySelector('#crm-form');
    hookElement.appendChild(form);${inputs.join(";")}
    var submitButton = document.createElement('BUTTON');
    var submitButtonText = document.createTextNode('Submit');
    submitButton.appendChild(submitButtonText);
    form.appendChild(submitButton);
    `;

    return finalStr;
  };

  export default generateForm;