// We are using the MVC pattern
// The model contains the game state
// In the model we have two objects, a fighter and a monster.
// To begin with, they are hard-coded

var model = {
    // The fighter has the minimum number of instance variables needed to simulate a combat
    fighter: {
        name: "Arata",
        race: "Human",
        level: 1,
        proficiencyBonus: 2,
        strength: 18,
        strengthBonus: 4,
        dexterity: 14,
        constitution: 16,
        hitPoints: 13,
        armor: "Chain Mail",
        shield: true,
        armorClass: 20,
        weapon: "Greatsword",
        minDamage: 2,
        maxDamage: 12,
    },
    // Likewise, the monster has the minimum required variables needed for a simple combat simulation
    monster: {
        type: "orc",
        strength: 16,
        strengthBonus: 3,
        hitPoints: 15,
        armorClass: 13,
        weapon: "Greataxe",
        attackBonus: 5,
        minDamage: 1,
        maxDamage: 12
    }
}

// Now comes the controller. The controller will handle all the game logic that impacts on the model

var controller = {
    // To begin, the controller contains one method: attack
    // The attack method takes two parameters, an attacker and a defender
    attack: function(attacker, defender) {
        // The attack is only carried out if both the attacker and defender are alive
        if (attacker.hitPoints > 0 && defender.hitPoints > 0) {

            // We prepare to calculate a random number of damage points
            // To do this, we first calculate the difference between an attacker's // maximum and minimum damage
            var damageRange = attacker.maxDamage - attacker.minDamage;

            // Now we calculate the bonus that will be added to the attack roll
            // we create a function that takes one parameter: the combatant (in practice, the attacker but we don't want any naming conflicts
            var calculateAttackBonus = function (combatant) {
                // we start by setting the bonus to 0
                var bonus = 0;
                // if the attacker has a proficiency bonus, combine the proficiency and strength bonuses
                if (combatant.proficiencyBonus) {
                    bonus = attacker.proficiencyBonus + attacker.strengthBonus;
                }
                // otherwise, the attack bonus is just the strength bonus
                    else {
                    bonus = attacker.strengthBonus;
                }
                // the function returns the calculated bonus
                return bonus;
            }
            // now we run the function to calculate the attack roll bonus
            var attackBonus = calculateAttackBonus(attacker);
            // we assume a failed roll unless the roll succeeds
            var hit = false;
            // this is the actual attack roll, a random number from 1 to 20 supplemented by the attack bonus
            var attackRoll = Math.floor(Math.random() * 20) + attackBonus;
            // if the attack roll is greater than the defender's armor class, the attack succeeds so the hit variable is set to true and we calculate the damage. This is a random number equivalent to the damage range calculated earlier, added to the minimum damage and the strength bonus.
            // If the attack is successful, we reduce the defender's hit points by the amount of damage done.
            if (attackRoll > defender.armorClass) {
                hit = true;
                var damage = Math.floor(Math.random() * damageRange) + attacker.minDamage + attacker.strengthBonus;
                defender.hitPoints = defender.hitPoints - damage;
            }
        }
        // Now we call the view method to display the results of the attack
        view.displayAttackResults(attacker.name? attacker.name : attacker.type, defender.name? defender.name : defender.type, hit, attacker.weapon, damage, defender.hitPoints);
    }
}

// the view object handles output

var view = {
    displayAttackResults: function(attacker, defender, hit, weapon, damage, hitPointsLeft){
        // hit variable had a boolean value
        // if hit is true we output attack results
        if (hit) {
                console.log(attacker + " hit the " + defender +
                    " with their " + weapon +
                    " for " + damage + " points. " +
                    defender + " has " + hitPointsLeft + " hit points left");
        } else {
            // if hit is false, we say there was a miss
            console.log(attacker + " missed!");
        }
        // if one combatant's hit points is down to 0 we say they are dead
        if (hitPointsLeft <= 0) {
            console.log(defender + " is dead!");
        }
    }
}

// Let's write a little loop that simulates the combat and doesn't go beyond the point one of them is dead

function simulateCombat(combatant1, combatant2) {
    while(combatant1.hitPoints > 0 && combatant2.hitPoints > 0) {
        controller.attack(combatant1, combatant2);
        if (combatant2.hitPoints > 0) {controller.attack(combatant2, combatant1);}
    }
}

simulateCombat(model.fighter, model.monster);
