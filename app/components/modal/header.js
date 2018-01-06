import m from 'mithril';
import Modal from '../../containers/modal/modal';

export const ModalHeader = {
    view(ctrl, attrs, children) {
        return (
            <div class="mmodal-header">
                <h1>{children}</h1>
                <a class={'close pt-intent-danger pt-small '+(attrs.notlockable == 'true' ? 'hidden' : '')} onclick={Modal.vm.close.bind(Modal)}><span style="color: #ffffff; font-size: 20px;" class="pt-icon-standard pt-icon-cross custom-icon-cross"  /></a>
            </div>
        );
    }
};