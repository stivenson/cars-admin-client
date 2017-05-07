import m from 'mithril';

export const Selective = {};

Selective.vm = function (placeholder, list, validator, validate, bind, empty) {
    return {
        placeholder: m.prop(placeholder),
        visible:     m.prop(false),
        validate:    m.prop(validate),
        items:       list,
        validator:   validator,
        current:     bind,
        emptyText:   m.prop(empty),
        choose(item) {
            this.current(item);
            this.visible(false);
        }
    };
};

Selective.controller = function (props) {

    const {placeholder, list, bind} = props;

    var validator = props.validator || (() => true);
    var validate = true;

    if ('validate' in props) {
        validate = props.validate;
    }

    var emptyText = 'No hay opciones disponibles';
    if ('empty' in props) {
        emptyText = props.empty;
    }

    this.vm = Selective.vm(placeholder, list, validator, validate, bind, emptyText);
};

Selective.view = function (ctrl, props) {
    var dropdown = null;
    var shouldValidate = ctrl.vm.validate();
    var visible = ctrl.vm.visible();

    if ('loading' in props && props.loading === true) {
        return (
            <div class="m selective">
                <div class="selective-body">
                    <span class="current">Cargando información...<span class="right spin"><i class="lnr lnr-sync"></i></span></span>
                </div>
            </div>
        );
    }

    if (visible) {
        listItem = (item) => {
            var isValid = ctrl.vm.validator(item);
            var warning = null;

            if (shouldValidate && false == isValid) {
                warning = <i class="lnr lnr-warning pull-right"></i>;
            }

            return (
                <li onclick={ctrl.vm.choose.bind(ctrl.vm, item)}>{item.label()} {warning}</li>
            );
        };

        if (ctrl.vm.items().length > 0) {
            dropdown = (
                <div class="selective-dropdown">
                    <ul>
                        {ctrl.vm.items().map((item) => {
                            return listItem(item);
                        })}
                    </ul>
                </div>
            );
        } else {
            dropdown = (
                <div class="selective-dropdown">
                    <p>{ctrl.vm.emptyText()}</p>
                </div>
            );
        }
    }

    var status = (s) => {
        if (!s) {
            return <span class="status invalid"><i class="lnr lnr-cross" /></span>;
        } else {
            return <span class="status valid"><i class="lnr lnr-checkmark-circle" /></span>;
        }
    };

    var current = <span class="current" onclick={ctrl.vm.visible.bind(ctrl, !visible)}>{ctrl.vm.placeholder()} <span class="right"><i class="lnr lnr-chevron-down"></i></span></span>;

    if (ctrl.vm.current() != false) {
        var isValid = ctrl.vm.validator(ctrl.vm.current());
        var isValidClass = "";

        if (ctrl.vm.validate() === true) {
            isValidClass = (isValid ? "valid" : "invalid");;
        }

        current = <span class={"current selected " + isValidClass} onclick={ctrl.vm.visible.bind(ctrl, !visible)}>{ctrl.vm.current().label()} <span class="right">{shouldValidate ? status(isValid) : null} <i class="lnr lnr-chevron-down"></i></span></span>
    }

    return (
        <div class="m selective">
            <div class="selective-body">
                {current}
                {dropdown}
            </div>
        </div>
    );
};