import mongoose from "mongoose";

const actorsSchema = mongoose.Schema({
  code: { type: String, required: true },
  name: { type: String, required: true },
  pos_x: { type: Number, required: true },
  pos_y: { type: Number, required: true },
  pos_z: { type: Number, required: true },
  rot: { type: Number, required: true },
  structure_code: { type: Number, required: true },
  parts: [],
});

export default actorsSchema;
