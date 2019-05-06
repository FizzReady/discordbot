// All credit is due to FizzReady#7887, if you have any issue please message me.
const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
// This feature show the status or presence of your bot.
client.on('ready', () => {
	const guild = client.guilds.get('<channelID>');
	var userCount = guild.memberCount;
    client.user.setStatus('available')
    client.user.setPresence({
        game: {
		name: `${userCount} Members`,
            type: "LISTENING",
            url: "https://www.twitch.tv/"
        }
    });
});
// This feature adds a welcome message to the most recent user.
client.on('guildMemberAdd', member => {
	member.guild.channels.get("<channelID>").send("Welcome <@" + member.id + "> to User's discord.")
   var role = member.guild.roles.find(role => role.name === "<RoleName>");
	member.addRole(role);
});
// This feature logs your bot to insure it start properly.
client.on("ready", () => {
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
});
// These features is what you put your commands under.
client.on("message", async message => {
  if(message.author.bot) return;
  if(message.content.indexOf(config.prefix) !== 0) return;
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if(command === "help") {
	message.reply("**HELP INFORMATION**\n" +
                               "Type `!commands` to view all the commands \n");
  }
  
  if(command === "commands") {
    message.reply("**COMMANDS**\n" +
                               "Type `!commands` to view all the commands \n" +
                               "Type `!rules` to view all the rules for the server \n");
  }
  
  if(command === "discord") {
  let invite = await message.channel.createInvite({
  }, `Requested with command by ${message.author.tag}`).catch(console.log);

  message.reply(invite ? `Here's a discord link: ${invite}` : "There has been an error during the creation of the invite.");
}
  
  if(command === "mute") {
	  
	if(!message.member.roles.some(r=>["Administrator", "Moderator", "Owner"].includes(r.name)) )
    return message.reply("Sorry, you don't have permissions to use this!");
	let tomute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  if(!tomute) return message.reply("Couldn't find user.");
  let muterole = message.guild.roles.find(`name`, "muted");
  if(!muterole){
    try{
      muterole = await message.guild.createRole({
        name: "muted",
        color: "#000000",
        permissions:[]
      })
      message.guild.channels.forEach(async (channel, id) => {
        await channel.overwritePermissions(muterole, {
          SEND_MESSAGES: false,
          ADD_REACTIONS: false
        });
      });
    }catch(e){
      console.log(e.stack);
    }
  }
  await(tomute.addRole(muterole.id));
  message.reply(`<@${tomute.id}> has been muted for ${ms(ms(mutetime))}`);

}
  
  if(command === "kick") {
    if(!message.member.roles.some(r=>["Administrator", "Moderator", "Owner"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");

    let member = message.mentions.members.first() || message.guild.members.get(args[0]);
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.kickable) 
      return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");
    
    let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason provided";
    
    await member.kick(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
    message.reply(`${member.user} has been kicked by ${message.author} because: ${reason}`);

  }
  
  if(command === "ban") {
    if(!message.member.roles.some(r=>["Administrator", "Moderator", "Owner"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");
    
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.bannable) 
      return message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");

    let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason provided";
    
    await member.ban(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
    message.reply(`${member.user} has been banned by ${message.author} because: ${reason}`);
  }
  
  if(command === "purge") {
    const deleteCount = parseInt(args[0], 10);
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");
    
    const fetched = await message.channel.fetchMessages({limit: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
  }
  
  if(command === "say") {
    const sayMessage = args.join(" ");
    message.delete().catch(O_o=>{}); 
    message.channel.send(sayMessage);
  }
});

client.login(config.token);