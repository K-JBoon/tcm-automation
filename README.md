# The Crooked Moon Automation

A FoundryVTT module that provides additional automation enhancements to the
[official Crooked Moon module](https://foundryvtt.com/packages/the-crooked-moon-2014).

This module works by hooking into FoundryVTT and D&D 5e system events to provide
quality-of-life automation features. It does not modify the official module at all,
instead it listens for game events (like rolling dice or taking rests) and automates
the bookkeeping that would otherwise need to be done manually.

Not affiliated with Avantris Entertainment nor Dragon Clan Studio.
Check out their amazing Foundry VTT module [here](https://foundryvtt.com/packages/the-crooked-moon-2014).

## Features

### Intrusion Die Automation

Automatically manages the Intrusion Die mechanic for the Occultist.

- **Automatic Die Progression**: The die automatically increases (on rolls of 1) or decreases (on rolls of 2+) based on your roll results
- **Rest Integration**: The die increases by one step on short rests (up to maximum) and resets to maximum on long rests
- **No Manual Tracking**: The module remembers your current die size between sessions

All automation features can be individually enabled or disabled in the module settings.

## Installation

### Install via Manifest URL

1. Open Foundry VTT and navigate to the **Add-on Modules** tab
2. Click **Install Module**
3. Paste the following manifest URL into the **Manifest URL** field:
   ```
   https://github.com/K-JBoon/tcm-automation/releases/latest/download/module.json
   ```
4. Click **Install**

### Manual Installation

1. Download the latest release from the [Releases page](https://github.com/K-JBoon/tcm-automation/releases)
2. Extract the zip file into your Foundry VTT `Data/modules` directory
3. Restart Foundry VTT
4. Enable the module in your world's module settings

### Requirements

- **FoundryVTT**: Version 13 or higher
- **D&D 5e System**: Version 5.0.4 or higher
- **The Crooked Moon**: The official module must be installed and enabled

## Support

- **Issues**: Report bugs or request features on [GitHub Issues](https://github.com/K-JBoon/tcm-automation/issues)

## License

Licensed under either of the following, at your choice:

- [Apache License, Version 2.0](https://github.com/K-JBoon/tcm-automation/blob/master/LICENSE-APACHE.txt), or
- [MIT license](https://github.com/K-JBoon/tcm-automation/blob/master/LICENSE-MIT.txt)

Unless explicitly stated otherwise, any contribution intentionally submitted
for inclusion in this crate, as defined in the Apache-2.0 license, shall
be dual-licensed as above, without any additional terms or conditions.
