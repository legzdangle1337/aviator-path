import { useSearchParams } from "react-router-dom";
import { useCallback, useMemo } from "react";

export interface SchoolFilters {
  search: string;
  state: string;
  partType: string;
  costMin: number;
  costMax: number;
  partnerships: string[];
  hasG1000: boolean;
  hasTaa: boolean;
  hasMultiEngine: boolean;
  hasSimulator: boolean;
  housingAvailable: boolean;
  editorsPick: boolean;
  claimedOnly: boolean;
  minVfrDays: number;
  minRating: number;
  sort: string;
  page: number;
}

const DEFAULT_FILTERS: SchoolFilters = {
  search: "",
  state: "",
  partType: "",
  costMin: 50000,
  costMax: 150000,
  partnerships: [],
  hasG1000: false,
  hasTaa: false,
  hasMultiEngine: false,
  hasSimulator: false,
  housingAvailable: false,
  editorsPick: false,
  claimedOnly: false,
  minVfrDays: 100,
  minRating: 0,
  sort: "best_match",
  page: 1,
};

const PARTNERSHIP_KEYS = [
  "skywest_elite",
  "united_aviate",
  "southwest_d225",
  "delta_propel",
  "envoy_cadet",
  "gojet_academy",
  "psa_pathway",
  "piedmont_pathway",
  "any_partnership",
] as const;

export function useSchoolFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: SchoolFilters = useMemo(() => {
    const p = searchParams;
    return {
      state: p.get("state") || "",
      partType: p.get("part") || "",
      costMin: Number(p.get("costMin")) || DEFAULT_FILTERS.costMin,
      costMax: Number(p.get("costMax")) || DEFAULT_FILTERS.costMax,
      partnerships: p.get("partnerships")?.split(",").filter(Boolean) || [],
      hasG1000: p.get("g1000") === "true",
      hasTaa: p.get("taa") === "true",
      hasMultiEngine: p.get("multi") === "true",
      hasSimulator: p.get("sim") === "true",
      housingAvailable: p.get("housing") === "true",
      editorsPick: p.get("editors") === "true",
      claimedOnly: p.get("claimed") === "true",
      minVfrDays: Number(p.get("vfr")) || DEFAULT_FILTERS.minVfrDays,
      minRating: Number(p.get("rating")) || 0,
      sort: p.get("sort") || "best_match",
      page: Number(p.get("page")) || 1,
    };
  }, [searchParams]);

  const setFilters = useCallback(
    (updater: Partial<SchoolFilters> | ((prev: SchoolFilters) => Partial<SchoolFilters>)) => {
      setSearchParams((prev) => {
        const currentFilters: SchoolFilters = {
          state: prev.get("state") || "",
          partType: prev.get("part") || "",
          costMin: Number(prev.get("costMin")) || DEFAULT_FILTERS.costMin,
          costMax: Number(prev.get("costMax")) || DEFAULT_FILTERS.costMax,
          partnerships: prev.get("partnerships")?.split(",").filter(Boolean) || [],
          hasG1000: prev.get("g1000") === "true",
          hasTaa: prev.get("taa") === "true",
          hasMultiEngine: prev.get("multi") === "true",
          hasSimulator: prev.get("sim") === "true",
          housingAvailable: prev.get("housing") === "true",
          editorsPick: prev.get("editors") === "true",
          claimedOnly: prev.get("claimed") === "true",
          minVfrDays: Number(prev.get("vfr")) || DEFAULT_FILTERS.minVfrDays,
          minRating: Number(prev.get("rating")) || 0,
          sort: prev.get("sort") || "best_match",
          page: Number(prev.get("page")) || 1,
        };

        const updates = typeof updater === "function" ? updater(currentFilters) : updater;
        const merged = { ...currentFilters, ...updates, page: updates.page ?? 1 };

        const params = new URLSearchParams();
        if (merged.state) params.set("state", merged.state);
        if (merged.partType) params.set("part", merged.partType);
        if (merged.costMin !== DEFAULT_FILTERS.costMin) params.set("costMin", String(merged.costMin));
        if (merged.costMax !== DEFAULT_FILTERS.costMax) params.set("costMax", String(merged.costMax));
        if (merged.partnerships.length) params.set("partnerships", merged.partnerships.join(","));
        if (merged.hasG1000) params.set("g1000", "true");
        if (merged.hasTaa) params.set("taa", "true");
        if (merged.hasMultiEngine) params.set("multi", "true");
        if (merged.hasSimulator) params.set("sim", "true");
        if (merged.housingAvailable) params.set("housing", "true");
        if (merged.editorsPick) params.set("editors", "true");
        if (merged.claimedOnly) params.set("claimed", "true");
        if (merged.minVfrDays !== DEFAULT_FILTERS.minVfrDays) params.set("vfr", String(merged.minVfrDays));
        if (merged.minRating > 0) params.set("rating", String(merged.minRating));
        if (merged.sort !== "best_match") params.set("sort", merged.sort);
        if (merged.page > 1) params.set("page", String(merged.page));
        return params;
      }, { replace: true });
    },
    [setSearchParams]
  );

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.state) count++;
    if (filters.partType) count++;
    if (filters.costMin !== DEFAULT_FILTERS.costMin || filters.costMax !== DEFAULT_FILTERS.costMax) count++;
    if (filters.partnerships.length) count++;
    if (filters.hasG1000 || filters.hasTaa || filters.hasMultiEngine || filters.hasSimulator) count++;
    if (filters.housingAvailable || filters.editorsPick || filters.claimedOnly) count++;
    if (filters.minVfrDays !== DEFAULT_FILTERS.minVfrDays) count++;
    if (filters.minRating > 0) count++;
    return count;
  }, [filters]);

  const clearFilters = useCallback(() => {
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  return { filters, setFilters, activeFilterCount, clearFilters, PARTNERSHIP_KEYS };
}

export const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY",
];

export const STATE_NAMES: Record<string, string> = {
  AL:"Alabama",AK:"Alaska",AZ:"Arizona",AR:"Arkansas",CA:"California",CO:"Colorado",
  CT:"Connecticut",DE:"Delaware",FL:"Florida",GA:"Georgia",HI:"Hawaii",ID:"Idaho",
  IL:"Illinois",IN:"Indiana",IA:"Iowa",KS:"Kansas",KY:"Kentucky",LA:"Louisiana",
  ME:"Maine",MD:"Maryland",MA:"Massachusetts",MI:"Michigan",MN:"Minnesota",
  MS:"Mississippi",MO:"Missouri",MT:"Montana",NE:"Nebraska",NV:"Nevada",NH:"New Hampshire",
  NJ:"New Jersey",NM:"New Mexico",NY:"New York",NC:"North Carolina",ND:"North Dakota",
  OH:"Ohio",OK:"Oklahoma",OR:"Oregon",PA:"Pennsylvania",RI:"Rhode Island",SC:"South Carolina",
  SD:"South Dakota",TN:"Tennessee",TX:"Texas",UT:"Utah",VT:"Vermont",VA:"Virginia",
  WA:"Washington",WV:"West Virginia",WI:"Wisconsin",WY:"Wyoming",
};
