module.exports = function chancewtf(mod) {
	const command = mod.command || mod.require.command;
	
	let enchantLevel = 0,
		damagechance = 0,
		downchance = 0;

	mod.hook('S_REGISTER_ENCHANT_ITEM', 3, event => {
		enchantLevel = event.enchantLevel;
        damagechance = event.damageOnFailureChance;
		downchance = event.downgradeOnFailureChance;
		event.hideSuccessChance = false;
		
		//if (event.enchantLevel >= 6 && event.itemEXPMax == 0) {msg();}
		if (event.itemEXPMax == 0) {msg();}
		return true;
		
	});
	mod.hook('S_REGISTER_EVOLUTION_ITEM', 3, event => {
        event.hideSuccessChance = false;
        return true;
    });
	
    function msg()
	{
        command.message(`Enchant ${enchantLevel} > ${enchantLevel+1}  Damage: ${Math.round(100*damagechance)}%, Downgrade: ${Math.round(100*downchance)}%`);
	}
    
};