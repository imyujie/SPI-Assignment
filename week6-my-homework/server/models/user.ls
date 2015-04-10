require! {'./db': db}

Schema = db.mongoose.Schema

UserSchema = new Schema {
    username: String,
    password: String,
    email: String,
    name: String,
    identity: Number  # 0 is Student, 1 is Teacher
}

module.exports = db.mongoose.model 'User', UserSchema