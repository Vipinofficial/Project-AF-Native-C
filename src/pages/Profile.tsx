import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { theme as Theme } from '@arli/tokens';
import type { CustomerDictionary } from '@arli/i18n';

interface ProfileProps {
  t: CustomerDictionary;
  loggedIn: boolean;
  phone: string;
  points: number;
  onLogout: () => void;
  onNavigate: (screen: string) => void;
}

/**
 * Real profile screen — replaces a nav tab that, until now, was labelled
 * "Account" but had nowhere real to go: tapping it just redirected back to
 * Home, because no logout existed and the phone number entered at login was
 * never plumbed up out of the Login screen.
 */
export const Profile: React.FC<ProfileProps> = ({ t, loggedIn, phone, points, onLogout, onNavigate }) => {
  if (!loggedIn) {
    return (
      <View style={styles.centre}>
        <Text style={styles.notLoggedIn}>{t.notLoggedIn}</Text>
        <TouchableOpacity style={styles.loginLink} onPress={() => onNavigate('login')}>
          <Text style={styles.loginLinkText}>{t.goToLogin}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const confirmLogout = () => {
    Alert.alert(t.logoutConfirm, undefined, [
      { text: 'Cancel', style: 'cancel' },
      { text: t.logoutBtn, style: 'destructive', onPress: onLogout },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{t.profileTitle}</Text>

      <View style={styles.card}>
        <Text style={styles.label}>{t.loggedInAs}</Text>
        <Text style={styles.phone}>+91 {phone || '—'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>{t.yourPoints}</Text>
        <Text style={styles.points}>★ {points}</Text>
      </View>

      <View style={styles.linkGroup}>
        <TouchableOpacity style={styles.linkRow} onPress={() => onNavigate('cart')}>
          <Text style={styles.linkText}>{t.myCart}</Text>
          <Text style={styles.linkArrow}>→</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkRow} onPress={() => onNavigate('explore')}>
          <Text style={styles.linkText}>{t.navExplore}</Text>
          <Text style={styles.linkArrow}>→</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={confirmLogout}>
        <Text style={styles.logoutBtnText}>{t.logoutBtn}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 110, gap: 14 },
  centre: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28, gap: 16 },
  notLoggedIn: { fontSize: 15, color: Theme.textSecondary },
  loginLink: { minHeight: 44, justifyContent: 'center' },
  loginLinkText: { fontSize: 15, fontFamily: Theme.fontSansBold, color: Theme.colorPrimary },
  title: { fontSize: 24, fontFamily: Theme.fontSerif, color: Theme.textPrimary },
  card: {
    backgroundColor: Theme.colorCardBg, borderWidth: 1, borderColor: Theme.borderColor,
    borderRadius: 16, padding: 16, gap: 4,
  },
  label: { fontSize: 11, fontFamily: Theme.fontSansBold, color: Theme.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 },
  phone: { fontSize: 18, fontFamily: Theme.fontSansBold, color: Theme.textPrimary },
  points: { fontSize: 18, fontFamily: Theme.fontSansBold, color: Theme.colorWarningText },
  linkGroup: {
    backgroundColor: Theme.colorCardBg, borderWidth: 1, borderColor: Theme.borderColor,
    borderRadius: 16, overflow: 'hidden',
  },
  linkRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 14, minHeight: 48,
    borderBottomWidth: 1, borderBottomColor: Theme.borderColor,
  },
  linkText: { fontSize: 14, fontFamily: Theme.fontSansSemiBold, color: Theme.textPrimary },
  linkArrow: { fontSize: 14, color: Theme.textMuted },
  logoutBtn: {
    borderWidth: 1.5, borderColor: Theme.colorAccent, borderRadius: 12,
    paddingVertical: 13, alignItems: 'center', minHeight: 48, justifyContent: 'center', marginTop: 8,
  },
  logoutBtnText: { fontSize: 14, fontFamily: Theme.fontSansBold, color: Theme.colorAccent },
});
