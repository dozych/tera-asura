module.exports = function BoxOpener(mod){	
  let	hooks = [],
      enabled = false,
      boxEvent = null,
      gacha_detected = false,
      isLooting = false,
      location = null,
      timer = null,
      delay = 5500,
      useDelay = false,
      statOpened = 0,
      statUsed = 0,
      statStarted = null,
      scanning = false,
      boxId = 166901,
      inventory = null

  mod.command.add('box', () => {
    if (!enabled && !scanning) {
      scanning = true
      load()
      mod.command.message('Open a box now and the script will continue opening it')
    } else {
      stop()
    }
  })

  mod.command.add('boxdelay', (arg) => {
    if (arg === "0") {
      useDelay = false
      delay = 5000
      mod.command.message('Turning OFF minimum box opening delay, enjoy the speed')
    } else if(!isNaN(arg)) {
      useDelay = true
      delay = parseInt(arg)
      mod.command.message(`Minimum box opening delay is set to: ${delay / 1000} sec`)
    } else {
      mod.command.message(`Minimum box opening delay is set to: ${useDelay ? `${delay / 1000} sec` : 'no delay'}`)
    }
  })

  mod.hook('C_PLAYER_LOCATION', 5, event => { location = event })

  function load() {
    hook('C_USE_ITEM', 3, event => {
      if (!scanning)
        return

      if (scanning){
        boxEvent = event
        boxId = event.id
        mod.command.message(`Box set to: ${boxId}, proceeding to auto-open it with ${useDelay ? `a minimum ${delay / 1000} sec delay` : 'no delay'}`)
        scanning = false
        const d = new Date()
        statStarted = d.getTime()
        enabled = true
        timer = setTimeout(openBox, delay)
      }
    })

    hook('S_SYSTEM_MESSAGE_LOOT_ITEM', 1, () => {
      if (!gacha_detected && !isLooting) {
        isLooting = true
        statOpened++
        if(!useDelay) {
          clearTimeout(timer)
          openBox()
        }
      }
    })

    hook('S_GACHA_END', 1, () => {
      statOpened++
      if (!useDelay) {
        clearTimeout(timer)
        openBox()
      }
    })

    hook('S_SYSTEM_MESSAGE', 1, event => {
      const msg = mod.parseSystemMessage(event.message)
      if (['SMT_ITEM_MIX_NEED_METERIAL', 'SMT_CANT_CONVERT_NOW'].includes(msg.id)) {
        mod.command.message('Box can not be opened anymore, stopping')
        stop()
      }
    })

    hook('S_GACHA_START', 1, event => {
      gacha_detected = true
      mod.toServer('C_GACHA_TRY', 1, { id:event.id })
    })
  }

  function openBox() {
    boxEvent.loc = location.loc
    boxEvent.w = location.w
    mod.toServer('C_USE_ITEM', 3, boxEvent)
    if (useDelay)
      statUsed++
    timer = setTimeout(openBox,delay)
  }

  function addZero(i) {
    if (i < 10)
      i = "0" + i
    return i
  }
  function stop() {
    unload()
    if (scanning) {
      scanning = false
      mod.command.message('Scanning for a box is aborted')
    } else {
      clearTimeout(timer)
      enabled = false
      gacha_detected = false

      if (useDelay && statOpened === 0)
        statOpened = statUsed

      let d = new Date()
      const t = d.getTime()
      const timeElapsedMSec = t - statStarted
      d = new Date(1970, 0, 1)
      d.setMilliseconds(timeElapsedMSec)
      const h = addZero(d.getHours())
      const m = addZero(d.getMinutes())
      const s = addZero(d.getSeconds())

      mod.command.message(`Box opener stopped. Opened: ${statOpened} boxes.`)
      mod.command.message(`Time elapsed: ${h}:${m}:${s}. Per box: ${(timeElapsedMSec / statOpened / 1000).toPrecision(2)} sec`)

      statOpened = 0
      statUsed = 0
    }
  }

  function unload() {
    if (hooks.length) {
      for (const hook of hooks)
        mod.unhook(hook)
      hooks = []
    }
  }

  function hook() {
    hooks.push(mod.hook(...arguments))
  }
}