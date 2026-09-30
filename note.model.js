import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return v !== v.toUpperCase();
            },
            message: props => `Title cannot be entirely uppercase!`
        }
    },
    content: { type: String, required: true },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

export const Note = mongoose.model('Note', noteSchema);