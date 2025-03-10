"use strict";
function getElement(selector) {
    return document.querySelector(selector);
}
;
const happyCustomerH2 = getElement("#happyCustomers");
const updateDisplay = () => {
    const time = new Date();
    happyCustomerH2.textContent = "Served " + Math.round((time.getTime() - 1740522851477) / 60000) + " Happy Customers";
};
document.addEventListener("DOMContentLoaded", () => {
    updateDisplay();
    setInterval(updateDisplay, 20000);
});
