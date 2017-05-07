import m from 'mithril';

export const NonIdealState = {
    controller(props) {
        var defaults = {
            icon: 'thumbs-down',
            title: 'Sin opciones.',
            description: 'No hay opciones disponibles.'
        };

        // Merge properties passed to m.component with defaults.
        var options = Object.assign({}, defaults, props);

        return {
            options: options
        };
    },
    view(c) {
        return (
            <div class="pt-non-ideal-state">
                <div class="pt-non-ideal-state-visual pt-non-ideal-state-icon">
                    <span class={`pt-icon pt-icon-${c.options.icon}`}></span>
                </div>
                <h5 class="pt-non-ideal-state-title">{c.options.title}</h5>
                <div class="pt-non-ideal-state-description">
                    {c.options.description}
                </div>
            </div>
        );
    }
};