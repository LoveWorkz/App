import axios from "axios"
import { AndroidValidationSendingDataType, IosValidationSendingDataType, PromoCodeResponse, ValidationResponseType } from "../types/inAppPurchaseType";

export const checkPromoCode = async (promoCode: string) => {
    const result = await axios.get<PromoCodeResponse>(`https://checkpromocode-znqlwk3rsq-uc.a.run.app?promoCode=${promoCode}`);
    return result.data;
}

export const validateIos = async (data: IosValidationSendingDataType) => {
    const result = await axios.post<ValidationResponseType>('https://validateios-znqlwk3rsq-uc.a.run.app', {
        requestData: data
    });
    return result.data;
}

export const validateAndroid = async (data: AndroidValidationSendingDataType) => {
    const result = await axios.post<ValidationResponseType>(`https://validateandroid-znqlwk3rsq-uc.a.run.app`, {
        requestData: data
    });
    return result.data;
}