import m from 'mithril';
import API from '../api';
import Utils from '../utils';
import Modal from '../../containers/modal/modal';
import {Alert} from '../../components/ui';

const DELIVERY_TYPE_DOMICILE = 1;
const STATUS_PENDING = 1;
export const STATUTES = [{id:1,name:'Pendiente'},{id:2,name:'Confirmado'},
    {id:3,name:'Cancelado'},
    {id:4,name:'Entregado'}];
export const DELIVERY_TYPES = [{id:1,name:'Domicilio'},{id:2,name:'En local'}];
export const TAKE = 16;
export const START_HOUR = '06:00 am', END_HOUR = '5:30 pm';
export const START_HOUR_WORK = Date.parse('01/01/2016 06:00:00'), END_HOUR_WORK = Date.parse('01/01/2016 05:30:00');

export const MProduct = function(data) {
    data = data || {};
    this.id = m.prop(data.id || false);
    this.name = m.prop(data.name || "");
    this.description = m.prop(data.description || "");
    this.value = m.prop(Utils.formatMoney(data.value) || "");
    this.numberValue = m.prop(data.value || 0);
    this.iva = m.prop(data.iva || "");
    this.available = m.prop(data.available || "");
    this.image1 = m.prop(data.image1 || "");
    this.mime = m.prop(data.mime || "");

    this.srcImage = m.prop(`data:image/${this.mime()};base64,${this.image1()}`);
};


MProduct.listAvailable = () => {
    return API.get('spe/products/available',{type:MProduct});
};

MProduct.listAvailablePaginate = (skip = 0, take = 24, category = 0) => {
    return API.get(`spe/products/available/pagination_products/${skip}/${take}/${category}`, {type: MProduct});
};

MProduct.get = (id) => {
	return API.get(`public/products/${id}`,{type:MProduct});
};


export const Client = function(data) {
    data = data || {};
    this.id = m.prop(data.id || false);
    this.name = m.prop(data.name || '');
    this.cc = m.prop(data.cc || '');
    this.roles_id = m.prop(data.roles_id || 2); // clients rol for default
    this.telephone = m.prop(data.telephone || '');
    this.cell_phone = m.prop(data.cell_phone || '');
    this.email = m.prop(data.email || '');
    this.password = m.prop(data.password || '');
    this.neighborhood = m.prop(data.neighborhood || '');
    this.address = m.prop(data.address || '');

    this.form = {
        id: m.prop(data.id || false),
        name: m.prop(data.name || ''),
        cc: m.prop(data.cc || ''),
        roles_id: m.prop(data.roles_id || 2), // clients rol for default
        telephone: m.prop(data.telephone || ''),
        cell_phone: m.prop(data.cell_phone || ''),
        email: m.prop(data.email || ''),
        password: m.prop(data.password || ''),
        neighborhood: m.prop(data.neighborhood || ''),
        address: m.prop(data.address || '')
    };
};

Client.save = function (data, options = {}) {
    return API.post('public/clients',data,options);
};


/* Sesion */

export const Sesion = function() {};

Sesion.login = function (data) {
    return API.post('public/login',data);    
};

Sesion.check = function (data) {
    return API.get('public/check');    
};

const clearLocalStorage = () => {
    localStorage.setItem('client', false);
    localStorage.setItem('data_user', false);
    localStorage.setItem('token', false);
    localStorage.setItem('admin',false);    
};

Sesion.fillLocalStorage = function (r) {
    if(haveSesionAdmin())
        Modal.vm.open(Alert, { label: 'Hay una sesión previamente abierta como un administrador. Dicha sesión se cerrará para usar esta.' });
    clearLocalStorage();
    localStorage.setItem('data_user', JSON.stringify(r.user));
    localStorage.setItem('token', r.token);
    localStorage.setItem('client',true); 
};

const haveSesionAdmin = () => {
    return localStorage.getItem('admin') !== 'false' && localStorage.getItem('admin') !== false;
};

Sesion.haveSesionClient = function() {
    return localStorage.getItem('client') !== 'false' && localStorage.getItem('client') !== false;
};

Sesion.logout = function () {
    API.get('public/logout');
    setTimeout(()=>{
        clearLocalStorage();
        m.route('/');
    },200);
};


/* ORDERS */

export const Itemorder = function(data) {
    data = data || {};
    this.id = m.prop(data.id || false);
    this.products_id = m.prop(data.products_id || false);
    this.amount = m.prop(parseInt(data.amount) || 0);
    this.observations = m.prop(data.observations || '');
    this.orders_id = m.prop(data.orders_id || false);

    // special front fields
    this.numberValue = m.prop(data.numberValue || '');
    this.name = m.prop(data.name || '');
    this.value = m.prop(data.value || '');
    
    this.form = {
        id: m.prop(data.id || ''),
        products_id: m.prop(data.products_id || false),
        amount: m.prop(parseInt(data.amount) || 0),
        observations: m.prop(data.observations || ''),
        orders_id: m.prop(data.orders_id || false)
    };

    this.json = () => {
        return {
            id: this.id(),
            products_id: this.products_id(),
            amount: this.amount(),
            observations: this.observations(),
            orders_id: this.orders_id()
        };
    };
};

const dataUser = () => {
    let dataUser = {id: false};
    try {
        dataUser = JSON.parse(localStorage.getItem('data_user')); 
    } catch (error) {}
    
    return dataUser.id;
};

export const Order = function(data) {
    data = data || {};
    this.id = m.prop(data.id || false);
    this.delivery_type = m.prop(data.delivery_type || DELIVERY_TYPE_DOMICILE);
    this.status = m.prop(data.status || STATUS_PENDING);
    this.users_id = m.prop(data.users_id || dataUser());
    this.created_at = m.prop(data.created_at || '--');
    this.items_orders = m.prop([]);

    this.reloadUserId = () => {
        this.users_id = m.prop(dataUser());
        this.form.users_id = m.prop(dataUser());
    };

    this.form = {
        id: m.prop(data.id || ''),
        status: m.prop(data.status || STATUS_PENDING),
        delivery_type: m.prop(data.delivery_type || DELIVERY_TYPE_DOMICILE),
        users_id: m.prop(data.users_id || dataUser()),
        created_at: m.prop(data.created_at || '--'),
        items_orders: this.items_orders 
    };

    this.jsonItemsOrders = () => {
        let res = [];
        let arr = this.items_orders();
        for (let item of arr) {
            res.push(item.json());
        }
        return JSON.stringify(res);
    };

    this.getItemsPromise = () => {
        return this.listItems(); 
    };
};


Order.save = function (data) {

    let endpoint = 'client/orders';        
    
    let options = {
        serialize: (value) => value,
        url: API.requestUrl(endpoint)
    };

    return API.post(endpoint, data, options);
};

export const Tools = function() {

    this.currentHour = function() {
        return API.get('tools/current_hour');
    };

};


