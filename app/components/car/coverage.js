import m from 'mithril';

export const CoverageCar = {
    vm(p){

    },
    controller(p){
        this.vm = CoverageCar.vm(p);
    },
    view(c,p){
        return <span class="coverage" ><span class="pt-tag pt-intent-success"> <span class="pt-icon-standard pt-icon-map-marker"> </span><span class="sepcolor">_</span>Covertura<span class="sepcolor">_</span>Cúcuta </span> </span>;
    }
}


export default CoverageCar;
