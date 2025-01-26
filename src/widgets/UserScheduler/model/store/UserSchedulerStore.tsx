import { autorun, makeAutoObservable, reaction, runInAction } from "mobx";
import crashlytics from '@react-native-firebase/crashlytics';
import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import { USER_SCHEDULERS_KEY } from '@src/shared/consts/storage';
import { userSchedulersAdapterStorage } from "@src/shared/lib/storage/adapters/userSchedulersAdapter";
import { DayBlock, DropdownOptions } from "../types/userSchedular";
import { PermissionsAndroid, Platform } from "react-native";
import notifee, { TriggerType, TimestampTrigger, AndroidImportance, AndroidNotificationSetting } from '@notifee/react-native';
import { notifeeLib } from "@src/shared/lib/notifee/notifee";
import { userStore } from "@src/entities/User";
import { add, addDays, sub } from "date-fns";

class UserSchedulerStore {
  isUserSchedulerLoading: boolean = true;
  weekdays: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  visibleWeekDays: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  dropdownOptions: DropdownOptions[] = [
    { label: '30m', value: 30 },
    { label: '1h', value: 60 },
    { label: '2h', value: 120 },
    { label: '3h', value: 180 },
    { label: '6h', value: 360 },
    { label: '12h', value: 720 },
    { label: '24h', value: 1440 },
  ];
  selectedDays:string[] = [];
  dayBlocks: DayBlock[] = []; 

  constructor() {
    makeAutoObservable(this)
  
    reaction(() => this.dayBlocks, () => {
      console.log(this.dayBlocks, "<---------------------------------------dayBlcoks");
      
      (async function(){
        const notIds = await notifeeLib.getTriggerNotificationIds()
        console.log(notIds, "<---------------------------------------This is notification ids scheduled by notifee");
      })();
    })
  }

  init = async () => {
    try {
      // userSchedulersAdapterStorage.removeUserSchedulers(USER_SCHEDULERS_KEY);
      // await notifeeLib.cancelAllNotifications();

      let storage = await userSchedulersAdapterStorage.getUserSchedulers(USER_SCHEDULERS_KEY);
      // console.log(storage, "storage");

      if(storage) {
        let newStorage = JSON.parse(storage);
        let newStorageUser = newStorage.find((userData: { userId: string; }) => userData.userId === userStore.userId); 

        let selectedDays: string[] = [];

        if(newStorageUser) {
          selectedDays = newStorageUser.data.map((data: { day: any; }) => data.day);
        }

        if(newStorageUser) {
          runInAction(() => {
            this.dayBlocks = newStorageUser.data;
            this.selectedDays = selectedDays;
          });
        }

        console.log(this.dayBlocks, "this.dayBlocks")
        console.log( this.selectedDays , "this.selectedDays")
      }

      runInAction(() => {
        this.isUserSchedulerLoading = false;
      });
  
    } catch (e) {
      errorHandler({error: e});
    } finally {
      runInAction(() => {
        this.isUserSchedulerLoading = false;
      });
    }
  }


  quit = async () => {
    if(!this.selectedDays) return;

    const storage = await userSchedulersAdapterStorage.getUserSchedulers(USER_SCHEDULERS_KEY);
    const newStorage: string | { userId: string; data: DayBlock[]; }[] = [];

    if(!storage) {
      newStorage.push({
        userId: userStore.userId,
        data: this.dayBlocks
      });

      await userSchedulersAdapterStorage.setUserSchedulers(USER_SCHEDULERS_KEY, JSON.stringify(newStorage));
      return;
    } 

    const storageParse = JSON.parse(storage);
    const storageUser = storageParse.find((userData: { userId: string; }) => userData.userId === userStore.userId);

    if(storageUser) {
      storageUser.data = this.dayBlocks
      await userSchedulersAdapterStorage.setUserSchedulers(USER_SCHEDULERS_KEY, JSON.stringify(storageParse));
      return;
    }

    // create new user
    storageParse.push({
      userId: userStore.userId,
      data: this.dayBlocks
    });

    await userSchedulersAdapterStorage.setUserSchedulers(USER_SCHEDULERS_KEY, JSON.stringify(storageParse));
  }

