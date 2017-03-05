import m from 'mithril';

export const ModalTabs = {
    view(ctrl, attrs, children) {
        return (
            <div class="mmodal-tabs">
                <nav>
                    {children}
                </nav>
            </div>
        );
    }
};