const pool = require("../config/db");

const UserModel = {
    createUser: async (name, email, password, role) => {
        const query = `
            INSERT INTO users (name, email, password, role) 
            VALUES ($1, $2, $3, $4) 
            RETURNING id, name, email, role
        `;
        const result = await pool.query(query, [name, email, password, role]);
        return result.rows[0];
    },

    findUserByEmail: async (email) => {
        const query = "SELECT * FROM users WHERE email = $1";
        const result = await pool.query(query, [email]);
        return result.rows.length > 0 ? result.rows[0] : null;
    },

    findUserById: async (id) => {
        const query = "SELECT id, name, email, role FROM users WHERE id = $1";
        const result = await pool.query(query, [id]);
        return result.rows.length > 0 ? result.rows[0] : null;
    }
};

module.exports = UserModel;
