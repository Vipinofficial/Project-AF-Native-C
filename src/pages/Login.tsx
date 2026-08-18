import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { theme as Theme } from '@arli/tokens';

interface LoginProps {
  t: any;
  onLoginSuccess: () => void;
  lang: 'en' | 'hi';
}

export const Login: React.FC<LoginProps> = ({ t, onLoginSuccess, lang }) => {
  const [screen, setScreen] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');

  const handleSendOtp = () => {
    if (phone.trim().length >= 10) {
      setScreen('otp');
      Alert.alert(lang === 'hi' ? 'OTP भेजा गया' : 'OTP Sent', lang === 'hi' ? 'कोई भी 4 अंक डालें' : 'Demo: Enter any 4 digits');
    } else {
      Alert.alert(lang === 'hi' ? 'त्रुटि' : 'Error', lang === 'hi' ? 'सही नंबर डालें' : 'Please enter a valid 10-digit number');
    }
  };

  const handleVerifyOtp = () => {
    if (otp.length === 4) {
      onLoginSuccess();
    } else {
      Alert.alert(lang === 'hi' ? 'त्रुटि' : 'Error', lang === 'hi' ? '4 अंकों का कोड डालें' : 'Please enter 4 digits');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {screen === 'phone' ? (
          <View>
            <Text style={styles.header}>{t.loginTitle}</Text>
            <Text style={styles.sub}>{t.loginSub}</Text>
            
            <Text style={styles.label}>{t.phoneLabel}</Text>
            <View style={styles.phoneInputRow}>
              <View style={styles.prefix}>
                <Text style={styles.prefixText}>+91</Text>
              </View>
              <TextInput
                value={phone}
                onChangeText={(val) => setPhone(val.replace(/\D/g, '').slice(0, 10))}
                placeholder="98765 43210"
                keyboardType="phone-pad"
                style={styles.input}
              />
            </View>

            <TouchableOpacity onPress={handleSendOtp} style={styles.primaryBtn}>
              <Text style={styles.primaryBtnText}>{t.sendOtp}</Text>
            </TouchableOpacity>

            <Text style={styles.orText}>{t.or}</Text>

            {/* Google and Devfrogs buttons stacked */}
            <TouchableOpacity onPress={onLoginSuccess} style={styles.thirdPartyBtn}>
              <Text style={styles.thirdPartyText}>G  {t.googleBtn}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onLoginSuccess} style={[styles.thirdPartyBtn, { marginTop: 8 }]}>
              <Text style={styles.thirdPartyText}>🐸  {t.devfrogsBtn || 'Continue with Devfrogs'}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <Text style={styles.header}>{t.otpTitle}</Text>
            <Text style={styles.sub}>{t.otpSub} +91 {phone}</Text>
            
            <TextInput
              value={otp}
              onChangeText={(val) => setOtp(val.replace(/\D/g, '').slice(0, 4))}
              placeholder="• • • •"
              keyboardType="numeric"
              maxLength={4}
              style={styles.otpInput}
            />

            <TouchableOpacity onPress={handleVerifyOtp} style={[styles.primaryBtn, { backgroundColor: Theme.colorAccent }]}>
              <Text style={styles.primaryBtnText}>{t.verify}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setScreen('phone')} style={styles.backBtn}>
              <Text style={styles.backBtnText}>{t.changeNumber}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.bgPrimary,
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Theme.borderColor,
    borderRadius: 20,
    padding: 24,
  },
  header: {
    fontFamily: Theme.fontSerif,
    fontSize: 26,
    color: Theme.textPrimary,
    marginBottom: 6,
  },
  sub: {
    fontFamily: Theme.fontSans,
    fontSize: 12.5,
    color: Theme.textMuted,
    marginBottom: 20,
  },
  label: {
    fontFamily: Theme.fontSansBold,
    fontSize: 10,
    textTransform: 'uppercase',
    color: Theme.textSecondary,
    letterSpacing: 0.5,
  },
  phoneInputRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 8,
  },
  prefix: {
    borderWidth: 1,
    borderColor: Theme.borderColor,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#F5EFE1',
    justifyContent: 'center',
  },
  prefixText: {
    fontFamily: Theme.fontSansBold,
    fontSize: 13,
    color: Theme.textSecondary,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: Theme.borderColor,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  primaryBtn: {
    backgroundColor: Theme.colorPrimary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  primaryBtnText: {
    fontFamily: Theme.fontSansBold,
    fontSize: 14,
    color: '#FAF5EC',
  },
  orText: {
    fontFamily: Theme.fontSans,
    fontSize: 11,
    color: Theme.textMuted,
    textAlign: 'center',
    marginVertical: 14,
  },
  thirdPartyBtn: {
    borderWidth: 1,
    borderColor: Theme.borderColor,
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  thirdPartyText: {
    fontFamily: Theme.fontSansSemiBold,
    fontSize: 13,
    color: Theme.textPrimary,
  },
  otpInput: {
    borderWidth: 1,
    borderColor: Theme.borderColor,
    borderRadius: 10,
    padding: 12,
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold',
    backgroundColor: '#FAF5EC',
    marginVertical: 16,
    letterSpacing: 8,
  },
  backBtn: {
    alignItems: 'center',
    marginTop: 12,
  },
  backBtnText: {
    fontFamily: Theme.fontSansSemiBold,
    fontSize: 12,
    color: Theme.textMuted,
  },
});
