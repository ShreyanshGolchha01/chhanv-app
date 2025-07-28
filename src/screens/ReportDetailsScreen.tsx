import React, { useState, useEffect } from 'react';
import serverUrl from '../services/Server';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { Ionicons, MaterialIcons, FontAwesome5, AntDesign } from '@expo/vector-icons';

interface Test {
  name: string;
  value: string;
  normalRange: string;
  status: string;
}

interface HealthReport {
  id: number;
  patientId: number;
  relativeId?: number;
  campname: string;
  campdate: string;
  reporttype: string;
  doctorName: string;
  reports: string;
  symptoms: string;
  diagnosis: string;
  medicines: string;
  condition: string;
  notes: string;
  patientName: string;
  relation: string;
  gender: string;
  bloodGroup: string;
  age: number;
  tests: Test[];
  campDetails?: {
    location?: string;
    address?: string;
    startTime?: string;
    endTime?: string;
    coordinator?: string;
    description?: string;
    services?: string;
    status?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface Camp {
  id: number;
  campName: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  doctors: string;
  status: string;
}

interface ReportDetailsScreenProps {
  onBack: () => void;
  reportData?: any;
}

const ReportDetailsScreen: React.FC<ReportDetailsScreenProps> = ({ onBack, reportData }) => {
  const [activeTab, setActiveTab] = useState<'employee' | 'family'>('employee');
  const [selectedFamilyMember, setSelectedFamilyMember] = useState<HealthReport | null>(null);
  const [healthReports, setHealthReports] = useState<HealthReport[]>([]);
  const [employeeReports, setEmployeeReports] = useState<HealthReport[]>([]);
  const [familyReports, setFamilyReports] = useState<HealthReport[]>([]);
  const [camps, setCamps] = useState<Camp[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentReportIndex, setCurrentReportIndex] = useState(0);
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    const getUserId = async () => {
      try {
        const cid = await AsyncStorage.getItem('cid');
        if (cid) {
          setUserId(cid);
        }
      } catch (error) {
        console.error('Error getting user ID:', error);
      }
    };
    getUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      loadHealthReports();
      loadCamps();
    }
  }, [userId]);

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const loadHealthReports = async () => {
    try {
      setLoading(true);
      console.log('Fetching health reports for user:', userId);

      const response = await fetch(`${serverUrl}/get_health_reports.php?patientId=${userId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Health reports response:', data);

      if (data.success) {
        setHealthReports(data.reports || []);
        setEmployeeReports(data.employeeReports || []);
        setFamilyReports(data.familyReports || []);
      } else {
        console.warn('No health reports found:', data.message);
        Alert.alert('जानकारी', 'कोई रिपोर्ट नहीं मिली।');
      }
    } catch (error) {
      console.error('Error loading health reports:', error);
      Alert.alert('त्रुटि', 'रिपोर्ट लोड करने में समस्या हुई।');
    } finally {
      setLoading(false);
    }
  };

  const loadCamps = async () => {
    try {
      const response = await fetch(`${serverUrl}/get_camp_app.php?limit=5`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Camps response:', data);

      if (data.success) {
        setCamps(data.camps || []);
      }
    } catch (error) {
      console.error('Error loading camps:', error);
    }
  };

  const handlePreviousReport = () => {
    if (currentReportIndex > 0) {
      setCurrentReportIndex(currentReportIndex - 1);
    }
  };

  const handleNextReport = () => {
    if (currentReportIndex < employeeReports.length - 1) {
      setCurrentReportIndex(currentReportIndex + 1);
    }
  };

  const renderFamilyMemberCard = (member: HealthReport) => (
    <TouchableOpacity
      key={member.id}
      style={styles.familyMemberCard}
      onPress={() => setSelectedFamilyMember(member)}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={COLORS.gradients.card.colors}
        start={COLORS.gradients.card.start}
        end={COLORS.gradients.card.end}
        style={styles.memberCardGradient}
      >
        <View style={styles.memberCardHeader}>
          <LinearGradient
            colors={COLORS.gradients.accent.colors}
            start={COLORS.gradients.accent.start}
            end={COLORS.gradients.accent.end}
            style={styles.memberCardAvatar}
          >
            <FontAwesome5 
              name={member.gender === 'female' ? 'female' : 'male'} 
              size={24} 
              color={COLORS.white} 
            />
          </LinearGradient>
          
          <View style={styles.memberCardInfo}>
            <Text style={styles.memberCardName}>{member.patientName}</Text>
            <Text style={styles.memberCardRelation}>{member.relation}</Text>
            <View style={styles.memberCardDetails}>
              <Text style={styles.memberCardDetailText}>उम्र: {member.age} वर्ष</Text>
              <Text style={styles.memberCardDetailText}>ब्लड ग्रुप: {member.bloodGroup}</Text>
            </View>
          </View>
          
          <LinearGradient
            colors={[COLORS.primary + '20', COLORS.primary + '10']}
            style={styles.viewDetailsIcon}
          >
            <Ionicons name="chevron-forward" size={20} color={COLORS.primary} />
          </LinearGradient>
        </View>
        
        <View style={styles.memberCardFooter}>
          <View style={styles.testsSummary}>
            <LinearGradient
              colors={['#27ae60', '#2ecc71']}
              style={styles.testsCountBadge}
            >
              <Text style={styles.testsCountText}>{member.tests.length} टेस्ट</Text>
            </LinearGradient>
            <Text style={styles.testsSummaryText}>रिपोर्ट देखने के लिए क्लिक करें</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderFamilyMembersList = () => (
    <View style={styles.familyListContainer}>
      <View style={styles.familyListHeader}>
        <Text style={styles.familyListTitle}>परिवारिक सदस्य रिपोर्ट</Text>
        <Text style={styles.familyListSubtitle}>
          {familyReports.length > 0 
            ? 'किसी भी सदस्य की विस्तृत रिपोर्ट देखने के लिए उन पर क्लिक करें'
            : 'अभी तक कोई परिवारिक सदस्य की रिपोर्ट नहीं है'
          }
        </Text>
      </View>
      {familyReports.length > 0 ? (
        familyReports.map(renderFamilyMemberCard)
      ) : (
        <LinearGradient
          colors={COLORS.gradients.card.colors}
          start={COLORS.gradients.card.start}
          end={COLORS.gradients.card.end}
          style={styles.emptyStateCard}
        >
          <LinearGradient
            colors={COLORS.gradients.accent.colors}
            start={COLORS.gradients.accent.start}
            end={COLORS.gradients.accent.end}
            style={styles.emptyStateIcon}
          >
            <FontAwesome5 name="user-friends" size={32} color={COLORS.white} />
          </LinearGradient>
          <Text style={styles.emptyStateTitle}>कोई पारिवारिक रिपोर्ट नहीं</Text>
          <Text style={styles.emptyStateMessage}>
            अभी तक आपके परिवारिक सदस्यों की कोई स्वास्थ्य रिपोर्ट नहीं है।
          </Text>
        </LinearGradient>
      )}
    </View>
  );

  const renderSelectedMemberDetails = () => {
    if (!selectedFamilyMember) return null;
    
    return (
      <View style={styles.selectedMemberContainer}>
        <TouchableOpacity 
          style={styles.backToListButton}
          onPress={() => setSelectedFamilyMember(null)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={COLORS.gradients.secondary.colors}
            start={COLORS.gradients.secondary.start}
            end={COLORS.gradients.secondary.end}
            style={styles.backToListGradient}
          >
            <Ionicons name="arrow-back" size={16} color={COLORS.white} />
            <Text style={styles.backToListText}>सभी सदस्य देखें</Text>
          </LinearGradient>
        </TouchableOpacity>
        
        {renderPersonCard(selectedFamilyMember, false)}
      </View>
    );
  };

  const renderTestResult = (test: Test) => (
    <LinearGradient
      key={test.name}
      colors={COLORS.gradients.card.colors}
      start={COLORS.gradients.card.start}
      end={COLORS.gradients.card.end}
      style={styles.testCard}
    >
      <View style={styles.testHeader}>
        <Text style={styles.testName}>{test.name}</Text>
        <LinearGradient
          colors={test.status === 'सामान्य' ? 
            ['#27ae60', '#2ecc71'] : 
            test.status === 'ध्यान दें' ?
            ['#f39c12', '#e67e22'] :
            ['#e74c3c', '#c0392b']}
          style={styles.statusBadge}
        >
          <Text style={styles.statusText}>{test.status}</Text>
        </LinearGradient>
      </View>
      
      <View style={styles.testDetails}>
        <View style={styles.testRow}>
          <LinearGradient
            colors={[COLORS.primary + '20', COLORS.primary + '10']}
            style={styles.testIcon}
          >
            <FontAwesome5 name="chart-line" size={14} color={COLORS.primary} />
          </LinearGradient>
          <View style={styles.testInfo}>
            <Text style={styles.testLabel}>परिणाम</Text>
            <Text style={styles.testValue}>{test.value}</Text>
          </View>
        </View>
        
        <View style={styles.testRow}>
          <LinearGradient
            colors={[COLORS.info + '20', COLORS.info + '10']}
            style={styles.testIcon}
          >
            <MaterialIcons name="info" size={14} color={COLORS.info} />
          </LinearGradient>
          <View style={styles.testInfo}>
            <Text style={styles.testLabel}>सामान्य सीमा</Text>
            <Text style={styles.normalRange}>{test.normalRange}</Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );

  const renderPersonCard = (report: HealthReport, isEmployee: boolean = false) => (
    <View style={styles.personSection}>
      <LinearGradient
        colors={COLORS.gradients.primary.colors}
        start={COLORS.gradients.primary.start}
        end={COLORS.gradients.primary.end}
        style={styles.personHeader}
      >
        <LinearGradient
          colors={COLORS.gradients.accent.colors}
          start={COLORS.gradients.accent.start}
          end={COLORS.gradients.accent.end}
          style={styles.personAvatar}
        >
          <FontAwesome5 
            name={isEmployee ? 'user-tie' : 
                  report.gender === 'female' ? 'female' : 'male'} 
            size={28} 
            color={COLORS.white} 
          />
        </LinearGradient>
        
        <View style={styles.personInfo}>
          <Text style={styles.personName}>{report.patientName}</Text>
          <Text style={styles.personRole}>{isEmployee ? `कर्मचारी` : report.relation}</Text>
          <View style={styles.personDetails}>
            <Text style={styles.personDetailText}>उम्र: {report.age} वर्ष</Text>
            <Text style={styles.personDetailText}>ब्लड ग्रुप: {report.bloodGroup}</Text>
          </View>
        </View>
      </LinearGradient>
      
      {/* Medical Details */}
      <LinearGradient
        colors={COLORS.gradients.card.colors}
        start={COLORS.gradients.card.start}
        end={COLORS.gradients.card.end}
        style={styles.medicalDetailsCard}
      >
        <Text style={styles.medicalDetailsTitle}>चिकित्सा विवरण</Text>
        
        <View style={styles.medicalDetailRow}>
          <Text style={styles.medicalDetailLabel}>लक्षण:</Text>
          <Text style={styles.medicalDetailValue}>{report.symptoms}</Text>
        </View>
        
        <View style={styles.medicalDetailRow}>
          <Text style={styles.medicalDetailLabel}>निदान:</Text>
          <Text style={styles.medicalDetailValue}>{report.diagnosis}</Text>
        </View>
        
        <View style={styles.medicalDetailRow}>
          <Text style={styles.medicalDetailLabel}>दवाइयां:</Text>
          <Text style={styles.medicalDetailValue}>{report.medicines}</Text>
        </View>
        
        <View style={styles.medicalDetailRow}>
          <Text style={styles.medicalDetailLabel}>स्थिति:</Text>
          <LinearGradient
            colors={report.condition === 'स्वस्थ' ? 
              ['#27ae60', '#2ecc71'] : 
              report.condition === 'स्थिर' ?
              ['#3498db', '#2980b9'] :
              report.condition === 'ध्यान चाहिए' ?
              ['#f39c12', '#e67e22'] :
              ['#e74c3c', '#c0392b']}
            style={styles.conditionBadge}
          >
            <Text style={styles.conditionText}>{report.condition}</Text>
          </LinearGradient>
        </View>
        
        {report.notes && (
          <View style={styles.medicalDetailRow}>
            <Text style={styles.medicalDetailLabel}>टिप्पणी:</Text>
            <Text style={styles.medicalDetailValue}>{report.notes}</Text>
          </View>
        )}
      </LinearGradient>
      
      {/* Tests Container */}
      <View style={styles.testsContainer}>
        <Text style={styles.testsTitle}>परीक्षण रिपोर्ट</Text>
        {report.tests && report.tests.length > 0 ? (
          report.tests.map(renderTestResult)
        ) : (
          <LinearGradient
            colors={COLORS.gradients.card.colors}
            start={COLORS.gradients.card.start}
            end={COLORS.gradients.card.end}
            style={styles.noTestsCard}
          >
            <MaterialIcons name="assignment" size={32} color={COLORS.textSecondary} />
            <Text style={styles.noTestsText}>कोई परीक्षण रिपोर्ट उपलब्ध नहीं</Text>
          </LinearGradient>
        )}
      </View>
    </View>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>रिपोर्ट लोड हो रही है...</Text>
        </View>
      );
    }

    if (activeTab === 'employee') {
      if (employeeReports.length > 0) {
        const currentReport = employeeReports[currentReportIndex];
        return renderPersonCard(currentReport, true);
      } else {
        return (
          <LinearGradient
            colors={COLORS.gradients.card.colors}
            start={COLORS.gradients.card.start}
            end={COLORS.gradients.card.end}
            style={styles.emptyStateCard}
          >
            <LinearGradient
              colors={COLORS.gradients.accent.colors}
              start={COLORS.gradients.accent.start}
              end={COLORS.gradients.accent.end}
              style={styles.emptyStateIcon}
            >
              <FontAwesome5 name="user-tie" size={32} color={COLORS.white} />
            </LinearGradient>
            <Text style={styles.emptyStateTitle}>कोई रिपोर्ट नहीं मिली</Text>
            <Text style={styles.emptyStateMessage}>
              अभी तक आपकी कोई स्वास्थ्य रिपोर्ट नहीं है।
            </Text>
            <TouchableOpacity style={styles.refreshButton} onPress={loadHealthReports}>
              <LinearGradient
                colors={COLORS.gradients.primary.colors}
                start={COLORS.gradients.primary.start}
                end={COLORS.gradients.primary.end}
                style={styles.refreshButtonGradient}
              >
                <Ionicons name="refresh" size={16} color={COLORS.white} />
                <Text style={styles.refreshButtonText}>रीफ्रेश करें</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        );
      }
    } else {
      if (selectedFamilyMember) {
        return renderSelectedMemberDetails();
      } else {
        return renderFamilyMembersList();
      }
    }
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Camp Info Card with Carousel */}
      {employeeReports.length > 0 && (
        <LinearGradient
          colors={COLORS.gradients.card.colors}
          start={COLORS.gradients.card.start}
          end={COLORS.gradients.card.end}
          style={styles.campInfoCard}
        >
          {/* Carousel Navigation */}
          <View style={styles.carouselHeader}>
            <TouchableOpacity 
              style={[styles.carouselButton, currentReportIndex === 0 && styles.disabledButton]}
              onPress={handlePreviousReport}
              disabled={currentReportIndex === 0}
              activeOpacity={0.7}
            >
              <Ionicons 
                name="chevron-back" 
                size={20} 
                color={currentReportIndex === 0 ? COLORS.gray[400] : COLORS.primary} 
              />
            </TouchableOpacity>
            
            <View style={styles.reportIndicator}>
              <Text style={styles.reportIndicatorText}>
                {currentReportIndex === 0 ? 'नवीनतम रिपोर्ट' : `${currentReportIndex + 1} रिपोर्ट पहले`}
              </Text>
              <View style={styles.dotsContainer}>
                {employeeReports.map((_, index: number) => (
                  <View 
                    key={index}
                    style={[
                      styles.dot, 
                      index === currentReportIndex && styles.activeDot
                    ]} 
                  />
                ))}
              </View>
            </View>
            
            <TouchableOpacity 
              style={[styles.carouselButton, currentReportIndex === employeeReports.length - 1 && styles.disabledButton]}
              onPress={handleNextReport}
              disabled={currentReportIndex === employeeReports.length - 1}
              activeOpacity={0.7}
            >
              <Ionicons 
                name="chevron-forward" 
                size={20} 
                color={currentReportIndex === employeeReports.length - 1 ? COLORS.gray[400] : COLORS.primary} 
              />
            </TouchableOpacity>
          </View>

          {/* Current Report Info */}
          {employeeReports[currentReportIndex] && (
            <View style={styles.campInfoDetails}>
              <View style={styles.campInfoHeader}>
                <LinearGradient
                  colors={COLORS.gradients.primary.colors}
                  start={COLORS.gradients.primary.start}
                  end={COLORS.gradients.primary.end}
                  // style={styles.campIcon}
                >
                  <MaterialIcons name="local-hospital" size={24} color={COLORS.white} />
                </LinearGradient>
                <View style={styles.campInfoDetails}>
                  <Text style={styles.campTitle}>{employeeReports[currentReportIndex].campname}</Text>
                  <Text style={styles.campDate}>
                    📅 {formatDate(employeeReports[currentReportIndex].campdate)}
                  </Text>
                </View>
              </View>
              
              <View style={styles.campDetails}>
                <View style={styles.campDetailRow}>
                  <MaterialIcons name="person" size={16} color={COLORS.primary} />
                  <Text style={styles.campDetailText}>
                    डॉक्टर: {employeeReports[currentReportIndex].doctorName}
                  </Text>
                </View>
                <View style={styles.campDetailRow}>
                  <MaterialIcons name="assignment" size={16} color={COLORS.accent} />
                  <Text style={styles.campDetailText}>
                    प्रकार: {employeeReports[currentReportIndex].reporttype}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </LinearGradient>
      )}

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'employee' && styles.activeTab]}
          onPress={() => setActiveTab('employee')}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={activeTab === 'employee' ? 
              COLORS.gradients.primary.colors : 
              ['transparent', 'transparent']}
            style={styles.tabGradient}
          >
            <FontAwesome5 
              name="user-tie" 
              size={16} 
              color={activeTab === 'employee' ? COLORS.white : COLORS.textSecondary} 
            />
            <Text style={[
              styles.tabText, 
              activeTab === 'employee' && styles.activeTabText
            ]}>
              कर्मचारी ({employeeReports.length})
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'family' && styles.activeTab]}
          onPress={() => setActiveTab('family')}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={activeTab === 'family' ? 
              COLORS.gradients.primary.colors : 
              ['transparent', 'transparent']}
            style={styles.tabGradient}
          >
            <Ionicons 
              name="people" 
              size={16} 
              color={activeTab === 'family' ? COLORS.white : COLORS.textSecondary} 
            />
            <Text style={[
              styles.tabText, 
              activeTab === 'family' && styles.activeTabText
            ]}>
              परिवार ({familyReports.length})
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderContent()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  loadingText: {
    fontSize: FONTS.sizes.base,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
  },
  campInfoCard: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    ...SHADOWS.large,
    elevation: 8,
  },
  campInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  // campIcon: {
  //   width: 50,
  //   height: 50,
  //   borderRadius: 25,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   marginRight: SPACING.md,
  //   ...SHADOWS.medium,
  // },
  campInfoDetails: {
    flex: 1,
  },
  campTitle: {
    fontSize: FONTS.sizes.base,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  campDate: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.primary,
    fontWeight: FONTS.weights.medium,
  },
  campDetails: {
    marginTop: SPACING.sm,
  },
  campDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  campDetailText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
    flex: 1,
  },
  // Medical Details Styles
  medicalDetailsCard: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.white,
    ...SHADOWS.medium,
    elevation: 4,
  },
  medicalDetailsTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  medicalDetailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
    flexWrap: 'wrap',
  },
  medicalDetailLabel: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.textPrimary,
    marginRight: SPACING.sm,
    minWidth: 80,
  },
  medicalDetailValue: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    flex: 1,
    lineHeight: 20,
  },
  conditionBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.round,
    alignSelf: 'flex-start',
  },
  conditionText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.white,
    fontWeight: FONTS.weights.bold,
  },
  testsTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  noTestsCard: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    backgroundColor: COLORS.white,
    ...SHADOWS.medium,
    elevation: 4,
  },
  noTestsText: {
    fontSize: FONTS.sizes.base,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.small,
  },
  tab: {
    flex: 1,
    overflow: 'hidden',
  },
  activeTab: {
    // Styling handled by gradient
  },
  tabGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xs,
  },
  tabText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.medium,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
  },
  activeTabText: {
    color: COLORS.white,
    fontWeight: FONTS.weights.bold,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
  },
  personSection: {
    marginBottom: SPACING.xl,
  },
  personHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
    marginBottom: SPACING.md,
    ...SHADOWS.medium,
  },
  personAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
    ...SHADOWS.small,
  },
  personInfo: {
    flex: 1,
  },
  personName: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  personRole: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.white + 'CC',
    marginBottom: SPACING.xs,
  },
  personDetails: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  personDetailText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.white + 'AA',
  },
  testsContainer: {
    marginBottom: SPACING.lg,
  },
  testCard: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.white,
    ...SHADOWS.medium,
    elevation: 4,
  },
  testHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  testName: {
    fontSize: FONTS.sizes.base,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.textPrimary,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.round,
    ...SHADOWS.small,
  },
  statusText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.white,
    fontWeight: FONTS.weights.bold,
  },
  testDetails: {
    gap: SPACING.sm,
  },
  testRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  testIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
    ...SHADOWS.small,
  },
  testInfo: {
    flex: 1,
  },
  testLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs / 2,
  },
  testValue: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
  },
  normalRange: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  familyMemberCard: {
    marginBottom: SPACING.md,
  },
  memberCardGradient: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    ...SHADOWS.medium,
    elevation: 6,
  },
  memberCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  memberCardAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
    ...SHADOWS.small,
  },
  memberCardInfo: {
    flex: 1,
  },
  memberCardName: {
    fontSize: FONTS.sizes.base,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  memberCardRelation: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.accent,
    fontWeight: FONTS.weights.medium,
    marginBottom: SPACING.xs,
  },
  memberCardDetails: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  memberCardDetailText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
  },
  viewDetailsIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  memberCardFooter: {
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
    paddingTop: SPACING.md,
  },
  testsSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  testsCountBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.round,
    ...SHADOWS.small,
  },
  testsCountText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.white,
    fontWeight: FONTS.weights.bold,
  },
  testsSummaryText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  familyListContainer: {
    paddingBottom: SPACING.xl,
  },
  familyListHeader: {
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.sm,
  },
  familyListTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  familyListSubtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  selectedMemberContainer: {
    paddingBottom: SPACING.xl,
  },
  backToListButton: {
    marginBottom: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    alignSelf: 'flex-start',
    ...SHADOWS.small,
  },
  backToListGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  backToListText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.white,
    fontWeight: FONTS.weights.medium,
    marginLeft: SPACING.xs,
  },
  emptyStateCard: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    backgroundColor: COLORS.white,
    ...SHADOWS.medium,
    elevation: 6,
  },
  emptyStateIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
    ...SHADOWS.small,
  },
  emptyStateTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  emptyStateMessage: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.lg,
  },
  refreshButton: {
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    ...SHADOWS.small,
  },
  refreshButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
  },
  refreshButtonText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.white,
    fontWeight: FONTS.weights.medium,
    marginLeft: SPACING.xs,
  },
  carouselHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  carouselButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  disabledButton: {
    backgroundColor: COLORS.gray[50],
    opacity: 0.5,
  },
  reportIndicator: {
    alignItems: 'center',
    flex: 1,
  },
  reportIndicatorText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.medium,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.gray[300],
  },
  activeDot: {
    backgroundColor: COLORS.primary,
    width: 12,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOWS.medium,
  },
  modalTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
    marginBottom: SPACING.lg,
    textAlign: 'center',
    color: COLORS.primary,
  },
  modalBody: {
    marginBottom: SPACING.lg,
  },
  modalText: {
    fontSize: FONTS.sizes.base,
    lineHeight: 24,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  modalSection: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: SPACING.lg,
  },
  modalButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    minWidth: 100,
    alignItems: 'center',
  },
  modalButtonText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.base,
    fontWeight: FONTS.weights.semibold,
  },
});

export default ReportDetailsScreen;
