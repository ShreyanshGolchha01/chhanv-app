// उदाहरण: AsyncStorage से phone number पाना

import AsyncStorage from '@react-native-async-storage/async-storage';

// Login के समय phone number store करें
const storePhoneNumber = async (phoneNumber: string) => {
  try {
    await AsyncStorage.setItem('userPhoneNumber', phoneNumber);
  } catch (error) {
    console.error('Error storing phone number:', error);
  }
};

// Profile load करते समय phone number पाना
const getStoredPhoneNumber = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('userPhoneNumber');
  } catch (error) {
    console.error('Error getting phone number:', error);
    return null;
  }
};

export { storePhoneNumber, getStoredPhoneNumber };
