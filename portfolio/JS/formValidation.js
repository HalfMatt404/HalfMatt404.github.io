'use strict';
function getElement(selector) {
  return document.querySelector(selector);
}
document.addEventListener('DOMContentLoaded', () => {
  console.log('we got this far');
  const formIssues = getElement('#formIssues');
  formIssues.style.display = 'none';
  getElement('#submitButton').addEventListener('click', (event) => {
    event.preventDefault();
    for (let i = formIssues.children.length - 1; i > -1; --i) {
      formIssues.children[i].remove();
    }
    let issues = [];
    const emailPattern = /\w+@\w+.\w+/;
    const phonePattern = /[0-9]{3}-[0-9]{3}-[0-9]{4}/;
    if (getElement('#PersonToContact').value == '') {
      issues.push('- Please give me your name');
    }
    if (!emailPattern.test(getElement('#email').value)) {
      issues.push('- Please enter an email');
    }
    if (!phonePattern.test(getElement('#phone').value)) {
      issues.push('- Phone number needs to fit 000-000-0000 format');
    }
    if (issues.length > 0) {
      issues.unshift('Please Resolve:');
    }
    if (issues.length == 0) {
      formIssues.style.display = 'none';
      getElement('#contactForm').submit();
    } else {
      for (let i = 0; i < issues.length; i++) {
        const newListItem = document.createElement('li');
        const issueText = document.createTextNode(issues[i]);
        newListItem.appendChild(issueText);
        formIssues.appendChild(newListItem);
      }
      formIssues.style.display = 'block';
    }
  });
});
