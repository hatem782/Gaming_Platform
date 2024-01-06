const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users.js');

const secretKey = process.env.JWT_SECRET_KEY;

const signin = async (req, res) => {
    const { email, password } = await req.body;

    try {
        // find old user by email
        const existingUser = await User.findOne({ email });
        console.log(existingUser);

        if (!existingUser) {
            return res.status(401).json({ message: "Invalid email or password" });
        }


        // check if the password is correct or not
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // genera JWT token
        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, secretKey, { expiresIn: "1h" });

        res.status(200).json({
            message: 'Sign-in Successful',
            token
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const signup = async (req, res) => {
    const { fullname, email, username, password, confirmPassword, country, onlineID, phoneNumber, dateOfBirth } = req.body;

    try {
        // Check for existing user with same email or username
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // validate confirmPassword
        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }
        // check if the user is 18+
        const currentDate = new Date();
        // get the year from the current date and extract from it the year of the user's date of birth to get his age
        const age = currentDate.getFullYear() - new Date(dateOfBirth).getFullYear();
        if (age < 18) {
            return res.status(400).json({ message: "You must be 18 or older to be able to create an account" });
        }


        // hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // create new user
        const newUser = new User({
            fullname,
            email,
            username,
            password: hashedPassword,
            country,
            onlineID,
            phoneNumber,
            dateOfBirth
        });

        const savedUser = await newUser.save();
        // generate JWT token
        const token = jwt.sign({ id: savedUser._id, email: savedUser.email }, secretKey, { expiresIn: '1h' });
        res.status(201).json({ message: "User created successfully", token })

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { fullname, email, username, password, confirmPassword, country, onlineID, phoneNumber, dateOfBirth } = req.body;

    try {
        // Check if the user exists
        const existingUser = await User.findById(id);

        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check for email and username uniqueness if they are provided in the request
        if (email) {
            const existingEmail = await User.findOne({ email, _id: { $ne: id } });
            if (existingEmail) {
                return res.status(400).json({ message: 'Email already exists' });
            }
        }

        if (username) {
            const existingUsername = await User.findOne({ username, _id: { $ne: id } });
            if (existingUsername) {
                return res.status(400).json({ message: 'Username already exists' });
            }
        }

        // Update user data
        existingUser.fullname = fullname || existingUser.fullname;
        existingUser.email = email || existingUser.email;
        existingUser.username = username || existingUser.username;
        existingUser.country = country || existingUser.country;
        existingUser.onlineID = onlineID || existingUser.onlineID;
        existingUser.phoneNumber = phoneNumber || existingUser.phoneNumber;
        existingUser.dateOfBirth = dateOfBirth || existingUser.dateOfBirth;

        // Update password if provided
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 12);
            existingUser.password = hashedPassword;
        }

        const updatedUser = await existingUser.save();

        res.status(200).json({ message: 'User updated successfully', user: updatedUser });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        // Check if the user exists
        const existingUser = await User.findById(id);

        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete the user
        await existingUser.deleteOne();

        res.status(200).json({ message: 'User deleted successfully' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    signin,
    signup,
    updateUser,
    deleteUser
};