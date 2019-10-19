
    var form = document.createElement('FORM');
    var hookElement = document.querySelector('#crm-form');
    hookElement.appendChild(form);var crmInput0 = document.createElement('INPUT');
          crmInput0.setAttribute('type', 'text');
          crmInput0.setAttribute('name', 'firstName');
          crmInput0.setAttribute('id', 'firstName');
          var label0 = document.createElement('LABEL');
          label0.setAttribute('for', 'firstName');
          var node0 = document.createTextNode('firstName');
          label0.appendChild(node0);
          form.appendChild(label0);
          form.appendChild(crmInput0);var crmInput1 = document.createElement('INPUT');
          crmInput1.setAttribute('type', 'text');
          crmInput1.setAttribute('name', 'lastName');
          crmInput1.setAttribute('id', 'lastName');
          var label1 = document.createElement('LABEL');
          label1.setAttribute('for', 'lastName');
          var node1 = document.createTextNode('lastName');
          label1.appendChild(node1);
          form.appendChild(label1);
          form.appendChild(crmInput1);var label2 = document.createElement('LABEL');
            label2.setAttribute('for', 'Gender')
            node2 = document.createTextNode('Gender')
            label2.appendChild(node2);
            form.appendChild(label2);
            var select2 = document.createElement('SELECT');
            select2.setAttribute('name', 'Gender');
            select2.setAttribute('id', 'Gender');
              form.appendChild(select2);
              var option0 = document.createElement('OPTION');
            option0.setAttribute('value', 'male');
            node0 = document.createTextNode('male');
            option0.appendChild(node0)
            select2.appendChild(option0);var option1 = document.createElement('OPTION');
            option1.setAttribute('value', 'female');
            node1 = document.createTextNode('female');
            option1.appendChild(node1)
            select2.appendChild(option1);var label3 = document.createElement('LABEL');
            label3.setAttribute('for', 'Activity')
            node3 = document.createTextNode('Activity')
            label3.appendChild(node3);
            form.appendChild(label3);
            var select3 = document.createElement('SELECT');
            select3.setAttribute('name', 'Activity');
            select3.setAttribute('id', 'Activity');
              form.appendChild(select3);
              var option0 = document.createElement('OPTION');
            option0.setAttribute('value', 'active');
            node0 = document.createTextNode('active');
            option0.appendChild(node0)
            select3.appendChild(option0);var option1 = document.createElement('OPTION');
            option1.setAttribute('value', 'inactive');
            node1 = document.createTextNode('inactive');
            option1.appendChild(node1)
            select3.appendChild(option1);var input4 = document.createElement('INPUT');
                  input4.setAttribute('type', 'hidden');
                  input4.setAttribute('name', 'Acquistion');
                  input4.setAttribute('id', 'Acquistion');
                  input4.setAttribute('value', 'form');
                  form.appendChild(input4);
    var submitButton = document.createElement('BUTTON');
    var submitButtonText = document.createTextNode('Submit');
    submitButton.appendChild(submitButtonText);
    form.appendChild(submitButton);
    