require! {'express', fs, '../models/assignment': Assignment, '../models/homework': Homework, path}
router = express.Router!

mkdirsSync = (dirpath, mode, callback) ->
  if fs.existsSync dirpath then true
  else
    if mkdirsSync path.dirname(dirpath), mode
      fs.mkdirSync(dirpath, mode)
      true;

string-to-date = (str)->
  date-str = str.replace('-', '/')
  new Date date-str

is-authenticated = (req, res, next)-> if req.is-authenticated! then next! else res.redirect '/login'

module.exports = (passport)->
  router.get '/', (req, res)!-> res.redirect '/assignments'
  router.get '/login', (req, res)!->
    if req.is-authenticated! then res.redirect '/'
    else res.render 'login'

  router.post '/login', passport.authenticate 'login', {
    success-redirect: '/home', failure-redirect: '/', failure-flash: true
  }

  router.get '/signup', (req, res)!-> res.render 'signup', message: req.flash 'message'

  router.post '/signup', passport.authenticate 'signup', {
    success-redirect: '/assign', failure-redirect: '/signup', failure-flash: true
  }

  router.get '/home', is-authenticated, (req, res)!->
    links = [{to: '/home', name: '首页'}, {to: '/assign', name: '发布作业'}]
    res.redirect '/assignments'

  router.get '/signout', (req, res)!->
    req.logout!
    res.redirect '/'

  router.get '/assign', is-authenticated, (req, res)!->
    links = [{to: '/home', name: '首页'}, {to: '/assign', name: '发布作业'}]
    res.render 'post', {to: '/assign', user: req.user, links: links}

  router.post '/assign', is-authenticated, (req, res)!->
    #todo
    new-assignment = new Assignment {
      title: req.param 'title'
      deadline: string-to-date req.param 'deadline'
      description: req.param 'description'
      teacherId: req.user._id
      teacherName: req.user.name
    }
    new-assignment.save (err)->
      if err then return handle-error err
      Assignment.find-by-id new-assignment, (err, doc)!->
        if err then return handle-error err
        res.redirect '/assignments/'+doc._id
        console.log doc

  router.get '/assignments', is-authenticated, (req, res)!->
    links = [{to: '/home', name: '首页'}, {to: '/assignments', name: '作业库'}]
    if req.user.identity is 0
      Assignment.find (err, hwlist) !->
        if err then return handle-error err
        res.render 'hwlist', {asmlist: hwlist, user: req.user, links: links}
    else
      Assignment.find {'teacherId': req.user._id} (err, hwlist) !->
        if err then return handle-error err
        res.render 'hwlist', {asmlist: hwlist, user: req.user, links: links}


  router.get /^\/assignments\/(.*)/, is-authenticated, (req, res)!->
    links = [{to: '/home', name: '首页'}, {to: '/assignments', name: '作业库'}]
    assignment-id = req.params[0]
    Assignment.find-by-id assignment-id, (err, doc)!->
      if err then return handle-error err
      Homework.find {'requirementId': assignment-id}, (err, hwlist)!->
        now = new Date!
        isvalid = if now < doc.deadline then true else false
        links.push {to: '/assignments/'+doc._id, name: doc.title}
        res.render 'detail', {assignment: doc, hwlist: hwlist, user: req.user, isvalid: isvalid, links: links}


  router.post '/upload', is-authenticated, (req, res)!->
    if req.user.identity is 1
      console.log 'Not Allow to Submit'
      return


    obj = req.files.homework
    tmp-path = obj.path
    new-path = './dist/public/uploads/'+req.param 'assignment_title'
    new-path += (req.param 'assignment_id') + '/'
    console.log new-path

    mkdirsSync new-path
    console.log obj.name.split '.'
    [head, tail] = obj.name.split '.'
    new-path += req.user.name + req.user.username + '.' + tail
    fs.rename tmp-path, new-path, (err)!-> if err then throw err
    Homework.find-one {requirementId: req.param 'assignment_id', studentUsr: req.user.username}, (err, result)!->
      if result
        Homework.update {_id: result._id}, {$set: {extend: tail, date: Date()}}, (err)!->
      else
        new-homework = new Homework {
          requirementId: req.param 'assignment_id'
          requirementName: req.param 'assignment_title'
          studentUsr: req.user.username
          studentName: req.user.name
          extend: tail
        }
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
    new-date = string-to-date req.param 'deadline'
    if new-date < Date!
      res.send '1'
    else
      Assignment.find-one-and-update {_id: assi-id}, {$set: {deadline: new-date}}, (err)!->
        res.send req.param 'deadline'

  router.get '/update', is-authenticated, (req, res)!->
    links = [{to: '/home', name: '首页'}, {to: '/assignments', name: '作业库'}]
    if req.user.identity is 0
      console.log 'Not Allow to Visit'
      return
    Assignment.find-by-id (req.param 'aid'), (err, doc)!->
      console.log doc
      links.push {to: '/assignments/'+doc._id, name: doc.title}
      links.push {to: '/update', name: '更新'}
      res.render 'post', {user: req.user, assignment: doc, to: '/update', links: links}

  router.post '/update', is-authenticated, (req, res)!->
    if req.user.identity is 0
      console.log 'Not Allow to Visit'
      return
    new-date = string-to-date req.param 'deadline'
    Assignment.find-one-and-update {_id: req.param 'aid'}, {$set: {deadline: new-date, description: req.param 'description'}}, (err)!->
      res.redirect '/assignments/'+req.param 'aid'

  router.post '/score', is-authenticated, (req, res)!->
    if req.user.identity is 0
      console.log 'Not Allow to Score'
      return
    Homework.update {_id: req.param 'homework_id' }, {$set: {score: +req.param 'score'}}, (err)!->
    #todo


