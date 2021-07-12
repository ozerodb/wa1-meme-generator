'use strict';
/* Data Access Object (DAO) module for accessing tasks */

const sqlite = require('sqlite3');

// open the database
const db = new sqlite.Database('meme.db', (err) => {
    if (err) throw err;
});

// get all memes
exports.getMemes = (isAuthenticated) => {
    return new Promise((resolve, reject) => {
        const sql = isAuthenticated ?
            'SELECT m.id,m.title,m.creatorId,u.name AS creatorName,m.templateId,m.isPublic,m.text1,m.text2,m.text3,m.color,m.fontFamily FROM memes AS m, users AS u WHERE m.creatorId=u.id' :
            'SELECT m.id,m.title,m.creatorId,u.name AS creatorName,m.templateId,m.isPublic,m.text1,m.text2,m.text3,m.color,m.fontFamily FROM memes AS m, users AS u WHERE m.creatorId=u.id AND m.isPublic=1';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
};

// delete a meme
exports.deleteMeme = (id, userid) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM memes WHERE id = ? AND creatorId = ?';
        db.run(sql, [id, userid], (err) => {
            if (err) {
                reject(err);
                return;
            } else
                resolve(null);
        });
    });
}

// add a new meme
exports.createMeme = (meme) => {
    return new Promise((resolve, reject) => {

        if (meme.copiedFrom != null) {
            const copy_sql = 'SELECT isPublic FROM memes WHERE id=?';
            db.get(copy_sql, [meme.copiedFrom], (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (row.isPublic === 0 && meme.isPublic === 1){
                    resolve({ error: 'Visibility constraint not respected.' });
                }
            })
        }

        const sql = 'INSERT INTO memes(title,creatorId,templateId,isPublic,text1,text2,text3,color,fontFamily) VALUES (?, ?, ?, ?, ?, ?, ?,?,?)';

        db.run(sql, [meme.title, meme.creatorId, meme.templateId, meme.isPublic, meme.text1, meme.text2, meme.text3, meme.color, meme.fontFamily], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(null);
        });
    });
};