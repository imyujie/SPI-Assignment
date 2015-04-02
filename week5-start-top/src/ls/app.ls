class Button
  @status = \idle

  (@btn, @callback) !->
    @red-dot = @btn.find \.unread
    @set-state \init
    @add-listener!

  add-listener: !->
    @btn.on 'click', (e) !~>
      if @get-state! is \init and @@status isnt \busy
        @set-state \waiting
        @@status = \busy
        @jqXHR = $.get '/?timestamp='+new Date!getTime! .done (+data) !~>
          @red-dot.text data
          @set-state \done
          @@status = \idle
          @callback data

  get-number: -> + @red-dot.text!

  get-state: -> @state

  # 3 States. 1. init (able to be click);2. waiting (waiting for response)
  #           3. done (has been clicked)

  set-state: (st) ->
    @state = st
    if @state is \init
      @btn.remove-class \disabled
      @red-dot.remove-class \visible
    else if @state is \waiting
      @btn.add-class \disabled
      @red-dot.text \... .add-class \visible
    else
      @btn.add-class \disabled
      @red-dot.add-class \visible

  reset: !->
    @set-state \init
    @jqXHR?.abort!
    @@status = \idle


class Bubble
  (@btn, @callback) !->
    @set-state \disabled
    @add-listener!

  add-listener: !->
    @btn.on \click, (e) !~>
      if @get-state! is \ready
        @callback @btn
        @set-state \sumed

  show-message: (msg) !->
    @btn.text msg

  get-state: -> @state

  # 2 States. 1. init (unable to be clicked)
  #           2. ready (able to sum and be clicked)
  #           3. sumed (has been click to sum)

  set-state: (st) !->
    | st is \init => @btn.text '' .add-class \disabled
    | st is \ready => @btn.remove-class \disabled
    | otherwise => @btn.add-class \disabled
    @state = st

  reset: !->
    @set-state \init

class Circle-menu

  (@options) ->
    # 实例化 Bubble
    @sum = 0
    @buttons = []
    func = &1
    @bubble = new Bubble @options.big-btn, (btn) !~>
      btn.text @sum
    for item in @options.small-btns
      @buttons.push new Button ($ item), (number) !~>
        if @check-able-to-sum! then @bubble.set-state \ready
        @sum += number
        func?!

    @whole-area = @options.whole-area
    @add-listener!

  add-listener: !->
    @whole-area.on \mouseleave, (e) !~>
      @reset-all!

  reset-all: !->
    for item in @buttons then item.reset!
    @bubble.reset!
    @sum = 0
    @options.robot?.reset!

  check-able-to-sum: ->
    for item in @buttons
      if item.get-state! is \init then return false
    true

  make-small-btns-array: (btns) ->
    [{btn: $ item, red: $ item .find \.unread} for item in btns]

class Robot
  @order-letter = ['A' to 'E']
  @order-number = [0 to 4]

  @shuffle = -> @order-number.sort (a, b) -> Math.random! - 0.5

  (@opts) !-> 
    @add-listener!
    @current = 0
    @activate = false

  add-listener: !->
    @opts.btn.on \click, (e) !~>
      if @state isnt \busy
        switch @opts.type
        | \shunxu => @@order-number = [0 to 4]
        | \bingxing => @@shuffle!
        | \suiji => @@shuffle!
        | otherwise => @@shuffle!
        @click-first!
        @state = \busy

  click-first: !->
    $ @opts.buttons[@@order-number[@current]] .click!
    @activate = true

  click-next-btn: !->
    $ @opts.buttons[@@order-number[++@current]] .click!

  click-bubble: !->
    @opts.bubble.click!

  reset: !->
    @current = 0
    @state = \idle
    @activate = false


<-! $

opts = 
  type: \suiji
  btn: ($ '.apb'),
  bubble: ($ '#info-bar div'),
  buttons: ($ '#control-ring li'),

rob = new Robot opts

opts = 
  big-btn: ($ '#info-bar div'),
  small-btns: ($ '#control-ring li'),
  whole-area: ($ '#at-plus-container'),
  robot: rob

cm = new Circle-menu opts, !->
  unless rob.activate then return
  if rob.current is 4 then rob.click-bubble!
  else rob.click-next-btn!