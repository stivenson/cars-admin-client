import m from 'mithril';
import {debounce} from './debounce';

export const InputAutoComplete = {};

InputAutoComplete.vm = function (bind, source, placeholder, afterevent,onkeyup) {
    var fetch = debounce((context) => {

        // Fetch stuff after debouncing value
        context.source(context.value()).then(context.handleResults.bind(context)).then(() => m.redraw());
    }, 250);

    return {
        visible:     m.prop(false),
        placeholder: m.prop(placeholder),
        bind:        bind,
        afterevent:  afterevent,
        onkeyup:     onkeyup,
        source:      source,
        value:       m.prop(""),
        results:     m.prop([]),
        handleKeypress(e) {
            switch(e.keyCode) {
                case 13:
                    // enter
                    break;
                case 40:
                    // down
                    break;
                case 38:
                    // up
                    break;
            }
        },
        handleResults(ls) {
            this.results(ls);
            this.visible(true);
        },
        handleChoose(item) {
            this.bind(item);
            this.value(item.label());
            this.visible(false);
            this.afterevent();
        },
        changeValue(value) {
            this.value(value);
            fetch(this);
        }
    };
};

InputAutoComplete.controller = function (props) {
    const {bind, source} = props;
    var afterevent = props.afterevent || m.prop(false);
    var onkeyup = props.onkeyup || m.prop(false);
    var placeholder = "";

    if ('placeholder' in props) {
        placeholder = props.placeholder;
    }

    this.vm = InputAutoComplete.vm(bind, source, placeholder, afterevent, onkeyup);

    if (bind() !== false) {
        this.vm.value(bind().label());
    }
};

InputAutoComplete.view = function (ctrl, props) {
    var results;


    if (ctrl.vm.visible()) {
        results = (
            <div class="dropdown" onmouseleave={ctrl.vm.visible.bind(ctrl.vm, false)}>
                <ul>
                    {ctrl.vm.results().map((item) => {
                        return (
                            <li onclick={ctrl.vm.handleChoose.bind(ctrl.vm, item)}>{item.label()}</li>
                        );
                    })}
                </ul>
                {(() => {
                    if (ctrl.vm.results().length == 0) {
                        return (
                            <p>No se encontró ningun resultado.</p>
                        );
                    }
                })()}
            </div>
        );
    }

    return (
        <div class="m contain input-auto-complete form-group sufixed">
            <span class="sufix"><i class="lnr lnr-magnifier" /></span>
            <input class="pt-input pt-fill" type="text" onkeyup={ctrl.vm.onkeyup}  onkeypress={ctrl.vm.handleKeypress.bind(ctrl.vm)} oninput={m.withAttr('value', ctrl.vm.changeValue.bind(ctrl.vm))} placeholder={ctrl.vm.placeholder()} value={ctrl.vm.value()} />
            {results}
        </div>
    );
};