// import axios from "axios";

// const API_BASE_URL = "https://yumemi-frontend-engineer-codecheck-api.vercel.app";

// export const fetchPrefectures = async () => {
//   try {
//     const res = await axios.get(`${API_BASE_URL}/api/v1/prefectures`, {
//       headers: {
//         "X-API-KEY": process.env.API_KEY,
//       },
//     });
//     return res.data.result;
//   } catch (error) {
//     console.error("都道府県データの取得に失敗しました:", error);
//     throw new Error("都道府県データの取得に失敗しました。");
//   }
// };

// export const fetchPopulationData = async (
//   prefectureCode: string,
//   populationType: string
// ) => {
//   try {
//     const res = await axios.get(
//       `${API_BASE_URL}/api/v1/population/composition/perYear`,
//       {
//         params: {
//           prefCode: prefectureCode,
//           populationType: populationType,
//         },
//         headers: {
//           "X-API-KEY": process.env.API_KEY,
//         },
//       }
//     );
//     return res.data;
//   } catch (error) {
//     console.error("人口構成データの取得に失敗しました:", error);
//     throw new Error("人口構成データの取得に失敗しました。");
//   }
// };

export interface PopulationApiResponse {
  result: {
    data: {
      label: string;
      data: { year: number; value: number }[];
    }[];
  };
}
