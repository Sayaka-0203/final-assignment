import { NextRequest, NextResponse } from "next/server";
import { fetchPopulationData } from "../../../api";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const prefecture = url.searchParams.get("prefecture");
  const populationType = url.searchParams.get("populationType");

  if (!prefecture) {
    return NextResponse.json({ message: "都道府県名が必要です" }, { status: 400 });
  }

  const selectedPopulationType = populationType || "total";

  try {
    const populationData = await fetchPopulationData(prefecture, selectedPopulationType);
    return NextResponse.json(populationData);
  } catch {
    return NextResponse.json({ message: "データ取得に失敗しました" }, { status: 500 });
  }
}
