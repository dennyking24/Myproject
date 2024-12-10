class BaseRepository {
    constructor(db) {
        this.db = db;
    }

    runQuery(query, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(query, params, function (err) {
                if (err) return reject(err);
                resolve({ id: this.lastID });
            });
        });
    }

    // Fetch all records
    fetchAll(query, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(query, params, (err, rows) => {
                if (err) {
                    return reject(err);
                }
                resolve(rows);
            });
        });
    }

    // Fetch a single record
    fetchOne(query, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(query, params, (err, row) => {
                if (err) {
                    return reject(err);
                }
                resolve(row);
            });
        });
    }

    // Insert a new record
    insert(query, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(query, params, function (err) {
                if (err) {
                    return reject(err);
                }
                resolve({ id: this.lastID });
            });
        });
    }

    // Update a record
    update(query, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(query, params, function (err) {
                if (err) {
                    return reject(err);
                }
                resolve({ changes: this.changes });
            });
        });
    }

    // Delete a record
    delete(query, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(query, params, function (err) {
                if (err) {
                    return reject(err);
                }
                resolve({ changes: this.changes });
            });
        });
    }
}

module.exports = BaseRepository;
