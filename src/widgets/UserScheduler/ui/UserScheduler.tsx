import React, { memo, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ListRenderItem,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import { observer } from 'mobx-react-lite';
import userSchedulerStore from '../model/store/UserSchedulerStore';
import { DropdownOptions } from '../model/types/userSchedular';
import { notifeeLib } from '@src/shared/lib/notifee/notifee';
import { useFocusEffect } from '@react-navigation/native';
// Define types for a single day block
type DayBlock = {
  day: string;
  time: Date;
  dropdownValue: string | null;
  showTimePicker?: boolean;
};

const UserScheduler: React.FC = () => {

  useEffect(() => {
    userSchedulerStore.init();

    console.log("into page")

    return (() => {

      userSchedulerStore.quit();
      console.log("left page");
    })
  },[]);

  function isValidDate(date: any): boolean {
    return date && !isNaN(new Date(date).getTime());
  }

  const weekdays = userSchedulerStore.weekdays;
  const dropdownOptions = userSchedulerStore.dropdownOptions;
  const selectedDays = userSchedulerStore.selectedDays;
  const dayBlocks = userSchedulerStore.dayBlocks;

  if(userSchedulerStore.isUserSchedulerLoading) return <Text>Loading...</Text>;

  // Render function for a single block
  const renderBlock: ListRenderItem<DayBlock> = ({ item }) => (
    <View style={styles.block}>
      <Text style={styles.blockTitle}>Selected: {item.day}</Text>
      <TouchableOpacity
        style={styles.timeButton}
        onPress={() => userSchedulerStore.updateDayBlock(item.day, 'showTimePicker', true)}
      >
        <Text style={styles.timeButtonText}>Pick Time</Text>
      </TouchableOpacity>
      {item.showTimePicker && (
       <DateTimePicker
        value={isValidDate(item.time) ? new Date(item.time) : new Date()} // Ensure item.time is a Date object
        mode="time"
        display="default"
        onChange={async (event, selectedTime) => {
          await userSchedulerStore.updateDayBlock(item.day, 'time', selectedTime || item.time);
          await userSchedulerStore.updateDayBlock(item.day, 'showTimePicker', false);
        }}
      />
      )}
    
      <Text style={styles.dropdownLabel}>Select an Option:</Text>
      <RNPickerSelect
        onValueChange={(value) => userSchedulerStore.updateDayBlock(item.day, 'dropdownValue', value)}
        items={dropdownOptions}
        placeholder={{}}
      />
      <Text style={styles.selectedTime}>
        Selected Time: {new Date(item.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
        {/* Selected Time: {item.time} */}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Weekdays</Text>
      <View style={styles.weekdayButtons}>
        {weekdays.map((day) => (
          <TouchableOpacity
            key={day}
            style={[
              styles.dayButton,
              selectedDays.includes(day) && styles.selectedButton,
            ]}
            onPress={() => userSchedulerStore.toggleDaySelection(day)}
          >
            <Text style={styles.dayText}>{day}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={dayBlocks}
        keyExtractor={(item) => item.day}
        renderItem={renderBlock}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  weekdayButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  dayButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 5,
    marginVertical: 5,
  },
  selectedButton: {
    backgroundColor: '#0056b3',
  },
  dayText: {
    color: '#fff',
    fontSize: 16,
  },
  block: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  blockTitle: {
    fontSize: 18,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  timeButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    marginBottom: 8,
  },
  timeButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  selectedTime: {
    fontSize: 16,
    marginBottom: 8,
  },
  dropdownLabel: {
    fontSize: 16,
    marginTop: 8,
    marginBottom: 4,
  },
});

export default memo(observer(UserScheduler));