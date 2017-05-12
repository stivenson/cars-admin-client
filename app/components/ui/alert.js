import m from 'mithril';
import Modal from '../../containers/modal/modal';

export var Alert = {
    controller(props) {
        var defaults = {
            actionLabel: 'Aviso',
            label: 'La acción no se pudo realizar',
            okButton: 'Aceptar',
            icon: 'pt-icon-error',
            mood: 'danger'
        };

        // Merge properties passed to m.component with defaults.
        var options = Object.assign({}, defaults, props);

        return {
            options: options,
            resolve: () => {
                props.resolve();
                Modal.vm.terminate();
            }
        };
    },
    view(c) {
        return (
            <div class="mmodal-body confirm-modal">
                <div class="row">
                    <div class="col-md-12 col-sm-12 col-xs-12">
                        <h2>{c.options.actionLabel}</h2>
                        <p>{c.options.label}</p>
                    </div>
                </div>

                <div class="row actions">
                    <div class="col-md-12 text-center">
                        <button class={"btn btn-block " + ("btn-" + c.options.mood)} type="submit"
                                onclick={c.resolve.bind(c)}>{c.options.okButton}</button>
                    </div>
                </div>
            </div>
        );
    }
};