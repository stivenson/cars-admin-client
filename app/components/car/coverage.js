import m from 'mithril';
import Modal from '../../containers/modal/modal';
import CarModalCoverage from './modalcoverage';

export const CoverageCar = {
    vm(p){

    },
    controller(p){
        this.vm = CoverageCar.vm(p);
        this.opencoverageCar = () => {
            return Modal.vm.open(CarModalCoverage);
        };
    },
    view(c,p){
        return (
            <span class="coverage" >
                <a onclick={c.opencoverageCar.bind(c)}>
                    <span class="pt-tag pt-intent-success"> 
                        <span class="pt-icon-standard pt-icon-map-marker custom-icon"> </span>
                        <span class="sepcolor">_</span>Covertura 
                    </span> 
                </a>
            </span>
        );
    }
};


export default CoverageCar;
