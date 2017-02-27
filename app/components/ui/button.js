import m from 'mithril';
import {Spinner} from './spinner';

export const Button = {
    view(_, attrs, children) {
        var content = children;
        var loading = attrs.loading || false;

        if (loading) {
            content = <Spinner small />;
        }

        var size = '';
        if ('large' in attrs) {
            size = 'pt-large';
        }

        if ('fill' in attrs) {
            size += ' pt-fill';
        }

        if ('disabled' in attrs && attrs.disabled()) {
            size += ' pt-disabled';
        }

        if ('hidden' in attrs && attrs.hidden == true) {
            size += ' hidden';
        }

        if ('icon' in attrs) {
            size += ' pt-icon-' + attrs.icon;
        }

        if ('intent' in attrs) {
            let intent = attrs.intent;

            if (intent !== false && intent != 'default') {
                size += ' pt-intent-' + intent;
            }

        } else {
            size += ' pt-intent-primary';
        }



        // To avoid repeat class parameter in button
        let textClass = 'pt-button ' + size;
        if('class' in attrs){
            attrs['class'] = textClass +' '+ attrs['class'];
        }else{
            attrs['class'] = textClass;
        }
        return (
            <button {...attrs}>
                {content}
            </button>
        );
    }
};