import m from 'mithril';
import API from '../api';
import Utils from '../utils';


const DELIVERY_TYPE_DOMICILE = 1;
const STATUS_PENDING = 1;
export const STATUTES = [{id:1,name:'Pendiente'},{id:2,name:'Confirmado'},
    {id:3,name:'Cancelado'},
    {id:4,name:'Entregado'}];
export const DELIVERY_TYPES = [{id:1,name:'Domicilio'},{id:2,name:'En local'}];
export const CATEGORIES = [{id:0,name:' -- '}, {id:1,name:'Sushi'}, {id:2,name:'Ensaladas'}, {id: 3, name: 'Menú de hoy'}];
export const TAKE = 16;

export const Product = function(data) {
    data = data || {};
    this.id = m.prop(data.id || false);
    this.name = m.prop(data.name || '');
    this.category_id = m.prop(data.category_id || 0);
    this.description = m.prop(data.description || '');
    this.smalldescription = m.prop(this.description().substring(0,10)+'...');
    this.value = m.prop(Utils.formatMoney(data.value) || '');
    this.numberValue = m.prop(data.value || 0);
    this.available = m.prop(data.available == true ? true : false);
    this.iva = m.prop(data.iva || 0);
    let mime = data.mime || ' ';
    let urlImage = `data:image/${mime};base64,${(data.image1 || ' ')}`;
    this.image = m.prop(urlImage);
    this.selected = m.prop(false);
    this.srcImage = m.prop(urlImage);

    this.form = {
        id: m.prop(data.id || ''),
        name: m.prop(data.name || ''),
        description: m.prop(data.description || ''),
        value: m.prop(data.value || ''),
        available: m.prop(data.available == true ? true : false),
        category_id: m.prop(data.category_id || 0),
        iva: m.prop(data.iva || ''),
        image: m.prop(urlImage),
        haveImage: m.prop(mime != ' '),
        selected: m.prop(false)
    }; 

};

Product.list = function () {
    return API.get('products', {type: Product});
};

Product.listAvailable = () => {
    return API.get('spe/products/available',{type:Product});
};

Product.get = (id) => {
    return API.get(`products/${id}`,{type:Product});
};

Product.save = function (data,options) {
    return API.post('products',data,options);
};

Product.delete = function (id) {
    return API.get(`temporal/delete/products/${id}`);
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
    };

};

Client.list = function (select, withAdmins = 'no') {
    if(select)
        return API.get(`clients/order/true/${withAdmins}`, {type: Client});
    else
        return API.get('clients', {type: Client});
};

Client.save = function (data,options) {
    return API.post('clients',data,options);
};

Client.delete = function (id) {
    return API.get(`temporal/delete/clients/${id}`);
};



/* Sesion */

export const Sesion = function() {};

const clearLocalStorage = () => {
    localStorage.setItem('data_user', false);
    localStorage.setItem('token', false);
    localStorage.setItem('admin',false);
    localStorage.setItem('client',false);
};

Sesion.logout = function () {
    API.get('public/logout');
    setTimeout(()=>{
        clearLocalStorage();
        m.route('/login');
    },200);
};

Sesion.notHaveSession = function () {
    return localStorage.getItem('admin') === 'false' || localStorage.getItem('admin') === false;
};

Sesion.haveSesionAdmin = function () {
    return localStorage.getItem('admin') !== 'false' && localStorage.getItem('admin') !== false;
};

/* ORDERS */

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
    };

    this.json = () => {
        return {
            id: this.id(),
            products_id: this.products_id(),
            amount: this.amount(),
            observations: this.observations(),
            orders_id: this.orders_id()
        };
    }


}

Itemorder.list = function (idOrder) {
    if(idOrder === false)  
        return new Promise((resolve, reject) => resolve(false));
    return API.get(`items_orders/all/${idOrder}`, {type: Itemorder});
}


export const Order = function(data) {
    data = data || {};
    this.id = m.prop(data.id || false);
    this.delivery_type = m.prop(data.delivery_type || DELIVERY_TYPE_DOMICILE);
    this.status = m.prop(data.status || STATUS_PENDING);
    this.users_id = m.prop(data.users_id || false);
    this.created_at = m.prop(data.created_at || '--');
    this.items_orders = m.prop([]);


    this.form = {
        id: m.prop(data.id || ''),
        status: m.prop(data.status || STATUS_PENDING),
        delivery_type: m.prop(data.delivery_type || DELIVERY_TYPE_DOMICILE),
        users_id: m.prop(data.users_id || false),
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

    this.objStatus = () => {
        let arr = STATUTES.filter(S => S.id == this.status());
        return arr[0];
    };

    this.isChecked = (products_id) => {
        return this.items_orders().filter(o => o.products_id() == products_id).length > 0;
    };

    this.styleStatus = () => {
        let res = '';
        switch(parseInt(this.status())){
            case 2: res = 'pt-intent-primary'; break;
            case 3: res = 'pt-intent-danger'; break;
            case 4: res = 'pt-intent-success'; break;
        }
        return res;
    };


    this.listItems = () => Itemorder.list(this.id());

    this.getItems = (refreshStatus) => {
        if(this.id() !== false) {
            this.listItems().then((r) => {
                    if(r != false){
                        this.items_orders(r);
                        this.form.items_orders(r);
                        refreshStatus(); // refresh checkbox
                        m.redraw();
                    }
                }).catch(e => console.log(`Error gettings items of order ${this.id}`));        
        }
    };

    this.getItemsPromise = () => {
        return this.listItems(); 
    };
};

Order.list = function (skip = 0, take = 15) {
    return API.get(`pagination_orders/${skip}/${take}`, {type: Order});
};

Order.save = function (data,options) {
    return API.post('orders',data,options);
};

Order.delete = function (id) {
    return API.get(`temporal/delete/orders/${id}`);
};




