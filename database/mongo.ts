import * as mongoose from 'mongoose';
import {patient} from '../schema/patient';
import {caregiver} from '../schema/caregiver';

async function getPatient(id : string) {
    return await patient.find({_id: id});
}

async function getPatientinfo( id : string, info : string) {
    let information = await patient.find({_id: id}).select(info)
    //console.log(information);
    // @ts-ignore
    return information[0][info] ;
}

async function getCaregiver(id : string) {
    return await caregiver.find({_id: id});
}

async function pushTodoPatient(id : string, update : any) {
    try{
        // @ts-ignore
        let patientOne = await patient.findById(id);
        if (patientOne){
            // @ts-ignore
            patientOne.todo.push(update);
            await patientOne.save();
        }
        else{
            updatePatient(id, {todo: [update]});
        }
        return true;
    }
    catch(err){
        console.log(err);
        return false;
    }

}

async function pushSummaryPatient(id : string, update : any) {
    try{
        // @ts-ignore
        let patientOne = await patient.findById(id);
        if (patientOne){
            // @ts-ignore
            patientOne.summary.push(update);
            await patientOne.save();
        }
        else{
            updatePatient(id, {summary: update});
        }
    }
    catch(err){
        console.log(err);
        return false;
    }
}


async function updatePatient(id :string, update :any){
    try{
        await patient.findOneAndUpdate({_id: id}, update);
    }
    catch(err){
        console.log(err);
        return false;
    }
    return true

}

async function updateCaregiver(id :string, update :any){
    try{
        await caregiver.findOneAndUpdate({_id: id}, update);
    }
    catch(err){
        console.log(err);
        return false;
    }
    return true

}

async function addPatient(newPatient :patient){
    try{
        await patient.create(newPatient);
    }
    catch(err){
        console.log(err);
        return false;
    }
    return true

}

async function addCaregiver(newCaregiver :caregiver){
    try{
        await caregiver.create(newCaregiver);
    }
    catch(err){
        console.log(err);
        return false;
    }
    return true

}

export {getPatient, getCaregiver, updatePatient, updateCaregiver, addPatient, addCaregiver, getPatientinfo, pushTodoPatient, pushSummaryPatient};