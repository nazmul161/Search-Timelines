const { tr } = require('date-fns/locale');
const { text } = require('express');
const mongoose = require('mongoose');

const saveddocsSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Users'
    },
    queryId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Queries'
    },
    ControlNumber: {
        type: String,
        required: [true, 'Please add an ControlNumber']
    },
    docdata: {
        type: mongoose.Schema.Types.Mixed,
        required: [true, 'Please add an object']
    },
    isRemoved: {
        type: Boolean,
        required: false
    },
    searchTopic: {
        type: String,
        required: true
    },

}, {
    timestamps: true
});

module.exports = mongoose.model('SavedDocs', saveddocsSchema);