import {
    BaseSearchFilters,
    BaseSearchResults
} from "../miscellaneous/base.search.types";
import {
    uuid
} from "../miscellaneous/system.types";

export interface PhysiotherapyCreateModel {
    AssetCode ? : string;
    Name ? : string;
    Description ? : string;
    RecommendedDurationMin ? : number;
    Tags ? : string;
    Version ? : string;
}

export interface PhysiotherapyUpdateModel {
    AssetCode ? : string;
    Name ? : string;
    Description ? : string;
    RecommendedDurationMin ? : number;
    Tags ? : string;
    Version ? : string;
}

export interface PhysiotherapyDto {
    id: number;
    AssetCode: string;
    Name: string;
    Description: string;
    RecommendedDurationMin: number;
    AssetCategory: string;
    OwnerUserId: uuid;
    Tags: string[];
    Version: string;

}

export interface PhysiotherapySearchFilters extends BaseSearchFilters {
    AssetCode ? : string;
    Name ? : string;
    Description ? : string;
    RecommendedDurationMin ? : number;
    AssetCategory ? : string;
    Tags ? : string;
    Version ? : string;
}

export interface PhysiotherapySearchResults extends BaseSearchResults {
    Items: PhysiotherapyDto[];
}