'use strict'
/*
Reference List
HuntingZoneIDs: Bluebox-1023 | Caiman-1023 | crabs-6553782 | mongos seems to be dependent on location, are the zone ids the same as orignal location?
Template IDs: Bluebox-88888888 | Caiman-99999999,99999991,99999992 | crabs-1021 | unknown for mongos | Test-mob - 181_2023

To discover more ids, hook S_SPAWN_NPC and check huntingzoneid and templateId. Or use 'mob-id-finder' module on my Github (SerenTera)

Configs are in config.json. If you do not have it, it will be auto generated on your first login
*/

const path = require('path'),
	  fs = require('fs')

module.exports = function markmob(mod) {

	let	mobid=[],
		config,
		fileopen = true,
		stopwrite,
		enabled,
		active = false,
		markenabled,
		messager,
		alerts,
		Item_ID,
		Monster_ID,
		specialMobSearch

	try{
		config = JSON.parse(fs.readFileSync(path.join(__dirname,'config.json'), 'utf8'))
		let defaultConfig = JSON.parse(fs.readFileSync(path.join(__dirname,'lib','configDefault.json'), 'utf8'))
		if(config.gameVersion !== defaultConfig.gameVersion || config.entriesVersion != defaultConfig.gameVersion && config.allowAutoEntryRemoval) {
			let oldMonsterList = JSON.parse(JSON.stringify(config.Monster_ID)), //Deep Clone to replace new list with old config using shallow merge
				newMonsterEntry = JSON.parse(JSON.stringify(defaultConfig.newEntries))

			if(config.allowAutoEntryRemoval === undefined) {
				console.log('[Monster Marker] A new config option (allowAutoEntryRemoval) is added to allow this module to automatically clear old event monster entries. It is by default enabled, and you have to disable it in config.json before next login if you do not want this.');
			}
			else if(config.allowAutoEntryRemoval) {
				for(let key of defaultConfig.deleteEntries) {	//Delete old unused entries for events that are over using deleteEntries
					if(oldMonsterList[key]) {
						console.log(`[Monster Marker] Removed old event entry: ${oldMonsterList[key]}`)
						delete oldMonsterList[key]
					}
				}
				config.entriesVersion = defaultConfig.gameVersion
			}

			Object.assign(oldMonsterList,newMonsterEntry) //Remember to remove the newentries for every update as well as remove old entries from past event

			config = Object.assign({},defaultConfig,config,{gameVersion:defaultConfig.gameVersion,Monster_ID:oldMonsterList}) //shallow merge
			delete config.newEntries
			delete config.deleteEntries
			save(config,'config.json')
			console.log('[Monster Marker] Updated new config file. Current settings transferred over.')
		}
		configInit()
	}
	catch(e){
		let defaultConfig = JSON.parse(fs.readFileSync(path.join(__dirname,'lib','configDefault.json'), 'utf8'))
		config = defaultConfig
		Object.assign(config.Monster_ID,config.newEntries)
		delete config.newEntries
		delete config.deleteEntries
		config.entriesVersion = defaultConfig.gameVersion
		save(config,'config.json')
		configInit()
		console.log('[Monster Marker] New config file generated. Settings in config.json.')
	}


///////Commands
	mod.command.add('warn', {
		$default() {
			mod.command.message('Неверная команда. Напишите "warn info" для помощи')
		},

		info() {
			mod.command.message(`Version: ${config.gameVersion}`)
			mod.command.message('Commands: warn [arguments]\nArguments are as follows:\ntoggle: Enable/Disable Module\nalert: Toggle popup alerts\nmarker: Toggles markers spawn\nclear: Clears marker\nactive: Checks if module is active zone\nadd huntingZone templateId name: Adds the entry to the config')
		},

		toggle() {
			enabled=!enabled
			mod.command.message( enabled ? ' Модуль Включен' : ' Модуль отключен')

			if(!enabled)
				for(let itemid of mobid) despawnthis(itemid)
		},

		alert() {
			alerts = !alerts
			mod.command.message(alerts ? 'Всплывающее уведомление системы включено' : 'Всплывающее уведомление системы отключено')
		},

		marker() {
			markenabled = !markenabled
			mod.command.message(markenabled ? 'Маркеры элементов включены' : 'Маркеры элементов отключены')
		},

		clear() {
			mod.command.message('Попытки сброса меток предметов')
			for(let itemid of mobid) despawnthis(itemid)
		},

		active() {
			mod.command.message(`Активный статус: ${active}`)
		},

		add(huntingZone,templateId,name) {
			config.Monster_ID[`${huntingZone}_${templateId}`] = name
			Monster_ID[`${huntingZone}_${templateId}`] = name
			save(config,'config.json')
			mod.command.message(` Добавлена Запись Конфигурации: ${huntingZone}_${templateId}= ${name}`)
		}

	})

////////Dispatches
	mod.hook('S_SPAWN_NPC', mod.majorPatchVersion < 79 ? 10 : 11, event => {	//Use version >5. Hunting zone ids are indeed only int16 types.
		if(!active || !enabled) return


		if(Monster_ID[`${event.huntingZoneId}_${event.templateId}`]) {
			if(markenabled) {
				markthis(event.loc,event.gameId*100n), //create unique id ?
				mobid.push(event.gameId)
			}

			if(alerts) notice('Обнаружен: '+ Monster_ID[`${event.huntingZoneId}_${event.templateId}`])

			if(messager) mod.command.message(' Обнаружен: '+ Monster_ID[`${event.huntingZoneId}_${event.templateId}`])
		}

		else if(specialMobSearch && event.bySpawnEvent) { //New def
			if(markenabled) {
				markthis(event.loc,event.gameId*100n),
				mobid.push(event.gameId)
			}

			if(alerts) notice('Обнаружен Ивентовый Монстр')

			if(messager) mod.command.message('Обнаружен Ивентовый Монстр')
			//console.log(`Special mob:${event.huntingZoneId}_${event.templateId}`)
		}

	})

	mod.hook('S_DESPAWN_NPC', 3, event => {
		if(mobid.includes(event.gameId)) {
			despawnthis(event.gameId*100n),
			mobid.splice(mobid.indexOf(event.gameId), 1)
		}
	})

	mod.hook('S_LOAD_TOPO', 3, event => { //reset mobid list on location change
		mobid=[]
		active = event.zone < 9000  //Check if it is a dungeon instance, since event mobs can come from dungeon
	})


////////Functions
	function markthis(locs,idRef) {
		mod.send('S_SPAWN_DROPITEM', 8, {
			gameId: idRef,
			loc:locs,
			item: Item_ID,
			amount: 1,
			expiry: 300000, //expiry time,milseconds (300000=5 mins?)
			explode:false,
			masterwork:false,
			enchant:0,
			source:0,
			debug:false,
			owners: [{id: 0}]
		})
	}

	function despawnthis(despawnid) {
		mod.send('S_DESPAWN_DROPITEM', 4, {
			gameId: despawnid
		})
	}

	function notice(msg) {
		mod.send('S_DUNGEON_EVENT_MESSAGE', 2, {
            type: 43,
            chat: false,
            channel: 0,
            message: msg
        })
    }

	function save(data,args) {
		if(!Array.isArray(args)) args = [args] //Find a way around this later -.-

		if(fileopen) {
			fileopen=false
			fs.writeFile(path.join(__dirname, ...args), JSON.stringify(data,null,"\t"), err => {
				if(err) mod.command.message('Ошибка записи файла, попытка перезаписи')
				fileopen = true
			})
		}
		else {
			clearTimeout(stopwrite)			 //if file still being written
			stopwrite=setTimeout(save(__dirname,...args),2000)
			return
		}
	}

	function configInit() {
		({enabled,markenabled,messager,alerts,Item_ID,Monster_ID,specialMobSearch} = config)
	}
}
