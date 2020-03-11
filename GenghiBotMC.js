var mineflayer = require('mineflayer');
var v = require('vec3');
const navigatePlugin = require('mineflayer-navigate')(mineflayer);
const bot = mineflayer.createBot({
  host: "l2x9.ftp.sh", // optional
  username: "GenghiBot",
  port: 25565,       // optional
  version: "1.12.2"                 // false corresponds to auto version detection (that's the default), put for example "1.8.8" if you need a specific version
});
navigatePlugin(bot);

bot.navigate.blocksToAvoid[132] = true; // avoid tripwire
bot.navigate.blocksToAvoid[59] = false; // ok to trample crops
bot.navigate.blocksToAvoid[10] = true;
bot.navigate.on('pathFound', function (path) {
  bot.chat("found path. I can get there in " + path.length + " moves.");
});
bot.navigate.on('cannotFind', function (closestPath) {
  bot.chat("unable to find path. getting as close as possible");
  bot.navigate.walk(closestPath);
});
bot.navigate.on('arrived', function () {
  bot.chat("I have arrived");
});
bot.navigate.on('interrupted', function() {
  bot.chat("stopping");
});

bot.on('chat', function(username, message) {
  if (username === bot.username) return;
  if (username === 'Genghius'){
      if (message == "GHome1") {
      bot.chat('/home home');
      };
      if (message == "GHome2") {
      bot.chat('/home home2');
      };
      if (message == "GHome3") {
      bot.chat('/home home3');
      };
      if (message == "GSetHome1") {
      bot.chat('/sethome home');
      };
      if (message == "GSetHome2") {
      bot.chat('/sethome home2');
      };
      if (message == "GSetHome3") {
      bot.chat('/sethome home3');
      };
      if (message == "killurself") {
      bot.chat("/kill")
      };
	if (message == 'Halt' ) {
	bot.navigate.stop()
	}

	switch (true) {
        case /^say .+$/.test(message):
        bot.chat(message.slice(3))
        break
      }
  }
  const command = message.split(' ')
  switch (true) {
    case /^list$/.test(message):
      sayItems()
      break
    case /^GToss \d+ \w+$/.test(message):
      // toss amount name
      // ex: toss 64 diamond
      tossItem(command[2], command[1])
      break
    case /^GToss \w+$/.test(message):
      // toss name
      // ex: toss diamond
      tossItem(command[1])
      break
    case /^GEquip \w+ \w+$/.test(message):
      // equip destination name
      // ex: equip hand diamond
      equipItem(command[2], command[1])
      break
    case /^GUnequip \w+$/.test(message):
      // unequip testination
      // ex: unequip hand
      unequipItem(command[1])
      break
    case /^GUse$/.test(message):
      useEquippedItem()
      break
    case /^GCraft \d+ \w+$/.test(message):
      // craft amount item
      // ex: craft 64 stick
      craftItem(command[2], command[1])
      break
  }
  switch (true) {
      case /^goto .+$/.test(message):
        var xyz = message.split('=')
        var DX = parseInt(xyz[1])
        var DY = parseInt(xyz[2])
        var DZ = parseInt(xyz[3])
        try{
        var v1 = v(DX, DY, DZ)
        bot.navigate.to(v1)
        } catch (i) {
        console.log("Error, Unable to reach Coordinates.");
        bot.chat("I am unable to reach those coordinates, sorry!")
        }
      break
  }

  switch (message) {
    case 'GW':
      bot.setControlState('forward', true)
      break
    case 'GS':
      bot.setControlState('back', true)
      break
    case 'GA':
      bot.setControlState('left', true)
      break
    case 'GD':
      bot.setControlState('right', true)
      break
    case 'Gsprint':
      bot.setControlState('sprint', true)
      break
    case 'stop':
      bot.clearControlStates()
      break
    case 'Gjump':
      bot.setControlState('jump', true)
      bot.setControlState('jump', false)
      break
    case 'Gjump*':
      bot.setControlState('jump', true)
      break
    case 'Gjstop':
      bot.setControlState('jump', false)
      break}

  if (message == "GenHelp") {
    bot.chat("Available commands are: GenInv, GenInventoryHelp, GenCoords, GBlock, GearUp, GenMovH, say, gotoH, and others.");
  };
  if (message == "GenInventoryHelp"){
    bot.chat("Inventory commands are: GToss [amount] [name], GToss [name], GEquip [destination] [item], GUnequip [destination], GUse, GCraft [amount] [item]")
  };
  if (message == "GenInv") {
    sayItems();
  };
  if (message == "Patria Y Socialismo A Muerte!") {
    bot.chat("Unidos Luchares y venceremos Comandate eterno!")
  };
  if (message == "GenCoords") {
    if(bot.game.dimension != "end")
    sayPosition();
  };
  if (message == "GenMovH") {
    bot.chat("The movement commands for GenghiBot are: GW; forward, GS; back, GA; left, GD; right, Gsprint, stop, Gjump, Gjump*, Gjstop, come");
  };
  if (message == "gotoH") {
    bot.chat("The syntax for the goto command in Genghibot is: \'goto =x=y=z\'")
  };
  if (message == 'GBlock'){
    block();
  }
  if (message == 'GearUp'){
    armor()
  }

  if (message === 'come') {

  try{
  var target = bot.players[username].entity;
    bot.navigate.to(target.position);
  } catch (e) {
    console.log("Error, Someone tried to call me while out of sight");
    bot.chat("Sorry, i am unable to find you!")
  }

  } else if (message === 'stop') {
    bot.navigate.stop();
  }

});

