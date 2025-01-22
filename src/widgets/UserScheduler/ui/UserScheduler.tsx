import React, { memo, useCallback, useEffect, useState } from 'react';
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
import { useFocusEffect, useTheme } from '@react-navigation/native';
import { useColors } from '@src/app/providers/colorsProvider';
import DatePicker from 'react-native-date-picker';
import { AppText, TextSize } from '@src/shared/ui/AppText/AppText';
import { Button, ButtonTheme } from '@src/shared/ui/Button/Button';
import { Select } from '@src/shared/ui/Select/Select';
import { TouchableComponent } from '@src/shared/ui/Select/TouchableComponent';
import { SvgXml } from 'react-native-svg';
import { ArrowDownIcon } from '@src/shared/assets/icons/ArrowDown';
import { horizontalScale, moderateScale, verticalScale } from '@src/shared/lib/Metrics';
import { getShadowOpacity } from '@src/app/styles/GlobalStyle';
// Define types for a single day block
type DayBlock = {
  day: string;
  time: Date;
  dropdownValue: string;
  showTimePicker?: boolean;
};

const UserScheduler: React.FC = () => {
  const colors = useColors();
  const {theme} = useTheme();
  const [open, setOpen] = useState<string | null>(null);

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

  const visibleWeekDays = userSchedulerStore.visibleWeekDays;
  const dropdownOptions = userSchedulerStore.dropdownOptions;
  const selectedDays = userSchedulerStore.selectedDays;
  const dayBlocks = userSchedulerStore.dayBlocks;

  if(userSchedulerStore.isUserSchedulerLoading) return <Text>Loading...</Text>;

  // Render function for a single block
  const renderBlock: ListRenderItem<DayBlock> = ({ item }) => (
    <View style={styles.block}>
      <Text style={styles.blockTitle}>{item.day}</Text>
      <View style={styles.item}>
        <TouchableComponent
          isLoading={false}
          selectedDisplayValue={new Date(item.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
          onSelectOpenHandler={()=>{
            setOpen(item.day);
            userSchedulerStore.updateDayBlock(item.day, 'showTimePicker', true)
          }}
        />
        <DatePicker
          modal
          mode="time"
          open={open === item.day}
          date={isValidDate(item.time) ? new Date(item.time) : new Date()}
          onConfirm={async (selectedTime) => {
            await userSchedulerStore.updateDayBlock(item.day, 'time', selectedTime || item.time);
            await userSchedulerStore.updateDayBlock(item.day, 'showTimePicker', false);
            setOpen(null);
          }}
          onCancel={() => {
            setOpen(null);
          }}
        />
      </View>
      
      <View style={[styles.item, {...getShadowOpacity(theme, colors.bgColor).shadowOpacity_level_1,}]}>
        <RNPickerSelect
        onValueChange={(value) => userSchedulerStore.updateDayBlock(item.day, 'dropdownValue', value)}
        items={dropdownOptions}
        placeholder={{}}
        style={{
          inputIOS: {
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            paddingVertical: verticalScale(8),
            height: 40,
            borderRadius:  moderateScale(10),
            paddingHorizontal: horizontalScale(20),
          },
          inputAndroid: {
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            paddingVertical: verticalScale(8),
            height: 40,
            borderRadius:  moderateScale(10),
            paddingHorizontal: horizontalScale(20),
            backgroundColor: colors.bgTertiaryColor,
          },
          iconContainer: {
            top: 10,
            right: 12,
            display: 'none',
          },
        }}
      />
      </View>
   
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={{...styles.title, color: colors.bgTabViewColor}}>Weekdays</Text>
      <View style={styles.weekdayButtons}>
        {visibleWeekDays.map((day) => (
          <TouchableOpacity
            key={day}
            style={[
              styles.dayButton,
              selectedDays.includes(day) && styles.selectedButton,
              {
                borderColor: colors.bgSessionActive,
                backgroundColor: selectedDays.includes(day) 
                  ? colors.bgTabViewColor
                  : 'transparent'
              }
            ]}
            onPress={() => userSchedulerStore.toggleDaySelection(day)}
          >
            <Text style={{
              ...styles.dayText, 
              color: selectedDays.includes(day) 
                ? colors.white 
                : colors.primaryTextColor
              }}>{day.slice(0, 1)}</Text>
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
  item: {
    marginTop: 16,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 14,
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
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginVertical: 5,
    borderWidth: 1,
    borderRadius: 8,
  },
  selectedButton: {
    backgroundColor: '#0056b3',
  },
  dayText: {
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
  icon: {
    height: horizontalScale(12),
    width: horizontalScale(12),
  },
});

export default memo(observer(UserScheduler));