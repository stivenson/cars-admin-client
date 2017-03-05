import m from 'mithril';
import Modal from '../../containers/modal/modal';

export const ModalHeader = {
    view(ctrl, attrs, children) {
        return (
            <div class="mmodal-header">
                <h1>{children}</h1>
                <a class="close" onclick={Modal.vm.close.bind(Modal)}><span class="pt-icon-standard pt-icon-cross" /></a>
            </div>
        );
    }
};