// SPDX-License-Identifier: 0BSD

import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import {panel} from 'resource:///org/gnome/shell/ui/main.js';

export default class extends Extension {
    enable() {
        const { dateMenu } = panel.statusArea;
        let children = panel._centerBox.get_children();

        this._oldHeight = panel.height;

        if (panel.height < 58) {
            panel.height = 58;
        }

        if (children.includes(dateMenu.container)) {
            panel._centerBox.remove_actor(dateMenu.container);

            children = panel._leftBox.get_children();
            panel._leftBox.insert_child_at_index(dateMenu.container,
                                                 children.length - 1);
        }
    }

    disable() {
        const { dateMenu } = panel.statusArea;
        const children = panel._leftBox.get_children();

        panel.height = this._oldHeight;

        if (children.includes(dateMenu.container)) {
            panel._leftBox.remove_actor(dateMenu.container);
            panel._centerBox.add_actor(dateMenu.container);
        }
    }
}
