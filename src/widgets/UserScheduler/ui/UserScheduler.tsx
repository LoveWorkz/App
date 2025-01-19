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

// Define types for a single day block
type DayBlock = {
  day: string;
  time: Date;
  dropdownValue: string | null;
  showTimePicker?: boolean;
};

const UserScheduler: React.FC = () => {
  useEffect(() => {
    console.log("eff");
  },[]);

  const [selectedDays, setSelectedDays] = useState<string[]>([]); // Track selected days
  const [dayBlocks, setDayBlocks] = useState<DayBlock[]>([]); // Store blocks for each day

  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const dropdownOptions = [
    { label: '30m', value: '30m' },
    { label: '1h', value: '1h' },
    { label: '2h', value: '2h' },
    { label: '3h', value: '3h' },
    { label: '6h', value: '6h' },
    { label: '12h', value: '12h' },
    { label: '24h', value: '24h' },
  ];

  // Toggle selection of a weekday
  const toggleDaySelection = (day: string) => {
    if (selectedDays.includes(day)) {
      // Remove day from selectedDays and dayBlocks
      setSelectedDays(selectedDays.filter((d) => d !== day));
      setDayBlocks(dayBlocks.filter((block) => block.day !== day));
    } else {
      // Add day to selectedDays and create a new block
      setSelectedDays([...selectedDays, day]);
      setDayBlocks([...dayBlocks, { day, time: new Date(), dropdownValue: null }]);
    }
  };

  // Update a field in a specific day block
  const updateDayBlock = (day: string, field: keyof DayBlock, value: any) => {
    setDayBlocks((prevBlocks) =>
      prevBlocks.map((block) =>
        block.day === day ? { ...block, [field]: value } : block
      )
    );
  };

  // Render function for a single block
  const renderBlock: ListRenderItem<DayBlock> = ({ item }) => (
    <View style={styles.block}>
      <Text style={styles.blockTitle}>Selected: {item.day}</Text>
      <TouchableOpacity
        style={styles.timeButton}
        onPress={() => updateDayBlock(item.day, 'showTimePicker', true)}
      >
        <Text style={styles.timeButtonText}>Pick Time</Text>
      </TouchableOpacity>
      {item.showTimePicker && (
        <DateTimePicker
          value={item.time}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={(event, selectedTime) => {
            updateDayBlock(item.day, 'time', selectedTime || item.time);
            updateDayBlock(item.day, 'showTimePicker', false);
          }}
        />
      )}
      <Text style={styles.selectedTime}>
        Selected Time: {item.time.toLocaleTimeString()}
      </Text>
      <Text style={styles.dropdownLabel}>Select an Option:</Text>
      <RNPickerSelect
        onValueChange={(value) => updateDayBlock(item.day, 'dropdownValue', value)}
        items={dropdownOptions}
        placeholder={{ label: 'Select an option', value: null }}
      />
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
            onPress={() => toggleDaySelection(day)}
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