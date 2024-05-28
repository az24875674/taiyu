const api = {};
const self = api;

api.網域 = () => ("https://taiyu.onrender.com");

api.標漢字音標 = () => `${self.網域()}/tau`;

api.正規化翻譯 = () => `${self.網域()}/正規化翻譯`;

api.語音合成 = ({ 腔口 = "", 分詞 = "" } = {}) =>
  encodeURI(`${self.網域()}/合成語音?` +
    `查詢腔口=${腔口}&查詢語句=${分詞}`);

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
