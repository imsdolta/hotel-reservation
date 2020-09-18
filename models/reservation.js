const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    room_type: {
        type: String,
        required: true
    },
    room_number: {
        type: Number,
        required: true
    },
    person_number: {
        type: Number,
        required: true
    },
    child_number: {
        type: String,
        requires: true
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
        default: Date.now
    }
});

const Reservation = mongoose.model('Reservation', ReservationSchema);

module.exports = Reservation;