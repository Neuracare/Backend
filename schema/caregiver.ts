import * as mongoose from 'mongoose';

const caregiver_schema = new mongoose.Schema(
  {
    _id: {type: String, required: true},
    patients: {type: Array, required: false},
  },
  {
    methods: {
      speak() {
        console.log(`${this.id}!`);
      },
    },
  }
);

export type caregiver = mongoose.InferSchemaType<typeof caregiver_schema>;
export const caregiver = mongoose.model('Caregivers', caregiver_schema);
