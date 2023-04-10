import mongoose from "mongoose";

const partsSchema = mongoose.Schema({
  name: { type: String, required: true },
  primitivetype: { type: Number, required: true },
  pos_x: { type: Number, required: true },
  pos_y: { type: Number, required: true },
  pos_z: { type: Number, required: true },
  dim_x: { type: Number, required: true },
  dim_y: { type: Number, required: true },
  dim_z: { type: Number, required: true },
  rot_x: { type: Number, required: true },
  rot_y: { type: Number, required: true },
  rot_z: { type: Number, required: true },
  color: { type: Number, required: true },
  transparent: { type: Number, required: true },
  parts: [
    {
      part: { type: mongoose.Schema.Types.ObjectId, ref: "parts" },
    },
  ],
});

export default partsSchema;
