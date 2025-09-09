import {createLoader, parseAsInteger,parseAsString} from "nuqs/server";
import { DEFAULT_PAGE } from "@/constant";

export const FiltreSearchParams={
    search: parseAsString
      .withDefault("")
      .withOptions({ clearOnDefault: true }),
    page: parseAsInteger
      .withDefault(DEFAULT_PAGE)
      .withOptions({ clearOnDefault: true }),
};
export const LoadSearchParams=createLoader(FiltreSearchParams);

