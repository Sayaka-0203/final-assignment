"use client";

import React, { useState } from "react";
import axios from "axios";
import Select, { SingleValue } from "react-select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const prefectureCodeMap: Record<string, number> = {
  北海道: 1,
  青森県: 2,
  岩手県: 3,
  宮城県: 4,
  秋田県: 5,
  山形県: 6,
  福島県: 7,
  茨城県: 8,
  栃木県: 9,
  群馬県: 10,
  埼玉県: 11,
  千葉県: 12,
  東京都: 13,
  神奈川県: 14,
  新潟県: 15,
  富山県: 16,
  石川県: 17,
  福井県: 18,
  山梨県: 19,
  長野県: 20,
  岐阜県: 21,
  静岡県: 22,
  愛知県: 23,
  三重県: 24,
  滋賀県: 25,
  京都府: 26,
  大阪府: 27,
  兵庫県: 28,
  奈良県: 29,
  和歌山県: 30,
  鳥取県: 31,
  島根県: 32,
  岡山県: 33,
  広島県: 34,
  山口県: 35,
  徳島県: 36,
  香川県: 37,
  愛媛県: 38,
};

interface Prefecture {
  id: number;
  name: string;
}

interface PopulationData {
  year: number;
  population: number;
}

interface PopulationApiResponse {
  result: {
    data: {
      label: string;
      data: { year: number; value: number }[];
    }[];
  };
}

const prefectures: Prefecture[] = Object.keys(prefectureCodeMap).map((key) => ({
  id: prefectureCodeMap[key],
  name: key,
}));

export default function Page() {
  const [selectedPrefecture, setSelectedPrefecture] = useState<string | null>(null);
  const [chartData, setChartData] = useState<PopulationData[]>([]);
  const [selectedPopulationType, setSelectedPopulationType] = useState<string>("総人口");

  const populationTypeOptions = [
    { value: "総人口", label: "総人口" },
    { value: "年少人口", label: "年少人口" },
    { value: "生産年齢人口", label: "生産年齢人口" },
    { value: "老年人口", label: "老年人口" },
  ];

  const handleCheckboxChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedPrefecture(value);
      await fetchPopulationData(value, selectedPopulationType);
    } else {
      setSelectedPrefecture(null);
      setChartData([]);
    }
  };

  const handlePopulationTypeChange = async (
    selectedOption: SingleValue<{ value: string; label: string }>
  ) => {
    const type = selectedOption?.value ?? "";
    setSelectedPopulationType(type);

    if (selectedPrefecture) {
      await fetchPopulationData(selectedPrefecture, type);
    }
  };

  const fetchPopulationData = async (prefectureName: string, populationType: string) => {
    try {
      const prefectureCode = prefectureCodeMap[prefectureName];
      const res = await axios.get<PopulationApiResponse>(
        `https://yumemi-frontend-engineer-codecheck-api.vercel.app/api/v1/population/composition/perYear`,
        {
          params: { prefCode: prefectureCode },
          headers: { "X-API-KEY": "8FzX5qLmN3wRtKjH7vCyP9bGdEaU4sYpT6cMfZnJ" },
        }
      );

      const populationData = res.data.result.data.find(
        (data) => data.label === populationType
      );

      if (populationData) {
        const formattedData = populationData.data.map((entry) => ({
          year: entry.year,
          population: entry.value,
        }));
        setChartData(formattedData);
      }
    } catch (error) {
      console.error("人口構成データの取得に失敗しました:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">都道府県一覧</h1>

      <div className="mb-4">
        <label htmlFor="population-type" className="mr-2">
          人口タイプ:
        </label>
        <Select
          instanceId="population-type-select"
          options={populationTypeOptions}
          defaultValue={populationTypeOptions[0]}
          onChange={handlePopulationTypeChange}
          className="w-64"
        />
      </div>

      <div className="grid grid-cols-5 gap-4 mb-6">
        {prefectures.map((prefecture) => (
          <div key={prefecture.id} className="flex items-center">
            <input
              type="checkbox"
              id={`prefecture-${prefecture.id}`}
              value={prefecture.name}
              onChange={handleCheckboxChange}
              checked={selectedPrefecture === prefecture.name}
              className="mr-2"
            />
            <label htmlFor={`prefecture-${prefecture.id}`}>{prefecture.name}</label>
          </div>
        ))}
      </div>

      {chartData.length > 0 && (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="population"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
