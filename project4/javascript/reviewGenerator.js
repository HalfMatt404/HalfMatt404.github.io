"use strict";
const humanNames = ["Catherine", "Maximo", "Brian", "Jalen", "Lane", "Colby", "Marissa", "Cali", "Alani", "Casey", "Jazlene", "Deanna", "Caitlin", "Carl", "Keith", "Micah", "Brock", "Neil", "Moises", "Blaze", "Jared", "Erin", "Mckayla", "Wesley", "Heath", "Simone", "Genesis", "Hugo", "Miriam", "Skylar", "Adan", "Cailyn", "Shamar", "Jagger", "Jasiah", "Kelly"];
const humanReviewText = ["All my friends are eating this stuff.", "I just can't get enough of Cheese", "My mom makes better Cheese, but whatever", "... nah, you gotta get something else, Cheese tastes funny.", "Works as advertised", "Too many instructions, I ain't reading all that", "MY KIDS LOVE THIS STUFF", "I don't understand the hype", "Life Changing", "Great Value"];
const humanPossibleRatings = [5, 5, 5, 5, 4, 4, 4, 3, 3, 2, 1];
const cowNames = ["Bessie", "Buttercup", "Daisy", "Marigold", "Clover", "Rosie", "Bella", "Fern", "Maple"];
const cowReviewText = ["Moooooooo", "Mooo moooo MOOo", "Why yes I do believe Gooda Cheese is quite an exceptional place to work... Moooo", "Moo, mooo, moo, moooo", "moo...", "MOoOOoOOoOoOOoOoo!"];
const cowPossibleRatings = [5, 5, 5, 5, 5, 5, 4, 5, 5, 1];
document.addEventListener('DOMContentLoaded', () => {
    const humanReviews = $("#humanReviews");
    const cowReviews = $("#cowReviews");
    generateReviews(humanNames, humanReviewText, humanPossibleRatings, 8, humanReviews);
    generateReviews(cowNames, cowReviewText, cowPossibleRatings, 12, cowReviews);
});
function generateReviews(possibleNames, possibleReviews, possibleRatings, numberOfReviews, reviewsParent) {
    let newSlidingContainer = $("<div>");
    newSlidingContainer.addClass("slidingContainer");
    for (let i = 0; i < numberOfReviews; i++) {
        let newReview = $("<c-Review>");
        newReview.attr("name", possibleNames[Math.round(Math.random() * (possibleNames.length - 1))]);
        newReview.attr("reviewContent", possibleReviews[Math.round(Math.random() * (possibleReviews.length - 1))]);
        newReview.attr("rating", possibleRatings[Math.round(Math.random() * (possibleRatings.length - 1))]);
        newReview.appendTo(newSlidingContainer);
    }
    for (let i = 0; i < 2; i++) {
        newSlidingContainer.clone().appendTo(reviewsParent);
    }
}
