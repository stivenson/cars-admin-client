import m from 'mithril';
import API from '../api';
import Utils from '../utils';


const DELIVERY_TYPE_DOMICILE = 1;
const STATUS_PENDING = 1;
export const STATUTES = [{id:1,name:'Pendiente'},{id:2,name:'Confirmado'},{id:2,name:'Cancelado'},{id:2,name:'Entregado'}];
export const DELIVERY_TYPES = [{id:1,name:'Domicilio'},{id:2,name:'En local'}];

export const Product = function(data) {
    data = data || {};
    this.id = m.prop(data.id || false);
    this.name = m.prop(data.name || '');
    this.description = m.prop(data.description || '');
    this.smalldescription = m.prop(this.description().substring(0,10)+'...');
    this.value = m.prop(Utils.formatMoney(data.value) || '');
    this.available = m.prop(data.available == true ? true : false);
    this.iva = m.prop(data.iva || 0);
    let mime = data.mime || ' ';
    let urlImage = `data:image/${mime};base64,${(data.image1 || ' ')}`;
    this.image = m.prop(urlImage);
    

    this.form = {
        id: m.prop(data.id || ''),
        name: m.prop(data.name || ''),
        description: m.prop(data.description || ''),
        value: m.prop(data.value || ''),
        available: m.prop(data.available == true ? true : false),
        iva: m.prop(data.iva || ''),
        image: m.prop(urlImage),
        haveImage: m.prop(mime != ' ')
    } 

}

Product.list = function () {
    return API.get('products', {type: Product});
}

Product.save = function (data,options) {
    return API.post('products',data,options);
}

Product.delete = function (id) {
    return API.get(`temporal/delete/products/${id}`);
}



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
        id: m.prop(data.id || ''),
        name: m.prop(data.name || ''),
        cc: m.prop(data.cc || ''),
        roles_id: m.prop(data.roles_id || 2), // clients rol for default
        telephone: m.prop(data.telephone || ''),
        cell_phone: m.prop(data.cell_phone || ''),
        email: m.prop(data.email || ''),
        password: m.prop(data.password || ''),
        neighborhood: m.prop(data.neighborhood || ''),
        address: m.prop(data.address || '')
    }

}

Client.list = function () {
    return API.get('clients', {type: Client});
}

Client.save = function (data,options) {
    return API.post('clients',data,options);
}

Client.delete = function (id) {
    return API.get(`temporal/delete/clients/${id}`);
}



export const Itemorder = function(data) {
    data = data || {};
    this.id = m.prop(data.id || false);
    this.products_id = m.prop(data.products_id || false);
    this.amount = m.prop(parseInt(data.amount) || 0);
    this.observations = m.prop(data.observations || '');
    this.orders_id = m.prop(data.orders_id || false);

    this.form = {
        id: m.prop(data.id || ''),
        products_id: m.prop(data.products_id || false),
        amount: m.prop(parseInt(data.amount) || 0),
        observations: m.prop(data.observations || ''),
        orders_id: m.prop(data.orders_id || false)
    }

}

Itemorder.list = function (idOrder) {
    if(idOrder === false)  
        return false;
    return API.get(`items_orders/all/${idOrder}`, {type: Itemorder});
}


export const Order = function(data) {
    data = data || {};
    this.id = m.prop(data.id || false);
    this.delivery_type = m.prop(data.delivery_type || DELIVERY_TYPE_DOMICILE);
    this.status = m.prop(data.status || STATUS_PENDING);
    this.users_id = m.prop(data.users_id || false);
    let items_orders = Itemorder.list(this.id);
    this.items_orders = m.prop( items_orders || []);

    this.form = {
        id: m.prop(data.id || ''),
        status: m.prop(data.status || STATUS_PENDING),
        delivery_type: m.prop(data.delivery_type || DELIVERY_TYPE_DOMICILE),
        users_id: m.prop(data.users_id || false),
        items_orders: m.prop( items_orders || []) 
    }

}

Order.list = function () {
    return API.get('orders', {type: Order});
}

Order.save = function (data,options) {
    return API.post('orders',data,options);
}

Order.delete = function (id) {
    return API.get(`temporal/delete/orders/${id}`);
}




