import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Theme } from '../theme';

interface HeaderProps {
  t: any;
  langLabel: string;
  cartCount: number;
  points: number;
  loggedIn: boolean;
  onNavigate: (screen: string) => void;
  onToggleLang: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  t,
  langLabel,
  cartCount,
  points,
  loggedIn,
  onNavigate,
  onToggleLang,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={() => onNavigate('home')} style={styles.logoBox}>
          <View style={styles.logoRow}>
            <Text style={styles.brandName}>ARLI</Text>
            <Text style={styles.subBrand}>FASHION</Text>
          </View>
          <Text style={styles.tagline}>by fashion vendors</Text>
        </TouchableOpacity>

        <View style={styles.actions}>
          <TouchableOpacity onPress={onToggleLang} style={styles.langBtn}>
            <Text style={styles.langLabel}>{langLabel}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => onNavigate('cart')} style={styles.cartBtn}>
            <Text style={styles.cartLabel}>🛒 {cartCount > 0 ? `(${cartCount})` : ''}</Text>
          </TouchableOpacity>

          {!loggedIn ? (
            <TouchableOpacity onPress={() => onNavigate('login')} style={styles.loginBtn}>
              <Text style={styles.loginText}>{t.navLogin || 'Login'}</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.userBadge}>
              <Text style={styles.userText}>★ {points}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.bgPrimary,
    borderBottomWidth: 1,
    borderBottomColor: Theme.borderColor,
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoBox: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  brandName: {
    fontFamily: Theme.fontSerif,
    fontSize: 20,
    fontWeight: 'bold',
    color: Theme.colorPrimary,
    marginRight: 4,
  },
  subBrand: {
    fontFamily: Theme.fontSansBold,
    fontSize: 10,
    letterSpacing: 1.5,
    color: Theme.colorPrimary,
  },
  tagline: {
    fontFamily: Theme.fontSans,
    fontSize: 7.5,
    fontStyle: 'italic',
    color: Theme.textMuted,
    marginTop: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  langBtn: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Theme.borderColor,
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginRight: 8,
  },
  langLabel: {
    fontFamily: Theme.fontSansBold,
    fontSize: 12,
    color: Theme.colorPrimary,
  },
  cartBtn: {
    borderWidth: 1,
    borderColor: Theme.borderColor,
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginRight: 8,
    backgroundColor: '#fff',
  },
  cartLabel: {
    fontFamily: Theme.fontSansMedium,
    fontSize: 12,
    color: Theme.textPrimary,
  },
  loginBtn: {
    backgroundColor: Theme.colorPrimary,
    borderRadius: 16,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  loginText: {
    fontFamily: Theme.fontSansSemiBold,
    fontSize: 12,
    color: '#FAF5EC',
  },
  userBadge: {
    backgroundColor: '#EDE4CF',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  userText: {
    fontFamily: Theme.fontSansBold,
    fontSize: 11,
    color: '#A5732A',
  },
});
