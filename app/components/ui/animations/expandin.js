import m from 'mithril';
import Velocity from 'velocity-animate';
import 'velocity-ui-pack';

export const ExpandIn = {
    config(element, isInitialized, context) {
        if (!isInitialized) {
            Velocity(element, "transition.expandIn", {duration: 400});
        }
    }
};