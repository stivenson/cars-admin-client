import m from 'mithril';
import API from '../../components/api';
import {Spinner} from '../../components/ui';
import {MProduct} from './models';

export const CarList = {
    vm(p){
        return {
            products: m.prop('empty'),
            working: m.prop(false),
            fetchProducts: () => {
                return MProduct.list();
            }
        }
    },
    controller(p){
        this.vm = CarList.vm(p);
        this.vm.working(true);
        this.vm.fetchProducts().then(this.vm.products).then(()=>this.vm.working(false)).then(()=>m.redraw());
    },
    view(c,p){
        return (
            <div class="car-list">
                <div class="row">

                  <div class="col-sm-3 col-md-3 col-xs-12">
                    <div class="thumbnail thumbnail-click">
                        <div class="cont-image-product">
                            <img class="image-product" alt="image product 1" src="https://img.buzzfeed.com/buzzfeed-static/static/2016-03/4/14/enhanced/webdr05/grid-cell-20993-1457120411-7.jpg" />
                        </div>
                        <div class="caption text-center">
                            <h4>Nombre producto</h4>
                            <p class="price-product">$400.000</p>
                        </div>
                    </div>
                  </div>

                  <div class="col-sm-3 col-md-3 col-xs-12">
                    <div class="thumbnail thumbnail-click">
                        <div class="cont-image-product">
                            <img class="image-product" alt="image product 1" src="http://www.radioactiva.cl/files/2014/07/Comida-china-de-tallarines-con-carne-y-verduras.jpg" />
                        </div>
                        <div class="caption text-center">
                            <h4>Nombre producto</h4>
                            <p class="price-product">$400.000</p>
                        </div>
                    </div>
                  </div>

                  <div class="col-sm-3 col-md-3 col-xs-12">
                    <div class="thumbnail thumbnail-click">
                        <div class="cont-image-product">
                            <img class="image-product" alt="image product 1" src="https://img.buzzfeed.com/buzzfeed-static/static/2016-03/4/14/enhanced/webdr05/grid-cell-20993-1457120411-7.jpg" />
                        </div>
                        <div class="caption text-center">
                            <h4>Nombre producto</h4>
                            <p class="price-product">$400.000</p>
                        </div>
                    </div>
                  </div>

                  <div class="col-sm-3 col-md-3 col-xs-12">
                    <div class="thumbnail thumbnail-click">
                        <div class="cont-image-product">
                            <img class="image-product" alt="image product 1" src="https://img.buzzfeed.com/buzzfeed-static/static/2016-03/4/14/enhanced/webdr05/grid-cell-20993-1457120411-7.jpg" />
                        </div>
                        <div class="caption text-center">
                            <h4>Nombre producto</h4>
                            <p class="price-product">$400.000</p>
                        </div>
                    </div>
                  </div>                                    

                </div>
            </div>
        );
    }
}


export default CarList;
