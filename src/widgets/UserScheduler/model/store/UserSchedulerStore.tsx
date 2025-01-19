import { autorun, makeAutoObservable, reaction, runInAction } from "mobx";
import crashlytics from '@react-native-firebase/crashlytics';
import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import { USER_SCHEDULERS_KEY } from '@src/shared/consts/storage';
import { userSchedulersAdapterStorage } from "@src/shared/lib/storage/adapters/userSchedulersAdapter";
import { DayBlock, DropdownOptions } from "../types/userSchedular";
import { PermissionsAndroid, Platform } from "react-native";
import notifee, { TriggerType, TimestampTrigger } from '@notifee/react-native';
import { notifeeLib } from "@src/shared/lib/notifee/notifee";
import { userStore } from "@src/entities/User";
import { addDays, sub } from "date-fns";

class UserSchedulerStore {
  isUserSchedulerLoading: boolean = true;
  weekdays: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
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
      console.log(storage, "Storage");
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
  }

  scheduleWeeklyNotification(day: string, time: Date, pastTimeMinute: number, weekdays: string[]) {
     let weekday = weekdays.indexOf(day) + 1;
     
     // Get the current date and time
     const scheduleTime = time;
  
     // Find the next occurrence of the target weekday
     const targetDate = addDays(scheduleTime, (weekday - scheduleTime.getDay() + 7) % 7);
  
     const scheduleTimeAgo = sub(targetDate, {minutes: pastTimeMinute});

     return scheduleTimeAgo;
  }

  toggleDaySelection = async (day: string) => {
    if (this.selectedDays.includes(day)) {
      // // Remove item from storage
      // this.removeScheduleStorage(day);
      const dayBlock = this.dayBlocks.find((block) => block.day === day) as DayBlock; 
      const scheduleNotificationId = dayBlock.scheduleNotificationId as string;

      console.log(scheduleNotificationId,"schid");

      await notifeeLib.cancelNotification(scheduleNotificationId);


      runInAction(() => {
        // Remove day from selectedDays and dayBlocks
        this.selectedDays = this.selectedDays.filter((d) => d !== day);
        this.dayBlocks = this.dayBlocks.filter((block) => block.day !== day); 
      })
    } else {
      // Add day to selectedDays and create a new block
      let newBlock: DayBlock =  { day, time: this.scheduleWeeklyNotification(day, new Date(), this.dropdownOptions[0].value, this.weekdays), dropdownValue: this.dropdownOptions[0].value }

      const scheduleNotificationId =  await notifeeLib.scheduleWeeklyNotification(newBlock.time);
      newBlock = {...newBlock, scheduleNotificationId: scheduleNotificationId};

      // // Add item in storage
      // await this.addScheduleStorage(newBlock);

      runInAction(() => {
        this.selectedDays = [...this.selectedDays, day];
        this.dayBlocks = [...this.dayBlocks, newBlock]
      })
    }
  };

  updateDayBlock = async (day: string, field: keyof DayBlock, value: any) => {
    // this.dayBlocks = this.dayBlocks.map((block) =>
    //   block.day === day ? { ...block, [field]: value } : block
    // )


    const dayBlocks = await Promise.all(this.dayBlocks.map(async (block) => {
      if(block.day === day) {
        let newBlock = { ...block, [field]: value }

        if(field !== 'showTimePicker') {
          newBlock.time = this.scheduleWeeklyNotification(day,new Date(newBlock.time),newBlock.dropdownValue,this.weekdays)

          // update Schedule for specific week day
          const oldScheduleNotificationId = block.scheduleNotificationId as string;
          await notifeeLib.cancelNotification(oldScheduleNotificationId);
          const newScheduleNotificationId = await notifeeLib.scheduleWeeklyNotification(newBlock.time);
          newBlock = { ...newBlock, scheduleNotificationId: newScheduleNotificationId } 
        }
      
        return newBlock
      }
      else {  
        return block 
      }
    }))

    runInAction(() => {
      this.dayBlocks = dayBlocks;
    })

  };
}

export default new UserSchedulerStore();