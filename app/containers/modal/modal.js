import m from 'mithril';
import {ExpandIn} from '../../components/ui/animations/expandin';

const Modal = {
    view() {
        if (Modal.vm.visible() == false) {
            return <div></div>;
        }

        //class="mmodal-overlay"

        return (
            <div class="m mmodal">
                <div onclick={Modal.vm.close.bind(Modal)}></div>
                <div class={"mmodal-content " + Modal.vm.className()} config={ExpandIn.config}>
                    {Modal.vm.current()}
                </div>
            </div>
        );
    }
};

Modal.vm = {
    init() {
        Modal.vm.visible = m.prop(false);
        Modal.vm.className = m.prop('');
        Modal.vm.current = m.prop(null);
        Modal.vm.deferred = m.prop(false);
        Modal.vm.open = function(component, params) {
            params = params || {};

            if ('className' in params) {
                Modal.vm.className(params.className);
            } else {
                Modal.vm.className('');
            }

            var deferred = m.deferred();

            params = Object.assign({}, params, {
                resolve: deferred.resolve,
                reject: deferred.reject
            });

            Modal.vm.visible(true);
            Modal.vm.current(m(component, params));
            Modal.vm.deferred(deferred);
            m.redraw(true);

            return deferred.promise;
        };

        Modal.vm.close = function() {
            Modal.vm.visible(false);
            Modal.vm.current(null);

            var deferred = Modal.vm.deferred();
            if (deferred != false) {

                // When having an active deferred op then reject and cleanup
                deferred.reject();

                // Clean up the deferred op
                Modal.vm.deferred(false);
            }
        };

        Modal.vm.terminate = function() {
            Modal.vm.visible(false);
            Modal.vm.current(null);
            Modal.vm.deferred(false);
        };
    }
};

Modal.vm.init();

export default Modal;