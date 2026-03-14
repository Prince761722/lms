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
        required: [true, 'Discription is required'],
        minLength: [8, 'Description must be atleast 8 charcters'],
        maxLength: [400, 'Description cannot exceed 400 characters']
    },
    category: {
        type: String,
        required: [true, 'Category is required']
    },
    thumbnail: {
        public_id: {
            type: String
        },

        secure_url: { type: String },
    },
    lectures: [
        {
            title: String,
            description: String,
            lecture: {
                public_id: { type: String ,required: true},
                secure_url: { type: String, required: true }
            }

        }
    ],
    numbersOfLectures: {
        type: Number,
        default: 0
    },
    createdBy: {
        type: String,
        required: [true, 'Creator name is required']
    }
}, {
    timestamps: true
})

const courseModel = model("Course", courseSchema);

export default courseModel;

