import m from 'mithril';
import CarList from '../../components/car/list';


export const Dashboard = {
    controller(p){
    },
    view(c,p){
        return (
            <div>
                <CarList />
            </div>
        );
    }
};

export default Dashboard;
