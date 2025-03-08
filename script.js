import {
	maleNames,
	femaleNames,
	surnames,
	backgrounds,
	physiques,
	skins,
	hairs,
	faces,
	speeches,
	clothings,
	virtues,
	vices,
	gear,
	norseNames,
	clanValues
} from "./tables.js";

/* CHARACTER */
document
	.querySelector("#generate-button")
	.addEventListener("click", () => generate());

document
	.querySelector("#generate-clan-button")
	.addEventListener("click", () => generateClan());

const sexes = {
	MALE: {
		label: "male",
		subjectPronoun: "he",
		objectPronoun: "him"
	},
	FEMALE: {
		label: "female",
		subjectPronoun: "she",
		objectPronoun: "her"
	}
};

function generate() {
	const character = {
		inventory: []
	};

	const sex = Math.random() > 0.5 ? sexes.MALE : sexes.FEMALE;

	// name
	const firstName =
		sex.label === sexes.MALE.label
			? rollOnTable(maleNames)
			: rollOnTable(femaleNames);

	const surname = rollOnTable(surnames);

	character.name = `${firstName} ${surname}`;

	// background
	const background = rollOnTable(backgrounds);

	// desc
	const physique = rollOnTable(physiques).toLowerCase();
	const skin = rollOnTable(skins).toLowerCase();
	const hair = rollOnTable(hairs).toLowerCase();
	const face = rollOnTable(faces).toLowerCase();
	const speech = rollOnTable(speeches).toLowerCase();
	const clothing = rollOnTable(clothings).toLowerCase();
	const virtue = rollOnTable(virtues).toLowerCase();
	const vice = rollOnTable(vices).toLowerCase();
	const age = 18 + d6() + d6();

	character.description = `${age}-year-old ${background} <br />${capitalise(
		sex.subjectPronoun
	)} has a ${physique} physique, ${skin} skin, ${hair} hair, and a ${face} face. ${capitalise(
		sex.subjectPronoun
	)} speaks in a ${speech} manner and wears ${clothing} clothing.<br />${capitalise(
		sex.subjectPronoun
	)} is known to be ${virtue}, though some regard ${
		sex.objectPronoun
	} as ${vice}.`;

	// stats
	character.str = d6() + d6() + d6();
	character.dex = d6() + d6() + d6();
	character.wil = d6() + d6() + d6();
	character.hp = d6();
	character.armor = 0;

	// gear

	//// armor
	let roll = d20();
	let armor =
		roll < 4
			? undefined
			: roll < 15
			? gear.armor.BRIGANDINE
			: roll < 20
			? gear.armor.CHAINMAIL
			: gear.armor.PLATE;
	if (armor) {
		character.inventory.push(armor);
		character.armor += armor.armorRating;
	}

	//// helmet & shield
	roll = d20();

	if (roll === 20) {
		character.inventory.push(gear.armor.SHIELD);
		character.armor += gear.armor.SHIELD.armorRating;
		character.inventory.push(gear.armor.HELMET);
		character.armor += gear.armor.HELMET.armorRating;
	} else if (roll > 16) {
		character.inventory.push(gear.armor.SHIELD);
		character.armor += gear.armor.SHIELD.armorRating;
	} else if (roll > 13) {
		character.inventory.push(gear.armor.HELMET);
		character.armor += gear.armor.HELMET.armorRating;
	}

	//// weapons
	roll = d20();

	let weaponChoices;
	if (roll === 20) {
		weaponChoices = [
			gear.weapons.HALBERD,
			gear.weapons.WAR_HAMMER,
			gear.weapons.BATTLEAXE
		];
	} else if (roll > 14) {
		weaponChoices = [
			gear.weapons.LONGBOW,
			gear.weapons.CROSSBOW,
			gear.weapons.SLING
		];
	} else if (roll > 5) {
		weaponChoices = [
			gear.weapons.SWORD,
			gear.weapons.MACE,
			gear.weapons.AXE
		];
	} else {
		weaponChoices = [
			gear.weapons.DAGGER,
			gear.weapons.CUDGEL,
			gear.weapons.STAFF
		];
	}

	character.inventory.push(rollOnTable(weaponChoices));

	//// expiditionary gear, tools, trinkets
	character.inventory.push(rollOnTable(gear.expiditionary));
	character.inventory.push(rollOnTable(gear.tools));
	character.inventory.push(rollOnTable(gear.trinkets));

	/// bonus items
	roll = d20();
	if (roll < 6) {
		character.inventory.push(
			Math.random() > 0.5
				? rollOnTable(gear.tools)
				: rollOnTable(gear.trinkets)
		);
	} else if (roll < 14) {
		character.inventory.push(rollOnTable(gear.expiditionary));
	} else if (roll < 18) {
		if (Math.random() > 0.5) {
			// armor
			roll = d20();
			armor =
				roll < 4
					? undefined
					: roll < 15
					? gear.armor.BRIGANDINE
					: roll < 20
					? gear.armor.CHAINMAIL
					: gear.armor.PLATE;
			if (armor) {
				character.inventory.push(armor);
				character.armor += armor.armorRating;
			}
		} else {
			// weapon
			roll = d20();
			if (roll === 20) {
				weaponChoices = [
					gear.weapons.HALBERD,
					gear.weapons.WAR_HAMMER,
					gear.weapons.BATTLEAXE
				];
			} else if (roll > 14) {
				weaponChoices = [
					gear.weapons.LONGBOW,
					gear.weapons.CROSSBOW,
					gear.weapons.SLING
				];
			} else if (roll > 5) {
				weaponChoices = [
					gear.weapons.SWORD,
					gear.weapons.MACE,
					gear.weapons.AXE
				];
			} else {
				weaponChoices = [
					gear.weapons.DAGGER,
					gear.weapons.CUDGEL,
					gear.weapons.STAFF
				];
			}
		}
	} else {
		inventory.push(rollOnTable(gear.spellbooks));
	}

	//// default items
	character.inventory.push(...gear.default);
	character.inventory.push({ label: `${d6() + d6() + d6()} gold pieces` });

	displayCharacter(character);
}

