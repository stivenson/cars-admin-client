import m from 'mithril';
import API from '../api';

// For Castings

export const MProduct = function(data) {
    data = data || {};
    this.id = m.prop(data.id || false);
    this.names = m.prop(data.names || "");
}


MProduct.list = () => {
    return API.get('products');
}