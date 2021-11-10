import { spinalCore, Model, Ptr, Lst, Choice } from 'spinal-core-connectorjs_type';


export class ProfilModel extends Model{
    constructor(name, data){
        super();
        this.add_attr({name, data: new Ptr(new Lst(data))})
    }
}


spinalCore.register_models([ProfilModel])