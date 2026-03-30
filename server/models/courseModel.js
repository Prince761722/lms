import mongoose from "mongoose";

const { Schema, model } = mongoose;

const courseSchema = new Schema({
    title: {
        type: String,
        required: true,
        minLength: [8, 'title must be at least 8 characters long']
    },
    description: {
        type: String,
        required: true,
        minLength: [8, 'Description must be atleast 8 characters'],
        maxLength: [400, 'Description cannot exceed 400 characters']
    },
    category: {
        type: String,
        required: true
    },

    // COURSE THUMBNAIL
    thumbnail: {
        public_id: String,
        secure_url: String
    },

    // 🔥 FIXED LECTURES
    lectures: [
        {
            title: String,
            description: String,

            lecture: {
                public_id: { type: String, required: true },
                secure_url: { type: String, required: true }
            },

            // ✅ REQUIRED FOR PREVIEW
            thumbnail: {
                public_id: String,
                secure_url: String
            }
        }
    ],

    numbersOfLectures: {
        type: Number,
        default: 0
    },

    createdBy: {
        type: String,
        required: true
    }

}, { timestamps: true });

export default model("Course", courseSchema);