import { IntrusionDieFeature } from './features/intrusion-die.js';

Hooks.once('init', () => {
    // Register module settings
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
    if (game.settings.get('tcm-automation', 'enableIntrusionDie')) {
        IntrusionDieFeature.initialize();
    }
});
