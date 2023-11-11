import * as mongoose from 'mongoose';

const patient_schema = new mongoose.Schema(
  {
    _id: {type: String, required: true},
    name: {type: String, required: true},
    sound: {type: String, required: true},
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
