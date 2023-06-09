import mongoose from "mongoose";

const structuresSchema = mongoose.Schema({
  site_id: { type: Number, required: true },
  code: { type: String, required: true },
  name: { type: String, required: true },
  pos_x: { type: Number, required: true },
  pos_y: { type: Number, required: true },
  pos_z: { type: Number, required: true },
  rot: { type: Number, required: true },
  dim_x: { type: Number, required: true, default:0 },
  dim_y: { type: Number, required: true, default:0 },
  dim_z: { type: Number, required: true, default:0 },
  structure_code: { type: Number, required: true },
  parts: [],
});

export default structuresSchema;
