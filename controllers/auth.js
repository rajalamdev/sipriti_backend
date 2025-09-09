const express = require("express")
const { v4 } = require("uuid")
const jwt = require("jsonwebtoken")
const { comparePassword } = require("../lib/hash")
const { User } = require("../models")
const { Role } = require("../models")
const asyncHandler = require("../middleware/asyncHandler")


// function for get token jwt from id user
function getToken(id){
    return jwt.sign({
        id
    }, process.env.JWT_SECRET, {
        expiresIn: "1d"
    })
}

function createSendToken(user, statusCode, res) {
    user.password = undefined
    const token = getToken(user.id)

    const cookieOption = {
        expire: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    }

    res.cookie("jwt", token, cookieOption)

    res.status(statusCode).json({
        status: "Success",
        data: {
            user
        }
    })
}

module.exports = {
     register: asyncHandler(async (req, res) => {
        // check if password and confirmPassword is null
        if (!req.body.password || !req.body.confirmPassword) {
            res.status(400)
            throw new Error("Password dan konfirmasi password tidak boleh kosong!")
        }

        // check if password and confirm password is not same
        if (req.body.password !== req.body.confirmPassword) {
            res.status(400)
            throw new Error("Password dan konfirmasi password harus sama!")
        }

        if (!req.body.role_id){
            res.status(400)
            throw new Error("Role harus diisi!")
        }

        // INSERT USER INTO DATABASE
        const createUser = await User.create({
            id: v4(),
            username: req.body.username,
            password: req.body.password,
            name: req.body.name,
            role_id: req.body.role_id
        })
        // Hanya return data user, JANGAN set cookie JWT
        res.status(201).json({
            status: "Success",
            data: {
                user: createUser
            }
        });
    }),

    login: asyncHandler(async (req, res) => {
        // check if username or password null
        if (!req.body.username || !req.body.password) {
            res.status(400)
            throw new Error("Username atau password tidak boleh kosong!")
        }

        const findUserByUsername = await User.findOne({
            where: {
                username: req.body.username
            },
        })

        if (!findUserByUsername) {
            res.status(400)
            throw new Error("Username atau password salah!")
        }

        // check if username and password match in DB
        const isPasswordCorrect = await comparePassword(req.body.password, findUserByUsername.password)
        if (
            (req.body.username !== findUserByUsername.username) 
            || (!isPasswordCorrect)
        ) {
            res.status(400)
            throw new Error("Username atau password salah!")
        }

        createSendToken(findUserByUsername, 200, res)        
    }),

    getCurrentUser: asyncHandler(async (req, res) => {
        const findUserById = await User.findOne({
            where: { id: req.user.id },
            include: {
                model: Role,
                as: "role",
                attributes: {
                    exclude: ["createdAt", "updatedAt"]
                }
            },
            attributes: {
                exclude: ["password", "role_id"]
            }
        })

        if (!findUserById) {
            res.status(401)
            throw new Error("User tidak ditemukan!")
        }

        return res.status(200).json({
            message: "Berhasil mendapatkan user",
            data: findUserById
        })
    }),

    logout: asyncHandler(async (req, res) => {
        res.cookie("jwt", "", {
            httpOnly: true,
            expires: new Date(0)
        })

        return res.status(200).json({
            message: "Berhasil logout",
        })
    }),

    // ... existing code ...
    // --- STAFF MANAGEMENT ---
    list: asyncHandler(async (req, res) => {
        // Only allow admin (add your own admin check if needed)
        const users = await User.findAll({
            include: {
                model: Role,
                as: "role",
                attributes: ["name"],
                where: { name: 'staff' }
            },
            attributes: { exclude: ["password", "role_id"] }
        });
        res.status(200).json({ message: "Berhasil mendapatkan semua staff", data: users });
    }),

    update: asyncHandler(async (req, res) => {
        const { id } = req.params;
        const { username, password, confirmPassword } = req.body;

        const user = await User.findByPk(id, {
            include: { model: Role, as: "role", attributes: ["name"] },
        });

        if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

        if (!username?.trim()) {
            return res.status(400).json({ message: "Username wajib diisi" });
        }

        const isUsernameChanged = user.username !== username;
        const isPasswordChanged = password?.trim();

        if (!isUsernameChanged && !isPasswordChanged) {
            return res.status(400).json({ message: "Data tidak berubah, silakan update dengan data baru." });
        }

        if (isPasswordChanged) {
            if (!confirmPassword?.trim()) {
            return res.status(400).json({ message: "Konfirmasi password wajib diisi" });
            }
            if (password !== confirmPassword) {
            return res.status(400).json({ message: "Password dan konfirmasi password harus sama" });
            }
            user.password = password;
        }

        if (isUsernameChanged) {
            user.username = username;
        }

        await user.save();
        user.password = undefined;

        return res.status(200).json({ message: "Berhasil update staff", data: user });
    }),


    delete: asyncHandler(async (req, res) => {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: "User tidak ditemukan" });
        await user.destroy();
        res.status(200).json({ message: "Berhasil menghapus staff", data: { id } });
    }),
// ... existing code ...

}