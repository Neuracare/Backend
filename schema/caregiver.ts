import * as mongoose from 'mongoose';

const caregiver_schema = new mongoose.Schema(
  {
    name: {type: String, required: true},
    sound: {type: String, required: true},
  },
  {
    methods: {
      speak() {
        console.log(`${this.sound}!`);
      },
    },
  }
);

export type caregiver = mongoose.InferSchemaType<typeof caregiver_schema>;
export const caregiver = mongoose.model('Caregivers', caregiver_schema);
