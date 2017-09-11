import m from 'mithril';
import { Client } from './models';
import API from '../api';
import Modal from '../../containers/modal/modal';
import {Spinner, Button, Alert, Confirm} from '../../components/ui';

export const Clients = {
    vm(p){
    	return {
            working: m.prop(false),
            clients: m.prop('empty'),
            readonly: m.prop(false),
            client: m.prop(new Client()),
            waitForm: m.prop(false)
        }; 
    },
    controller(p){
        this.vm = Clients.vm(p);
        this.limitSizeImagen = 8388606;
        var currentformData = new FormData();

        let getClients = (selectFirst, index) => {
            index = index || null;
            this.vm.working(true);
            Client.list(false)
                .then(this.vm.clients)
                .then(() => this.vm.working(false))
                .then(() => {
                    if(index != null){
                        if(index == 'first')
                            index = 0;
                        this.edit(index);
                }})
                .then(()=>{if(selectFirst == true) {this.detail(0)}})
                .then(()=>m.redraw())
                .catch(r=>{
                    m.route('/login');
                    window.location.reload();
                });
        };

        getClients(true,null);

        this.add = () => {
            currentformData = new FormData();
            this.vm.waitForm(true);
            this.vm.client(new Client());
            this.vm.readonly(false);
            setTimeout(() => {
                this.vm.waitForm(false);
                m.redraw();
            },350);
        }

        this.edit = (index) => {
            currentformData = new FormData();
            this.vm.waitForm(true);
            let arrClients = this.vm.clients();
            this.vm.client(arrClients[index]);
            this.vm.client().index = m.prop(index+1);
            this.vm.readonly(false);

            setTimeout(() => {              
                this.vm.waitForm(false);
                m.redraw();
            },350);
        }

        this.detail = (index) => {
            this.vm.waitForm(true);
            let arrClients = this.vm.clients();
            this.vm.client(arrClients[index]);
            this.vm.readonly(true);
            setTimeout(() => {
                this.vm.waitForm(false);
                m.redraw();
            },350);
        }

        this.delete = (index) => {
            let arrClients = this.vm.clients();
            Modal.vm.open(Confirm, {className: 'mmodal-small', mood: 'success', icon: 'ok-circle',label: '¿Confirmas que deseas borrar este cliente?', actionLabel: 'Eliminar cliente'})
            .then(() => {
                    Client.delete(arrClients[index].id())
                    .then(res =>{
                        if(res == false){
                            Modal.vm.open(Alert, {label: 'No se pudo eliminar el cliente'});
                        }else{  
                            getClients(true,null);
                            Modal.vm.open(Alert, {label: 'Cliente eliminado con éxito', icon: 'pt-icon-endorsed',mood: 'success'});
                        }
                    })
                }
            );

        }


        this.save = (event) => {
             if (event) { event.preventDefault(); }
            if (this.vm.working()) return;

            let endpoint = 'clients';
            let options = {
                serialize: (value) => value,
                url: API.requestUrl(endpoint)
            };

            currentformData.append('name', this.vm.client().form.name());
            currentformData.append('cc', this.vm.client().form.cc());
            currentformData.append('roles_id', this.vm.client().form.roles_id());
            currentformData.append('telephone', this.vm.client().form.telephone());
            currentformData.append('cell_phone', this.vm.client().form.cell_phone());
            currentformData.append('email', this.vm.client().form.email());
            currentformData.append('password', this.vm.client().form.password());
            currentformData.append('neighborhood', this.vm.client().form.neighborhood());
            currentformData.append('address', this.vm.client().form.address());

            if(this.vm.client().form.id() != false){

                // validation for make - less image

                currentformData.append('id', this.vm.client().form.id());
                this.vm.working(true);
                Client.save(currentformData,options)
                .then(res => {
                    this.vm.working(false);
                    if(res == false){
                        Modal.vm.open(Alert, {label: 'No se pudo actualizar el cliente'});
                    }else if(res === 'email_invalid') {  
                        Modal.vm.open(Alert, {label: 'El nuevo correo especificado ya existe en el sistema, por favor indique otro'});
                    } else {  
                        let auxIndex = (this.vm.client().index()-1) == 0 ? 'first': this.vm.client().index()-1;
                        getClients(false,auxIndex);
                        Modal.vm.open(Alert, {label: 'Cliente actualizado con éxito', icon: 'pt-icon-endorsed',mood: 'success'});
                    }   
                }).catch(erSave => {
                    this.vm.working(false);
                    Modal.vm.open(Alert, {label: 'No se pudo actualizar el cliente, por favor verifique datos faltantes, y/o reales'});
                });

            }else{

                // validation for make
                this.vm.working(true);
                Client.save(currentformData,options)
                .then(res => {
                    this.vm.working(false);
                    if(res == false){
                        Modal.vm.open(Alert, {label: 'No se pudo guardar el cliente'});
                    }else if(res === 'email_invalid') {  
                        Modal.vm.open(Alert, {label: 'El correo especificado ya existe en el sistema, por favor indique otro'});
                    } else {
                        this.vm.client(new Client());
                        currentformData = new FormData();
                        getClients(true,null);
                        Modal.vm.open(Alert, {label: 'Cliente guardado con éxito', icon: 'pt-icon-endorsed',mood: 'success'});
                    }
                }).catch(erSave => {
                    this.vm.working(false);
                    Modal.vm.open(Alert, {label: 'No se pudo guardar el cliente, por favor verifique datos faltantes, y/o reales'});
                });

            }


        }


    },
    view(c,p){

        let spinner = <div class="custom-spinner text-center"><Spinner Large /></div>;

        let list = spinner;
        let form = spinner;

        let btnAdd = <button onclick={c.add.bind(c)} type="button" class="pt-button pt-minimal pt-icon-add pt-intent-primary custom-add-btn" >Agregar Cliente</button>;


        if(c.vm.waitForm() == false){
            form = (
            <div class="panel panel-default">
            <div class="panel-body">
                <form onsubmit={c.save.bind(c)} >

                    <label class="pt-label">
                        Nombre completo cliente
                        <input
                            type="text"
                            class="pt-input pt-fill"
                            name="name"
                            oninput={m.withAttr('value', c.vm.client().form.name)}
                            value={c.vm.client().form.name()}
                            placeholder=""
                            required
                            disabled={c.vm.readonly()}
                        />
                    </label>

                    <label class="pt-label">
                        Número identificación
                        <input
                            type="text"
                            class="pt-input pt-fill"
                            name="cc"
                            oninput={m.withAttr('value', c.vm.client().form.cc)}
                            value={c.vm.client().form.cc()}
                            placeholder="Solo números"
                            required
                            disabled={c.vm.readonly()}
                        />
                    </label>

                    <label class="pt-label">
                        Celular 
                        <input
                            type="text"
                            class="pt-input pt-fill"
                            name="cell_phone"
                            oninput={m.withAttr('value', c.vm.client().form.cell_phone)}
                            value={c.vm.client().form.cell_phone()}
                            placeholder="Solo números"
                            required
                            disabled={c.vm.readonly()}
                        />
                    </label>


                    <label class="pt-label">
                        Teléfono fijo <i>(Opcional)</i> 
                        <input
                            type="text"
                            class="pt-input pt-fill"
                            name="telephone"
                            oninput={m.withAttr('value', c.vm.client().form.telephone)}
                            value={c.vm.client().form.telephone()}
                            placeholder="Opcional"
                            disabled={c.vm.readonly()}
                        />
                    </label>

                    <label class="pt-label">
                        Nombre Barrio
                        <input
                            type="text"
                            class="pt-input pt-fill"
                            name="neighborhood"
                            oninput={m.withAttr('value', c.vm.client().form.neighborhood)}
                            value={c.vm.client().form.neighborhood()}
                            placeholder=""
                            required
                            disabled={c.vm.readonly()}
                        />
                    </label>

                    <label class="pt-label">
                        Dirección Domicilio
                        <input
                            type="text"
                            class="pt-input pt-fill"
                            name="address"
                            oninput={m.withAttr('value', c.vm.client().form.address)}
                            value={c.vm.client().form.address()}
                            placeholder=""
                            required
                            disabled={c.vm.readonly()}
                        />
                    </label>


                    <label class="pt-label">
                        Email
                        <input
                            type="email"
                            class="pt-input pt-fill"
                            name="email"
                            oninput={m.withAttr('value', c.vm.client().form.email)}
                            value={c.vm.client().form.email()}
                            placeholder=""
                            required
                            disabled={c.vm.readonly()}
                        />
                    </label>

                    <label class={"pt-label "+(c.vm.readonly() == true ? 'hidden':'')} >
                        Password
                        <input
                            type="password"
                            class="pt-input pt-fill"
                            name="password"
                            oninput={m.withAttr('value', c.vm.client().form.password)}
                            value={c.vm.client().form.password()}
                            placeholder="******"
                            required={c.vm.client().form.id() == false}
                            disabled={c.vm.readonly()}
                        />
                    </label>

                    <div class={"text-center "+(c.vm.readonly() ? 'hidden':'')}>
                        <Button type="submit" loading={c.vm.working()} >
                            Guardar
                        </Button>
                    </div>
                </form>
            </div>
            </div>
            );
        }

        if(c.vm.clients() != 'empty'){
            list = (
            	<div class="table-responsive custom-table-responsive">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>cc</th>
                                <th>Nombre</th>
                                <th>Celular</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                        {c.vm.clients().map((client,index) => {
                            return (
                                <tr>
                                    <td>{client.cc()}</td>
                                    <td>{client.name()}</td>
                                    <td>{client.cell_phone()}</td>
                                    <td>
                                        <div class="dropdown">
                                          <button class="pt-button pt-minimal dropdown-toggle" type="button" data-toggle="dropdown"> Acciones
                                          <span class="caret"></span></button>
                                          <ul class="dropdown-menu">
                                            <li><button onclick={c.detail.bind(c,index)} type="button" class="pt-button pt-minimal pt-icon-search pt-intent-primary" >Detallar</button></li>
                                            <li><button onclick={c.edit.bind(c,index)} type="button" class="pt-button pt-minimal pt-icon-edit pt-intent-primary" >Editar</button></li>
                                            <li><button onclick={c.delete.bind(c,index)}  type="button" class="pt-button pt-minimal pt-icon-delete pt-intent-primary" >Borrar</button></li>
                                          </ul>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
            	</div>
            );
        }


        let content = (
            <div class="admin-clients row">
                <div clas="col-md-12">{btnAdd}<br/></div> 

                <div class="col-md-7">
                    {list}
                </div> 
                <div class="col-md-5">   
                    {form}
                </div> 
            </div>
        )

        return content;

    }
}


export default Clients;
