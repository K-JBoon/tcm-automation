const DIE_PROGRESSION = ['d2', 'd3', 'd4', 'd6', 'd8', 'd10', 'd12'];

export class IntrusionDieFeature {
	static MODULE_ID = 'tcm-automation';
	static FEATURE_ID = 'intrusion-die';
	static FLAG_KEY = 'intrusionDie';

	static getDieIndex(dieSize) {
		return DIE_PROGRESSION.indexOf(dieSize);
	}

	static getMaxDieSize(wizardLevel) {
		if (wizardLevel >= 17) return 'd12';
		if (wizardLevel >= 11) return 'd10';
		if (wizardLevel >= 5) return 'd8';
		return 'd6';
	}

	static getWizardLevel(actor) {
		const wizardClass = actor.items.find(i => 
			i.type === 'class' && i.name.toLowerCase().includes('wizard')
		);
		return wizardClass?.system.levels || 0;
	}

	static getCurrentDie(actor) {
		const wizardLevel = this.getWizardLevel(actor);
		const maxDie = this.getMaxDieSize(wizardLevel);
		const currentDie = actor.getFlag(this.MODULE_ID, this.FLAG_KEY);

		// Initialize flag if it doesn't exist
		if (!currentDie) {
			this.setCurrentDie(actor, maxDie);
			return maxDie;
		}

		return currentDie;
	}

	static async setCurrentDie(actor, dieSize) {
		await actor.setFlag(this.MODULE_ID, this.FLAG_KEY, dieSize);
	}

	static isIntrusionFeature(subject) {
		console.warn({ subject });
		return subject?.type === 'utility' && subject.name.toLowerCase() === 'intrusion';
	}

	static async handleIntrusionRoll(actor, roll) {
		const wizardLevel = this.getWizardLevel(actor);
		if (wizardLevel < 3) return;

		const maxDie = this.getMaxDieSize(wizardLevel);
		const currentDie = this.getCurrentDie(actor);
		const currentIndex = this.getDieIndex(currentDie);
		const result = roll.total;

		if (result === 1) {
			// Intrusion occurs! Increase die size
			const newIndex = Math.min(currentIndex + 1, this.getDieIndex(maxDie));
			const newDie = DIE_PROGRESSION[newIndex];
			await this.setCurrentDie(actor, newDie);

			// Roll on the Intrusion rollable table
			await this.rollIntrusionTable();
		} else if (result >= 2) {
			// No intrusion, decrease die size
			const newIndex = Math.max(currentIndex - 1, 0);
			const newDie = DIE_PROGRESSION[newIndex];
			await this.setCurrentDie(actor, newDie);
		}
	}

	static async rollIntrusionTable() {
		// Find the Intrusion rollable table
		const table = game.tables.getName('Intrusion');

		if (!table) {
			ui.notifications.warn(game.i18n.localize('TCMAUTOMATION.ui.notifications.warn.intrusionTableNotFound'));
			return;
		}

		// Roll on the table and display the result
		await table.draw();
	}

	static async handleShortRest(actor) {
		const wizardLevel = this.getWizardLevel(actor);
		if (wizardLevel < 3) return;

		const maxDie = this.getMaxDieSize(wizardLevel);
		const currentDie = this.getCurrentDie(actor);
		const currentIndex = this.getDieIndex(currentDie);
		const maxIndex = this.getDieIndex(maxDie);
		const newIndex = Math.min(currentIndex + 1, maxIndex);
		const newDie = DIE_PROGRESSION[newIndex];

		if (newDie !== currentDie) {
			await this.setCurrentDie(actor, newDie);
		}
	}

	static async handleLongRest(actor) {
		const wizardLevel = this.getWizardLevel(actor);
		if (wizardLevel < 3) return;

		const maxDie = this.getMaxDieSize(wizardLevel);
		await this.setCurrentDie(actor, maxDie);
	}

	static initialize() {
		// Hook to replace the die formula before rolling
		Hooks.on('dnd5e.preRollFormula', (config) => {
			if (!this.isIntrusionFeature(config.subject)) return true;

			const actor = config.subject.actor;
			if (!actor) return true;

			const wizardLevel = this.getWizardLevel(actor);

			if (wizardLevel < 3) return true;

			// Get the current die size
			const currentDie = this.getCurrentDie(actor);

			console.warn({
				actor, config, currentDie
			});
			// Find and replace the Intrusion die from the activity
			if (config.rolls?.length && config.rolls[0].parts?.length) {
				config.rolls[0].parts[0] = `1${currentDie}`;
			}

			return true;
		});

		// Hook to handle the roll result and update die size
		Hooks.on('dnd5e.rollFormula', async (rolls, data) => {
			if (!this.isIntrusionFeature(data.subject)) return;

			const actor = data.subject.actor;
			if (!actor) return;

			// Process the first roll result
			if (rolls?.length > 0) {
				await this.handleIntrusionRoll(actor, rolls[0]);
			}
		});

		// Hook to handle die scaling on rests
		Hooks.on('dnd5e.restCompleted', async (actor, result) => {
			if (result.type === 'short') {
				await this.handleShortRest(actor);
			} else if (result.type === 'long') {
				await this.handleLongRest(actor);
			}
		});
	}
}
