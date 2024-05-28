const express = require('express');
const fetch = require('node-fetch');  // 确保安装了 node-fetch
const cors = require('cors');  // 导入 cors 中间件
const app = express();
const PORT = process.env.PORT || 3000;

const api = {};
const self = api;

api.網域 = () => ("https://hokbu.ithuan.tw/");

api.標漢字音標 = () => `${self.網域()}tau`;

api.正規化翻譯 = () => `${self.網域()}正規化翻譯`;

api.語音合成 = ({ 腔口 = "", 分詞 = "" } = {}) =>
  encodeURI(`${self.網域()}語音合成?` +
    `查詢腔口=${腔口}&查詢語句=${分詞}`);

const 專案 = "寫啥物";  // 或 "鬥拍字"

api.取得查詢函式名稱 = (專案) => {
  switch (專案) {
    case "寫啥物":
      return "正規化翻譯";
    case "鬥拍字":
      return "標漢字音標";
    default:
      return null;
  }
};

api.取得查詢函式 = (專案) =>
  api[self.取得查詢函式名稱(專案)];

// 启用 CORS
app.use(cors());

app.get('/合成語音', async (req, res) => {
  const { text, accent } = req.query;
  const url = api.語音合成({ 腔口: accent, 分詞: text });
  try {
    const response = await fetch(url);
    if (response.ok) {
      const audioBlob = await response.blob();
      res.type('audio/mpeg');
      res.send(audioBlob);
    } else {
      res.status(response.status).send(response.statusText);
    }
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export const playTaiwaneseVoice = async (text, accent) => {
  const url = api.語音合成({ 腔口: accent, 分詞: text });
  try {
    const response = await fetch(url);
    if (response.ok) {
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    } else {
      console.error("Failed to fetch the audio:", response.statusText);
    }
  } catch (error) {
    console.error("Error occurred while fetching the audio:", error);
  }
};
