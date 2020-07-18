import { DND5E } from "../../../systems/dnd5e/module/config.js";

let dnd5e = DND5E;

mergeObject(DND5E.weaponProperties, {
	"brc": "Breach",
	"cvt": "Covert",
	"dly": "Deadly",
	"exp": "Explosive",
	"flw": "Flow",
	"hok": "Hook",
	"mtd": "Mounted",
	"scr": "Scatter",
});

mergeObject(DND5E.weaponTypes, {
	"exoticM": "Exotic Melee",
	"exoticR": "Exotic Ranged",
});

Hooks.on("rollItemBetterRolls", async (roll) => {
	addDeadly(roll);
});

Hooks.on("renderItemSheet5e", (app, html, data) => {
	let item = app.object;
	if (item.data.type != "weapon") { return; }
	let details = html.find(`.tab.details`);
	let deadlyField = `<div class="form-group"><label>Deadly Bonus</label><div class="form-fields"><input type="text" name="flags.redTweaks.deadlyFormula" value="${item?.data?.flags?.redTweaks?.deadlyFormula || ""}" placeholder="1d4"/></div></div>`;
	details.append(deadlyField);
});

// Checks if Deadly flag is available on a weapon, and applies the deadly damage if the weapon hit maximum damage on its damage roll
async function addDeadly(customRoll) {
	if (customRoll?.item?.data?.data?.properties?.dly == true) {
		for (let i=0;i<customRoll.templates.length;i++) {
			let template = customRoll.templates[i];
			//console.log(template);
			if (template.type == "damage") {
				let data = template.data;
				if ((data.lefttotal == data.maxRoll) || (data.righttotal && (data.righttotal == data.maxCrit))) {
					
					await customRoll.fieldToTemplate(["custom", {title:"Deadly Damage", numRolls:1, formula:(customRoll.item.data.flags?.redTweaks?.deadlyFormula || "1d4")}])
					.then(() => {
						console.log("Deadly proc'd!", customRoll.templates);
					});
					return true;
				}
				break;
			}
		}
	}
	return true;
}