function displayCharacter({
	name,
	description,
	str,
	dex,
	wil,
	hp,
	armor,
	inventory
}) {
	document.querySelector("#name").innerHTML = name;
	document.querySelector("#description").innerHTML = description;
	document.querySelector("#str-score").innerHTML = str;
	document.querySelector("#dex-score").innerHTML = dex;
	document.querySelector("#wil-score").innerHTML = wil;
	document.querySelector("#hp-score").innerHTML = hp;
	document.querySelector("#armor-score").innerHTML = armor;

	let inventoryHtml = "";
	inventory.forEach((item) => {
		inventoryHtml += `<li>${item.label}</li>`;
	});
	document.querySelector("#inventory").innerHTML = inventoryHtml;
}

generate();

/* CLAN */

function generateClan() {
	// name
	const name = `Clan ${rollOnTable(norseNames)}ung`;

	// values
	const confirmedValues = {
		YES: { label: "are", values: [] },
		VERY_YES: { label: "are extemely", values: [] }
	};

	clanValues.forEach((v) => {
		const stake = d6() + d6();
		let descriptor = "";
		switch (stake) {
			case 12:
				// case 2:
				if (v.NO && Math.random() > 0.5) {
					confirmedValues.VERY_YES.values.push(v.NO);
				} else {
					confirmedValues.VERY_YES.values.push(v.YES);
				}
				break;
			case 11:
			case 3:
				if (v.NO && Math.random() > 0.5) {
					confirmedValues.YES.values.push(v.NO);
				} else {
					confirmedValues.YES.values.push(v.YES);
				}
				break;
			default:
				break;
		}
	});

	let valuesHtml = "";

	if (confirmedValues.YES.values.length > 0) {
		valuesHtml += buildValuesList(confirmedValues.YES);
	}

	if (confirmedValues.VERY_YES.values.length > 0) {
		valuesHtml += buildValuesList(confirmedValues.VERY_YES);
	}

	displayClan({ name, description: valuesHtml });
}

function buildValuesList({ label, values }) {
	return `${label}:<br />
	<ul>
	${values.map((v) => `<li>${v}</li>`).join("")}
	</ul>`;
}

function displayClan({ name, description }) {
	console.log(name);
	document.querySelector("#clan-name").innerHTML = name;
	document.querySelector("#clan-description").innerHTML = description;
}

/* UTILITY */

function rollOnTable(table) {
	return table[Math.floor(Math.random() * table.length)];
}

function d6() {
	return Math.floor(Math.random() * 6) + 1;
}

function d20() {
	return Math.floor(Math.random() * 20) + 1;
}

function capitalise(str) {
	return str.charAt(0).toUpperCase() + str.substring(1);
}

function buildList(words) {
	if (words.length === 1) return words[0];
	if (words.length === 2) return `${words[0]} and ${words[1]}`;
	let list = "";
	for (let i = 0; i < words.length - 1; i++) {
		list += `${words[i]}, `;
	}
	list += `and ${words[words.length - 1]}`;

	return list;
}

generateClan();
