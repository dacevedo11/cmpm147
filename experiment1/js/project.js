// Experiment 1: Getting Started
// Author: Daniel Acevedo
// Date: 4.4.2024

function main() {

  const fillers = {
    hairstyle: ["Bald", "Crew cut", "Side part", "Receding hairline", "Dr. Phil", "Flat top"],
    top: ["Hawaiian shirt", "Striped polo shirt", "Tye Dye shirt", "American flag tshirt", "Metallica shirt", "Work jacket", "White tshirt"],
    bottom: ["Cargo shorts", "Jean shorts", "Gray sweatpants", "Blue jeans", "Khakis", "Basketball shorts", "Cargo pants"],
    accessory: ["Fanny pack", "Baseball cap", "Bucket hat", "Oakley sunglasses", "Suspenders", "Apron"],
    footwear: ["White New Balances", "Merrells", "Nike Air Monarchs", "Crocs", "Socks & Sandals", "Boots"],
  };

  const template = ` <br>
  Hairstyle: $hairstyle <br> <br>
  Top: $top <br> <br>
  Bottom: $bottom <br> <br>
  Accessory: $accessory <br> <br>
  Footwear: $footwear`;


  // STUDENTS: You don't need to edit code below this line.

  const slotPattern = /\$(\w+)/;

  function replacer(match, name) {
    let options = fillers[name];
    if (options) {
      return options[Math.floor(Math.random() * options.length)];
    } else {
      return `<UNKNOWN:${name}>`;
    }
  }

  function generate() {
    let story = template;
    while (story.match(slotPattern)) {
      story = story.replace(slotPattern, replacer);
    }

    /* global box */
    $("#box").html(story);
  }

  /* global clicker */
  $("#clicker").click(generate);

  generate();
}

main();