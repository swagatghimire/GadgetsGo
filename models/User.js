const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    address: { type: String, required: true },
    mobile: { type: String, required: true },
    cartItems: [
        {
            id: { type: Number, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
            
        },
    ],
    amount: { type: Number, required: true }, // Total amount
});

module.exports = mongoose.model('User', UserSchema);
