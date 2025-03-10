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
	clanValues,
	storeInventory
} from "./tables.js";

/* CHARACTER */
document
	.querySelector("#generate-button")
	.addEventListener("click", () => generate());

document
	.querySelector("#generate-clan-button")
	.addEventListener("click", () => generateClan());

document
	.querySelector("#generate-store-button")
	.addEventListener("click", () => generateStore());

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
	const age = 18 + d(6) + d(6);

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
	character.str = d(6) + d(6) + d(6);
	character.dex = d(6) + d(6) + d(6);
	character.wil = d(6) + d(6) + d(6);
	character.hp = d(6);
	character.armor = 0;

	// gear

	//// armor
	let roll = d(20);
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
	roll = d(20);

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
	roll = d(20);

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
	roll = d(20);
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
			roll = d(20);
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
			roll = d(20);
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
		character.inventory.push(rollOnTable(gear.spellbooks));
	}

	//// default items
	character.inventory.push(...gear.default);
	character.inventory.push({ label: `${d(6) + d(6) + d(6)} gold pieces` });

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
		const stake = d(6) + d(6);
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
	document.querySelector("#clan-name").innerHTML = name;
	document.querySelector("#clan-description").innerHTML = description;
}

generateClan();

/* STORE*/

function generateStore() {
	const inventory = [];

	const stockCount = d(6) + d(6) + d(6);

	for (let i = 0; i < stockCount; i++) {
		const item = Object.create(rollOnTable(storeInventory));

		if (d(6) === 6) {
			item.label = "Faulty " + item.label;
			item.price = item.price > 10 ? d(6) : 1;
		}

		inventory.push(item);
	}

	inventory.push(Object.create(storeInventory[0]));
	inventory.push(Object.create(storeInventory[0]));

	displayStore(inventory);
}

function displayStore(inventory) {
	// sort alphabetically
	inventory.sort((a, b) => {
		return a.label.localeCompare(b.label);
	});

	// handle duplicates
	inventory = handleDuplicates(inventory);

	// display
	let html = "<ul>";
	for (let i = 0; i < inventory.length; i++) {
		const item = inventory[i];

		html += "<li>";
		if (item.count) {
			html += `${item.count}x ${item.label}: ${item.price}sp each`;
		} else {
			html += `${item.label}: ${item.price}sp`;
		}
		html += "</li>";
	}

	html += "</ul>";
	document.querySelector("#store-list").innerHTML = html;
}

function handleDuplicates(inventory) {
	for (let i = 0; i < inventory.length - 1; i++) {
		const thisItem = inventory[i];
		const nextItem = inventory[i + 1];

		if (thisItem.label === nextItem.label) {
			thisItem.count = thisItem.count ? thisItem.count + 1 : 2;
			inventory.splice(i + 1, 1);
		}
	}
	return inventory;
}

generateStore();

/* UTILITY */

function rollOnTable(table) {
	return table[Math.floor(Math.random() * table.length)];
}

function d(sides) {
	return Math.floor(Math.random() * sides) + 1;
}

function capitalise(str) {
	return str.charAt(0).toUpperCase() + str.substring(1);
}
