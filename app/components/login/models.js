import m from 'mithril';
import API from '../api';
import Utils from '../utils';
import Modal from '../../containers/modal/modal';
import {Alert} from '../../components/ui';

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
    if(haveSesionClient())
        Modal.vm.open(Alert, { label: 'Hay una sesión previamente abierta como un cliente. Dicha sesión se cerrará para usar esta.' });
    
    clearLocalStorage();
    localStorage.setItem('data_user', JSON.stringify(r.user));
    localStorage.setItem('token', r.token);
    localStorage.setItem('admin',true);  
};

const clearLocalStorage = () => {
    localStorage.setItem('client', false);
    localStorage.setItem('data_user', false);
    localStorage.setItem('token', false);
    localStorage.setItem('admin',false);    
};

const haveSesionClient = () => {
    return localStorage.getItem('client') !== 'false' && localStorage.getItem('client') !== false;
};


Sesion.login = function (data) {
    return API.post('public/login',data);    
};

Sesion.haveSession = function () {
    return localStorage.getItem('admin') !== 'false' && localStorage.getItem('admin') !== false;
};
