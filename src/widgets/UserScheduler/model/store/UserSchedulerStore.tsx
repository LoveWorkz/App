import { makeAutoObservable, runInAction } from "mobx";
import crashlytics from '@react-native-firebase/crashlytics';
import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import { USER_SCHEDULERS_KEY } from '@src/shared/consts/storage';
import { userSchedulersAdapterStorage } from "@src/shared/lib/storage/adapters/userSchedulersAdapter";
import { DayBlock, DropdownOptions } from "../types/userSchedular";
import { PermissionsAndroid, Platform } from "react-native";
import notifee, { TriggerType, TimestampTrigger } from '@notifee/react-native';
import { notifeeLib } from "@src/shared/lib/notifee/notifee";
import { userStore } from "@src/entities/User";

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
  }

  init = async () => {
    try {
      crashlytics().log('Fetching user schedulers');
      
      userSchedulersAdapterStorage.removeUserSchedulers(USER_SCHEDULERS_KEY);
      await notifeeLib.cancelAllNotifications();
      let d = await notifeeLib.getTriggerNotificationIds();
      console.log(d, "getTriggerNotificationIds")

      // console.log("userId", userStore.userId)

      let storage = await userSchedulersAdapterStorage.getUserSchedulers(USER_SCHEDULERS_KEY);
      if(storage) {
        let newStorage = JSON.parse(storage);
        let newStorageUser = newStorage.find((userData: { userId: string; }) => userData.userId === userStore.userId); 

        console.log(newStorageUser, "newStorage");
        console.log(this.selectedDays, "selectedDays");

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

  async removeScheduleStorage(day: string) {
    let storage = await userSchedulersAdapterStorage.getUserSchedulers(USER_SCHEDULERS_KEY) as string;
    let newStorage = JSON.parse(storage);
    let newStorageUser = newStorage.find((userData: { userId: string; }) => userData.userId === userStore.userId);

    newStorageUser.data = newStorageUser.data.filter((userData: { day: string; }) => userData.day !== day)

    await userSchedulersAdapterStorage.setUserSchedulers(USER_SCHEDULERS_KEY, JSON.stringify(newStorage));

    storage = await userSchedulersAdapterStorage.getUserSchedulers(USER_SCHEDULERS_KEY) as string;

    console.log(storage, "remove")
  }

  updateScheduleStorage() {
    
  }

  async addScheduleStorage(newBlock: DayBlock) {
    let storage = await userSchedulersAdapterStorage.getUserSchedulers(USER_SCHEDULERS_KEY);
    let newStorage;

    if(!storage) {
      // crete storage if null
      newStorage = [];

      newStorage.push({
        userId: userStore.userId,
        data: [newBlock]
      })

      await userSchedulersAdapterStorage.setUserSchedulers(USER_SCHEDULERS_KEY, JSON.stringify(newStorage));

      storage = await userSchedulersAdapterStorage.getUserSchedulers(USER_SCHEDULERS_KEY);
      console.log(storage);
      return;
    }

    newStorage = JSON.parse(storage);
    let newStorageUser = newStorage.find((userData: { userId: string; }) => userData.userId === userStore.userId);


    if(newStorageUser) {
      newStorageUser.data.push(
        newBlock 
      )
      await userSchedulersAdapterStorage.setUserSchedulers(USER_SCHEDULERS_KEY, JSON.stringify(newStorage));

      storage = await userSchedulersAdapterStorage.getUserSchedulers(USER_SCHEDULERS_KEY);
      console.log(storage);
      return;
    }


    // New user logic
    newStorage.push({
      userId: userStore.userId,
      data: [newBlock]
    })
    
    await userSchedulersAdapterStorage.setUserSchedulers(USER_SCHEDULERS_KEY, JSON.stringify(newStorage));

    storage = await userSchedulersAdapterStorage.getUserSchedulers(USER_SCHEDULERS_KEY);
    console.log(storage);
  }

  toggleDaySelection = async (day: string) => {

    console.log(this.selectedDays, "this.selectedDays")
    if (this.selectedDays.includes(day)) {
      // Remove day from selectedDays and dayBlocks
      this.selectedDays = this.selectedDays.filter((d) => d !== day);
      this.dayBlocks = this.dayBlocks.filter((block) => block.day !== day); 


      // Remove item from storage
      this.removeScheduleStorage(day);
    } else {
      // Add day to selectedDays and create a new block
      this.selectedDays = [...this.selectedDays, day];
      let newBlock: DayBlock =  { day, time: new Date(), dropdownValue: this.dropdownOptions[0].value }

      const scheduleNotificationId =  await notifeeLib.scheduleWeeklyNotification(newBlock.day, newBlock.time, newBlock.dropdownValue, this.weekdays);
      console.log(scheduleNotificationId, "scheduleNotificationId")

      newBlock = {...newBlock, scheduleNotificationId: scheduleNotificationId};


      // // Add item in storage

      await this.addScheduleStorage(newBlock);


      runInAction(() => {
        this.dayBlocks = [...this.dayBlocks, newBlock]
      })
    }
  };

  updateDayBlock = (day: string, field: keyof DayBlock, value: any) => {
    this.dayBlocks = this.dayBlocks.map((block) =>
      block.day === day ? { ...block, [field]: value } : block
    )

    // let storage 

  };
}

export default new UserSchedulerStore();