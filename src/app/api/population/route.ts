import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const API_BASE_URL = "https://yumemi-frontend-engineer-codecheck-api.vercel.app";
const API_KEY = process.env.API_KEY;

export const fetchPrefectures = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/v1/prefectures`, {
      headers: {
        "X-API-KEY": API_KEY,
      },
    });
    return res.data.result;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data);
    } else {
      console.error("General error:", error);
    }
    throw new Error("都道府県データの取得に失敗しました");
  }
};

export const fetchPopulationData = async (prefectureCode: number, populationType: string) => {
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
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("人口構成データの取得に失敗しました:", error.message);
      throw new Error(`人口構成データの取得に失敗しました: ${error.message}`);
    }
    console.error("人口構成データの取得に失敗しました:", error);
    throw new Error("人口構成データの取得に失敗しました。");
  }
};

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const type = url.searchParams.get("type");

  if (type === "prefectures") {
    try {
      const prefectures = await fetchPrefectures();
      return NextResponse.json(prefectures);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return NextResponse.json({ message: `都道府県データ取得に失敗しました: ${error.message}` }, { status: 500 });
      }
      return NextResponse.json({ message: "都道府県データ取得に失敗しました" }, { status: 500 });
    }
  } else {
    const prefCode = url.searchParams.get("prefCode");
    const prefName = url.searchParams.get("prefName");
    const populationType = url.searchParams.get("populationType");

    if (!prefCode || !prefName) {
      return NextResponse.json({ message: "都道府県コードと名前が必要です" }, { status: 400 });
    }

    const prefCodeNumber = parseInt(prefCode, 10);
    if (isNaN(prefCodeNumber)) {
      return NextResponse.json({ message: "有効な都道府県コードを指定してください" }, { status: 400 });
    }

    const selectedPopulationType = populationType || "total";

    try {
      const populationData = await fetchPopulationData(prefCodeNumber, selectedPopulationType);
      return NextResponse.json(populationData);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return NextResponse.json({ message: `データ取得に失敗しました: ${error.message}` }, { status: 500 });
      }
      return NextResponse.json({ message: "データ取得に失敗しました" }, { status: 500 });
    }
  }
}
