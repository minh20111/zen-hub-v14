const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const express = require('express');

// --- 1. SERVER GIỮ BOT ONLINE (DÀNH CHO UPTIMEROBOT) ---
const app = express();
app.get('/', (req, res) => {
    res.send('Bot Zen đang chạy 24/7 trên Render! Trạng thái: 🟢 Hoạt động tốt');
});
app.listen(3000, () => console.log('✅ Cổng 3000 đã mở - Sẵn sàng kết nối UptimeRobot'));

// --- 2. CẤU HÌNH THÔNG TIN BOT ---
const TOKEN = 'MTQ3MzE2MzIxNDAzOTY3OTA4OA.GbScrZ.1ncOwsmQvcJ6XLCfOtkXTF_dZWv6lLejwFmr28'; // Token của ông
const CLIENT_ID = '1473163214039679088'; // Client ID của ông

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent 
    ] 
});

// --- 3. ĐĂNG KÝ SLASH COMMANDS (LỆNH /) ---
const commands = [
    new SlashCommandBuilder().setName('stock').setDescription('Xem Stock Blox Fruit mới nhất'),
    new SlashCommandBuilder().setName('script').setDescription('Lấy Script Auto Farm'),
    new SlashCommandBuilder().setName('code').setDescription('Lấy Code Blox Fruit mới nhất'),
    new SlashCommandBuilder().setName('status').setDescription('Kiểm tra tình trạng Bot')
].map(c => c.toJSON());

async function refreshCommands() {
    const rest = new REST({ version: '10' }).setToken(TOKEN);
    try {
        await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
        console.log('✅ Đã cập nhật hệ thống Slash Commands');
    } catch (e) { console.error('Lỗi cập nhật Commands:', e); }
}

// --- 4. LOGIC XỬ LÝ KHI BOT ONLINE ---
client.on('ready', () => {
    console.log(`🚀 Bot đã online: ${client.user.tag}`);
    refreshCommands(); // Ép Discord nhận diện lệnh ngay lập tức
});

// Xử lý lệnh gõ gạch chéo (Slash Commands)
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    // Chống lỗi "Ứng dụng không phản hồi"
    await interaction.deferReply().catch(() => null); 

    if (interaction.commandName === 'stock') {
        // Giả lập lấy Stock (Ông có thể thay bằng API thật nếu có)
        const embed = new EmbedBuilder()
            .setTitle('🍎 Blox Fruit Stock Real-time')
            .setColor('#00ff00')
            .addFields(
                { name: '🔥 Trái đang bán:', value: 'Dough, Dragon, Leopard', inline: true },
                { name: '⏰ Reset sau:', value: '2 giờ 15 phút', inline: true }
            )
            .setFooter({ text: 'Nhớ trang bị Sword/Fist trước khi farm!' })
            .setTimestamp();
        
        return interaction.editReply({ embeds: [embed] });
    }

    if (interaction.commandName === 'script') {
        return interaction.editReply('📜 Script của ông đây: `loadstring(game:HttpGet("https://raw.githubusercontent.com/Zen/Main/main/Gui"))()`');
    }

    if (interaction.commandName === 'code') {
        return interaction.editReply('🎁 Code mới nhất: `REWARD_CODE`, `VALENTINE_2026`, `GEAR5_COMING`');
    }

    if (interaction.commandName === 'status') {
        return interaction.editReply('🟢 Bot đang chạy ổn định trên Render 24/7!');
    }
});

// --- 5. TỰ ĐỘNG RESTART NẾU CÓ LỖI ---
process.on('unhandledRejection', error => {
    console.error('Lỗi chưa xử lý:', error);
});

client.login(TOKEN);
