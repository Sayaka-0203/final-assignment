import axios from "axios";
import dotenv from "dotenv";

// 環境変数のロード
dotenv.config();

// APIのベースURLとキーの定義
const API_BASE_URL = "https://yumemi-frontend-engineer-codecheck-api.vercel.app";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

// 都道府県データを取得する関数
export const fetchPrefectures = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/v1/prefectures`, {
      headers: {
        "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY,
      },
    });
    return res.data.result;
  } catch (error) {
    console.error("都道府県データの取得に失敗しました:", error);
    throw new Error("都道府県データの取得に失敗しました。");
  }
};

// 人口構成データを取得する関数
export const fetchPopulationData = async (
  prefectureCode: number,
  populationType: string
) => {
  try {
    const res = await axios.get(
      `${API_BASE_URL}/api/v1/population/composition/perYear`,
      {
        params: {
          prefCode: prefectureCode,
          populationType: populationType,
        },
        headers: {
          "X-API-KEY": API_KEY,
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("人口構成データの取得に失敗しました:", error);
    throw new Error("人口構成データの取得に失敗しました。");
  }
};

// APIのレスポンス型定義
export interface PopulationApiResponse {
  result: {
    data: {
      label: string;
      data: { year: number; value: number }[];
    }[];
  };
}
