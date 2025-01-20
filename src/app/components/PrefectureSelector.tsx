import React from "react";

interface Prefecture {
  prefCode: number;
  prefName: string;
}

interface PopulationData {
  year: number;
  population: number;
  prefecture: string;
}

interface PrefectureSelectorProps {
  prefectures: Prefecture[];
  selectedPrefectures: string[];
  setSelectedPrefectures: React.Dispatch<React.SetStateAction<string[]>>;
  fetchAndSetPopulationData: (
    prefectureCode: number,
    prefectureName: string,
    populationType: string
  ) => Promise<void>;
  selectedPopulationType: string;
  setChartData: React.Dispatch<React.SetStateAction<PopulationData[]>>;
}

const PrefectureSelector: React.FC<PrefectureSelectorProps> = ({
  prefectures,
  selectedPrefectures,
  setSelectedPrefectures,
  fetchAndSetPopulationData,
  selectedPopulationType,
  setChartData,
}) => {
  const handleCheckboxChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;

    if (checked) {
      setSelectedPrefectures((prev) => [...prev, value]);
      const prefecture = prefectures.find((pref) => pref.prefName === value);
      if (prefecture) {
        await fetchAndSetPopulationData(prefecture.prefCode, value, selectedPopulationType);
      }
    } else {
      setSelectedPrefectures((prev) => prev.filter((pref) => pref !== value));
      setChartData((prev) => prev.filter((data) => data.prefecture !== value));
    }
  };

  return (
    <div className="grid grid-cols-5 gap-4 mb-6">
      {prefectures.map((prefecture) => (
        <div key={prefecture.prefCode} className="flex items-center">
          <input
            type="checkbox"
            id={`prefecture-${prefecture.prefCode}`}
            value={prefecture.prefName}
            onChange={handleCheckboxChange}
            checked={selectedPrefectures.includes(prefecture.prefName)}
            className="mr-2"
          />
          <label htmlFor={`prefecture-${prefecture.prefCode}`}>{prefecture.prefName}</label>
        </div>
      ))}
    </div>
  );
};

export default PrefectureSelector;
