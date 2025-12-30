import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import MahzorGiyusCard from "@/components/app-components/mahzor-giyus-card/mahzor-giyus-card";
import { fetchMahzorGiyusCountsThunk } from "@/store/thunks/mahzor-giyus/mahzor-giyus.thunk";
import AccordionSection from "@/components/app-components/accordion-section/accordion-section";
import MahzorGiyusSkeletonSection from "@/components/app-components/mahzor-giyus-skeleton/mahzor-giyus-skeleton";
import { useNavigate } from "react-router-dom";

const REQUIRED_MONTHS = ["Mars", "Aout", "Novembre"];
const MONTH_COLORS: Record<string, { bg: string; text: string }> = {
  Mars: { bg: "bg-[#3838eb]", text: "text-[#3838eb]" },
  Aout: { bg: "bg-[#b333e2]", text: "text-[#b333e2]" },
  Novembre: { bg: "bg-[#31ad6d]", text: "text-[#31ad6d]" },
};

const MahzorGiyus: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { data, isLoading, error } = useSelector(
    (state: RootState) => state.mahzorGiyus
  );

  useEffect(() => {
    dispatch(fetchMahzorGiyusCountsThunk());
  }, [dispatch]);

  const handleCardClick = (key: string) => {
    navigate(`/mahzor-giyus/${encodeURIComponent(key)}`);
  };

  if (isLoading || error) {
    return (
      <div className="space-y-8">
        {[1, 2].map((i) => (
          <MahzorGiyusSkeletonSection key={i} />
        ))}
      </div>
    );
  }
  if (!data) return <div>No data available.</div>;

  return (
    <div className="space-y-8">
      {Object.entries(data).map(([year, periods]) => {
        const yearNumber = year.split(" ").pop();

        return (
          <AccordionSection key={year} title={year}>
            <div className="flex flex-col items-center space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-20 gap-y-8">
                {REQUIRED_MONTHS.map((month) => {
                  const key = `${month} ${yearNumber} - Olim / Mahal Hesder`;
                  const periodData = periods[key] || { count: 0, leads: [] };
                  const colorClass = MONTH_COLORS[month] || "bg-gray-500";

                  return (
                    <div key={key} onClick={() => handleCardClick(key)}>
                      <MahzorGiyusCard
                        count={periodData.count}
                        period={key}
                        colorClass={colorClass.bg}
                        textColor={colorClass.text}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-20 gap-y-8">
                {REQUIRED_MONTHS.map((month) => {
                  const key = `${month} ${yearNumber} - Mahal Nahal / Mahal Haredi`;
                  const periodData = periods[key] || { count: 0, leads: [] };
                  const colorClass = MONTH_COLORS[month] || "bg-gray-500";

                  return (
                    <div key={key} onClick={() => handleCardClick(key)}>
                      <MahzorGiyusCard
                        count={periodData.count}
                        period={key}
                        colorClass={colorClass.bg}
                        textColor={colorClass.text}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </AccordionSection>
        );
      })}
    </div>
  );
};

export default MahzorGiyus;
