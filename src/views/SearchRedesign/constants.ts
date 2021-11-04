import { CatalogSearchSort } from "../../api/catalog-search/constants";
import type { QueryParamKey } from "../../constants/url";

const LIMITS = [25, 50, 75, 100];
export const LIMIT = LIMITS[0];

export type SearchQueryParam = Extract<QueryParamKey, "offset" | "q">;

export const SORT_RENDER_MAP = {
  [CatalogSearchSort.NameAsc]: "A-Z",
  [CatalogSearchSort.NameDesc]: "Z-A",
  [CatalogSearchSort.PublishDateAsc]: "Oldest first",
  [CatalogSearchSort.PublishDateDesc]: "Newest first",
  [CatalogSearchSort.DownloadsDesc]: "Most downloads",
  [CatalogSearchSort.DownloadsAsc]: "Least downloads",
};
