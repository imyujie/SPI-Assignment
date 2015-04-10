require! {'./db': db}

Schema = db.mongoose.Schema

UserSchema = new Schema {
    requirementId: String,
    studentUsr: String,
    studentName: String,
    date: { type: Date, default: Date.now },
    score: { type: Number, default: -1},
}

UserSchema.virtual 'score.tostring' .get -> if @score >= 0 then @score else '尚未评分'
#获得student信息
module.exports = db.mongoose.model 'Homework', UserSchema