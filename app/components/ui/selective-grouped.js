import m from 'mithril';

export const SelectiveGrouped = {};

SelectiveGrouped.vm = function (placeholder, list, validator, bind, onChange) {
    return {
        placeholder: m.prop(placeholder),
        visible:     m.prop(false),
        search:      m.prop(""),
        list:        list,
        validator:   validator,
        current:     bind,
        onChange:    onChange,
        choose(item) {
            this.current(item);
            this.visible(false);
            this.onChange(item);
        }
    };
};

SelectiveGrouped.controller = function (props) {
    const {placeholder, groups, validator, onChange, bind} = props;

    this.vm = SelectiveGrouped.vm(placeholder, groups, validator, bind, onChange);
};

SelectiveGrouped.view = function (ctrl, props) {

    var dropdown = null;
    var searchStr = ctrl.vm.search().toLowerCase();
    var visible = ctrl.vm.visible();

    if ('loading' in props && props.loading === true) {
        return (
            <div class="m selective">
                <div class="selective-body">
                    <span class="current">Cargando información... <span class="right spin"><i class="lnr lnr-sync"></i></span></span>
                </div>
            </div>
        );
    }

    if (visible) {
        listItem = (item) => {
            var valid = ctrl.vm.validator(item);
            var warning = null;

            if (!valid) {
                warning = <i class="lnr lnr-warning pull-right"></i>;
            }

            return (
                <li onclick={ctrl.vm.choose.bind(ctrl.vm, item)}>{item.label()} {warning}</li>
            );
        };

        var filter = (item) => {
            if (searchStr == "") return true;

            return item.label().toLowerCase().latinise().indexOf(searchStr) !== -1;
        };

        var search = (
            <div class="selective-search">
                <input type="text" class="form-control" oninput={m.withAttr('value', ctrl.vm.search)} value={ctrl.vm.search()} placeholder="Escribe una busqueda." autofocus />
            </div>
        );

        dropdown = (
            <div class="selective-dropdown">
                {search}
                <ul config={ctrl.config}>
                    {ctrl.vm.list().map((group) => {

                        var items = [];
                        items.push(<li class="group-header">{group.label()}</li>);

                        var children = group.children().filter(filter);
                        if (children.length == 0) return;

                        for (var i in children) {
                            items.push(listItem(children[i]));
                        }

                        return items;
                    })}
                </ul>
            </div>
        );
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
        var valid = ctrl.vm.validator(ctrl.vm.current());
        current = <span class={"current selected " + (valid ? "valid" : "invalid")} onclick={ctrl.vm.visible.bind(ctrl, !visible)}>{ctrl.vm.current().label()} <span class="right">{status(valid)} <i class="lnr lnr-chevron-down"></i></span></span>
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