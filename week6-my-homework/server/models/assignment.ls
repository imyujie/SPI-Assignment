require! {'./db': db, './user': User}

Schema = db.mongoose.Schema

AssignmentSchema = new Schema {
    title: String,
    description: String,
    deadline: String,
    teacherId: String,
    teacherName: String
}

module.exports = db.mongoose.model 'Assignment', AssignmentSchema

