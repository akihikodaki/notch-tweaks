// SPDX-License-Identifier: 0BSD

import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import {panel, sessionMode} from 'resource:///org/gnome/shell/ui/main.js';

export default class extends Extension {
    enable() {
        const {emit} = sessionMode;

        this._oldHeight = panel.height;

        if (panel.height < 58) {
            panel.height = 58;
        }

        sessionMode.emit = function() {
            this.panel = {
                ...this.panel,
                left: this.panel.left.concat(this.panel.center),
                center: []
            };

            emit.apply(this, arguments);
        };

        sessionMode.emit('updated');
    }

    disable() {
        panel.height = this._oldHeight;

        delete sessionMode.emit;
        sessionMode._sync();
    }
}