bot.on('entityHurt', function(victim) {
  if(victim.username == bot.username) {
    console.log('I am under attack.')
  }
  else {
    console.log('I see ' + victim + ' under attack.')
  }
})

bot.on('time', function(){
  if (bot.health < 8){
    bot.chat('/home home2')
  }
  if (bot.health <6){
    SequipItem("totem", "hand");
    useEquippedItem();
  }
  if (bot.health < 18 && bot.health > 6){
    SequipItem("golden_apple", "hand");
    useEquippedItem();
  }
  if (bot.food < 17){
    SequipItem("golden_apple", "hand");
    useEquippedItem();
  }

})

bot.on('whisper', function(username, message, translate, jsonMsg, matches){
  if(username == 'Genghius'){
    switch (true) {
      case /^say .+$/.test(message):
        bot.chat(message.slice(3))
        break
      }
  }
  if(message == 'Help'){
    bot.whisper(username, 'The available whisper commands are:None for the moment, but you can send your command ideas at genghius.khanate@gmail.com');
  }
  else{
    console.log(`${username} sent this message through /whisper: ${message}`)
    bot.whisper(username, 'i can whisper too UwU. try whispering Help in order to get a list of whisper commands.');
  }
});

bot.on('death', () => {
  bot.chat('I died uwu, TwT')
  console.log('\n\nI Have Died')
});

bot.on('login', () => {
  bot.chat('/login CO557376')
  console.log("\n\n\nI have joined the game")
});


 function sayPosition () {
    bot.chat(`My current coordinates are: ${bot.entity.position}`)
  }

function sayItems (items = bot.inventory.items()) {
  const output = items.map(itemToString).join(', ')
  if (output) {
    bot.chat(output)
  } else {
    bot.chat('empty')
  }
}

function itemToString (item) {
  if (item) {
    return `${item.name} x ${item.count}`
  } else {
    return '(nothing)'
  }
}

bot.on('error', err => console.log(err))

function block () {
  var block = bot.blockInSight()

  if (!block) {
    return bot.chat('Looking at Air')
  }

  bot.chat(`Looking at ${block.displayName}`)
}
function tossItem (name, amount) {
  amount = parseInt(amount, 10)
  const item = itemByName(name)
  if (!item) {
    bot.chat(`I have no ${name}`)
  } else if (amount) {
    bot.toss(item.type, null, amount, checkIfTossed)
  } else {
    bot.tossStack(item, checkIfTossed)
  }

  function checkIfTossed (err) {
    if (err) {
      bot.chat(`unable to toss: ${err.message}`)
    } else if (amount) {
      bot.chat(`tossed ${amount} x ${name}`)
    } else {
      bot.chat(`tossed ${name}`)
    }
  }
}

function equipItem (name, destination) {
  const item = itemByName(name)
  if (item) {
    bot.equip(item, destination, checkIfEquipped)
  } else {
    bot.chat(`I have no ${name}`)
  }

  function checkIfEquipped (err) {
    if (err) {
      bot.chat(`cannot equip ${name}: ${err.message}`)
    } else {
      console.log(`equipped ${name}`)
    }
  }
}
function SequipItem (name, destination) {
  const item = itemByName(name)
  if (item) {
    bot.equip(item, destination, ScheckIfEquipped)
  } else {
    console.log(`I have no ${name}`)
  }

  function ScheckIfEquipped (err) {
    if (err) {
      console.log(`cannot equip ${name}: ${err.message}`)
    } else {
      console.log(`equipped ${name}`)
    }
  }
}

function unequipItem (destination) {
  bot.unequip(destination, (err) => {
    if (err) {
      bot.chat(`cannot unequip: ${err.message}`)
    } else {
      bot.chat('unequipped')
    }
  })
}

function useEquippedItem () {
  console.log('activating item')
  bot.activateItem()
}

function armor() {
  console.log('gearing up')
  equipItem('diamond_helmet', 'hand')
  useEquippedItem()
  equipItem('diamond_chestplate', 'hand')
  useEquippedItem()
  equipItem('diamond_leggings', 'hand')
  useEquippedItem()
  equipItem('diamond_boots', 'hand')
  useEquippedItem()
  equipItem('golden_apple', 'hand')
  equipItem('diamond_sword', 'hand')
}

function craftItem (name, amount) {
  amount = parseInt(amount, 10)
  const item = require('minecraft-data')(bot.version).findItemOrBlockByName(name)
  const craftingTable = bot.findBlock({
    matching: 58
  })

  if (item) {
    const recipe = bot.recipesFor(item.id, null, 1, craftingTable)[0]
    if (recipe) {
      bot.chat(`I can make ${name}`)
      bot.craft(recipe, amount, craftingTable, (err) => {
        if (err) {
          bot.chat(`error making ${name}`)
        } else {
          bot.chat(`did the recipe for ${name} ${amount} times`)
        }
      })
    } else {
      bot.chat(`I cannot make ${name}`)
    }
  } else {
    bot.chat(`unknown item: ${name}`)
  }
}

function itemToString (item) {
  if (item) {
    return `${item.name} x ${item.count}`
  } else {
    return '(nothing)'
  }
}

function itemByName (name) {
  return bot.inventory.items().filter(item => item.name === name)[0]
}

