const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const ChainMemberSchema = new Schema({
    id: { type: String, unique: true },
    amount: { type: Number, min: 1 }, // Do not allow a 0 amount to be saved
});

const ChainSchema = new Schema({
  chainStart: { type: Date, unique: true }, // Do not allow duplicate chains
  chainEnd: { type: Date, unique: true },
  members: [ChainMemberSchema],
  paid: Boolean,
});

module.exports.Chain = mongoose.model("Chain", ChainSchema);