// src/types/filterTypes.ts

import { filterProps } from "./query";

export interface ExtendedFilterProps extends filterProps {
    filter?: string | null;
    brands?: string | null;
    models?: string | null;
    body_types?: string | null;
    colors?: string | null;
    drive_types?: string | null;
    emission_standards?: string | null;
    enginee_sizes?: string | null;
    enginee_types?: string | null;
    fuel_economies?: string | null;
    interior_colors?: string | null;
    induction_turbos?: string | null;
    number_of_doors?: string | null;
    power_to_weights?: string | null;
    powers?: string | null;
    tow_brakeds?: string | null;
    number_of_seats?: string | null;
    transmissions?: string | null;
    locations?: string | null;
    year_from?: string | null;
    year_to?: string | null;
    odometer_from?: string | null;
    odometer_to?: string | null;
    price_from?: string | null;
    price_to?: string | null;
    safety_from?: string | null;
    safety_to?: string | null;
    user_type?: string | null;
}