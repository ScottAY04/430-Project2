const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();

const GunplaSchema = new mongoose.Schema({
    name: {
        type:String,
        required: true,
        trim: true,
        set: setName,
    },
    grade: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        min: 0,
        required: true,
    },
    built: {
        type: Boolean,
        required: false,
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Account',
    },
    createdDate: {
        type: Date,
        default: Date.now(),
    },
});

GunplaSchema.statics.toAPI = (doc) => ({
    name: doc.name,
    grade: doc.grade,
    built: doc.built,
});

const GunplaModel = mongoose.model('Gunpla', GunplaSchema);
module.exports = GunplaModel;