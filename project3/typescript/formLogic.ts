
document.addEventListener('DOMContentLoaded', () => {
  
  const formIssues = getElement("#formIssues");
  
  // hides 
  formIssues.style.display = 'none';


  getElement("#submitComplaint").addEventListener('click', event => {

    // Stop the button from automatically submitting the form
    event.preventDefault();
    
 // clear the formIssues ul of any previous issue notices
  for (let i = formIssues.children.length - 1; i > -1; --i) {
    formIssues.children[i].remove();
  }

    let issues: string[] = [];

    
    // Test for issues
    const emailPattern = /\w+@\w+.\w+/;
    const phonePattern = /[0-9]{3}-[0-9]{3}-[0-9]{4}/;
    const fbiPattern = /fbi/i;
    
    if ((getElement("#complainer") as HTMLInputElement).value == "") {
      issues.push("- Please give me your name");
    }
    if (!emailPattern.test((getElement("#email") as HTMLInputElement).value)) {
      issues.push("- Please enter an email");
    }
    if (!phonePattern.test((getElement("#phone") as HTMLInputElement).value)) {
      
      issues.push("- Phone number needs to fit 000-000-0000 format");
    }
    if ((getElement("#amFbi") as HTMLInputElement).checked || fbiPattern.test((getElement("#company") as HTMLInputElement).value) || fbiPattern.test((getElement("#email") as HTMLInputElement).value)) {
      issues.push("- Get outta here FBI scrub, what we are doing is legal... I think");
    }
    
    if (issues.length > 0) {
      issues.unshift("Please Resolve:");
    }

    // if there are no issues submit the form
    if (issues.length == 0) {
      formIssues.style.display = 'none';
      (getElement("#contactForm") as HTMLFormElement).submit();      
    }
    // If there are then display them
    else {

      for (let i = 0; i < issues.length; i++)
      {
        const newListItem : HTMLLIElement = document.createElement('li');
        const issueText : Text = document.createTextNode(issues[i]);

        newListItem.appendChild(issueText);
        formIssues.appendChild(newListItem);
      }

      formIssues.style.display = 'block';
    }

    
  });
})