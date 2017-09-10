import m from 'mithril';
import API from '../api';
import Utils from '../utils';


export const Client = function(data) {
    data = data || {};
    this.id = m.prop(data.id || false);
    this.email = m.prop(data.email || '');
    this.password = m.prop(data.password || '');

    this.form = {
        id: m.prop(data.id || ''),
        email: m.prop(data.email || ''),
        password: m.prop(data.password || '')
    };
};

export const Sesion = function() {};


Sesion.fillLocalStorage = function (r) {
    localStorage.setItem('data_user', JSON.stringify(r.user));
    localStorage.setItem('token', r.token);
};


Sesion.login = function (data) {
    return API.post('public/login',data);    
};

Sesion.haveSession = function () {
    return localStorage.getItem('user') !== 'false' && localStorage.getItem('user') !== false;
};
