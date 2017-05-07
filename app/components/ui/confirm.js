import m from 'mithril';
import Modal from '../../containers/modal/modal';

export var Confirm = {
    controller(props) {
        var defaults = {
            actionLabel: 'Confirmar cambios',
            label: '¿Confirmas que quieres realizar esta acción?',
            okButton: 'Confirmar',
            cancelButton: 'Cancelar',
            icon: 'warning-sign',
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
                    <div class="col-xs-3 text-center"><span class={"pt-icon-large pt-icon-" + c.options.icon + " " + c.options.mood}></span></div>
                    <div class="col-xs-9">
                        <h2>{c.options.actionLabel}</h2>
                        <p>{c.options.label}</p>
                    </div>
                </div>

                <div class="row actions">
                    <div class="col-md-6 col-sm-6 col-xs-6">
                        <button class="btn btn-default btn-block" type="submit" onclick={Modal.vm.close.bind(Modal.vm)}>{c.options.cancelButton}</button>
                    </div>
                    <div class="col-md-6 col-sm-6 col-xs-6">
                        <button class={"btn btn-block " + ("btn-" + c.options.mood)} type="submit" onclick={c.resolve.bind(c)}>{c.options.okButton}</button>
                    </div>
                </div>
            </div>
        );
    }
};