require! mongoose
mongoose.connect 'mongodb://localhost/homework-project'
module.exports.mongoose = mongoose