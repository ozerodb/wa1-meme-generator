'use strict';

const sqlite = require('sqlite3')

// open the database
const db = new sqlite.Database('meme.db', (err) => {
  if (err) throw err;
});

const bcrypt = require('bcrypt');

// DAO operations for validating users

exports.getUser = (email, password) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE email = ?';
        db.get(sql, [email], (err, row) => {
            if (err)
                reject(err); // DB error
            else if (row === undefined)
                resolve(false); // admin not found
            else {
                bcrypt.compare(password, row.password).then(result => {
                    if (result) // password matches
                        resolve({id: row.id, username: row.email, name: row.name});
                    else
                        resolve(false); // password not matching
                })
            }
        });
    });
};

exports.getUserById = (id) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users WHERE id = ?';
        db.get(sql, [id], (err, row) => {
          if (err) 
            reject(err);
          else if (row === undefined)
            resolve({error: 'User not found.'});
          else {
            const user = {id: row.id, username: row.email, name: row.name}
            resolve(user);
          }
      });
    });
  };
  