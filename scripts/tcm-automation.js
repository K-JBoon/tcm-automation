import { IntrusionDieFeature } from './features/intrusion-die.js';
import { HexSlingerFeature } from './features/hex-slinger.js';

Hooks.once('init', () => {
    // Register module settings
    game.settings.register('tcm-automation', 'enableHexSlinger', {
        name: 'Enable Hex Slinger Automation',
        hint: 'Adds a "Use Hex Slinger" button to Sneak Attack chat cards when the character has charges remaining.',
        scope: 'world',
        config: true,
        type: Boolean,
        default: true
    });

    game.settings.register('tcm-automation', 'enableIntrusionDie', {
        name: 'Enable Intrusion Die Automation',
        hint: 'TCMAUTOMATION.settings.enableIntrusionDieHint',
        scope: 'world',
        config: true,
        type: Boolean,
        default: true
    });

});

Hooks.once('ready', () => {
    // Initialize enabled features
    if (game.settings.get('tcm-automation', 'enableHexSlinger')) {
        HexSlingerFeature.initialize();
    }

    if (game.settings.get('tcm-automation', 'enableIntrusionDie')) {
        IntrusionDieFeature.initialize();
    }
});
