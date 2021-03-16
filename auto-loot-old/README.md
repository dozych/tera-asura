```
Support seraph via paypal donations, thanks in advance !
```

# auto-loot-old [![](https://img.shields.io/badge/paypal-donate-333333.svg?colorA=0070BA&colorB=333333)](https://www.paypal.me/seraphinush) 
tera-toolbox module to loot items automatically

## Auto-update guide
- Create a folder called `auto-loot-old` in `tera-toolbox/mods` and download >> [`module.json`](https://raw.githubusercontent.com/ylennia-archives/auto-loot-old/master/module.json) << (right-click this link and save link as..) into the folder

## Usage
- __`loot`__
  - Toggle on/off
### Arguments
- __`auto`__
  - Toggle automatic loot attempt on interval on/off
- __`set`__
  - __`delay <num>`__
    - Set delay between loot attempt to `num`
  - __`interval <num>`__
    - Set loot delay between automatic loot to `num`

## Info
- Original author : [Saegusae](https://github.com/Saegusae)

## Changelog
<details>

    1.46
    - Added mount state
    1.45
    - Removed `ㅣㅐㅐㅅ` command
    1.44
    - Reinstated `tera-game-state`
    1.43
    - Added settings-migrator support
    - Added `set [delay|interval]` option
    - Removed `status` option
    1.42
    - Removed `tera-game-state` usage
    1.41
    - Added hot-reload support
    1.40
    - Updated for caali-proxy-nextgen
    1.39
    - Removed `Command` require()
    - Removed `tera-game-state` require()
    - Updated to `mod.command`
    - Updated to `mod.game`
    1.38
    - Removed font color bloat
    - Added `tera-game-state` dependency
    1.37
    - Updated script in accordance to Pinkipi's update on master branch
    - Refactored config file
    -- Added `auto`
    -- Added `enable`
    -- Added `loopInterval`
    -- Added `lootDelay`
    1.36
    - Added auto-update support
    - Updated to latest tera-data
    1.35
    - Added strongboxes to blacklist
    1.34
    - Updated code and font color
    1.33
    - Updated code aesthetics
    1.32
    - Updated code
    - Added string function
    1.31
    - Updated code aesthetics
    1.30
    - Updated code aesthetics
    1.22
    - Fixed error
    - Updated code
    1.21
    - Fixed error
    - Removed protocol version restriction
    1.20
    - Updated code and protocol version
    - Added `status` command
    1.10
    - Personalized code aesthetics
    1.00
    - Initial fork

</details>