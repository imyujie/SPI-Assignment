require! {'./db': db}

Schema = db.mongoose.Schema

HomeworkSchema = new Schema {
    requirementId: String,
    requirementName: String,
    studentUsr: String,
    studentName: String,
    extend: String,
    date: { type: Date, default: Date.now },
    score: { type: Number, default: -1},
}

HomeworkSchema.virtual 'scorestring' .get -> if @score >= 0 then @score else '尚未评分'
HomeworkSchema.virtual 'path' .get ->
    '/uploads/'+ @requirementName + @requirementId + '/' + @studentName + @studentUsr + '.' + @extend

HomeworkSchema.virtual 'name' .get ->
    @studentName + @studentUsr + '.' + @extend

HomeworkSchema.virtual 'datestring' .get ->
    month = if (@date.getMonth!+1) >= 10 then ''+(@date.getMonth!+1) else '0'+(@date.getMonth!+1)
    date = if (@date.getDate!) >= 10 then ''+(@date.getDate!) else '0'+(@date.getDate!)
    hour = if (@date.getHours!) >= 10 then ''+(@date.getHours!) else '0'+(@date.getHours!)
    minute = if (@date.getMinutes!) >= 10 then ''+(@date.getMinutes!) else '0'+(@date.getMinutes!)
    @date.getFullYear! + '/' + month + '/' + date + ' ' + hour + ':' +minute

#获得student信息
module.exports = db.mongoose.model 'Homework', HomeworkSchema