import * as caregiver from './caregiver';
import * as patient from './patient';
import * as mongoose from 'mongoose';

await mongoose.connect('mongodb+srv://neuracare:Dancing12@cluster0.aw0klyp.mongodb.net/NeuraCare?retryWrites=true&w=majority');

const care = new caregiver.caregiver({
    _id: 'rmadithya@outlook.com',
    patients: [
        "shlokdesai33@gmail.com", "rmadith@gmail.com"
    ],
});

await care.save();
