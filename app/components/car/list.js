import m from 'mithril';
import API from '../../components/api';
import {Spinner} from '../../components/ui';
import {MSoat} from '../soat/models';

export const DashboardList = {
    vm(p){
        return {
            listSoats: m.prop('empty'),
            working: m.prop(false),
            detail: m.prop(false),
            fetchSoats: () => {
                return API.get('soats',{type: MSoat});
            },
            formatDate: (date) => {
                let objDate = new Date(date); 
                return objDate.getDate() + "/" + (objDate.getMonth()+1) + "/" + objDate.getFullYear() + "   " + objDate.getHours() + ":" + objDate.getMinutes() + ":" + objDate.getSeconds();
            },
            calcExpiration: (date) => {
                let endDateSoat = new Date(date); 
                endDateSoat.setFullYear(endDateSoat.getFullYear() + 1); 
                return endDateSoat.toString('yyyy-MM-dd HH:mm:ss');
            }
        }
    },
    controller(p){
        this.vm = DashboardList.vm(p);
        this.vm.working(true);
        this.vm.fetchSoats().then(this.vm.listSoats).then(()=>this.vm.working(false)).then(()=>m.redraw());
    },
    view(c,p){

        if(localStorage.getItem('user') == 'false' || localStorage.getItem('user') == null){
            m.route("/");
        }

        let spin = <div class="text-center"><Spinner /></div>;

        let tableSoats = spin;

        if(c.vm.listSoats() != 'empty' && c.vm.listSoats().length < 1){
            tableSoats = <div class="text-center"><br/><br/><b>No se encontraron soats</b><br/><br/></div>
        }else {
            if (c.vm.listSoats() != 'empty'){
                tableSoats = (
                    <div class="table-responsive">
                        <table class="table" >
                           <thead>
                            <th># Targeta</th><th>Títular</th><th># Cuotas</th><th>Fecha Compra</th><th>Fecha Vencimiento</th><th></th>
                           </thead>
                           <tbody>
                            {c.vm.listSoats().map((s) => {
                                return (
                                    <tr>
                                        <td>{s.number_cart()}</td>
                                        <td>{s.holder_cart()}</td>
                                        <td>{s.number_quotas()}</td>
                                        <td>{c.vm.formatDate(s.created_at())}</td>
                                        <td>{c.vm.formatDate(c.vm.calcExpiration(s.created_at()))}</td>
                                        <td>
                                            <a onclick={c.vm.detail.bind(c.vm,s.id())}><span class="pt-icon-standard pt-icon-remove-row-top"></span> Ver Información</a>
                                            <br/>
                                            <div class={c.vm.detail() == s.id()?'':'hidden'}>
                                                <br/>
                                                <table style="background: #e5e5e5;" class="table" >
                                                   <tbody>
                                                        <tr>
                                                            <td>
                                                                <b>Placa</b><br/>
                                                                {s.plate()}
                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <td>
                                                                <b>Descripción</b><br/>
                                                                {s.d_vehicle()}
                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <td>
                                                                <b>Valor prima</b><br/>
                                                                ${s.prima()}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <b>Contribución Fosyga</b><br/>
                                                                ${parseInt(parseInt(s.prima()) * 0.5)}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <b>Tasa RUNT</b><br/>
                                                                $1.610
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <b>Total</b><br/>
                                                                ${parseInt(s.prima()) + (parseInt(parseInt(s.prima()) * 0.5)) + 1610}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <b>Inicio de vigencia</b><br/> {s.created_at()}
                                                            </td>    
                                                        </tr>
                                                   </tbody>
                                                </table>  
                                            </div>                                         
                                        </td>
                                    </tr>
                                )
                            })}
                           </tbody>
                        </table>
                    </div>
                )
            }
        }


        return( 
            <div class="list">
                <div class="panel panel-default">
                    <div class="panel-body">
                        <h3>Listado de Soats</h3>
                        <br/><br/>
                        {tableSoats}
                    </div>
                </div>
            </div>
        );
    }
}


export default DashboardList;
