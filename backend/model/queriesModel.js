const { text } = require('express');
const mongoose = require('mongoose');

const queriesSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Users'
    },
    query: {
        type: String,
        required: [true, 'Please add an Query']
    },

    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
    },

    searchTopic: {
        type: String,
        required: true
    },

    os: {
        type: String,
        required: [true, 'Provide device OS']
    },

    
}, {
    timestamps: true
});

module.exports = mongoose.model('Queries', queriesSchema);