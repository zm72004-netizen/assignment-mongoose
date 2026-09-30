import { User } from './user.model.js';
import bcrypt from 'bcrypt';


export const signup = async (req, res) => {
    try {
        const { name, email, password, phone, age } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists." });
        }
        const hashedPassword = bcrypt.hashSync(password, 8);
        const newUser = new User({ name, email, password: hashedPassword, phone, age });
        await newUser.save();
        res.status(201).json({ message: "User added successfully.", user: newUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        res.status(200).json({ message: "Login success", userId: user._id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const updateUser = async (req, res) => {
    try {
        const { id } = req.query;
        const { email } = req.body;

        if (email) {
            const emailExist = await User.findOne({ email, _id: { $ne: id } });
            if (emailExist) {
                return res.status(400).json({ message: "Email already exists" });
            }
        }

        const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User updated", updatedUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const deleteUser = async (req, res) => {
    try {
        const { id } = req.query;
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "user deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const getUserById = async (req, res) => {
    try {
        const { id } = req.query;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};