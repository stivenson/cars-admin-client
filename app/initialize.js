import 'localstorage-polyfill';
import m from 'mithril';

import Dashboard from 'containers/dashboard/dashboard';
import Login from 'containers/login/login';
import Admin from 'containers/admin/admin';
import MainLayout from 'layouts/MainLayout/MainLayout';


document.addEventListener('DOMContentLoaded', () => {
    var root = document.getElementById('app');
    localStorage.setItem('client',false);
    localStorage.setItem('admin',false);
    localStorage.setItem('data_user', false);
    localStorage.setItem('token', false);
    const WrapMainLayout = (children) => {
        return {
            view() {
                return (
                    <MainLayout>{children}</MainLayout>
                );
            }
        };
    };

    m.route.mode = 'hash';
    m.route(root, '/', {
        '/login': WrapMainLayout(Login),
        '/admin': WrapMainLayout(Admin),
        '/': WrapMainLayout(Dashboard),
        '/category/:category': WrapMainLayout(Dashboard)
    });
});

