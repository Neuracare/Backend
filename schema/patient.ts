import * as mongoose from 'mongoose';

const patient_schema = new mongoose.Schema(
  {
    _id: {type: String, required: true},
    name: {type: String, required: true},
    caregiver: {type: String, required: true},
    heartRate: {type: Number, required: true},
    bloodPressure: {type: Number, required: true},
    respiratoryRate: {type: Number, required: true},
    bloodOxygen: {type: Number, required: true},
    location: {type: Object, required: true},
    todo: {type: Array, required: false},
    summary: {type: Array, required: false},
  },
  {
    methods: {
      speak() {
        console.log(`${this._id}!`);
      },
    },
  }
);

export type patient = mongoose.InferSchemaType<typeof patient_schema>;
export const patient = mongoose.model('Patients', patient_schema);
