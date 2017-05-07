import m from 'mithril';
import Observable from '../observable';
import TablePage from './page';
import API from '../api';
import {Spinner} from '../ui';

const TablePaginated = {
    row(item) {
        item = item || {};
        var keys = Object.keys(item);
        var columns;

        if (keys.length > 0) {
            columns = keys.map((key) => {
                return <td>{item[key]}</td>;
            });
        } else {
            columns = [0,1,2,3,4].map(() => {
                return <td>-</td>;
            });
        }

        return <tr>{columns}</tr>;
    },
    vm(props) {
        var defaults = {
            emptyLabel: 'No hay información disponible para mostrar.',
            emptyIcon: 'pt-icon-inbox',
            endpoint: false,
            endpointParams: {},
            perPage: 5,
            tableWidth: '800px',
            headers: TablePaginated.headers,
            row: TablePaginated.row
        };

        // Merge properties passed to m.component with defaults.
        var options = Object.assign({}, defaults, props);
        var data = new TablePage({to: options.perPage});

        return {
            state: {
                options: options,
                data: m.prop(data),
                loading: m.prop(true),
                fields: m.prop(false),
            },
            initialize() {
                this.fetch(0, options.perPage);
            },
            fetch(offset, limit) {
                this.state.loading(true);
                let options = this.state.options;
                let pagination = {
                    limit,
                    offset
                };

                let params = Object.assign({}, options.endpointParams, pagination);

                return API.get(options.endpoint + '?' + m.route.buildQueryString(params), {type: TablePage}).then(this.state.data).then(() => this.state.loading(false)).then(() => m.redraw(true));
            },
            next() {
                var data = this.state.data();
                var target = data.from() + this.state.options.perPage;
                if (target < data.total()) {
                    data.from(target);
                    this.fetch(data.from(), this.state.options.perPage);
                }
            },
            previous() {
                var data = this.state.data();
                var target = data.from() - this.state.options.perPage;
                if (target >= 0) {
                    data.from(target);
                    this.fetch(data.from(), this.state.options.perPage);
                }
            },
            functionParams: props.functionParams || m.prop(false) // Optional parameter
        };
    },
    controller(props) {
        this.vm = TablePaginated.vm(props);
        this.vm.initialize();

        // Setup observable
        Observable.on(["refreshTable"], () => this.vm.fetch(this.vm.state.data().from(), this.vm.state.options.perPage));

        // TODO: use immutable setup for change detection
        Observable.on(["TablePaginated.setup"], options => {
            this.vm.state.options = Object.assign({}, this.vm.state.options, options);
            this.vm.initialize();
        });
    },
    view(c, props) {
        var state = c.vm.state;
        var options = state.options;


        // Init validation if optional parameter is used
        if(c.vm.functionParams() != false){
            var arrParams = c.vm.functionParams();
            var endpointParams = options.endpointParams;
            for(var i in arrParams){
                if(i in endpointParams){
                    if(endpointParams[i] != arrParams[i]){
                        endpointParams[i] = arrParams[i];
                        c.vm.fetch(state.data().from(), options.perPage);
                    }
                }else{
                    endpointParams[i] = arrParams[i];
                    c.vm.fetch(state.data().from(), options.perPage);
                }
            }

            for(var i in endpointParams){
                if(!(i in arrParams)){
                    delete endpointParams[i];
                    c.vm.fetch(state.data().from(), options.perPage);
                    break;
                }
            }
        }
        // End validation if optional parameter is used



        var spin = <Spinner small />;
        var loading = (
            <div class="loading text-center">
                {spin}
            </div>
        );
        var pagination = <span class="desc">-</span>;
        var empty = (
            <div class="no-results">
                <p>{options.emptyLabel}</p>
                <span class={"pt-icon " + options.emptyIcon}></span>
            </div>
        );

        var sample = {};
        console.log('············');
        console.log(state.data());
        console.log('············');
        var data = state.data().data();

        if (data.length > 0) {
            sample = data[0];
        }

        if (!state.loading()) {
            pagination = <span class="desc">{state.data().from()} - {state.data().to()} de {state.data().total()}</span>;
        }

        var prevDisabled = state.data().from() == 0;
        var nextDisabled = state.data().to() >= state.data().total();

        return (
            <div class="table-paginated">
                <div class="table-responsive">
                    <table class="table table-hover" style={{width: state.loading() || data.length > 0 ? options.tableWidth : '100%'}}>
                        <thead>
                            {options.headers(sample)}
                        </thead>
                        <tbody class={state.loading() ? "hidden" : ""}>
                            {data.map(options.row)}
                        </tbody>
                    </table>
                </div>
                {state.loading() ? loading : null}
                {!state.loading() && data.length == 0 ? empty : null}

                <div class="pages">
                    {pagination}
                    <a class={"go prev" + (prevDisabled ? " disabled": "")} onclick={c.vm.previous.bind(c.vm)}><span class="pt-icon-standard pt-icon-caret-left"></span></a>
                    <a class={"go prev" + (nextDisabled ? " disabled": "")} onclick={c.vm.next.bind(c.vm)}><span class="pt-icon-standard pt-icon-caret-right"></span></a>
                </div>
            </div>
        );
    }
};

export default TablePaginated;