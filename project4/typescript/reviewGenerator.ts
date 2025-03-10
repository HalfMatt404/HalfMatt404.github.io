// Possible human info
const humanNames : string[] = ["Catherine",  "Maximo", "Brian", "Jalen", "Lane", "Colby", "Marissa", "Cali", "Alani", "Casey", "Jazlene", "Deanna", "Caitlin", "Carl", "Keith", "Micah", "Brock", "Neil", "Moises", "Blaze", "Jared", "Erin", "Mckayla", "Wesley", "Heath", "Simone", "Genesis", "Hugo", "Miriam", "Skylar", "Adan", "Cailyn", "Shamar", "Jagger", "Jasiah", "Kelly"]; 
const humanReviewText: string[] = ["All my friends are eating this stuff.", "I just can't get enough of Cheese", "My mom makes better Cheese, but whatever", "... nah, you gotta get something else, Cheese tastes funny.", "Works as advertised", "Too many instructions, I ain't reading all that", "MY KIDS LOVE THIS STUFF", "I don't understand the hype", "Life Changing", "Great Value"];
const humanPossibleRatings: number[] = [5,5,5,5,4,4,4,3,3,2,1];

// Possible cow info
const cowNames : string[] = ["Bessie", "Buttercup", "Daisy", "Marigold", "Clover", "Rosie", "Bella", "Fern", "Maple"]; 
const cowReviewText: string[] = ["Moooooooo", "Mooo moooo MOOo", "Why yes I do believe Gooda Cheese is quite an exceptional place to work... Moooo", "Moo, mooo, moo, moooo", "moo...", "MOoOOoOOoOoOOoOoo!"];
const cowPossibleRatings: number[] = [5,5,5,5,5,5,4,5,5,1];

document.addEventListener('DOMContentLoaded', () => {
  const humanReviews = $("#humanReviews");
  const cowReviews = $("#cowReviews");

  // Generates human reviews
  generateReviews(humanNames, humanReviewText, humanPossibleRatings, 8, humanReviews);
  // Generates cow reviews
  generateReviews(cowNames, cowReviewText, cowPossibleRatings, 12, cowReviews);
 })

 // Adds a list of random reviews to a slider node
 function generateReviews(possibleNames, possibleReviews, possibleRatings, numberOfReviews, reviewsParent) {
  let newSlidingContainer = $("<div>");
  newSlidingContainer.addClass("slidingContainer");
  
  for (let i = 0; i < numberOfReviews; i++) { 

    let newReview = $("<c-Review>");

    // Randomizes attributes
    newReview.attr("name", possibleNames[Math.round(Math.random() * (possibleNames.length - 1))]);
    newReview.attr("reviewContent", possibleReviews[Math.round(Math.random() * (possibleReviews.length - 1))]);
    newReview.attr("rating", possibleRatings[Math.round(Math.random() * (possibleRatings.length -1))]);
    
    newReview.appendTo(newSlidingContainer);
  }

  // Attaches two so the sliding loops cleanly
  for (let i = 0; i < 2; i++) {
    newSlidingContainer.clone().appendTo(reviewsParent);
  }
 }