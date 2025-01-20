"use client";

import React, { useState, useEffect } from "react";
import Select, { SingleValue } from "react-select";
import { fetchPrefectures, fetchPopulationData, PopulationApiResponse } from "../api";
import PrefectureSelector from "../app/components/PrefectureSelector";
import PopulationChart from "../app/components/PopulationChart";

interface Prefecture {
  prefCode: number;
  prefName: string;
}

interface PopulationData {
  year: number;
  population: number;
  prefecture: string;
}

export default function Page() {
  const [prefectures, setPrefectures] = useState<Prefecture[]>([]);
  const [selectedPrefectures, setSelectedPrefectures] = useState<string[]>([]);
  const [chartData, setChartData] = useState<PopulationData[]>([]);
  const [selectedPopulationType, setSelectedPopulationType] = useState<string>("総人口");

  const populationTypeOptions = [
    { value: "総人口", label: "総人口" },
    { value: "年少人口", label: "年少人口" },
    { value: "生産年齢人口", label: "生産年齢人口" },
    { value: "老年人口", label: "老年人口" },
  ];

  useEffect(() => {
    const loadPrefectures = async () => {
      try {
        const result = await fetchPrefectures();
        setPrefectures(result);
      } catch (error) {
        console.error("都道府県データの読み込みに失敗しました:", error);
      }
    };

    loadPrefectures();
  }, []);

  const fetchAndSetPopulationData = async (
    prefectureCode: number,
    prefectureName: string,
    populationType: string
  ) => {
    try {
      const data: PopulationApiResponse = await fetchPopulationData(prefectureCode, populationType);
      const populationData = data.result.data.find((d) => d.label === populationType);
      if (populationData) {
        const formattedData = populationData.data.map((entry) => ({
          year: entry.year,
          population: entry.value,
          prefecture: prefectureName,
        }));
        setChartData((prev) => [...prev, ...formattedData]);
      }
    } catch (error) {
      console.error("人口構成データの取得に失敗しました:", error);
    }
  };

  const handlePopulationTypeChange = async (
    selectedOption: SingleValue<{ value: string; label: string }>
  ) => {
    const type = selectedOption?.value ?? "";
    setSelectedPopulationType(type);

    const promises = selectedPrefectures.map((prefectureName) => {
      const prefecture = prefectures.find((pref) => pref.prefName === prefectureName);
      if (prefecture) {
        return fetchAndSetPopulationData(prefecture.prefCode, prefectureName, type);
      }
      return Promise.resolve();
    });

    await Promise.all(promises);
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

      <PrefectureSelector
        prefectures={prefectures}
        selectedPrefectures={selectedPrefectures}
        setSelectedPrefectures={setSelectedPrefectures}
        fetchAndSetPopulationData={fetchAndSetPopulationData}
        selectedPopulationType={selectedPopulationType}
        setChartData={setChartData}
      />

      <PopulationChart chartData={chartData} selectedPrefectures={selectedPrefectures} />
    </div>
  );
}
