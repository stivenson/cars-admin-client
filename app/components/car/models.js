import m from 'mithril';
import API from '../api';
import Utils from '../utils';
import Modal from '../../containers/modal/modal';
import {Alert} from '../../components/ui';
import {Config} from '../../config';

const DELIVERY_TYPE_DOMICILE = 1;
const STATUS_PENDING = 1;
export const STATUTES = [
    {id:1,name:'Pendiente'},
    {id:2,name:'Confirmado'},
    {id:3,name:'Cancelado'},
    {id:4,name:'Entregado'}];
export const DELIVERY_TYPES = [{id:1,name:'Domicilio'},{id:2,name:'En local'}];
export const TAKE = 16;

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

MProduct.listAvailablePaginate = (skip = 0, take = 24) => {
    return API.get(`spe/products/available/pagination_products/${skip}/${take}`, {type: MProduct});
};

MProduct.get = (id) => {
	return API.get(`public/products/${id}`,{type:MProduct});
};

MProduct.getUrlShareProductFacebook = (id) => {
    return `${Config.API_URL}/public/share/product/facebook/${id}`;
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


/* SESION */

export const Sesion = function() {};

const clearLocalStorage = () => {
    localStorage.setItem('data_user_facebook', false); 
};

Sesion.getNameUser = () => {
    let data_user_facebook = {};
    try {
        data_user_facebook = JSON.parse(localStorage.getItem('data_user_facebook'));        
    } catch (error) {}

    return (data_user_facebook != null && 'name' in data_user_facebook) ? data_user_facebook.name : '';
};


Sesion.getClientInfo = (process = false, already = false) => {
    const data_user_facebook = JSON.parse(localStorage.getItem('data_user_facebook'));
    const userID = typeof data_user_facebook.authResponse !== 'undefined' ? data_user_facebook.authResponse.userID : false;
    FB.api(`/${userID}`, function(response) {
        data_user_facebook.name = response.name;
        Sesion.getClientWithIdFacebook(userID).then(r => {
            data_user_facebook.name = response.name;

            if(already)
                Sesion.fillLocalStorage(Object.assign({}, data_user_facebook, r), already);
            else if(r != false)
                Sesion.fillLocalStorage(Object.assign({}, data_user_facebook, r));
            else
                Sesion.fillLocalStorage(Object.assign({}, data_user_facebook));
            
            try {
                if(process != false)
                    process(false); 
            } catch (error) {}

            m.redraw();
        });
    });
};

Sesion.check = function (data) {
    return API.get('public/check');    
};

Sesion.fillLocalStorage = function (r,already = false) {
    if(!already)
        clearLocalStorage();
    localStorage.setItem('data_user_facebook', JSON.stringify(r));
};

Sesion.haveSesionClient = function() {
    return localStorage.getItem('data_user_facebook') !== 'false' && localStorage.getItem('data_user_facebook') !== false;
};

Sesion.logout = function () {
    setTimeout(()=>{
        clearLocalStorage();
        m.route('/');
        m.redraw();
    },200);
};

Sesion.getClientWithIdFacebook = (userIdFacebook) => {
    return API.get(`public/clients/${userIdFacebook}`);    
};

Sesion.getSesionObject = () => {
    let obj = JSON.parse(window.localStorage.getItem('data_user_facebook'));

    if(obj != false){
        obj.cell_phone = typeof obj.cell_phone !== 'undefined' ? obj.cell_phone : '';
        obj.email = typeof obj.email !== 'undefined' ? obj.email : '';
        obj.neighborhood = typeof obj.neighborhood !== 'undefined' ? obj.neighborhood : '';
        obj.address = typeof obj.address !== 'undefined' ? obj.address : '';
    }

    return obj;
};

Sesion.notDataUserFacebook = () => {
    return localStorage.getItem('data_user_facebook') === false || localStorage.getItem('data_user_facebook') === 'false' || localStorage.getItem('data_user_facebook') == null;
};

Sesion.setSesionObject = (objectParam) => {
    const object = objectParam || {};
    const sesionObject = Object.assign({},Sesion.getSesionObject(),{});
    clearLocalStorage(); 
    
    const client = {
        cell_phone: object.cell_phone || '',
        email: object.email || '',
        neighborhood: object.neighborhood || '',
        address: object.address || ''
    };

    window.localStorage.setItem('data_user_facebook',JSON.stringify(Object.assign({}, sesionObject, client)));
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
