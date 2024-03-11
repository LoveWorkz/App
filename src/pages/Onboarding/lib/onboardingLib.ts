import { AppRouteNames } from "@src/shared/config/route/configRoute";
import { HAS_COMPLETED_ONBOARDING_KEY } from "@src/shared/consts/storage";
import { navigation } from "@src/shared/lib/navigation/navigation";
import { onboardingStorage } from "@src/shared/lib/storage/adapters/onboardingAdapter";

export const setOnboardingStatusAndNavigate = async () => {
    await onboardingStorage.setOnboardingData(HAS_COMPLETED_ONBOARDING_KEY, JSON.stringify(true));
    navigation.resetHistoryAndNavigate(AppRouteNames.AUTH);
}