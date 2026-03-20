export class HexSlingerFeature {
    static MODULE_ID = 'tcm-automation';
    static ITEM_NAME = 'Hex Slinger';
    static TABLE_NAME = 'Hex Slinger Jinxes';
    static FLAG_KEY = 'hexSlingerUsed';

    static isSneakAttackMessage(message) {
        const itemUuid = message.flags?.dnd5e?.item?.uuid;
        if (!itemUuid) return false;
        const item = fromUuidSync(itemUuid);
        return item?.system?.identifier === 'sneak-attack'
            && message.rolls?.[0]?.dice?.[0]?.results?.length >= 2;
    }

    static getHexSlingerItem(actor) {
        return actor?.items.find(i => i.name === this.ITEM_NAME) ?? null;
    }

    static hasCharges(item) {
        if (!item) return false;
        const { spent, max } = item.system.uses;
        return spent < max;
    }

    static isAlreadyUsed(message) {
        return !!message.getFlag(this.MODULE_ID, this.FLAG_KEY);
    }

    static canViewButton(message) {
        return game.user.isGM || message.isAuthor;
    }

    static getJinxTotal(message) {
        const results = message.rolls[0].dice[0].results;
        return results[0].result + results[1].result;
    }

    static async drawJinxTable(total) {
        const table = game.tables.getName(this.TABLE_NAME);
        if (!table) {
            ui.notifications.warn(`TCM Automation: Rollable table "${this.TABLE_NAME}" not found.`);
            return;
        }
        const roll = new Roll(String(total));
        await roll.evaluate();
        await table.draw({ roll });
    }

    static async consumeCharge(item) {
        await item.update({ 'system.uses.spent': item.system.uses.spent + 1 });
    }

    static async handleButtonClick(message, btn) {
        btn.disabled = true;
        const total = this.getJinxTotal(message);
        const actor = game.actors.get(message.speaker.actor);
        const item = this.getHexSlingerItem(actor);
        await this.drawJinxTable(total);
        await this.consumeCharge(item);
        await message.setFlag(this.MODULE_ID, this.FLAG_KEY, true);
        btn.remove();
    }

    static injectButton(html, message) {
        const footer = html.querySelector('.card-footer')
            ?? html.querySelector('.message-content');
        if (!footer) return;

        const btn = document.createElement('button');
        btn.classList.add('tcm-hex-slinger-btn');
        btn.textContent = 'Use Hex Slinger';
        btn.style.width = '100%';
        btn.style.textTransform = 'unset';
        btn.style.margin = '0.25rem 0';
        btn.addEventListener('click', () => this.handleButtonClick(message, btn));

        const wrapper = document.createElement('div');
        wrapper.classList.add('dnd5e2');
        wrapper.appendChild(btn);
        footer.appendChild(wrapper);
    }

    static initialize() {
        Hooks.on('renderChatMessageHTML', (message, html) => {
            if (!this.isSneakAttackMessage(message)) return;
            if (!this.canViewButton(message)) return;
            if (this.isAlreadyUsed(message)) return;

            const actor = game.actors.get(message.speaker.actor);
            const item = this.getHexSlingerItem(actor);
            if (!this.hasCharges(item)) return;

            this.injectButton(html, message);
        });
    }
}
