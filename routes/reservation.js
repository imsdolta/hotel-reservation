const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');


// Load User model
const reservation = require('../models/reservation');

const { ensureAuthenticated } = require('../config/auth');

router.post('/booking', ensureAuthenticated, (req, res) => {

    req.body.user = req.user._id
    console.log("body is", req.body)

    const { room_type, room_number, person_number, child_number, startDate, endDate } = req.body;
    let errors = [];

    if (!room_type || !room_number || !person_number || !child_number || !startDate || !endDate) {
        errors.push({ msg: 'Please fill all fields' });
    }

    if (errors.length > 0) {
        console.log("errors")
        res.render('dashboard', {
            errors,
        });
    } else {
        try {
            const reservationDetails = new reservation({
                id: req.user._id,
                room_type,
                room_number,
                person_number,
                child_number,
                startDate,
                endDate
            })

            console.log(reservationDetails)
            reservationDetails.save().then(data => {
                try {
                    reservation.find({ id: req.user.id }).lean().then(data => {
                        res.render('booked', {
                            data
                        })
                    })
                } catch (err) {
                    console.error(err)
                    res.render('dashbpard')
                }
            }).catch(err => console.error(err))
        } catch (error) {
            console.error(error)
        }
    }
});


router.get('/booking', ensureAuthenticated, async(req, res) => {
    console.log(req.user.id);

    try {
        reservation.find({ id: req.user.id }).lean().then(data => {
            console.log(data)
            res.render('booked', {
                data
            })

        })
    } catch (err) {
        console.error(err)
        res.render('dashbpard')
    }
});

router.post('/delete/:id', async(req, res) => {
    console.log("deleting id", req.params.id)
    try {
        let data = await reservation.findById(req.params.id).lean()

        if (!data) {
            return res.render('dashboard')
        }

        if (data.id != req.user.id) {
            res.redirect('/dashboard')
        } else {
            await reservation.deleteOne({ _id: req.params.id })
            console.log("deleted")
            res.redirect('/dashboard')
        }

    } catch (err) {
        console.log(err)
        return res.render('dashboard')
    }
})

router.post('/edit/:id', async(req, res) => {
    console.log("editing id", req.params.id)
    try {
        let data = await reservation.findById(req.params.id).lean()

        if (!data) {
            return res.render('dashboard')
        }

        if (data.id != req.user.id) {
            res.redirect('/dashboard')
        } else {

            await reservation.deleteOne({ _id: req.params.id })
            res.render('dashboard', data)
        }

    } catch (err) {
        console.log(err)
        return res.render('dashboard')
    }
})


module.exports = router