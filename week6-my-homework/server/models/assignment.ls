require! {'./db': db, './user': User}

Schema = db.mongoose.Schema

AssignmentSchema = new Schema {
    title: String,
    description: String,
    deadline: Date,
    teacherId: String,
    teacherName: String
}

AssignmentSchema.virtual 'datestring' .get ->
    month = if (@deadline.getMonth!+1) >= 10 then ''+(@deadline.getMonth!+1) else '0'+(@deadline.getMonth!+1)
    date = if (@deadline.getDate!) >= 10 then ''+(@deadline.getDate!) else '0'+(@deadline.getDate!)
    hour = if (@deadline.getHours!) >= 10 then ''+(@deadline.getHours!) else '0'+(@deadline.getHours!)
    minute = if (@deadline.getMinutes!) >= 10 then ''+(@deadline.getMinutes!) else '0'+(@deadline.getMinutes!)
    @deadline.getFullYear! + '/' + month + '/' + date + ' ' + hour + ':' +minute

AssignmentSchema.virtual 'briefdescription' .get ->
    @description.substring(0, 140)

module.exports = db.mongoose.model 'Assignment', AssignmentSchema

