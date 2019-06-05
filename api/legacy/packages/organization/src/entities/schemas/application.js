const mongoose = require('mongoose');
const { toJSON } = require('@pdc/shared-providers').mongo;

const { Schema } = mongoose;

export const ApplicationSchema = new Schema({
  name: { type: String, max: 255, trim: true },
  permissions: [String],
}, { timestamps: true, id: false });

// eslint-disable-next-line func-names
ApplicationSchema.method('toJSON', function () {
  return toJSON(ApplicationSchema, this);
});