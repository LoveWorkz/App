import axios from "axios"
import { IosValidationSendingDataType, PromoCodeResponse, ValidationResponseType } from "../types/inAppPurchaseType";

export const checkPromoCode = async (promoCode: string) => {
    const result = await axios.get<PromoCodeResponse>(`https://helloworld-znqlwk3rsq-uc.a.run.app?promoCode=${promoCode}`);
    return result.data;
}

export const validateIos = async (data: IosValidationSendingDataType) => {
    const result = await axios.get<ValidationResponseType>(``);
    return result.data;
}

export const validateAndroid = async (token: string) => {
    const result = await axios.get<ValidationResponseType>(``);
    return result.data;
}