// Experiment 1: Getting Started
// Author: Daniel Acevedo
// Date: 4.4.2024

function main() {

  const fillers = {
    animal: ["FOX", "CAT", "TOAD", "SPIDER", "OWL", "HARE", "MAGPIE", "CROW", "DOG", "RAT"],
    spell: ["UNSEEN HAND", "CONJURE LIGHT", "SPEAK HUMAN", "LOCK/UNLOCK, OPEN/CLOSE", "CONJURE DINNER", "MAKE FLAME", "TIDY, CLEAN AND MEND", "PLANT GROWTH", "DISTRACT/CONFUSE", "MAKE BOOK READ ITSELF ALOUD"],
    village: ["UNDER THE THUMB OF THE BARON", "FILLED WITH CHERRY GHOMES", "CONTROLLED BY A CREEPY CULT", "DEVOUTLY RELIGIOUS", "INCREDIBLY SUPERSTITIOUS", "AT WAR WITH THE FOREST TRIBES", "BUILT AROUND THE WIZARD COLLEGE", "FULL OF HARDY MINING FOLK", "SHADY AND DANGEROUS", "OPPRESIVELY PERFECT"],
    witchhunter: ["ARMOURED AND TOUGH", "WIZENED AND WISE", "DRUNK AND VIOLENT", "PIOUS AND AGGRESSIVE", "GUARDED AND COWARDLY", "MAGICAL AND JEALOUS", "CLEVER AND CRUEL", "DUPLICITOUS AND HIDDEN", "JOLLY AND WELL-MEANING", "HEADSTRONG AND WILD"],
    twist: ["THE VILLAGE IS IN ON IT", "A RIVAL WITCH SET THEM UP", "THE WITCH-HUNTER DIDN'T DO IT", "THE WITCH-HUNTER IS WAITING FOR YOU", "THE VILLAGE FOLK ARE HAVING A FESTIVAL", "THE WITCH-HUNTER DIED AND IS BEING BURIED", "THERE ARE TWO RIVAL WITCH-HUNTERS IN TOWN", "THE VILLAGE IS ABANDONED", "THE WITCH-HUNTER HAS DRAGGED A SUSPECT UP FOR INTERROGATION", "THE VILLAGE HATES THEM"]
  };



  const template = `You are a cute $animal. Your witch taught you $spell. The village is $village. 
  The witch-hunter is: $witchhunter. But here's the twist: $twist`;


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