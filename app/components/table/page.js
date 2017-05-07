import m from 'mithril';

const TablePage = function(data) {
    data = data || {};

    this.total = m.prop(data.total || 0);
    this.from = m.prop(data.from || 0);
    this.to = m.prop(data.to || 5);
    this.data = m.prop(data.data || []);
};

export default TablePage;