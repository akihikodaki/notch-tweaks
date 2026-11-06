// SPDX-License-Identifier: 0BSD

import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import {layoutManager, panel, sessionMode} from 'resource:///org/gnome/shell/ui/main.js';

export default class extends Extension {
    #oldHeight;
    #connection;

    enable() {
        const {emit} = sessionMode;
        const {height} = panel;

        function patchPanel(sessionMode) {
            sessionMode.panel = {
                ...sessionMode.panel,
                left: sessionMode.panel.left.concat(sessionMode.panel.center),
                center: []
            };
        }

        function updateHeight() {
            const {geometry_scale} = layoutManager.findMonitorForActor(panel);
            panel.height = Math.max(height, 58 / geometry_scale);
        };

        this.#oldHeight = height;
        this.#connection = layoutManager.connect('monitors-changed', updateHeight);
        updateHeight();

        sessionMode.emit = function() {
            patchPanel(this);
            emit.apply(this, arguments);
        };

        patchPanel(sessionMode);
        panel._updatePanel();
    }

    disable() {
        panel.height = this.#oldHeight;
        layoutManager.disconnect(this.#connection);
        delete sessionMode.emit;
        sessionMode._sync();
    }
}
