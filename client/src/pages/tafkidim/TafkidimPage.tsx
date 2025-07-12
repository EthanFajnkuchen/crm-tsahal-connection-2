import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchTafkidimThunk } from "@/store/thunks/tafkidim/tafkidim.thunk";
import TafkidimColumn from "@/components/app-components/tafkidim-colum /TafkidimColumn";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import ProtectedComponent from "@/components/app-components/protected-component/protected-component";

const CATEGORIES = [
  { key: "Jobnik", label: "Jobnik" },
  { key: "Tomeh Lehima", label: "Tomeh Lehima" },
  { key: "Lohem", label: "Lohem" },
];

const TafkidimPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, isLoading, error } = useSelector(
    (state: RootState) => state.tafkidim
  );
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchTafkidimThunk());
  }, [dispatch]);

  const filteredData = useMemo(() => {
    if (!data) return null;
    if (!search.trim()) return data;
    const lower = search.toLowerCase();
    const filterLeads = (leads: any[]) =>
      leads.filter(
        (lead) =>
          lead.fullName.toLowerCase().includes(lower) ||
          (lead.nomPoste && lead.nomPoste.toLowerCase().includes(lower))
      );
    return {
      Jobnik: { ...data.Jobnik, leads: filterLeads(data.Jobnik.leads) },
      "Tomeh Lehima": {
        ...data["Tomeh Lehima"],
        leads: filterLeads(data["Tomeh Lehima"].leads),
      },
      Lohem: { ...data.Lohem, leads: filterLeads(data.Lohem.leads) },
    };
  }, [data, search]);

  return (
    <ProtectedComponent showUnauthorizedMessage={true}>
      <div className="p-6 font-[Poppins]">
        <div className="flex justify-center mb-6">
          <div className="relative w-2/3">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground text-fuchsia-800 font-bold" />
            <Input
              className="w-full p-2 rounded border bg-white "
              style={{ paddingLeft: "2.5rem" }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un poste ou un soldat"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto ">
          {CATEGORIES.map((cat) => (
            <TafkidimColumn
              key={cat.key}
              title={cat.label}
              leads={
                filteredData
                  ? filteredData[cat.key as keyof typeof filteredData].leads
                  : []
              }
              total={
                filteredData
                  ? filteredData[cat.key as keyof typeof filteredData].leads
                      .length
                  : 0
              }
              isLoading={isLoading}
              error={error || ""}
            />
          ))}
        </div>
      </div>
    </ProtectedComponent>
  );
};

export default TafkidimPage;
