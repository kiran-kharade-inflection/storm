import {
    UserSelectedGoalService
} from '../../../database/repository.services/user.responses/user.selected.goal.service';
import {
    ErrorHandler
} from '../../../common/error.handler';
import {
    Helper
} from '../../../common/helper';
import {
    ApiError
} from '../../../common/api.error';
import {
    UserSelectedGoalValidator as validator
} from './user.selected.goal.validator';
import {
    uuid
} from '../../../domain.types/miscellaneous/system.types';
import {
    UserSelectedGoalCreateModel,
    UserSelectedGoalUpdateModel,
    UserSelectedGoalSearchFilters,
    UserSelectedGoalSearchResults
} from '../../../domain.types/user.responses/user.selected.goal.domain.types';

///////////////////////////////////////////////////////////////////////////////////////

export class UserSelectedGoalControllerDelegate {

    //#region member variables and constructors

    _service: UserSelectedGoalService = null;

    constructor() {
        this._service = new UserSelectedGoalService();
    }

    //#endregion

    create = async (requestBody: any) => {
        await validator.validateCreateRequest(requestBody);
        var createModel: UserSelectedGoalCreateModel = this.getCreateModel(requestBody);
        const record = await this._service.create(createModel);
        if (record === null) {
            throw new ApiError('Unable to create user selected goal!', 400);
        }
        return this.getEnrichedDto(record);
    }

    getById = async (id: uuid) => {
        const record = await this._service.getById(id);
        if (record === null) {
            ErrorHandler.throwNotFoundError('User selected goal with id ' + id.toString() + ' cannot be found!');
        }
        return this.getEnrichedDto(record);
    }

    search = async (query: any) => {
        await validator.validateSearchRequest(query);
        var filters: UserSelectedGoalSearchFilters = this.getSearchFilters(query);
        var searchResults: UserSelectedGoalSearchResults = await this._service.search(filters);
        var items = searchResults.Items.map(x => this.getSearchDto(x));
        searchResults.Items = items;
        return searchResults;
    }

    update = async (id: uuid, requestBody: any) => {
        await validator.validateUpdateRequest(requestBody);
        const record = await this._service.getById(id);
        if (record === null) {
            ErrorHandler.throwNotFoundError('User selected goal with id ' + id.toString() + ' cannot be found!');
        }
        const updateModel: UserSelectedGoalUpdateModel = this.getUpdateModel(requestBody);
        const updated = await this._service.update(id, updateModel);
        if (updated == null) {
            throw new ApiError('Unable to update user selected goal!', 400);
        }
        return this.getEnrichedDto(updated);
    }

    delete = async (id: uuid) => {
        const record = await this._service.getById(id);
        if (record == null) {
            ErrorHandler.throwNotFoundError('User selected goal with id ' + id.toString() + ' cannot be found!');
        }
        const userSelectedGoalDeleted: boolean = await this._service.delete(id);
        return {
            Deleted : userSelectedGoalDeleted
        };
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////

    //#region Privates

    getSearchFilters = (query) => {

        var filters = {};

        var name = query.name ? query.name : null;
        if (name != null) {
            filters['Name'] = name;
        }
        var description = query.description ? query.description : null;
        if (description != null) {
            filters['Description'] = description;
        }
        var careplanId = query.careplanId ? query.careplanId : null;
        if (careplanId != null) {
            filters['CareplanId'] = careplanId;
        }
        var assetId = query.assetId ? query.assetId : null;
        if (assetId != null) {
            filters['AssetId'] = assetId;
        }
        var assetType = query.assetType ? query.assetType : null;
        if (assetType != null) {
            filters['AssetType'] = assetType;
        }
        var additionalDetails = query.additionalDetails ? query.additionalDetails : null;
        if (additionalDetails != null) {
            filters['AdditionalDetails'] = additionalDetails;
        }
        var startDate = query.startDate ? query.startDate : null;
        if (startDate != null) {
            filters['StartDate'] = startDate;
        }
        var endDate = query.endDate ? query.endDate : null;
        if (endDate != null) {
            filters['EndDate'] = endDate;
        }
        var progressStatus = query.progressStatus ? query.progressStatus : null;
        if (progressStatus != null) {
            filters['ProgressStatus'] = progressStatus;
        }

        return filters;
    }

    getUpdateModel = (requestBody): UserSelectedGoalUpdateModel => {

        const updateModel: UserSelectedGoalUpdateModel = {};

        if (Helper.hasProperty(requestBody, 'Name')) {
            updateModel.Name = requestBody.Name;
        }
        if (Helper.hasProperty(requestBody, 'Description')) {
            updateModel.Description = requestBody.Description;
        }
        if (Helper.hasProperty(requestBody, 'UserId')) {
            updateModel.UserId = requestBody.UserId;
        }
        if (Helper.hasProperty(requestBody, 'CareplanId')) {
            updateModel.CareplanId = requestBody.CareplanId;
        }
        if (Helper.hasProperty(requestBody, 'AdditionalDetails')) {
            updateModel.AdditionalDetails = requestBody.AdditionalDetails;
        }
        if (Helper.hasProperty(requestBody, 'StartDate')) {
            updateModel.StartDate = requestBody.StartDate;
        }
        if (Helper.hasProperty(requestBody, 'EndDate')) {
            updateModel.EndDate = requestBody.EndDate;
        }

        return updateModel;
    }

    getCreateModel = (requestBody): UserSelectedGoalCreateModel => {
        return {
            Name              : requestBody.Name ? requestBody.Name : null,
            Description       : requestBody.Description ? requestBody.Description : null,
            UserId            : requestBody.UserId ? requestBody.UserId : null,
            CareplanId        : requestBody.CareplanId ? requestBody.CareplanId : null,
            AdditionalDetails : requestBody.AdditionalDetails ? requestBody.AdditionalDetails : null,
            StartDate         : requestBody.StartDate ? requestBody.StartDate : null,
            EndDate           : requestBody.EndDate ? requestBody.EndDate : null
        };
    }

    getEnrichedDto = (record) => {
        if (record == null) {
            return null;
        }
        return {
            id                : record.id,
            Name              : record.Name,
            Description       : record.Description,
            UserId            : record.UserId,
            CareplanId        : record.CareplanId,
            AssetId           : record.AssetId,
            AssetType         : record.AssetType,
            AdditionalDetails : record.AdditionalDetails,
            StartDate         : record.StartDate,
            EndDate           : record.EndDate,
            ProgressStatus    : record.ProgressStatus
        };
    }

    getSearchDto = (record) => {
        if (record == null) {
            return null;
        }
        return {
            id                : record.id,
            Name              : record.Name,
            Description       : record.Description,
            UserId            : record.UserId,
            CareplanId        : record.CareplanId,
            AssetId           : record.AssetId,
            AssetType         : record.AssetType,
            AdditionalDetails : record.AdditionalDetails,
            StartDate         : record.StartDate,
            EndDate           : record.EndDate,
            ProgressStatus    : record.ProgressStatus
        };
    }

    //#endregion

}
///////////////////////////////////////////////////////////////////////////////////////////////
