/**
  * @INFO
  * @github https://github.com/Tae5609
  * @author ᴛᴀᴇ5609シ#2855
  */

const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async msg => {
  if (msg.author.bot) return;
  if (msg.channel.id === config.qna_ch_id) {
    var msg_store = msg;

    msg.delete();
    msg.channel.send(`\`[🕥]\` \`|\` เราได้รับคำถามจากคุณ <@${msg.author.id}> เรียบร้อยเเล้ว กรุณารอการตอบกลับจากทีมงาน`);

    let log_ch = client.channels.cache.get(config.log_qna_ch_id);
    let embed_to_send = new Discord.MessageEmbed()
      .setAuthor(`LOG Q&A`, "https://images-ext-1.discordapp.net/external/oW7W90-pc9jbsrc66Zoo3MGLrKfQ2erDNSty8kYhbIM/https/dunmanhigh.moe.edu.sg/wp-content/uploads/2020/05/QA.png?width=479&height=479")
      .setDescription(`คำถาม : ${msg_store.content.replace(/\n/g, " ")}\nผู้ถาม : ${msg_store.author.tag}\nไอดีผู้ถาม : ${msg_store.author.id}`)
      .setColor("#70d7ff");

    log_ch.send(embed_to_send).then(msgs => {
      let embed_to_edit = new Discord.MessageEmbed()
        .setAuthor(`LOG Q&A`, "https://images-ext-1.discordapp.net/external/oW7W90-pc9jbsrc66Zoo3MGLrKfQ2erDNSty8kYhbIM/https/dunmanhigh.moe.edu.sg/wp-content/uploads/2020/05/QA.png?width=479&height=479")
        .setDescription(`คำถาม : ${msg_store.content.replace(/\n/g, " ")}\nผู้ถาม : ${msg_store.author.tag}\nไอดีผู้ถาม : ${msg_store.author.id}\n\nไอดีสำหรับการตอบกลับ : ${msgs.id}`)
        .setFooter(`ใช้คำสั่ง ${config.prefix}reply ${msgs.id} <คำตอบ> เพื่อตอบกลับ`)
        .setColor("#70d7ff");
      msgs.edit(embed_to_edit);
    });
    return;
  };

  if (msg.channel.id !== config.log_qna_ch_id) return;

  if (!msg.content.startsWith(config.prefix) || msg.author.bot) return;

  const args = msg.content.slice(config.prefix.length).trim().split(' ');
  const command = args.shift().toLowerCase();

  if (command == "reply") {
    var message_id_to_fetch = args[0];
    var answer_to_post = args.join(" ").replace(args[0], "");
    if (!message_id_to_fetch) return msg.channel.send(`\`[❌]\` \`|\` กรุณาระบุไอดีคำถาม`);
    if (!args[1]) return msg.channel.send(`\`[❌]\` \`|\` กรุณาระบุคำตอบ`);

    var qna_ch_log = client.channels.cache.get(config.log_qna_ch_id);

    qna_ch_log.messages.fetch(message_id_to_fetch)
      .then(msg_log_q => {
        var des = msg_log_q.embeds[0].description;
        var question = des.split("\n")[0].replace("คำถาม : ", "");
        var question_author_id = des.split("\n")[2].replace("ไอดีผู้ถาม : ", "");
        var question_author_username = des.split("\n")[1].replace("ผู้ถาม : ", "");
        var qna_ch = client.channels.cache.get(config.qna_ch_id);

        var to_send_back = new Discord.MessageEmbed()
          .setAuthor(`คำถามของ ${question_author_username} ได้รับการตอบเรียบร้อยเเล้ว`, 'https://media.discordapp.net/attachments/855829803454562325/901813692323201054/checked_1.png')
          .setDescription(`\`❓\` **คำถาม** : ${question}\n\n\`⚡\` **คำตอบ** : ${answer_to_post}\n\nคำถามของ : <@${question_author_id}> | ตอบโดย : ${msg.author.username}`)
          .setFooter(`ระบบโดย ᴛᴀᴇ5609シ#2855 | สนใจติดต่อ DM (มีค่าใช้จ่าย)`)
          .setColor('#ffffff')

        qna_ch.send(to_send_back);
        msg_log_q.delete();
      })
      .catch(() => {
        msg.channel.send(`\`[❌]\` \`|\` ไม่พบไอดีคำถามดังกล่าว`);
      });
  };
});

client.login(config.token);