  scheduleWeeklyNotification(
    day: string,
    originalTime: Date,
    pastTimeMinute: number,
    weekdays: string[]
  ) {
    const weekday = weekdays.indexOf(day) + 1; // 1-based index for weekday
    const now = new Date();
  
    let scheduleTime = new Date(originalTime);
    const currentWeekday = now.getDay();
  
    let daysToAdd = (weekday - currentWeekday + 7) % 7;
  
    if (daysToAdd === 0 && scheduleTime.getTime() > now.getTime()) {
      scheduleTime.setDate(now.getDate());
    } else {
      scheduleTime.setDate(now.getDate() + daysToAdd);
    }
  
    const adjustedTime = new Date(scheduleTime.getTime() - pastTimeMinute * 60 * 1000);
  
    if (adjustedTime <= now) {
      adjustedTime.setDate(adjustedTime.getDate() + 7);
    }
  
    return adjustedTime;
  }  
  
  toggleDaySelection = async (day: string) => {
    if (this.selectedDays.includes(day)) {
      // Find the block to cancel the notification
      const dayBlock = this.dayBlocks.find((block) => block.day === day) as DayBlock;
      const scheduleNotificationId = dayBlock.scheduleNotificationId as string;
  
      // Cancel the notification
      await notifeeLib.cancelNotification(scheduleNotificationId);
  
      runInAction(() => {
        // Remove day from selectedDays and dayBlocks
        this.selectedDays = this.selectedDays.filter((d) => d !== day);
        this.dayBlocks = this.dayBlocks.filter((block) => block.day !== day);
      });
    } else {
      // Create a new block with the default dropdown value and original time
      const newBlock: DayBlock = {
        day,
        time: new Date(), // Default to current time for the picker
        dropdownValue: this.dropdownOptions[0].value,
      };
  
      // Calculate the notification time based on the dropdown value
      const notificationTime = this.scheduleWeeklyNotification(
        day,
        newBlock.time,
        newBlock.dropdownValue,
        this.weekdays
      );

      const settings = await notifee.getNotificationSettings();
      if (settings.android.alarm !== AndroidNotificationSetting.ENABLED) {
        await notifee.openAlarmPermissionSettings();
      }
  
      // Schedule the notification
      const scheduleNotificationId = await notifeeLib.scheduleWeeklyNotification(
        notificationTime,
        newBlock.time
      );
  
      runInAction(() => {
        // Add the new block and update selectedDays
        this.selectedDays = [...this.selectedDays, day];
        this.dayBlocks = [...this.dayBlocks, { ...newBlock, scheduleNotificationId }];
      });
    }
  };
  

  updateDayBlock = async (day: string, field: keyof DayBlock, value: any) => {
    const updatedDayBlocks = await Promise.all(
      this.dayBlocks.map(async (block) => {
        if (block.day === day) {
          let updatedBlock = { ...block, [field]: value };
  
          // Trigger notification only for relevant fields
          if (field === 'dropdownValue' || field === 'time') {
            const notificationTime = this.scheduleWeeklyNotification(
              day,
              updatedBlock.time, // Use the unmodified `time`
              updatedBlock.dropdownValue,
              this.weekdays
            );
  
            // Cancel the old notification
            if (block.scheduleNotificationId) {
              await notifeeLib.cancelNotification(block.scheduleNotificationId);
            }
  
            // Schedule a new notification and update the notification ID
            const newScheduleNotificationId = await notifeeLib.scheduleWeeklyNotification(
              notificationTime,
              updatedBlock.time
            );
  
            updatedBlock = { ...updatedBlock, scheduleNotificationId: newScheduleNotificationId };
          }
  
          return updatedBlock;
        }
        return block; // Leave other blocks unchanged
      })
    );
  
    runInAction(() => {
      this.dayBlocks = updatedDayBlocks;
    });
  };
  
}

export default new UserSchedulerStore();