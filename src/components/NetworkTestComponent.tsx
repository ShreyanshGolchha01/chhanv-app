import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { testConnection } from '../services/realApi';

const NetworkTestComponent = () => {
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'success' | 'failed' | 'idle'>('idle');
  const [lastTestTime, setLastTestTime] = useState<string>('');

  const handleTestConnection = async () => {
    setConnectionStatus('testing');
    
    try {
      const result = await testConnection();
      
      if (result.success) {
        setConnectionStatus('success');
        setLastTestTime(new Date().toLocaleTimeString());
        Alert.alert('Success', 'Backend connection successful!');
      } else {
        setConnectionStatus('failed');
        Alert.alert('Connection Failed', result.error || 'Unable to connect to backend');
      }
    } catch (error) {
      setConnectionStatus('failed');
      Alert.alert('Error', 'Network error occurred');
    }
  };

  useEffect(() => {
    // Test connection on component mount
    handleTestConnection();
  }, []);

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'success':
        return '#4CAF50';
      case 'failed':
        return '#F44336';
      case 'testing':
        return '#FF9800';
      default:
        return '#9E9E9E';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'success':
        return 'Connected';
      case 'failed':
        return 'Connection Failed';
      case 'testing':
        return 'Testing...';
      default:
        return 'Not Tested';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Backend Connection Status</Text>
      
      <View style={[styles.statusContainer, { backgroundColor: getStatusColor() }]}>
        <Text style={styles.statusText}>{getStatusText()}</Text>
      </View>
      
      {lastTestTime && (
        <Text style={styles.timeText}>Last test: {lastTestTime}</Text>
      )}
      
      <TouchableOpacity 
        style={styles.testButton} 
        onPress={handleTestConnection}
        disabled={connectionStatus === 'testing'}
      >
        <Text style={styles.buttonText}>Test Connection</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  statusContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 10,
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  timeText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 15,
  },
  testButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default NetworkTestComponent;
