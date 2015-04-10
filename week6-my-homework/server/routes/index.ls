require! {'express', fs, '../models/assignment': Assignment, '../models/homework': Homework, path}
router = express.Router!

mkdirsSync = (dirpath, mode, callback) ->
  if fs.existsSync dirpath then true
  else
    if mkdirsSync path.dirname(dirpath), mode
      fs.mkdirSync(dirpath, mode)
      true;


is-authenticated = (req, res, next)-> if req.is-authenticated! then next! else res.redirect '/'



module.exports = (passport)->
  router.get '/', (req, res)!-> res.render 'login', message: req.flash 'message'

  router.post '/login', passport.authenticate 'login', {
    success-redirect: '/home', failure-redirect: '/', failure-flash: true
  }

  router.get '/signup', (req, res)!-> res.render 'signup', message: req.flash 'message'

  router.post '/signup', passport.authenticate 'signup', {
    success-redirect: '/assign', failure-redirect: '/signup', failure-flash: true
  }

  router.get '/home', is-authenticated, (req, res)!-> res.render 'post', user: req.user

  router.get '/signout', (req, res)!->
    req.logout!
    res.redirect '/'

  router.get '/assign', is-authenticated, (req, res)!->
    res.render 'post'

  router.post '/assign', is-authenticated, (req, res)!->
    #todo
    new-assignment = new Assignment {
      title: req.param 'title'
      deadline: req.param 'deadline'
      description: req.param 'description'
      teacherId: req.user._id
      teacherName: req.user.name
    }
    new-assignment.save (err)->
      if err then return handle-error err
      Assignment.find-by-id new-assignment, (err, doc)!->
        if err then return handle-error err
        console.log doc

  router.get '/assignments', is-authenticated, (req, res)!->
    if req.user.identity is 0
      Assignment.find (err, hwlist) !->
        if err then return handle-error err
        res.render 'hwlist', {asmlist: hwlist}
    else
      Assignment.find {'teacherId': req.user._id} (err, hwlist) !->
        if err then return handle-error err
        res.render 'hwlist', {asmlist: hwlist}


  router.get /^\/assignments\/(.*)/, is-authenticated, (req, res)!->
    assignment-id = req.params[0]
    Assignment.find-by-id assignment-id, (err, doc)!->
      if err then return handle-error err
      res.render 'detail', {assignment: doc, hwlist: [], user: req.user}


  router.post '/upload', is-authenticated, (req, res)!->
    if req.user.identity is 1
      console.log 'Not Allow to Submit'
      return
    # get file, then store and rename it
    new-homework = new Homework {
      requirementId: req.param 'assignment_id'
      studentUsr: req.user.username
      studentName: req.user.name
    }
    obj = req.files.homework
    tmp-path = obj.path
    new-path = './uploads/'+req.param 'assignment_title'
    new-path += (req.param 'assignment_id') + '/'
    new-path += req.user.name + req.user.username + '/'
    console.log new-path

    mkdirsSync new-path
    new-path += obj.name
    fs.rename tmp-path, new-path, (err)!-> if err then throw err

    new-homework.save (err)->
      if err then return handle-error err
      Homework.find-by-id new-homework, (err, doc)!->
        if err then return handle-error err
        console.log doc


  router.post '/modify', is-authenticated, (req, res)!->
    if req.user.identity is 0
      console.log 'Not Allow to Modify'
      return
    assi-id = req.param 'assignment_id'
    date-str = req.param 'deadline' .replace('-', '/')
    ddl = new Date date-str
    if ddl < Date!
      res.send 'Invalid Deadline'
    else
      Assignment.update {id: ass-id}, {$set: {deadline: ddl-date}}, (err)!->
    # if ddl_date <= Date.now

  router.post '/score', is-authenticated, (req, res)!->
    if req.user.identity is 0
      console.log 'Not Allow to Score'
      return
    Homework.update {id: req.params['id']}, {$set: {score: req.params['score']}}, (err)!->
    #todo


